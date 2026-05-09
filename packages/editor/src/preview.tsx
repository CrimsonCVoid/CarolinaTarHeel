'use client';

import { useEffect, useRef } from 'react';

interface Props {
  src: string;
  /** Bumped after each autosave/publish. Triggers an in-iframe RSC refresh
   *  via postMessage instead of a full document reload. */
  refreshKey?: number;
}

/*
 * Hot-update preview iframe.
 *
 * Two paths:
 *   1. `src` itself changes (e.g. switching to a different page) — full
 *      navigation, set iframe.src as normal.
 *   2. Same `src`, only `refreshKey` ticks (autosave / publish) — send
 *      `{ type: 'thw-preview-refresh' }` to the iframe. The preview page's
 *      RefreshListener catches it and calls Next's router.refresh(), which
 *      streams in just the new RSC payload. No document reload, no white
 *      flash, scroll position preserved.
 *
 * Initial mount: src is set declaratively on the <iframe> below; the effect
 * skips the first render so we don't fire a postMessage at a not-yet-loaded
 * frame.
 */
export function PreviewIframe({ src, refreshKey = 0 }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);
  const prevSrcRef = useRef(src);
  const prevKeyRef = useRef(refreshKey);
  const mountedRef = useRef(false);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    if (!mountedRef.current) {
      mountedRef.current = true;
      prevSrcRef.current = src;
      prevKeyRef.current = refreshKey;
      return;
    }
    if (src !== prevSrcRef.current) {
      // Different page — set src to navigate. Standard iframe load.
      iframe.src = src;
      prevSrcRef.current = src;
      return;
    }
    if (refreshKey !== prevKeyRef.current) {
      // Same page, content changed — ask the iframe to soft-refresh.
      try {
        iframe.contentWindow?.postMessage({ type: 'thw-preview-refresh' }, '*');
      } catch {
        // Cross-origin or detached — fall back to full reload.
        iframe.src = src;
      }
      prevKeyRef.current = refreshKey;
    }
  }, [src, refreshKey]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
        <span>Preview</span>
        <a href={src} target="_blank" rel="noopener" className="text-brand-700 hover:underline">
          Open in new tab ↗
        </a>
      </div>
      <iframe
        ref={ref}
        src={src}
        title="Preview"
        data-thw-preview
        className="block h-full min-h-0 w-full flex-1 bg-white"
      />
    </div>
  );
}
