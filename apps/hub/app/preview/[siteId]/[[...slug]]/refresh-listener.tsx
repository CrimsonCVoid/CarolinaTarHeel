'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/*
 * Receives `{ type: 'thw-preview-refresh' }` from the parent editor and
 * triggers Next's router.refresh() — re-fetches the RSC payload for this
 * route in place without a full document reload. The preview page stays a
 * Server Component (we want the template render server-side), but this
 * tiny listener gives us hot-update behavior on save without an iframe
 * reload flash.
 */
export function RefreshListener() {
  const router = useRouter();
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'thw-preview-refresh') {
        router.refresh();
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [router]);
  return null;
}
