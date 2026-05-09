'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

/*
 * MOTION.md §3.4 — the moment that justifies the price point.
 *
 * Two browser-chrome mockups side by side. Both start "loading" together.
 *  - Right: completes in 0.8s with Lighthouse 99 + 127 KB / 0.8s LCP.
 *  - Left:  drags on 8s with skeleton boxes shifting (visualizing CLS),
 *           images popping in late (FOUT-style), a fake cookie banner
 *           sliding up at 3s. Final stats: 4.2 MB / 8.1s LCP / Lighthouse 47.
 * Number counters tick in real time. Replay button restarts.
 *
 * Implementation: framer-motion timeline + CSS transitions. ~3 KB after
 * tree-shake for the framer parts that aren't shared with the rest of
 * the page.
 */

const TYPICAL_LCP = 8.1;
const TYPICAL_SIZE = 4.2;
const TYPICAL_LH = 47;
const OURS_LCP = 0.8;
const OURS_SIZE = 0.127; // 127 KB
const OURS_LH = 99;

export function PerformanceComparison() {
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const ref = useRef<HTMLDivElement>(null);

  // Auto-start on first viewport entry.
  useEffect(() => {
    if (phase !== 'idle') return;
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setPhase('running');
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [phase]);

  // The "running" phase finishes after 8 seconds (longest leg).
  useEffect(() => {
    if (phase !== 'running') return;
    const t = setTimeout(() => setPhase('done'), 8200);
    return () => clearTimeout(t);
  }, [phase, run]);

  const replay = () => {
    setRun((r) => r + 1);
    setPhase('running');
  };

  return (
    <div ref={ref} className="mt-16 grid gap-4 lg:grid-cols-2">
      <BrowserCard
        key={`typical-${run}`}
        kind="typical"
        running={phase === 'running'}
        targetLcp={TYPICAL_LCP}
        targetSize={TYPICAL_SIZE}
        targetLh={TYPICAL_LH}
        durationMs={8000}
      />
      <BrowserCard
        key={`ours-${run}`}
        kind="ours"
        running={phase === 'running'}
        targetLcp={OURS_LCP}
        targetSize={OURS_SIZE}
        targetLh={OURS_LH}
        durationMs={800}
      />
      <div className="lg:col-span-2 mt-2 flex justify-center">
        <button
          type="button"
          onClick={replay}
          disabled={phase === 'running'}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors duration-[var(--dur-fast)] hover:bg-slate-50 disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" /> Replay
        </button>
      </div>
    </div>
  );
}

interface CardProps {
  kind: 'typical' | 'ours';
  running: boolean;
  targetLcp: number;
  targetSize: number; // MB
  targetLh: number;
  durationMs: number;
}

function BrowserCard({ kind, running, targetLcp, targetSize, targetLh, durationMs }: CardProps) {
  const [progress, setProgress] = useState(0); // 0..1
  const [showCookie, setShowCookie] = useState(false);
  const [imagesIn, setImagesIn] = useState(false);
  const [fontReady, setFontReady] = useState(false);
  const [shifted, setShifted] = useState(false);
  const isOurs = kind === 'ours';

  useEffect(() => {
    if (!running) {
      setProgress(0);
      setShowCookie(false);
      setImagesIn(false);
      setFontReady(false);
      setShifted(false);
      return;
    }

    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    if (isOurs) {
      // Our build is already done in 800ms. Images come in instantly via
      // next/image priority, font is preloaded, no banner.
      const t1 = setTimeout(() => setImagesIn(true), 200);
      const t2 = setTimeout(() => setFontReady(true), 150);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // Typical SMB site: messy.
    const t1 = setTimeout(() => setShifted(true), 1200); // skeleton → real layout shift
    const t2 = setTimeout(() => setImagesIn(true), 4500); // images pop in late
    const t3 = setTimeout(() => setFontReady(true), 5500); // FOUT → swap
    const t4 = setTimeout(() => setShowCookie(true), 3000);
    return () => {
      cancelAnimationFrame(raf);
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, [running, durationMs, isOurs]);

  const lcp = (progress * targetLcp).toFixed(1);
  const size = progress < 1 ? (progress * targetSize).toFixed(targetSize < 1 ? 3 : 1) : targetSize.toFixed(targetSize < 1 ? 3 : 1);
  const lh = Math.round(progress * targetLh);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 px-3">
          <div className="rounded bg-white px-2 py-1 text-center text-[10px] text-slate-500">
            {isOurs ? 'joespizza.com' : 'old-site.example'}
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {isOurs ? 'Built by us' : 'Typical SMB'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-slate-100">
        <div
          className={`h-full ${isOurs ? 'bg-emerald-500' : 'bg-amber-500'} transition-[width] ease-out`}
          style={{
            width: `${progress * 100}%`,
            transitionDuration: '120ms',
          }}
        />
      </div>

      {/* Mock site body */}
      <div className="relative h-72 overflow-hidden bg-white">
        <AnimatePresence>
          {progress > 0 && (
            <motion.div
              key="body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.16 }}
              className="absolute inset-0"
            >
              {/* Hero block */}
              <div className={`m-3 h-20 rounded ${imagesIn ? 'bg-gradient-to-r from-brand-200 to-brand-400' : 'bg-slate-200'} transition-colors duration-300`} />
              {/* Headline skeleton */}
              <div className="mx-3 mt-2">
                <div className={`h-5 rounded ${fontReady ? 'bg-slate-900' : 'bg-slate-300'} transition-colors duration-150`} style={{ width: shifted && !isOurs ? '80%' : '60%' }} />
                <div className={`mt-2 h-3 rounded bg-slate-200`} style={{ width: shifted && !isOurs ? '60%' : '45%' }} />
              </div>
              {/* Cards row */}
              <div className="mx-3 mt-4 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-16 rounded ${imagesIn ? 'bg-brand-100' : 'bg-slate-100'} transition-colors duration-200`}
                    style={{
                      transform: shifted && !isOurs ? `translateY(${(i % 2) * 6}px)` : undefined,
                      transitionProperty: 'transform, background-color',
                      transitionDuration: '300ms',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fake cookie banner — only the typical side */}
        <AnimatePresence>
          {showCookie && !isOurs && (
            <motion.div
              key="cookie"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-2 bottom-2 rounded border border-slate-300 bg-white p-2 text-[10px] text-slate-600 shadow-sm"
            >
              We use cookies. <span className="font-semibold text-brand-700">Accept all</span> · Decline
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-200 px-4 py-3 text-center text-xs">
        <div>
          <div className={`font-display text-base font-semibold ${isOurs ? 'text-emerald-700' : 'text-slate-900'}`}>
            {progress >= 1 ? targetSize.toFixed(targetSize < 1 ? 3 : 1) : size}
            <span className="ml-0.5 text-[10px] font-normal text-slate-500">{targetSize < 1 ? 'MB' : 'MB'}</span>
          </div>
          <div className="text-[10px] text-slate-500">Page weight</div>
        </div>
        <div>
          <div className={`font-display text-base font-semibold ${isOurs ? 'text-emerald-700' : 'text-amber-700'}`}>
            {lcp}<span className="ml-0.5 text-[10px] font-normal text-slate-500">s</span>
          </div>
          <div className="text-[10px] text-slate-500">LCP</div>
        </div>
        <div>
          <div className={`font-display text-base font-semibold ${isOurs ? 'text-emerald-700' : 'text-red-700'}`}>{lh}</div>
          <div className="text-[10px] text-slate-500">Lighthouse</div>
        </div>
      </div>
    </div>
  );
}
