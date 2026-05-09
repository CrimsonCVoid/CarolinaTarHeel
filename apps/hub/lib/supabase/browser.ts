'use client';
import { createBrowserClient as createSsrBrowser } from '@supabase/ssr';

export function createBrowserClient() {
  return createSsrBrowser(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );
}
