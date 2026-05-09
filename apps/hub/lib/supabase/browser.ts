'use client';
import { createBrowserClient as createSsrBrowser } from '@supabase/ssr';
import type { Database } from '@tarheel/db/types';

export function createBrowserClient() {
  return createSsrBrowser<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );
}
