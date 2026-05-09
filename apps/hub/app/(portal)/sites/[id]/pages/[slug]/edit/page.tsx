import { notFound } from 'next/navigation';
import { Container } from '@tarheel/ui';
import { getTemplate } from '@tarheel/templates';
import { requireSiteAccess } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { signPreviewToken } from '@/lib/preview-token';
import { EditorShell } from './editor-shell';

export const metadata = { title: 'Edit page' };

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug: slugParam } = await params;
  const slug = decodeURIComponent(slugParam);
  const { site } = await requireSiteAccess(id);
  const template = getTemplate(site.template_id);
  const pageDef = template.pages.find((p) => p.slug === slug);
  if (!pageDef) notFound();

  const supabase = await createServerClient();
  const { data: page } = await supabase
    .from('pages')
    .select('id, slug, draft_content, published_content, status, updated_at')
    .eq('site_id', id)
    .eq('slug', slug)
    .maybeSingle();

  const { data: versions } = await supabase
    .from('page_versions')
    .select('id, reason, created_at, edited_by')
    .eq('page_id', page?.id ?? '00000000-0000-0000-0000-000000000000')
    .order('created_at', { ascending: false })
    .limit(20);

  const previewToken = signPreviewToken(site.id, site.preview_secret);
  const previewPath = slug === '/' ? '' : slug;
  const previewUrl = `/preview/${site.id}${previewPath}?token=${previewToken}`;

  return (
    <Container className="py-8">
      <EditorShell
        siteId={id}
        siteDomain={site.domain}
        slug={slug}
        templateId={site.template_id}
        editorMeta={pageDef.editorMeta}
        initialDraft={(page?.draft_content as Record<string, unknown>) ?? (pageDef.defaultContent as Record<string, unknown>)}
        previewUrl={previewUrl}
        versions={versions ?? []}
      />
    </Container>
  );
}
