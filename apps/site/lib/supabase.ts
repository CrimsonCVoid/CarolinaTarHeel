import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

let _client: SupabaseClient | null = null;

/**
 * Server-only Supabase client scoped by env.SITE_ID. RLS is bypassed by the
 * service role key, but every query must include `.eq('site_id', env.SITE_ID)`
 * (and we never read site_id from the request — it comes from the deployment).
 */
export function siteSupabase(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('siteSupabase() called from the browser — service role keys must never reach the client.');
  }
  if (!_client) {
    _client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}
