import type Stripe from 'stripe';
import { env } from '@/lib/env';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { track, groupIdentify } from '@/lib/analytics-server';

export const runtime = 'nodejs';

/*
 * Stripe webhook handler.
 *
 * Events we handle:
 *   checkout.session.completed       — first payment, sub starts
 *   customer.subscription.updated    — plan/status changes (upgrade,
 *                                       past_due, paused, etc.)
 *   customer.subscription.deleted    — cancellation took effect
 *   customer.subscription.trial_will_end — 3-day heads-up
 *   invoice.payment_succeeded        — successful renewal
 *   invoice.payment_failed           — dunning trigger
 *   customer.updated                 — name/email changes synced back
 *
 * All DB writes hit the org row identified by stripe_customer_id.
 * Audit log + PostHog event for each business-meaningful change.
 */
export async function POST(req: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) return new Response('Webhook not configured', { status: 503 });
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return new Response(`Bad signature: ${e instanceof Error ? e.message : 'unknown'}`, { status: 400 });
  }

  const admin = createAdminClient();

  // Helper — find an org by stripe customer id. Returns null if unknown.
  async function findOrgByCustomer(
    customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined,
  ) {
    if (!customer) return null;
    const customerId = typeof customer === 'string' ? customer : customer.id;
    const { data } = await admin
      .from('organizations')
      .select('id, name, plan')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    return data ? { ...data, customerId } : null;
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.['orgId'];
      const tier = session.metadata?.['plan'];
      if (orgId && session.customer) {
        await admin
          .from('organizations')
          .update({
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer.id,
            stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
            stripe_subscription_status: 'active',
            ...(tier ? { plan: tier } : {}),
          })
          .eq('id', orgId);
        await admin.from('audit_log').insert({
          org_id: orgId,
          action: 'stripe.checkout_completed',
          metadata: { sessionId: session.id, mode: session.mode, tier },
        });
        await track('subscription_started', {
          distinctId: session.customer_email ?? orgId,
          properties: { tier, amount_total: session.amount_total },
          groups: { organization: orgId },
        });
        await groupIdentify('organization', orgId, {
          stripe_subscription_status: 'active',
          plan: tier,
          first_paid_at: new Date().toISOString(),
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const org = await findOrgByCustomer(sub.customer);
      await admin
        .from('organizations')
        .update({ stripe_subscription_status: sub.status, stripe_subscription_id: sub.id })
        .eq('stripe_customer_id', org?.customerId ?? '');
      if (org) {
        await admin.from('audit_log').insert({
          org_id: org.id,
          action: event.type === 'customer.subscription.deleted' ? 'stripe.subscription_canceled' : 'stripe.subscription_updated',
          metadata: { subscriptionId: sub.id, status: sub.status },
        });
        await groupIdentify('organization', org.id, { stripe_subscription_status: sub.status });
      }
      break;
    }

    case 'customer.subscription.trial_will_end': {
      const sub = event.data.object as Stripe.Subscription;
      const org = await findOrgByCustomer(sub.customer);
      if (org) {
        await admin.from('audit_log').insert({
          org_id: org.id,
          action: 'stripe.trial_will_end',
          metadata: { trial_end: sub.trial_end },
        });
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const org = await findOrgByCustomer(invoice.customer);
      if (org) {
        await admin.from('audit_log').insert({
          org_id: org.id,
          action: 'stripe.payment_succeeded',
          metadata: { invoiceId: invoice.id, amount: invoice.amount_paid },
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const org = await findOrgByCustomer(invoice.customer);
      if (org) {
        await admin.from('audit_log').insert({
          org_id: org.id,
          action: 'stripe.payment_failed',
          metadata: { invoiceId: invoice.id, amount: invoice.amount_due, attemptCount: invoice.attempt_count },
        });
        await track('payment_failed', {
          distinctId: org.id,
          properties: { invoice_id: invoice.id, attempt_count: invoice.attempt_count },
          groups: { organization: org.id },
        });
      }
      break;
    }

    case 'customer.updated': {
      const customer = event.data.object as Stripe.Customer;
      // No-op for now — we don't mirror customer name/email back into the org row
      // because the editor's source of truth is auth.users + organizations.name.
      // Hook left in so the webhook 200s on this event instead of marking it
      // unhandled in the Stripe dashboard.
      void customer;
      break;
    }

    default:
      // Unhandled events still 200 so Stripe doesn't retry forever.
      break;
  }

  return Response.json({ received: true });
}
