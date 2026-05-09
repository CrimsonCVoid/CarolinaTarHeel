'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { requireSiteAccess } from '@/lib/auth';

export async function setStatus(id: string, status: 'new' | 'read' | 'archived' | 'spam', siteId: string) {
  await requireSiteAccess(siteId);
  const supabase = await createServerClient();
  const { error } = await supabase.from('form_submissions').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/sites/${siteId}/forms`);
}

export async function exportCsv(formData: FormData) {
  const siteId = String(formData.get('siteId'));
  const formId = formData.get('formId') ? String(formData.get('formId')) : null;
  await requireSiteAccess(siteId);
  const supabase = await createServerClient();
  let query = supabase
    .from('form_submissions')
    .select('id, form_id, data, status, created_at')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });
  if (formId) query = query.eq('form_id', formId);
  const { data } = await query;
  const rows = data ?? [];

  const keys = new Set<string>();
  for (const r of rows) {
    const d = r.data as Record<string, unknown>;
    Object.keys(d ?? {}).forEach((k) => keys.add(k));
  }
  const cols = ['id', 'form_id', 'status', 'created_at', ...keys];
  const escape = (v: unknown) => {
    const s = v == null ? '' : typeof v === 'string' ? v : JSON.stringify(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [cols.join(',')];
  for (const r of rows) {
    const d = (r.data as Record<string, unknown>) ?? {};
    const cells = [r.id, r.form_id, r.status, r.created_at, ...[...keys].map((k) => d[k])];
    lines.push(cells.map(escape).join(','));
  }
  const csv = lines.join('\n');
  const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  redirect(dataUri);
}
