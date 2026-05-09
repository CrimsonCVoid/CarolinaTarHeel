'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Container } from '@tarheel/ui';
import { TickerNumber } from '@/components/ui/ticker-number';

interface Tier {
  name: string;
  pitch: string;
  build: number;
  monthly: number;
  features: string[];
  highlight?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    pitch: 'For new SMBs who need a real site fast.',
    build: 750,
    monthly: 39,
    features: ['1–4 page site', 'Mobile-perfect', 'Lighthouse 95+', 'SSL · DNS · backups', '1 edit/month'],
  },
  {
    name: 'Standard',
    pitch: 'Most NC SMBs land here.',
    build: 1500,
    monthly: 69,
    features: [
      'Up to 8 pages',
      'Custom photo session (1 hr)',
      'Form inbox + Resend notifications',
      'Quarterly SEO + content review',
      'Same-day support',
    ],
    highlight: true,
  },
  {
    name: 'Premium',
    pitch: 'Multi-location or higher-stakes brands.',
    build: 2750,
    monthly: 129,
    features: [
      '10–15 pages',
      'On-site photo + drone (2 hrs)',
      'Local SEO setup (GBP, schema, citations)',
      'Monthly performance + uptime report',
      'Priority response (4 business hrs)',
    ],
  },
];

export function PricingSummary() {
  return (
    <section className="bg-slate-50 py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Simple, productized pricing.
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            One-time build fee, then a flat monthly for hosting and care. Cancel anytime.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <li
              key={t.name}
              className={`group rounded-2xl border p-8 transition-[border-color,transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-brand-700 hover:shadow-md motion-reduce:hover:translate-y-0 ${
                t.highlight
                  ? 'border-brand-600 bg-white shadow-md motion-safe:animate-[thw-ring-breath_4s_var(--ease-in-out-cubic)_infinite] hover:animate-none'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-900">{t.name}</h3>
                {t.highlight ? (
                  <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">Most popular</span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.pitch}</p>
              <p className="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-900">${t.build}</p>
              <p className="text-sm text-slate-600">
                one-time, then ${t.monthly} / mo hosting & care
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-2xl px-6 text-base font-medium transition-colors duration-[var(--dur-fast)] active:scale-[0.97] motion-reduce:active:scale-100 ${
                  t.highlight
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                }`}
              >
                Book a call →
              </Link>
            </li>
          ))}
        </ul>

        <MathCallout />

        <p className="mt-10 text-center text-xs text-slate-500">
          All tiers · no exceptions: ✓ You own your domain · ✓ You own your content · ✓ Cancel hosting anytime · ✓ JSON
          export · ✓ Real human support · ✓ NC-based team
        </p>
      </Container>
    </section>
  );
}

function MathCallout() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="mx-auto mt-12 max-w-3xl rounded-2xl bg-slate-900 p-10 text-center text-white">
      <p className="font-display text-lg font-semibold tracking-tight">Year 1 with Tar Heel Web Co. (Standard)</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
        $1,500 + ($69 × 12) = $
        <TickerNumber value={2328} duration={1400} shown={inView} thousands />
      </p>
      <p className="mt-8 font-display text-lg font-semibold tracking-tight text-slate-300">
        Year 1 with a typical NC web agency
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-300 md:text-4xl">
        $5,500 + ($150 × 12) = $
        <TickerNumber value={7300} duration={1400} shown={inView} thousands />
      </p>
      <p className="mt-10 font-display text-2xl font-semibold tracking-tight md:text-3xl">
        You save{' '}
        <span className="text-emerald-400">
          $<TickerNumber value={4972} duration={1600} shown={inView} thousands />
        </span>{' '}
        in year one,
      </p>
      <p className="mt-1 font-display text-xl font-semibold tracking-tight md:text-2xl">
        and{' '}
        <span className="text-emerald-400">
          $<TickerNumber value={972} duration={1600} shown={inView} thousands />
        </span>{' '}
        every year after.
      </p>
    </div>
  );
}
