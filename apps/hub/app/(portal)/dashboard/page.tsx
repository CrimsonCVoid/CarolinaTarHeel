import Link from 'next/link';
import { Badge, Card, CardContent, Container } from '@tarheel/ui';
import { createServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'Dashboard' };

export default async function Dashboard() {
  const supabase = await createServerClient();
  const { data: sites } = await supabase
    .from('sites')
    .select('id, domain, status, template_id, organizations(name, plan)')
    .order('created_at', { ascending: false });

  return (
    <Container className="py-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Your sites</h1>
          <p className="mt-1 text-sm text-slate-600">Edit content, view submissions, manage billing.</p>
        </div>
      </div>
      {sites && sites.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => {
            const org = s.organizations as { name?: string; plan?: string } | null;
            return (
              <li key={s.id}>
                <Link href={`/sites/${s.id}`}>
                  <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">{org?.name ?? 'Untitled'}</h2>
                        <Badge variant={s.status === 'live' ? 'success' : s.status === 'archived' ? 'muted' : 'warning'}>
                          {s.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{s.domain}</p>
                      <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
                        {s.template_id} · {org?.plan ?? '—'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card className="mt-8">
          <CardContent className="p-12 text-center">
            <p className="text-base text-slate-600">No sites yet.</p>
            <p className="mt-1 text-sm text-slate-500">Your operator will provision one.</p>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
