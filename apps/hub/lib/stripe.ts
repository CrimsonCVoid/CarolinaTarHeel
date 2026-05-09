import 'server-only';
import Stripe from 'stripe';
import { env } from './env';

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not set');
  if (!_stripe) {
    _stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });
  }
  return _stripe;
}

export const PRICES = {
  starter_monthly: () => env.STRIPE_PRICE_STARTER_MONTHLY,
  standard_monthly: () => env.STRIPE_PRICE_STANDARD_MONTHLY,
  premium_monthly: () => env.STRIPE_PRICE_PREMIUM_MONTHLY,
  build_starter: () => env.STRIPE_PRICE_BUILD_STARTER,
  build_standard: () => env.STRIPE_PRICE_BUILD_STANDARD,
  build_premium: () => env.STRIPE_PRICE_BUILD_PREMIUM,
};

export type Plan = 'starter' | 'standard' | 'premium';

export function priceForPlan(plan: Plan, kind: 'build' | 'monthly'): string {
  const key = `${kind === 'build' ? 'build_' : ''}${plan}${kind === 'monthly' ? '_monthly' : ''}` as keyof typeof PRICES;
  const price = PRICES[key]();
  if (!price) throw new Error(`Stripe price not configured for ${key}`);
  return price;
}
