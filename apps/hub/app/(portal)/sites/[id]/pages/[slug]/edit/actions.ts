'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getTemplate } from '@tarheel/templates';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireSiteAccess } from '@/lib/auth';
import { track } from '@/lib/analytics-server';

const Json = z.unknown();

export async function saveDraft(siteId: string, slug: string, draft: unknown) {
  await requireSiteAccess(siteId);
  Json.parse(draft);
  const supabase = await createServerClient();
  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('site_id', siteId)
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('pages').update({ draft_content: draft }).eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('pages')
      .insert({ site_id: siteId, slug, draft_content: draft, status: 'draft' });
    if (error) throw new Error(error.message);
  }
}

export async function publishPage(siteId: string, slug: string) {
  const { user, site } = await requireSiteAccess(siteId);
  const template = getTemplate(site.template_id);
  const pageDef = template.pages.find((p) => p.slug === slug);
  if (!pageDef) throw new Error('Page is not part of this template');

  const supabase = await createServerClient();
  const { data: page, error: pageErr } = await supabase
    .from('pages')
    .select('id, draft_content')
    .eq('site_id', siteId)
    .eq('slug', slug)
    .maybeSingle();
  if (pageErr || !page) throw new Error(pageErr?.message ?? 'Page not found');

  const parsed = pageDef.schema.safeParse(page.draft_content);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    throw new Error(`Validation failed: ${JSON.stringify(flat)}`);
  }

  await supabase.from('page_versions').insert({
    page_id: page.id,
    content: parsed.data,
    edited_by: user.id,
    reason: 'publish',
  });

  const { error: updErr } = await supabase
    .from('pages')
    .update({
      published_content: parsed.data,
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', page.id);
  if (updErr) throw new Error(updErr.message);

  // Audit
  await supabase.from('audit_log').insert({
    org_id: site.org_id,
    site_id: siteId,
    user_id: user.id,
    action: 'page.publish',
    metadata: { slug },
  });

  // Revalidate the live site
  try {
    await fetch(`https://${site.domain}/api/revalidate`, {
      method: 'POST',
      headers: {
        'x-revalidation-secret': site.revalidation_secret,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ paths: [slug] }),
    });
  } catch (e) {
    console.warn('Revalidation request failed (non-fatal):', e);
  }

  revalidatePath(`/sites/${siteId}`);
  revalidatePath(`/sites/${siteId}/pages/${encodeURIComponent(slug)}/edit`);

  await track('page_published', {
    distinctId: user.id,
    properties: { slug, template: site.template_id, domain: site.domain },
    groups: { organization: site.org_id, site: siteId },
  });
}

/**
 * Rename a page's URL slug. Validates, ensures uniqueness per site,
 * updates the row, and revalidates both old and new paths on the live
 * site. The template_page_key is NOT touched — schema binding stays.
 *
 * Old URL becomes a 404 after rename (no redirects table yet). Will
 * add server-side redirects when we have multiple clients asking for
 * SEO-safe migrations.
 */
const SLUG_RE = /^\/[a-z0-9](?:[a-z0-9-/]*[a-z0-9])?$/;

