'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireSiteAccess } from '@/lib/auth';

interface MediaRow {
  id: string;
  public_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
  storage_path: string;
}

export async function uploadMediaItems(formData: FormData): Promise<MediaRow[]> {
  const siteId = String(formData.get('siteId'));
  await requireSiteAccess(siteId);
  const files = formData.getAll('files').filter((v): v is File => v instanceof File);
  const admin = createAdminClient();
  const out: MediaRow[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${siteId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const { error: upErr } = await admin.storage
      .from('site-media')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data: pub } = admin.storage.from('site-media').getPublicUrl(path);
    const { data, error } = await admin
      .from('media')
      .insert({
        site_id: siteId,
        storage_path: path,
        public_url: pub.publicUrl,
        size_bytes: file.size,
        mime_type: file.type,
      })
      .select('id, public_url, alt_text, width, height, size_bytes, mime_type, created_at, storage_path')
      .single();
    if (error) throw new Error(error.message);
    out.push(data as MediaRow);
  }
  revalidatePath(`/sites/${siteId}/media`);
  return out;
}

export async function updateAltText(mediaId: string, altText: string) {
  const supabase = await createServerClient();
  const { data: row } = await supabase.from('media').select('site_id').eq('id', mediaId).single();
  if (!row) throw new Error('Media not found');
  await requireSiteAccess(row.site_id);
  const { error } = await supabase.from('media').update({ alt_text: altText.trim() || null }).eq('id', mediaId);
  if (error) throw new Error(error.message);
}

export async function deleteMedia(mediaId: string, siteId: string) {
  await requireSiteAccess(siteId);
  const admin = createAdminClient();
  const { data: row } = await admin.from('media').select('storage_path').eq('id', mediaId).eq('site_id', siteId).single();
  if (!row) return;
  await admin.storage.from('site-media').remove([row.storage_path]);
  await admin.from('media').delete().eq('id', mediaId);
  revalidatePath(`/sites/${siteId}/media`);
}
