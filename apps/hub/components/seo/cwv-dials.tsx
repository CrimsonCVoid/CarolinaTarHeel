'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TickerNumber } from '@/components/ui/ticker-number';

/*
 * Three semicircle gauges (LCP / INP / CLS). Each arc fills via
 * pathLength on viewport entry. Color shifts per Web Vitals threshold.
 */

interface DialMetric {
  label: string;
  value: number;
  threshold: number;
  max: number;
  unit: string;
  decimals: number;
}

const PORTFOLIO_DEFAULTS: DialMetric[] = [
  { label: 'LCP', value: 1.2, threshold: 2.5, max: 4, unit: 's', decimals: 1 },
  { label: 'INP', value: 84, threshold: 200, max: 500, unit: 'ms', decimals: 0 },
  { label: 'CLS', value: 0.02, threshold: 0.1, max: 0.25, unit: '', decimals: 2 },
];

export function CoreWebVitalsDials({ metrics = PORTFOLIO_DEFAULTS }: { metrics?: DialMetric[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="seo-card rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-slate-900">Core Web Vitals</h3>
      <p className="mt-1 text-xs text-slate-500">Median across our fleet, last 28 days.</p>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {metrics.map((m) => (
          <Dial key={m.label} metric={m} inView={inView} />
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-600">
        <strong className="text-slate-900">100%</strong> of our sites pass Core Web Vitals.{' '}
        <span className="text-slate-500">Industry average: 49% (HTTP Archive Web Almanac).</span>
      </p>
    </div>
  );
}

function Dial({ metric, inView }: { metric: DialMetric; inView: boolean }) {
  const passing = metric.value <= metric.threshold;
  const color = passing
    ? 'var(--color-success-700)'
    : metric.value <= metric.max * 0.7
      ? 'var(--color-warning-600)'
      : 'var(--color-danger-600)';
  const pct = Math.min(1, metric.value / metric.max);

  // Semicircle arc — radius 60, viewBox 160x90, drawn from (10,80) to (150,80).
  const arc = 'M 10 80 A 70 70 0 0 1 150 80';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 100" className="w-full max-w-[140px]" aria-label={`${metric.label}: ${metric.value}${metric.unit}`}>
        <path d={arc} stroke="rgb(226 232 240)" strokeWidth={10} fill="none" strokeLinecap="round" />
        <motion.path
          d={arc}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: pct } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="-mt-6 text-center">
        <div className={`font-display text-xl font-semibold ${passing ? 'text-emerald-700' : 'text-amber-700'}`}>
          <TickerNumber value={metric.value} decimals={metric.decimals} duration={1600} shown={inView} />
          {metric.unit ? <span className="ml-0.5 text-[11px] font-normal text-slate-500">{metric.unit}</span> : null}
        </div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{metric.label}</div>
      </div>
    </div>
  );
}
