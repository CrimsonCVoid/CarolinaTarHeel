/**
 * Nightly content backup. Dumps every site's pages + settings to JSON files
 * suitable for committing to a `tarheelweb-content-backups` repo.
 *
 * Run via: pnpm tsx scripts/backup-content.ts <output-dir>
 *
 * In production: GitHub Actions cron job (.github/workflows/backup.yml).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const out = process.argv[2] ?? './backups';
await fs.mkdir(out, { recursive: true });

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data: sites, error: siteErr } = await supabase.from('sites').select('id, domain, template_id, status, org_id');
if (siteErr) throw siteErr;

for (const site of sites ?? []) {
  const dir = path.join(out, site.domain);
  await fs.mkdir(dir, { recursive: true });

  const { data: settings } = await supabase
    .from('site_settings')
    .select('brand, contact, hours, social, seo')
    .eq('site_id', site.id)
    .maybeSingle();

  const { data: pages } = await supabase
    .from('pages')
    .select('slug, title, meta_description, og_image_url, published_content, status, published_at')
    .eq('site_id', site.id);

  const { data: media } = await supabase
    .from('media')
    .select('storage_path, public_url, alt_text, width, height, mime_type, size_bytes')
    .eq('site_id', site.id);

  await fs.writeFile(
    path.join(dir, 'site.json'),
    JSON.stringify({ site, settings, pages, media, exportedAt: new Date().toISOString() }, null, 2),
  );
}

console.warn(`Backed up ${sites?.length ?? 0} site(s) to ${out}`);
