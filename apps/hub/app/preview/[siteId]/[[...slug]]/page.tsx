import { notFound } from 'next/navigation';
import { renderTemplate, type SiteSettings } from '@tarheel/templates';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyPreviewToken } from '@/lib/preview-token';
import { RefreshListener } from './refresh-listener';

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
    admin.from('pages').select('slug, draft_content').eq('site_id', siteId).eq('slug', path).maybeSingle(),
    admin.from('site_settings').select('brand, contact, hours, social, seo').eq('site_id', siteId).maybeSingle(),
  ]);

  if (!pageRes.data) notFound();

  const settings = (settingsRes.data ?? DEFAULT_SETTINGS) as SiteSettings;

  /*
   * Preview is allowed to render content that the publish gate would
   * reject — we want the editor to always show *something* the user can
   * see, even if a field is mid-edit and not yet valid. If template
   * schema validation fails (image URL not yet entered, required field
   * empty, etc.), surface a friendly placeholder with the issue list
   * instead of a 500.
   */
  let rendered;
  try {
    rendered = renderTemplate(
      site.template_id as string,
      pageRes.data.slug as string,
      pageRes.data.draft_content,
      settings,
    );
  } catch (e) {
    const issues = extractZodIssues(e);
    rendered = (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="font-display text-xl font-semibold text-amber-900">Preview not ready</h1>
          <p className="mt-2 text-sm text-amber-900/80">
            Some fields in this draft don&apos;t pass validation yet. Fix them in the editor and the preview
            will update automatically.
          </p>
          {issues.length > 0 ? (
            <ul className="mt-4 space-y-1.5 text-sm text-amber-900">
              {issues.slice(0, 12).map((iss, i) => (
                <li key={i}>
                  <code className="rounded bg-white/60 px-1.5 py-0.5 text-xs">{iss.path || '(root)'}</code>
                  <span className="ml-2 text-amber-900/80">{iss.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-amber-800/70">{(e as Error)?.message}</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      <RefreshListener />
      {rendered}
    </>
  );
}

interface IssueRow {
  path: string;
  message: string;
}

function extractZodIssues(err: unknown): IssueRow[] {
  if (!err || typeof err !== 'object') return [];
  const maybe = err as { issues?: { path?: (string | number)[]; message?: string }[] };
  if (!Array.isArray(maybe.issues)) return [];
  return maybe.issues.map((iss) => ({
    path: (iss.path ?? []).join('.'),
    message: iss.message ?? 'Invalid value',
  }));
}
