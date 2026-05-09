import Link from 'next/link';
import { Container } from '@tarheel/ui';

export const metadata = { title: 'Pricing' };

interface Tier {
  name: string;
  build: string;
  monthly: string;
  pitch: string;
  features: string[];
  highlight?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    build: '$750',
    monthly: '$39 / mo',
    pitch: 'For new SMBs who need a real site fast.',
    features: [
      '4-page site (Home, About, Services, Contact)',
      'Mobile-first, Lighthouse 95+',
      'Self-serve editor for copy + photos',
      'Domain + DNS setup',
      'Email + chat support',
    ],
  },
  {
    name: 'Standard',
    build: '$1,500',
    monthly: '$69 / mo',
    pitch: 'Most NC SMBs land here.',
    features: [
      'Up to 8 pages with full template',
      'Custom photography session (1 hr)',
      'Form inbox with Resend notifications',
      'Quarterly SEO + content review',
      'Phone support',
    ],
    highlight: true,
  },
  {
    name: 'Premium',
    build: '$2,750',
    monthly: '$129 / mo',
    pitch: 'For multi-location or higher-stakes brands.',
    features: [
      'Unlimited pages on the chosen template',
      'On-site photo + drone session (2 hrs)',
      'Local SEO setup (GBP, schema, citations)',
      'Monthly performance + uptime report',
      'Priority response (4 business hr)',
    ],
  },
];

export default function PricingPage() {
  return (
    <Container className="py-20 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Simple, productized pricing
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          One-time build fee, then a flat monthly for hosting and care. Cancel anytime.
        </p>
      </div>
      <ul className="mt-16 grid gap-6 lg:grid-cols-3">
        {TIERS.map((t) => (
          <li
            key={t.name}
            // MOTION.md §3.5 — pricing tier hover. Highlighted (Standard) tier
            // gets the only continuous animation on the marketing site:
            // border opacity oscillates 100 ↔ 70% on a 4-second cycle, paused
            // on hover. The keyframe `thw-ring-breath` lives in globals.css.
            className={`group rounded-2xl border p-8
              transition-[border-color,transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out-quint)]
              hover:-translate-y-1 hover:border-brand-700 hover:shadow-md
              motion-reduce:hover:translate-y-0 ${
                t.highlight
                  ? 'border-brand-600 bg-brand-50 shadow-md motion-safe:animate-[thw-ring-breath_4s_var(--ease-in-out-cubic)_infinite] hover:animate-none'
                  : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">{t.name}</h2>
              {t.highlight ? (
                <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-600">{t.pitch}</p>
            <p className="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-900">
              {t.build}
            </p>
            <p className="text-sm text-slate-600">one-time, then {t.monthly}</p>
            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-600">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-2xl px-6 text-base font-medium ${
                t.highlight
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
              }`}
            >
              Get started
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          Not sure which?
        </h2>
        <p className="mx-auto mt-3 max-w-prose text-base text-slate-700">
          Most restaurants and home-service businesses start at Standard. Multi-location law firms and med spas
          tend to land on Premium. We&apos;ll talk through it on the discovery call.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex h-11 items-center rounded-2xl bg-brand-600 px-6 text-base font-medium text-white hover:bg-brand-700"
        >
          Book a 20-min call
        </Link>
      </section>
    </Container>
  );
}
