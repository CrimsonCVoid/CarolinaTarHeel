'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TickerNumber } from '@/components/ui/ticker-number';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

// 6 months, organic sessions normalized as growth multiplier vs. month 1.
const SAMPLE = [
  { month: 'M1', mult: 1.0 },
  { month: 'M2', mult: 1.4 },
  { month: 'M3', mult: 2.1 },
  { month: 'M4', mult: 2.6 },
  { month: 'M5', mult: 3.0 },
  { month: 'M6', mult: 3.4 },
];

export function OrganicTrafficChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div ref={ref} className="seo-card rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-slate-900">Organic traffic growth</h3>
      <p className="mt-1 text-xs text-slate-500">Aggregate organic sessions, indexed to month 1 = 1.0×.</p>
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SAMPLE} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-success-700)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-success-700)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" vertical={false} />
            <XAxis dataKey="month" stroke="rgb(100 116 139)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="rgb(100 116 139)" fontSize={11} tickLine={false} axisLine={false} width={28} tickFormatter={(v) => `${v}×`} />
            <Tooltip formatter={(v: number) => `${v.toFixed(1)}×`} contentStyle={{ background: 'white', border: '1px solid rgb(226 232 240)', borderRadius: 8, fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="mult"
              stroke="var(--color-success-700)"
              strokeWidth={2}
              fill="url(#traffic-fill)"
              animationDuration={1600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        <strong className="text-slate-900">
          <TickerNumber value={3.4} from={1.0} decimals={1} duration={1600} shown={inView} />×
        </strong>{' '}
        average organic growth in 90 days — sample portfolio data.
      </p>
      <details className="mt-2 text-xs text-slate-600">
        <summary className="cursor-pointer text-brand-700 hover:underline">How we do it →</summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
          <li>Speed alone moves rankings 1–3 spots in our experience</li>
          <li>Schema.org markup unlocks rich result eligibility</li>
          <li>Programmatic location pages (e.g. /service-areas/cary)</li>
          <li>Quarterly content review on Standard, monthly on Premium</li>
        </ul>
      </details>
    </div>
  );
}
