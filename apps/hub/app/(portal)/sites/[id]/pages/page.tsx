import Link from 'next/link';
import { Badge, Card, CardContent, CardHeader, CardTitle, Container } from '@tarheel/ui';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { getTemplate } from '@tarheel/templates';

export const metadata = { title: 'Pages' };

export default async function PagesIndex({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { site } = await requireSiteAccess(id);
  const template = getTemplate(site.template_id);
  const supabase = await createServerClient();
  const { data: pages } = await supabase
    .from('pages')
    .select('id, slug, status, updated_at')
    .eq('site_id', id);

  const bySlug = new Map((pages ?? []).map((p) => [p.slug, p]));

  return (
    <Container className="py-10">
      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-200">
            {template.pages.map((p) => {
              const row = bySlug.get(p.slug);
              return (
                <li key={p.slug} className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      href={`/sites/${id}/pages/${encodeURIComponent(p.slug)}/edit`}
                      className="text-base font-medium text-slate-900 hover:text-brand-700"
                    >
                      {p.title} <span className="text-slate-400">{p.slug}</span>
                    </Link>
                    {row ? (
                      <p className="text-xs text-slate-500">
                        updated {new Date(row.updated_at).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">not yet edited</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={row?.status === 'published' ? 'success' : 'warning'}>
                      {row?.status ?? 'new'}
                    </Badge>
                    <Link
                      href={`/sites/${id}/pages/${encodeURIComponent(p.slug)}/edit`}
                      className="text-sm text-brand-700 hover:underline"
                    >
                      Edit →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
