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

interface UserSite {
  id: string;
  domain: string;
  template_id: string;
  status: 'draft' | 'live' | 'archived';
  org_id: string;
  org: { name: string | null; plan: string | null } | null;
}

/**
 * Loads every site this user can edit. Used by the sidebar (to render the
 * site switcher) and by the smart-redirect logic on /dashboard which sends
 * single-site users straight to their site.
 */
export async function loadUserSites(): Promise<UserSite[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('sites')
    .select('id, domain, template_id, status, org_id, organizations(name, plan)')
    .order('created_at', { ascending: false });
  return (data ?? []).map((row) => {
    // Supabase types the joined relation as either a single object or an
    // array depending on the FK shape. sites.org_id → organizations.id is
    // 1-1 so it's a single object at runtime, but the inferred type may
    // be the array variant. Normalize both shapes.
    const orgRel = row.organizations as unknown as
      | { name: string | null; plan: string | null }
      | { name: string | null; plan: string | null }[]
      | null;
    const org = Array.isArray(orgRel) ? (orgRel[0] ?? null) : (orgRel ?? null);
    return {
      id: row.id as string,
      domain: row.domain as string,
      template_id: row.template_id as string,
      status: row.status as UserSite['status'],
      org_id: row.org_id as string,
      org,
    };
  });
}

export async function isOperator(userId: string): Promise<boolean> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('org_members')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'operator')
    .limit(1);
  return Boolean(data && data.length > 0);
}
