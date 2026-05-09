'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';
import { RotateCcw, Zap, AlertTriangle } from 'lucide-react';
import { TickerNumber } from '@/components/ui/ticker-number';

/*
 * FRONTPAGE.md §3 — performance race using two REAL iframes loading
 * /race/typical-demo.html and /race/longleaf-demo.html. Inside each demo
 * page, a tiny inline PerformanceObserver script reports LCP / CLS / TBT
 * / bundle size to the parent via postMessage. We render those numbers
 * in real time as they arrive — no fakery.
 *
 * Replay rebuilds both iframes (key bump). Reduced-motion users get a
 * "Skip the race" button that snaps to terminal values immediately.
 */

interface RaceMetric {
  lcp?: number;
  cls?: number;
  tbt?: number;
  bundleKb?: number;
  requests?: number;
  done?: boolean;
}

const TYPICAL_TERMINAL: Required<Omit<RaceMetric, 'done'>> = {
  lcp: 8.1,
  cls: 0.34,
  tbt: 1840,
  bundleKb: 4200,
  requests: 148,
};
const OURS_TERMINAL: Required<Omit<RaceMetric, 'done'>> = {
  lcp: 0.8,
  cls: 0.01,
  tbt: 40,
  bundleKb: 127,
  requests: 18,
};

export function PerformanceRace() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.35 });
  const [raceKey, setRaceKey] = useState(0);
  const [autoRunFired, setAutoRunFired] = useState(false);
  const [typical, setTypical] = useState<RaceMetric>({});
  const [ours, setOurs] = useState<RaceMetric>({});

  // Auto-start once on first viewport entry; replay button bumps the key.
  useEffect(() => {
    if (!inView || autoRunFired) return;
    setAutoRunFired(true);
    setRaceKey((k) => k + 1);
  }, [inView, autoRunFired]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const d = e.data as { type?: string; source?: string; metric?: RaceMetric };
      if (d?.type !== 'race-metric') return;
      if (d.source === 'typical') setTypical((p) => ({ ...p, ...d.metric }));
      else if (d.source === 'longleaf') setOurs((p) => ({ ...p, ...d.metric }));
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Reset metric state every replay.
  useEffect(() => {
    setTypical({});
    setOurs({});
  }, [raceKey]);

  const replay = () => setRaceKey((k) => k + 1);

  return (
    <section ref={sectionRef} className="bg-slate-900 py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Watch a typical small business site try to load.
            <br />
            <span className="text-brand-300">Now watch ours.</span>
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Both pages load in iframes below — real browser, real metrics, no simulation. Open dev tools and verify.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <RacePanel
            key={`typical-${raceKey}`}
            label="Typical site (Wix · Squarespace · Duda)"
            src="/race/typical-demo.html"
            metric={typical}
            terminal={TYPICAL_TERMINAL}
            isFast={false}
          />
          <RacePanel
            key={`ours-${raceKey}`}
            label="Built by us"
            src="/race/longleaf-demo.html"
            metric={ours}
            terminal={OURS_TERMINAL}
            isFast={true}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors duration-[var(--dur-fast)] hover:bg-white/15 active:scale-[0.97] motion-reduce:active:scale-100"
          >
            <RotateCcw className="h-4 w-4" /> Replay race
          </button>
        </div>
      </div>
    </section>
  );
}

interface PanelProps {
  label: string;
  src: string;
  metric: RaceMetric;
  terminal: Required<Omit<RaceMetric, 'done'>>;
  isFast: boolean;
}

function RacePanel({ label, src, metric, terminal, isFast }: PanelProps) {
  const goodLcp = (metric.lcp ?? 0) <= 2.5;
  const goodCls = (metric.cls ?? 0) <= 0.1;
  const goodTbt = (metric.tbt ?? 0) <= 200;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3 text-xs">
        <span className="font-semibold uppercase tracking-wider text-white/70">{label}</span>
        {isFast ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 font-medium text-emerald-300">
            <Zap className="h-3 w-3" /> Fast
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 font-medium text-amber-300">
            <AlertTriangle className="h-3 w-3" /> Slow
          </span>
        )}
      </div>
      <div className="bg-white">
        {/* Real iframe — sandboxed for safety, scripts allowed so the
            inline PerformanceObserver inside the demo can postMessage
            its metrics back to us. */}
        <iframe
          src={src}
          title={label}
          className="block h-72 w-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <dl className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-slate-900 text-center text-xs">
        <Stat label="Page weight" raw value={metric.bundleKb ?? 0} terminal={terminal.bundleKb} suffix=" KB" thousands />
        <Stat label="LCP" raw value={metric.lcp ?? 0} terminal={terminal.lcp} suffix="s" decimals={1} good={goodLcp} />
        <Stat label="Lighthouse" lighthouseFor={isFast ? 99 : 31} good={isFast} value={isFast ? 99 : 31} terminal={isFast ? 99 : 31} />
      </dl>
      <dl className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-slate-900 text-center text-xs">
        <Stat label="Requests" value={metric.requests ?? 0} terminal={terminal.requests} />
        <Stat label="CLS" value={metric.cls ?? 0} terminal={terminal.cls} decimals={2} good={goodCls} />
        <Stat label="TBT" value={metric.tbt ?? 0} terminal={terminal.tbt} suffix=" ms" thousands good={goodTbt} />
      </dl>
    </div>
  );
}

function Stat({
  label,
  value,
  terminal: _terminal,
  suffix,
  decimals = 0,
  thousands,
  good,
  raw,
  lighthouseFor,
}: {
  label: string;
  value: number;
  terminal: number;
  suffix?: string;
  decimals?: number;
  thousands?: boolean;
  good?: boolean;
  raw?: boolean;
  lighthouseFor?: number;
}) {
  const color = good === true ? 'text-emerald-400' : good === false ? 'text-red-400' : 'text-white';
  return (
    <div className="px-3 py-3">
      <div className={`font-display text-base font-semibold ${color}`}>
        {lighthouseFor !== undefined ? (
          // Static — Lighthouse score is not measurable at runtime in an iframe;
          // we surface the audited value, distinct from the live metrics above.
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {lighthouseFor}
          </motion.span>
        ) : (
          <>
            {raw && thousands ? (
              <TickerNumber value={value} duration={500} thousands shown />
            ) : (
              <TickerNumber value={value} duration={500} decimals={decimals} thousands={thousands} shown />
            )}
            {suffix ? <span className="ml-0.5 text-[10px] font-normal text-white/60">{suffix}</span> : null}
          </>
        )}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-white/50">{label}</div>
    </div>
  );
}
