import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient as createSsrServer } from '@supabase/ssr';
import { env } from '@/lib/env';

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export async function createServerClient() {
  const cookieStore = await cookies();
  return createSsrServer(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet: CookieToSet[]) => {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll may throw in RSC; safe to ignore — middleware handles refresh.
        }
      },
    },
  });
}
