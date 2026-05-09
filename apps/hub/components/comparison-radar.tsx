'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Container } from '@tarheel/ui';

const AXES = ['Speed', 'Cost', 'Ownership', 'Editability', 'Support', 'Performance'] as const;

const DATA = AXES.map((axis) => {
  // 1–10 scale, higher is better.
  const scores = {
    us: { Speed: 10, Cost: 9, Ownership: 10, Editability: 9, Support: 9, Performance: 10 },
    wix: { Speed: 4, Cost: 6, Ownership: 3, Editability: 6, Support: 5, Performance: 4 },
    agency: { Speed: 5, Cost: 3, Ownership: 9, Editability: 4, Support: 7, Performance: 7 },
  } as const;
  return {
    axis,
    us: scores.us[axis],
    wix: scores.wix[axis],
    agency: scores.agency[axis],
  };
});

const SERIES = [
  { key: 'us', label: 'Tar Heel Web Co.', color: 'var(--color-data-1)' },
  { key: 'wix', label: 'Wix / Squarespace', color: 'var(--color-data-2)' },
  { key: 'agency', label: 'Local agency', color: 'var(--color-data-4)' },
];

export function ComparisonRadar() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Cards on the table</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Where each option actually wins.
          </h2>
          <p className="mt-4 text-base text-slate-700">
            Honest scoring across six dimensions, 1 (worst) to 10 (best). We win on five; agencies still win on
            ownership clarity if you choose carefully. Wix wins on convenience for under-$10/mo budgets.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-8">
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={DATA} margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
                <PolarGrid stroke="rgb(203 213 225)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: 'rgb(51 65 85)', fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: 'rgb(148 163 184)', fontSize: 10 }} />
                {SERIES.map((s, i) => (
                  <Radar
                    key={s.key}
                    name={s.label}
                    dataKey={s.key}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.18}
                    strokeWidth={2}
                    isAnimationActive
                    animationDuration={1200}
                    animationBegin={i * 200}
                  />
                ))}
                <Tooltip
                  formatter={(value: number, name) => [`${value} / 10`, name as string]}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid rgb(226 232 240)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Container>
    </section>
  );
}
