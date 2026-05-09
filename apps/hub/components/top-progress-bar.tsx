'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/*
 * Top progress bar (MOTION.md §4.7) — 2px brand strip at the top of the
 * viewport. Indeterminate growth pattern: 30% in 200ms, 80% in 1200ms,
 * 100% on resolve, fade out 200ms.
 *
 * App Router doesn't expose route-change events directly. We synthesize a
 * "navigation in flight" signal by intercepting clicks on internal <a>
 * elements and clearing it when pathname/searchParams change.
 */
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<number | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolve to 100% then fade away whenever the route resolves.
  useEffect(() => {
    if (progress === null) return;
    setProgress(1);
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    finishTimerRef.current = setTimeout(() => setProgress(null), 240);
    // We don't include `progress` in deps — only react to route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept link clicks to start the progress.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest('a');
      if (!target) return;
      if (target.target === '_blank' || target.hasAttribute('download')) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;
      // Same-origin navigation — start the bar.
      setProgress(0.05);
      requestAnimationFrame(() => setProgress(0.3));
      const t1 = setTimeout(() => setProgress(0.8), 200);
      return () => clearTimeout(t1);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (progress === null) return null;

  return (
    <div
      role="progressbar"
      aria-busy
      aria-label="Page loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    >
      <div
        className="h-full origin-left bg-brand-600 transition-[transform,opacity] motion-reduce:transition-none"
        style={{
          transform: `scaleX(${progress})`,
          opacity: progress >= 1 ? 0 : 1,
          transitionDuration: progress >= 1 ? '240ms' : '1200ms',
          transitionTimingFunction: 'var(--ease-out-quint)',
        }}
      />
    </div>
  );
}
