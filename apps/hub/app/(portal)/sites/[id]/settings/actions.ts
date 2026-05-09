'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { requireSiteAccess } from '@/lib/auth';

export async function saveSiteSettings(siteId: string, value: Record<string, unknown>) {
  const { site } = await requireSiteAccess(siteId);
  const supabase = await createServerClient();
  const payload = {
    site_id: siteId,
    brand: value['brand'] ?? {},
    contact: value['contact'] ?? {},
    hours: value['hours'] ?? {},
    social: value['social'] ?? {},
    seo: value['seo'] ?? {},
  };
  const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'site_id' });
  if (error) throw new Error(error.message);

  // Site-wide settings affect every page; revalidate everything
  try {
    await fetch(`https://${site.domain}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidation-secret': site.revalidation_secret, 'content-type': 'application/json' },
      body: JSON.stringify({ paths: ['/'] }),
    });
  } catch {
    // best-effort
  }
  revalidatePath(`/sites/${siteId}/settings`);
}
