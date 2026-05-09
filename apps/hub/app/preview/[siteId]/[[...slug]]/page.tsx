import { notFound } from 'next/navigation';
import { type SiteSettings } from '@tarheel/templates';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyPreviewToken } from '@/lib/preview-token';
import { RefreshListener } from './refresh-listener';
import { PreviewSurface } from './preview-surface';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SETTINGS: SiteSettings = {
  brand: {},
  contact: {},
  hours: {},
  social: {},
  seo: {},
};

interface Props {
  params: Promise<{ siteId: string; slug?: string[] }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const { siteId, slug } = await params;
  const sp = await searchParams;
  const path = '/' + (slug?.join('/') ?? '');

  const admin = createAdminClient();
  const { data: site } = await admin
    .from('sites')
    .select('preview_secret, template_id')
    .eq('id', siteId)
    .single();
  if (!site) notFound();

  if (!sp.token || !verifyPreviewToken(sp.token, siteId, site.preview_secret as string)) {
    return (
      <main className="grid min-h-screen place-items-center bg-white p-8 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900">Invalid preview link</h1>
          <p className="mt-2 text-sm text-slate-600">This preview link has expired or been revoked.</p>
        </div>
      </main>
    );
  }

  const [pageRes, settingsRes] = await Promise.all([
    admin
      .from('pages')
      .select('slug, template_page_key, draft_content')
      .eq('site_id', siteId)
      .eq('slug', path)
      .maybeSingle(),
    admin.from('site_settings').select('brand, contact, hours, social, seo').eq('site_id', siteId).maybeSingle(),
  ]);

  if (!pageRes.data) notFound();

  const settings = (settingsRes.data ?? DEFAULT_SETTINGS) as SiteSettings;

  /*
   * Render via template_page_key (stable schema identifier) — pages.slug
   * is now editable and represents only the URL path. Falls back to slug
   * for any rows that haven't been migrated yet (defensive).
   */
  const templatePageKey = (pageRes.data.template_page_key as string | null) ?? (pageRes.data.slug as string);

  return (
    <>
      <RefreshListener />
      <PreviewSurface
        templateId={site.template_id as string}
        slug={templatePageKey}
        initialContent={pageRes.data.draft_content}
        initialSettings={settings}
      />
    </>
  );
}
