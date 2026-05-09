'use server';

import { redirect } from 'next/navigation';
import { stripe, priceForPlan, type Plan } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export async function openCustomerPortal(formData: FormData) {
  const orgId = String(formData.get('orgId'));
  const supabase = await createServerClient();
  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_customer_id')
    .eq('id', orgId)
    .single();
  if (!org?.stripe_customer_id) throw new Error('No Stripe customer for this org');

  const session = await stripe().billingPortal.sessions.create({
    customer: org.stripe_customer_id,
    return_url: `https://${env.NEXT_PUBLIC_BRAND_DOMAIN}/dashboard`,
  });
  redirect(session.url);
}

/** Operator-only: create a Stripe Checkout session for a one-time build + recurring sub. */
export async function createOnboardingCheckout(orgId: string, plan: Plan) {
  const admin = createAdminClient();
  const { data: org } = await admin.from('organizations').select('id, name, stripe_customer_id').eq('id', orgId).single();
  if (!org) throw new Error('Org not found');

  let customerId = org.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe().customers.create({ name: org.name, metadata: { orgId } });
    customerId = customer.id;
    await admin.from('organizations').update({ stripe_customer_id: customerId }).eq('id', orgId);
  }

  const session = await stripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    success_url: `https://${env.NEXT_PUBLIC_BRAND_DOMAIN}/dashboard?welcome=1`,
    cancel_url: `https://${env.NEXT_PUBLIC_BRAND_DOMAIN}/admin/orgs/${orgId}`,
    line_items: [
      { price: priceForPlan(plan, 'monthly'), quantity: 1 },
      { price: priceForPlan(plan, 'build'), quantity: 1 }, // one-time build
    ],
    metadata: { orgId, plan },
  });
  return { url: session.url };
}
