import { requireUser, loadUserSites, isOperator } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { PortalShell } from '@/components/portal/shell';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [sites, operator] = await Promise.all([loadUserSites(), isOperator(user.id)]);

  // Pre-compute new-submission counts per site so the sidebar's "Inbox"
  // badge doesn't fan out client-side fetches. Cheap: 1 query per site,
  // typical user has 1.
  const supabase = await createServerClient();
  const submissionsBySite = Object.fromEntries(
    await Promise.all(
      sites.map(async (s) => {
        const { count } = await supabase
          .from('form_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('site_id', s.id)
          .eq('status', 'new');
        return [s.id, count ?? 0] as const;
      }),
    ),
  );

  return (
    <PortalShell
      email={user.email ?? ''}
      isOperator={operator}
      sites={sites.map((s) => ({ id: s.id, domain: s.domain, status: s.status, org: s.org }))}
      submissionsBySite={submissionsBySite}
    >
      {children}
    </PortalShell>
  );
}
