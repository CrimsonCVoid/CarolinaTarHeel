'use client';

import { useEffect, useRef } from 'react';

interface Props {
  src: string;
  /** Hash bumped on every save to force a refresh without losing scroll. */
  refreshKey?: number;
}

export function PreviewIframe({ src, refreshKey = 0 }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    try {
      iframe.contentWindow?.postMessage({ type: 'refresh', refreshKey }, '*');
    } catch {
      // ignore
    }
    iframe.src = src;
  }, [src, refreshKey]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
        <span>Preview</span>
        <a href={src} target="_blank" rel="noopener" className="text-brand-700 hover:underline">
          Open in new tab ↗
        </a>
      </div>
      <iframe
        ref={ref}
        src={src}
        title="Preview"
        className="block h-[90vh] min-h-[700px] w-full bg-white"
      />
    </div>
  );
}
