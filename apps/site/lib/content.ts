import 'server-only';
import { cache } from 'react';
import { env } from './env.js';
import { siteSupabase } from './supabase.js';
import type { SiteSettings } from '@tarheel/templates';

interface SiteRow {
  id: string;
  domain: string;
  template_id: string;
  status: 'draft' | 'live' | 'archived';
}

interface PageRow {
  slug: string;
  title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  content: unknown;
}

const DEFAULT_SETTINGS: SiteSettings = {
  brand: {},
  contact: {},
  hours: {},
  social: {},
  seo: {},
};

export const fetchSite = cache(async (): Promise<SiteRow> => {
  const supabase = siteSupabase();
  const { data, error } = await supabase
    .from('sites')
    .select('id, domain, template_id, status')
    .eq('id', env.SITE_ID)
    .single();
  if (error || !data) throw new Error(`Site ${env.SITE_ID} not found: ${error?.message ?? 'no row'}`);
  return data as SiteRow;
});

export const fetchSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = siteSupabase();
  const { data } = await supabase
    .from('site_settings')
    .select('brand, contact, hours, social, seo')
    .eq('site_id', env.SITE_ID)
    .maybeSingle();
  return (data ?? DEFAULT_SETTINGS) as SiteSettings;
});

export const fetchPublishedPage = cache(
  async (slug: string, opts?: { preview?: boolean }): Promise<PageRow | null> => {
    const supabase = siteSupabase();
    const select = opts?.preview
      ? 'slug, title, meta_description, og_image_url, draft_content'
      : 'slug, title, meta_description, og_image_url, published_content';
    const { data, error } = await supabase
      .from('pages')
      .select(select)
      .eq('site_id', env.SITE_ID)
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as Record<string, unknown>;
    const content = opts?.preview ? row['draft_content'] : row['published_content'];
    if (!content && !opts?.preview) return null;
    return {
      slug: row['slug'] as string,
      title: (row['title'] as string | null) ?? null,
      meta_description: (row['meta_description'] as string | null) ?? null,
      og_image_url: (row['og_image_url'] as string | null) ?? null,
      content,
    };
  },
);

export async function fetchAllPublishedSlugs(): Promise<string[]> {
  const supabase = siteSupabase();
  const { data, error } = await supabase
    .from('pages')
    .select('slug')
    .eq('site_id', env.SITE_ID)
    .eq('status', 'published');
  if (error) throw error;
  return (data ?? []).map((row) => (row as { slug: string }).slug);
}
