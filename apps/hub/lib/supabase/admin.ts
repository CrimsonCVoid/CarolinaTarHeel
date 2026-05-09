import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@tarheel/db/types';
import { env } from '@/lib/env';

let _admin: ReturnType<typeof createClient<Database>> | null = null;

/** Service-role client. RLS bypassed. Use only when the tenant boundary is enforced in code. */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient() called on the client — service role keys must never reach the browser.');
  }
  if (!_admin) {
    _admin = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}
