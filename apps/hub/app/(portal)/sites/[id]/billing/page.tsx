import { Badge, Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { BillingActions } from './billing-actions';
import { env } from '@/lib/env';

export const metadata = { title: 'Billing' };

const STATUS_LABELS: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' | 'muted' }> = {
  active: { label: 'Active', tone: 'success' },
  trialing: { label: 'Trial', tone: 'success' },
  past_due: { label: 'Past due', tone: 'warning' },
  unpaid: { label: 'Unpaid', tone: 'danger' },
  canceled: { label: 'Cancelled', tone: 'muted' },
  incomplete: { label: 'Incomplete', tone: 'warning' },
  incomplete_expired: { label: 'Expired', tone: 'muted' },
  paused: { label: 'Paused', tone: 'muted' },
};

export default async function BillingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  const supabase = await createServerClient();
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, plan, stripe_customer_id, stripe_subscription_status')
    .eq('id', site.org_id)
    .single();

  const status = org?.stripe_subscription_status ?? null;
  const statusInfo = status ? STATUS_LABELS[status] ?? { label: status, tone: 'muted' as const } : null;
  const isTestMode = (env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_');

  return (
    <Container className="py-10">
      {isTestMode ? (
        <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Stripe test mode.</strong> Use test card{' '}
          <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">4242 4242 4242 4242</code> with any
          future expiration and any CVC. No real money will be charged.
        </div>
      ) : null}

      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Billing</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your subscription, update card, view invoices.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>Subscription</span>
            {statusInfo ? <Badge variant={statusInfo.tone}>{statusInfo.label}</Badge> : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <Row label="Plan" value={titleCase(org?.plan ?? '—')} />
            <Row
              label="Monthly"
              value={
                org?.plan === 'starter'
                  ? '$39 / mo'
                  : org?.plan === 'standard'
                    ? '$69 / mo'
                    : org?.plan === 'premium'
                      ? '$129 / mo'
                      : '—'
              }
            />
            <Row label="Customer ID" value={org?.stripe_customer_id ?? '—'} mono />
          </dl>
          <div className="mt-6">
            <BillingActions orgId={org?.id ?? ''} hasCustomer={Boolean(org?.stripe_customer_id)} />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Need help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>
            Email{' '}
            <a className="text-brand-700 hover:underline" href="mailto:hello@tarheelweb.co">
              hello@tarheelweb.co
            </a>{' '}
            for invoice questions, plan changes, or cancellation. We respond same-day on Standard, within 2 hours
            on Premium.
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}

function titleCase(s: string): string {
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className={mono ? 'font-mono text-xs text-slate-500' : 'font-medium text-slate-900'}>{value}</dd>
    </div>
  );
}
