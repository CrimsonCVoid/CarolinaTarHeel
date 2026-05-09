'use client';

import { useState, useTransition } from 'react';
import { Button } from '@tarheel/ui';
import { Loader2 } from 'lucide-react';
import { createOnboardingCheckout } from '@/app/(portal)/sites/[id]/billing/actions';

interface Props {
  orgId: string;
  currentPlan: 'starter' | 'standard' | 'premium' | null;
  hasActiveSubscription: boolean;
}

/*
 * Operator-driven checkout. From the org detail page, the operator can
 * generate a Checkout URL for any tier — sends the link to the client
 * over email/text. We don't ask the client to come back to our portal
 * to pay; they click the Stripe-hosted Checkout link directly.
 *
 * Once paid, the webhook flips org.stripe_subscription_status='active'
 * and the client's editor session unlocks.
 */
export function CheckoutButtons({ orgId, currentPlan, hasActiveSubscription }: Props) {
  const [pending, start] = useTransition();
  const [generated, setGenerated] = useState<{ tier: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = (tier: 'starter' | 'standard' | 'premium') => {
    setError(null);
    setGenerated(null);
    start(async () => {
      try {
        const out = await createOnboardingCheckout(orgId, tier);
        setGenerated({ tier, url: out.url ?? '' });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not generate checkout');
      }
    });
  };

  if (hasActiveSubscription) {
    return (
      <p className="text-xs text-slate-500">
        Active subscription on the <strong className="capitalize text-slate-900">{currentPlan ?? 'standard'}</strong> plan.
        Use the customer portal to upgrade or change card.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Generate a Stripe Checkout link for the client. They pay the build fee + first month of hosting in one
        transaction; subscription auto-bills monthly after.
      </p>
      <div className="flex flex-wrap gap-2">
        {(['starter', 'standard', 'premium'] as const).map((t) => (
          <Button key={t} variant="outline" size="sm" disabled={pending} onClick={() => generate(t)}>
            {pending ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>
      {generated ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
          <p className="font-semibold">
            {generated.tier.charAt(0).toUpperCase() + generated.tier.slice(1)} checkout link
          </p>
          <p className="mt-1 break-all font-mono text-[11px]">
            <a href={generated.url} target="_blank" rel="noopener" className="hover:underline">
              {generated.url}
            </a>
          </p>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(generated.url)}
            className="mt-2 text-[11px] font-medium text-emerald-900 underline-offset-2 hover:underline"
          >
            Copy link
          </button>
        </div>
      ) : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
