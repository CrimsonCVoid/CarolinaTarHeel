import { createBrowserClient as createSsrBrowser, createServerClient as createSsrServer } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

type CookieStore = {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options?: Record<string, unknown>): void;
};

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v || v.length === 0) {
    throw new Error(`Missing required env var ${key}`);
  }
  return v;
}

/** Browser session client. RLS is active via the user's JWT. Safe in client components. */
export function createBrowserClient() {
  return createSsrBrowser(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
}

/**
 * Server client bound to the current request's cookies. RLS active.
 * Pass in the cookie store from `next/headers` (or compatible).
 */
export function createServerClient(cookies: CookieStore) {
  return createSsrServer(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'), {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (toSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
        for (const { name, value, options } of toSet) {
          cookies.set(name, value, options);
        }
      },
    },
  });
}

/**
 * Service-role client. RLS BYPASSED. Server-only — throws if reached from a browser.
 * Use only when you have already enforced the tenant boundary in code (e.g. via env.SITE_ID).
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient() called in a browser context — service role keys must never reach the client.');
  }
  return createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
