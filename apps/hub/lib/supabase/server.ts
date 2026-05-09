import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient as createSsrServer } from '@supabase/ssr';
import type { Database } from '@tarheel/db/types';
import { env } from '@/lib/env';

export async function createServerClient() {
  const cookieStore = await cookies();
  return createSsrServer<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options as Record<string, unknown>);
          }
        } catch {
          // setAll may throw in RSC; safe to ignore — middleware handles refresh.
        }
      },
    },
  });
}
