import { notFound } from 'next/navigation';
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

  const supabase = await createServerClient();
  const { data: page } = await supabase
    .from('pages')
    .select('id, slug, template_page_key, draft_content, published_content, status, updated_at')
    .eq('site_id', id)
    .eq('slug', slug)
    .maybeSingle();
  if (!page) notFound();

  // Resolve the schema by template_page_key (stable identifier), not by
  // the URL slug — pages.slug is now editable and may not match any
  // template page.
  const templatePageKey = (page.template_page_key as string | null) ?? (page.slug as string);
  const pageDef = template.pages.find((p) => p.slug === templatePageKey);
  if (!pageDef) notFound();

  const { data: versions } = await supabase
    .from('page_versions')
    .select('id, reason, created_at, edited_by')
    .eq('page_id', page.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const previewToken = signPreviewToken(site.id, site.preview_secret);
  const previewPath = slug === '/' ? '' : slug;
  const previewUrl = `/preview/${site.id}${previewPath}?token=${previewToken}`;

  return (
    <EditorShell
      siteId={id}
      siteDomain={site.domain}
      slug={slug}
      templatePageKey={templatePageKey}
      pageTitle={pageDef.title}
      templateId={site.template_id}
      editorMeta={pageDef.editorMeta}
      initialDraft={(page.draft_content as Record<string, unknown>) ?? (pageDef.defaultContent as Record<string, unknown>)}
      previewUrl={previewUrl}
      versions={versions ?? []}
    />
  );
}
