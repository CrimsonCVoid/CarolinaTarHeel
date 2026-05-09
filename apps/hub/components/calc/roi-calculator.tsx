'use client';

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Container, Input, Label } from '@tarheel/ui';

const INDUSTRIES = {
  restaurant: { label: 'Restaurant', avgCustomers: 18, conservative: 0.6 },
  medspa: { label: 'Med spa', avgCustomers: 4, conservative: 0.7 },
  hvac: { label: 'HVAC / home services', avgCustomers: 6, conservative: 0.65 },
  lawfirm: { label: 'Law firm', avgCustomers: 2, conservative: 0.8 },
  retail: { label: 'Retail', avgCustomers: 12, conservative: 0.5 },
} as const;

type IndustryKey = keyof typeof INDUSTRIES;

const TIERS = {
  starter: { label: 'Starter', build: 750, monthly: 39 },
  standard: { label: 'Standard', build: 1500, monthly: 69 },
  premium: { label: 'Premium', build: 2750, monthly: 129 },
} as const;

type TierKey = keyof typeof TIERS;

export function RoiCalculator() {
  const [industry, setIndustry] = useState<IndustryKey>('restaurant');
  const [customerValue, setCustomerValue] = useState(45);
  const [tier, setTier] = useState<TierKey>('standard');

  const { monthlyRevenue, monthlyNet, payback, chartData } = useMemo(() => {
    const ind = INDUSTRIES[industry];
    const t = TIERS[tier];
    const newCustomers = ind.avgCustomers * ind.conservative;
    const monthlyRevenue = Math.round(newCustomers * customerValue);
    const monthlyNet = monthlyRevenue - t.monthly;
    const payback = monthlyRevenue > 0 ? t.build / monthlyRevenue : 0;
    const data = Array.from({ length: 13 }, (_, i) => ({
      month: i,
      net: -t.build + monthlyNet * i,
    }));
    return { monthlyRevenue, monthlyNet, payback, chartData: data };
  }, [industry, customerValue, tier]);

  return (
    <section className="bg-slate-50 py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Will this pay for itself? Run the math.
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            Numbers update as you tweak inputs. Conservative multipliers based on our portfolio averages.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div>
              <Label htmlFor="industry">Business type</Label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryKey)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors duration-[var(--dur-fast)] focus-visible:bg-brand-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {Object.entries(INDUSTRIES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <Label htmlFor="customerValue">Avg customer value ($)</Label>
              <Input
                id="customerValue"
                type="number"
                min={1}
                value={customerValue}
                onChange={(e) => setCustomerValue(Math.max(1, Number(e.target.value)))}
                className="mt-1.5"
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="tier">Tier</Label>
              <select
                id="tier"
                value={tier}
                onChange={(e) => setTier(e.target.value as TierKey)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors duration-[var(--dur-fast)] focus-visible:bg-brand-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {Object.entries(TIERS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label} — ${v.build} + ${v.monthly}/mo
                  </option>
                ))}
              </select>
            </div>

            <dl className="mt-6 space-y-2 border-t border-slate-200 pt-6 text-sm">
              <Row label="New customers from website (conservative)" value={`${Math.round(INDUSTRIES[industry].avgCustomers * INDUSTRIES[industry].conservative)}/mo`} />
              <Row label="Monthly revenue from those customers" value={`$${monthlyRevenue.toLocaleString()}`} />
              <Row label={`Monthly cost (${TIERS[tier].label})`} value={`$${TIERS[tier].monthly}`} />
              <Row label="Net" value={`$${monthlyNet.toLocaleString()}`} highlight={monthlyNet > 0} />
              <Row
                label="Build payback"
                value={
                  monthlyRevenue > 0 && payback < 24 ? `${payback.toFixed(1)} months` : 'Tweak inputs above'
                }
              />
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-base font-semibold tracking-tight text-slate-900">Cumulative net, year 1</h3>
            <p className="mt-1 text-xs text-slate-500">
              Reference line at break-even. Above is profit; below is sunk cost still working off the build fee.
            </p>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="roi-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-success-700)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-success-700)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="rgb(100 116 139)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 11, fill: 'rgb(100 116 139)' }}
                  />
                  <YAxis
                    stroke="rgb(100 116 139)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <ReferenceLine y={0} stroke="rgb(148 163 184)" strokeDasharray="3 3" label={{ value: 'Break-even', position: 'right', fontSize: 10, fill: 'rgb(100 116 139)' }} />
                  <Tooltip
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Net']}
                    contentStyle={{ background: 'white', border: '1px solid rgb(226 232 240)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="var(--color-success-700)"
                    strokeWidth={2}
                    fill="url(#roi-fill)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-600">{label}</dt>
      <dd className={highlight ? 'font-semibold text-emerald-700' : 'font-medium text-slate-900'}>{value}</dd>
    </div>
  );
}
