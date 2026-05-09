import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { createServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'Organization' };

export default async function OrgDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const [{ data: org }, { data: sites }, { data: members }, { data: events }] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', id).single(),
    supabase.from('sites').select('id, domain, template_id, status, created_at').eq('org_id', id),
    supabase.from('org_members').select('user_id, role, joined_at').eq('org_id', id),
    supabase
      .from('audit_log')
      .select('action, created_at, metadata')
      .eq('org_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  return (
    <Container className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>{org?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 text-sm sm:grid-cols-3">
            <div><dt className="text-slate-500">Plan</dt><dd className="font-medium capitalize">{org?.plan}</dd></div>
            <div><dt className="text-slate-500">Status</dt><dd className="font-medium">{org?.stripe_subscription_status ?? '—'}</dd></div>
            <div><dt className="text-slate-500">Customer</dt><dd className="font-mono text-xs">{org?.stripe_customer_id ?? '—'}</dd></div>
          </dl>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200">
            {(sites ?? []).map((s) => (
              <li key={s.id}>
                <Link href={`/sites/${s.id}`} className="flex items-center justify-between py-3 hover:text-brand-700">
                  <span>{s.domain}</span>
                  <span className="text-xs text-slate-500">{s.template_id} · {s.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200">
            {(members ?? []).map((m) => (
              <li key={m.user_id} className="flex items-center justify-between py-3 text-sm">
                <span className="font-mono text-xs">{m.user_id}</span>
                <span className="capitalize text-slate-700">{m.role}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200">
            {(events ?? []).map((e, i) => (
              <li key={i} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium text-slate-900">{e.action}</span>
                <span className="text-xs text-slate-500">{new Date(e.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
