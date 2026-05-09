import { Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { TeamForm } from './team-form';

export const metadata = { title: 'Team' };

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  const supabase = await createServerClient();
  const { data: members } = await supabase
    .from('org_members')
    .select('user_id, role, joined_at')
    .eq('org_id', site.org_id);

  return (
    <Container className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="mb-8 divide-y divide-slate-200">
            {(members ?? []).map((m) => (
              <li key={m.user_id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-mono text-xs text-slate-700">{m.user_id}</div>
                  <div className="text-xs text-slate-500">joined {new Date(m.joined_at).toLocaleDateString()}</div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
          <TeamForm orgId={site.org_id} />
        </CardContent>
      </Card>
    </Container>
  );
}
