'use client';

import { Button } from '@tarheel/ui';
import { openCustomerPortal } from './actions';

export function BillingActions({ orgId, hasCustomer }: { orgId: string; hasCustomer: boolean }) {
  if (!hasCustomer) {
    return (
      <p className="text-sm text-slate-600">
        No active subscription. Your operator will send you a Stripe checkout link to start hosting.
      </p>
    );
  }
  return (
    <form action={openCustomerPortal}>
      <input type="hidden" name="orgId" value={orgId} />
      <Button type="submit">Manage subscription</Button>
    </form>
  );
}
