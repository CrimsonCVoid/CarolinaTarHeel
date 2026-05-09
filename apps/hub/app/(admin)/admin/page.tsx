import Link from 'next/link';
import { Card, CardContent, Container } from '@tarheel/ui';
import { createServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'Admin' };

export default async function AdminHome() {
  const supabase = await createServerClient();
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name, slug, plan, stripe_subscription_status, created_at')
    .order('created_at', { ascending: false });

  return (
    <Container className="py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">All organizations</h1>
          <p className="text-sm text-slate-600">{orgs?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/onboard"
          className="inline-flex h-10 items-center rounded-2xl bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          New onboarding
        </Link>
      </div>
      <Card className="mt-6">
        <CardContent className="p-0">
          <ul className="divide-y divide-slate-200">
            {(orgs ?? []).map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orgs/${o.id}`}
                  className="grid grid-cols-[1fr_120px_140px_120px] items-center gap-4 px-6 py-4 hover:bg-slate-50"
                >
                  <div>
                    <div className="font-medium text-slate-900">{o.name}</div>
                    <div className="text-xs text-slate-500">/{o.slug}</div>
                  </div>
                  <span className="capitalize text-sm text-slate-700">{o.plan}</span>
                  <span className="text-sm text-slate-700">{o.stripe_subscription_status ?? 'no sub'}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(o.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
