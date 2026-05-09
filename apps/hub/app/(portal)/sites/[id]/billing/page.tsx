import { Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { BillingActions } from './billing-actions';

export const metadata = { title: 'Billing' };

export default async function BillingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  const supabase = await createServerClient();
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, plan, stripe_customer_id, stripe_subscription_status')
    .eq('id', site.org_id)
    .single();

  return (
    <Container className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Plan</dt>
              <dd className="font-medium capitalize text-slate-900">{org?.plan ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Status</dt>
              <dd className="font-medium text-slate-900">{org?.stripe_subscription_status ?? 'not started'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Customer ID</dt>
              <dd className="font-mono text-xs text-slate-500">{org?.stripe_customer_id ?? '—'}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <BillingActions orgId={org?.id ?? ''} hasCustomer={Boolean(org?.stripe_customer_id)} />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