export async function renameSlug(
  siteId: string,
  currentSlug: string,
  nextSlug: string,
): Promise<{ slug: string }> {
  const { user, site } = await requireSiteAccess(siteId);
  const raw = nextSlug.trim().toLowerCase();
  const cleaned = raw === '' || raw === '/' ? '/' : raw.startsWith('/') ? raw : `/${raw}`;
  if (cleaned !== '/' && !SLUG_RE.test(cleaned)) {
    throw new Error(
      'Slug must be lowercase letters, numbers, or hyphens, separated by /. Example: /menu or /our-services.',
    );
  }
  if (cleaned === currentSlug) return { slug: currentSlug };

  const supabase = await createServerClient();
  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('site_id', siteId)
    .eq('slug', cleaned)
    .maybeSingle();
  if (existing) throw new Error(`Another page on this site already uses ${cleaned}.`);

  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('site_id', siteId)
    .eq('slug', currentSlug)
    .single();
  if (!page) throw new Error('Page not found');

  const { error: updErr } = await supabase.from('pages').update({ slug: cleaned }).eq('id', page.id);
  if (updErr) throw new Error(updErr.message);

  try {
    await fetch(`https://${site.domain}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidation-secret': site.revalidation_secret, 'content-type': 'application/json' },
      body: JSON.stringify({ paths: [currentSlug, cleaned] }),
    });
  } catch (e) {
    console.warn('Revalidation request failed (non-fatal):', e);
  }

  await supabase.from('audit_log').insert({
    org_id: site.org_id,
    site_id: siteId,
    user_id: user.id,
    action: 'page.rename',
    metadata: { from: currentSlug, to: cleaned },
  });

  await track('page_renamed', {
    distinctId: user.id,
    properties: { from: currentSlug, to: cleaned, domain: site.domain },
    groups: { organization: site.org_id, site: siteId },
  });

  revalidatePath(`/sites/${siteId}`);
  revalidatePath(`/sites/${siteId}/pages`);
  return { slug: cleaned };
}

/**
 * Fetches a single version's content. Used by the Preview button on the
 * version-history list — the editor pushes this content into the iframe
 * so the user can see the snapshot without overwriting their current
 * draft. Auth gate is the same as restoreVersion (read access on the
 * owning site).
 */
export async function getVersionContent(siteId: string, versionId: string): Promise<unknown> {
  await requireSiteAccess(siteId);
  const supabase = await createServerClient();
  // Verify the version belongs to a page on this site (defense in depth —
  // RLS already enforces this via the membership policies in 0001_initial).
  const { data: ver } = await supabase
    .from('page_versions')
    .select('content, page_id, pages!inner(site_id)')
    .eq('id', versionId)
    .single();
  if (!ver) throw new Error('Version not found');
  const pageRel = ver.pages as { site_id: string } | { site_id: string }[] | null;
  const owningSiteId = Array.isArray(pageRel) ? pageRel[0]?.site_id : pageRel?.site_id;
  if (owningSiteId !== siteId) throw new Error('Version does not belong to this site');
  return ver.content;
}

export async function restoreVersion(siteId: string, slug: string, versionId: string) {
  await requireSiteAccess(siteId);
  const supabase = await createServerClient();
  const { data: ver } = await supabase.from('page_versions').select('content').eq('id', versionId).single();
  if (!ver) throw new Error('Version not found');
  const { data: page } = await supabase.from('pages').select('id').eq('site_id', siteId).eq('slug', slug).single();
  if (!page) throw new Error('Page not found');
  await supabase.from('pages').update({ draft_content: ver.content }).eq('id', page.id);
  await supabase.from('page_versions').insert({ page_id: page.id, content: ver.content, reason: 'restore' });
  revalidatePath(`/sites/${siteId}/pages/${encodeURIComponent(slug)}/edit`);
}

const UPLOAD_BODY = z.object({ siteId: z.string().uuid() });

export async function uploadMedia(formData: FormData): Promise<{ publicUrl: string; width?: number; height?: number }> {
  const siteId = String(formData.get('siteId'));
  const file = formData.get('file');
  UPLOAD_BODY.parse({ siteId });
  if (!(file instanceof File)) throw new Error('Missing file');
  await requireSiteAccess(siteId);

  const admin = createAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${siteId}/${Date.now()}-${safeName}`;

  const { error: upErr } = await admin.storage.from('site-media').upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (upErr) throw new Error(upErr.message);

  const { data: pub } = admin.storage.from('site-media').getPublicUrl(path);

  await admin.from('media').insert({
    site_id: siteId,
    storage_path: path,
    public_url: pub.publicUrl,
    size_bytes: file.size,
    mime_type: file.type,
  });

  return { publicUrl: pub.publicUrl };
}
