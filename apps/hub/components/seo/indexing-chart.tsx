'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SAMPLE = Array.from({ length: 14 }, (_, i) => ({
  day: i,
  joes: i < 2 ? 0 : Math.min(8, Math.round(8 * (1 - Math.exp(-0.5 * (i - 1))))),
  triangle: i < 3 ? 0 : Math.min(12, Math.round(12 * (1 - Math.exp(-0.4 * (i - 2))))),
  sage: i < 1 ? 0 : Math.min(6, Math.round(6 * (1 - Math.exp(-0.7 * i)))),
  wagner: i < 4 ? 0 : Math.min(15, Math.round(15 * (1 - Math.exp(-0.35 * (i - 3))))),
  pinecone: i < 2 ? 0 : Math.min(10, Math.round(10 * (1 - Math.exp(-0.45 * (i - 1))))),
}));

const SERIES = [
  { key: 'joes', label: "Joe's Pizza", color: 'var(--color-data-1)' },
  { key: 'triangle', label: 'Triangle HVAC', color: 'var(--color-data-3)' },
  { key: 'sage', label: 'Sage Med Spa', color: 'var(--color-data-5)' },
  { key: 'wagner', label: 'Wagner Law', color: 'var(--color-data-2)' },
  { key: 'pinecone', label: 'Pinecone Aesthetics', color: 'var(--color-data-4)' },
];

export function IndexingChart() {
  return (
    <div className="seo-card rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-slate-900">Google indexing speed</h3>
      <p className="mt-1 text-xs text-slate-500">Days since launch (X) vs. pages indexed (Y) — sample of five sites.</p>
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SAMPLE} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`gix-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" vertical={false} />
            <XAxis dataKey="day" stroke="rgb(100 116 139)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="rgb(100 116 139)" fontSize={11} tickLine={false} axisLine={false} width={28} />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid rgb(226 232 240)', borderRadius: 8, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
            {SERIES.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                fill={`url(#gix-${s.key})`}
                strokeWidth={1.5}
                animationDuration={1200}
                animationBegin={i * 150}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        <strong className="text-slate-900">~4 days</strong> from launch to fully indexed — sample portfolio data.
      </p>
      <details className="mt-2 text-xs text-slate-600">
        <summary className="cursor-pointer text-brand-700 hover:underline">How we do it →</summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
          <li>
            Programmatic XML sitemap with accurate <code className="rounded bg-slate-100 px-1">lastmod</code>
          </li>
          <li>IndexNow protocol pings to Bing/Yandex on every publish</li>
          <li>Auto-submission to Google Search Console via API</li>
          <li>Schema.org JSON-LD per template (LocalBusiness, Restaurant, Service, etc.)</li>
        </ul>
      </details>
    </div>
  );
}
