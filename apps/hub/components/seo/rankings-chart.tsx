'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts';

const SAMPLE = Array.from({ length: 13 }, (_, w) => ({
  week: w,
  pizza_apex: Math.max(1, Math.round(45 - w * 3.6 - Math.random() * 2)),
  hvac_cary: Math.max(1, Math.round(38 - w * 3.0 - Math.random() * 2)),
  med_spa_chapel: Math.max(2, Math.round(50 - w * 4.0 - Math.random() * 2)),
}));

const KEYWORDS = [
  { key: 'pizza_apex', label: '"pizza apex nc"', color: 'var(--color-data-1)' },
  { key: 'hvac_cary', label: '"hvac repair cary"', color: 'var(--color-data-2)' },
  { key: 'med_spa_chapel', label: '"botox chapel hill"', color: 'var(--color-data-5)' },
];

export function RankingsChart() {
  return (
    <div className="seo-card rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-display text-lg font-semibold tracking-tight text-slate-900">Search rankings</h3>
      <p className="mt-1 text-xs text-slate-500">Weeks since launch vs. SERP position. Lower is better.</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SAMPLE} margin={{ top: 8, right: 8, left: 0, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="rgb(100 116 139)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `Week ${v}`}
              label={{
                value: 'Weeks since launch',
                position: 'insideBottom',
                offset: -16,
                fontSize: 11,
                fill: 'rgb(100 116 139)',
              }}
            />
            <YAxis
              reversed
              domain={[1, 50]}
              ticks={[1, 10, 20, 30, 50]}
              stroke="rgb(100 116 139)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <ReferenceLine
              y={10}
              stroke="var(--color-success-700)"
              strokeDasharray="3 3"
              label={{ value: 'Page 1', position: 'right', fontSize: 10, fill: 'rgb(21 128 61)' }}
            />
            {/*
             * Tooltip is itemized: one row per <Line>, no aggregation. Defaults
             * to that anyway, but we override the formatter so each entry reads
             * "Position #N" (rather than just a bare number) and the header
             * reads "Week N".
             */}
            <Tooltip
              cursor={{ stroke: 'rgb(148 163 184)', strokeDasharray: '3 3' }}
              labelFormatter={(week) => `Week ${week}`}
              formatter={(value: number, name) => [`Position #${value}`, name as string]}
              contentStyle={{
                background: 'white',
                border: '1px solid rgb(226 232 240)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 16 }} iconType="circle" verticalAlign="bottom" />
            {KEYWORDS.map((k, i) => (
              <Line
                key={k.key}
                type="monotone"
                dataKey={k.key}
                name={k.label}
                stroke={k.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                animationDuration={1600}
                animationBegin={i * 200}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        <strong className="text-slate-900">All three</strong> reach page 1 within 12 weeks — sample portfolio data.
      </p>
      <details className="mt-2 text-xs text-slate-600">
        <summary className="cursor-pointer text-brand-700 hover:underline">How we do it →</summary>
        <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
          <li>Fast Core Web Vitals — Google explicitly rewards them</li>
          <li>Structured data per page type</li>
          <li>Local business signals (NAP, Google Business Profile, citations)</li>
          <li>Topic-cluster URL structure, no orphan pages</li>
        </ul>
      </details>
    </div>
  );
}
