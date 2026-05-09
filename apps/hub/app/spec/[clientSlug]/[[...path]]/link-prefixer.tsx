'use client';

import { useEffect } from 'react';

/**
 * Templates render absolute root-relative links (`/food`, `/beer`, etc.) that
 * are correct in production but wrong inside the spec preview, where the same
 * pages live under `/spec/<clientSlug>/...`. This client component intercepts
 * link clicks and rewrites root-relative `href`s to include the prefix.
 *
 * Anchors with `target="_blank"`, external URLs, in-page hashes, mail/tel
 * links, and links that already start with the prefix are left alone.
 */
export function LinkPrefixer({ prefix }: { prefix: string }) {
  useEffect(() => {
    function rewrite(node: Element) {
      const a = node.closest('a');
      if (!a) return null;
      const href = a.getAttribute('href');
      if (!href) return null;
      if (a.target === '_blank') return null;
      if (href.startsWith('#')) return null;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return null;
      if (!href.startsWith('/')) return null; // external or relative
      if (href.startsWith(prefix + '/') || href === prefix) return null; // already prefixed
      return prefix + href;
    }

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      const dest = rewrite(target);
      if (!dest) return;
      e.preventDefault();
      window.location.href = dest;
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [prefix]);

  return null;
}
