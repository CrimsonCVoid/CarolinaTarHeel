/**
 * One-shot Stripe product + price setup.
 *
 * Run once per Stripe environment (test, then live) to create the six
 * canonical price points used by the onboarding flow:
 *
 *   - Build · Starter   $750  one-time
 *   - Build · Standard  $1,500 one-time
 *   - Build · Premium   $2,750 one-time
 *   - Hosting · Starter   $39 / mo recurring
 *   - Hosting · Standard  $69 / mo recurring
 *   - Hosting · Premium  $129 / mo recurring
 *
 * Outputs the env-var lines you should paste into your Vercel project.
 *
 *   STRIPE_SECRET_KEY=sk_test_... pnpm tsx scripts/stripe-setup.ts
 *   # or for live:
 *   STRIPE_SECRET_KEY=sk_live_... pnpm tsx scripts/stripe-setup.ts
 */

import Stripe from 'stripe';

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error('Set STRIPE_SECRET_KEY first.');
  process.exit(1);
}
const stripe = new Stripe(secret, { apiVersion: '2025-02-24.acacia' });
const isTest = secret.startsWith('sk_test_');

const TIERS = [
  { plan: 'starter', label: 'Starter', build: 75000, monthly: 3900 },
  { plan: 'standard', label: 'Standard', build: 150000, monthly: 6900 },
  { plan: 'premium', label: 'Premium', build: 275000, monthly: 12900 },
] as const;

async function findOrCreateProduct(name: string, metadata: Record<string, string>): Promise<Stripe.Product> {
  const list = await stripe.products.search({ query: `metadata['key']:'${metadata.key}'` });
  if (list.data[0]) return list.data[0];
  return stripe.products.create({ name, metadata });
}

async function findOrCreatePrice(
  productId: string,
  unitAmount: number,
  recurring: boolean,
  metadata: Record<string, string>,
): Promise<Stripe.Price> {
  const list = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const existing = list.data.find(
    (p) =>
      p.unit_amount === unitAmount &&
      Boolean(p.recurring) === recurring &&
      p.metadata?.['key'] === metadata.key,
  );
  if (existing) return existing;
  return stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency: 'usd',
    recurring: recurring ? { interval: 'month' } : undefined,
    metadata,
  });
}

async function main(): Promise<void> {
  console.log(`\nStripe setup running in ${isTest ? 'TEST' : 'LIVE'} mode\n`);
  const envLines: string[] = [];

  for (const tier of TIERS) {
    const buildKey = `build_${tier.plan}`;
    const buildProduct = await findOrCreateProduct(`Tar Heel Web Co. — Build · ${tier.label}`, {
      key: buildKey,
      tier: tier.plan,
      kind: 'build',
    });
    const buildPrice = await findOrCreatePrice(buildProduct.id, tier.build, false, { key: buildKey });
    envLines.push(`STRIPE_PRICE_BUILD_${tier.plan.toUpperCase()}=${buildPrice.id}`);

    const monthlyKey = `${tier.plan}_monthly`;
    const monthlyProduct = await findOrCreateProduct(`Tar Heel Web Co. — Hosting · ${tier.label}`, {
      key: monthlyKey,
      tier: tier.plan,
      kind: 'monthly',
    });
    const monthlyPrice = await findOrCreatePrice(monthlyProduct.id, tier.monthly, true, { key: monthlyKey });
    envLines.push(`STRIPE_PRICE_${tier.plan.toUpperCase()}_MONTHLY=${monthlyPrice.id}`);

    console.log(
      `${tier.label.padEnd(10)} build ${buildPrice.id}  monthly ${monthlyPrice.id}  (${
        buildProduct.name === '' ? 'created' : 'reused'
      })`,
    );
  }

  console.log('\nPaste into your Vercel project env (Production at minimum):\n');
  console.log(envLines.join('\n'));
  console.log('');
}

await main();
