import type Stripe from 'stripe';
import { env } from '@/lib/env';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.['orgId'];
      if (orgId && session.customer) {
        await admin
          .from('organizations')
          .update({
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer.id,
            stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
            stripe_subscription_status: 'active',
          })
          .eq('id', orgId);
        await admin.from('audit_log').insert({
          org_id: orgId,
          action: 'stripe.checkout_completed',
          metadata: { sessionId: session.id, mode: session.mode },
        });
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      await admin
        .from('organizations')
        .update({ stripe_subscription_status: sub.status, stripe_subscription_id: sub.id })
        .eq('stripe_customer_id', customerId);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        await admin.from('audit_log').insert({
          org_id: '00000000-0000-0000-0000-000000000000', // join via stripe_customer_id below
          action: 'stripe.payment_failed',
          metadata: { customerId, invoiceId: invoice.id, amount: invoice.amount_due },
        });
      }
      break;
    }
    default:
      // ignore
      break;
  }

  return Response.json({ received: true });
}
