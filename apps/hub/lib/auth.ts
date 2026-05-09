import 'server-only';
import { redirect } from 'next/navigation';
import { createServerClient } from './supabase/server';

export async function requireUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireOperator() {
  const user = await requireUser();
  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from('org_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'operator')
    .limit(1);
  if (!rows || rows.length === 0) redirect('/dashboard');
  return user;
}

export async function requireSiteAccess(siteId: string) {
  const user = await requireUser();
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('sites')
    .select('id, org_id, domain, template_id, status, revalidation_secret, preview_secret')
    .eq('id', siteId)
    .maybeSingle();
  if (error || !data) redirect('/dashboard');
  return { user, site: data };
}
