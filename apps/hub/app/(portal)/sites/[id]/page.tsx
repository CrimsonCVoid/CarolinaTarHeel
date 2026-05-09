import Link from 'next/link';
import { Badge, Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { getTemplate } from '@tarheel/templates';

export const metadata = { title: 'Site overview' };

export default async function SiteOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  const template = getTemplate(site.template_id);
  const supabase = await createServerClient();
  const [{ data: pages }, { data: subs }, { data: lastAudit }] = await Promise.all([
    supabase.from('pages').select('id, slug, status, updated_at').eq('site_id', id).order('slug'),
    supabase.from('form_submissions').select('id, status', { count: 'exact', head: false }).eq('site_id', id).eq('status', 'new'),
    supabase
      .from('audit_log')
      .select('action, created_at')
      .eq('site_id', id)
      .order('created_at', { ascending: false })
      .limit(1),
  ]);

  return (
    <Container className="py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={site.status === 'live' ? 'success' : 'warning'}>{site.status}</Badge>
            <p className="mt-2 text-sm text-slate-600">Domain: {site.domain}</p>
            <p className="text-sm text-slate-600">Template: {template.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{subs?.length ?? 0}</div>
            <Link href={`/sites/${id}/forms`} className="mt-2 inline-block text-sm text-brand-700 hover:underline">
              View new submissions →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last activity</CardTitle>
          </CardHeader>
          <CardContent>
            {lastAudit?.[0] ? (
              <div className="text-sm text-slate-700">
                <div className="font-medium">{lastAudit[0].action}</div>
                <div className="text-slate-500">{new Date(lastAudit[0].created_at).toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200">
            {(pages ?? []).map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <Link
                    href={`/sites/${id}/pages/${encodeURIComponent(p.slug)}/edit`}
                    className="text-base font-medium text-slate-900 hover:text-brand-700"
                  >
                    {p.slug}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {p.status} · updated {new Date(p.updated_at).toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/sites/${id}/pages/${encodeURIComponent(p.slug)}/edit`}
                  className="text-sm text-brand-700 hover:underline"
                >
                  Edit →
                </Link>
              </li>
            ))}
            {(!pages || pages.length === 0) && <p className="py-3 text-sm text-slate-500">No pages yet.</p>}
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
