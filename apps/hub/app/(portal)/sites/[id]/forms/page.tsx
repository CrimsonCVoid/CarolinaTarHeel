import { Container, Card, CardContent } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { FormsInbox } from './forms-inbox';

export const metadata = { title: 'Forms' };

export default async function FormsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; form?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  await requireSiteAccess(id);
  const supabase = await createServerClient();

  let query = supabase
    .from('form_submissions')
    .select('id, form_id, data, status, created_at')
    .eq('site_id', id)
    .order('created_at', { ascending: false })
    .limit(200);
  if (sp.status) query = query.eq('status', sp.status);
  if (sp.form) query = query.eq('form_id', sp.form);
  const { data: subs } = await query;

  return (
    <Container className="py-10">
      <Card>
        <CardContent className="p-0">
          <FormsInbox siteId={id} initial={subs ?? []} activeStatus={sp.status} activeForm={sp.form} />
        </CardContent>
      </Card>
    </Container>
  );
}
