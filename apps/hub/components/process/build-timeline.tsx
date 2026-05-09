'use client';

import { motion } from 'framer-motion';
import { Container } from '@tarheel/ui';

interface Phase {
  name: string;
  day: number;
  length: number;
  variant: 'us' | 'you' | 'launch';
}

const PHASES: Phase[] = [
  { name: 'Discovery call', day: 1, length: 0.5, variant: 'us' },
  { name: 'Design draft', day: 1.5, length: 1.5, variant: 'us' },
  { name: 'Your review', day: 3, length: 1, variant: 'you' },
  { name: 'Build', day: 4, length: 2, variant: 'us' },
  { name: 'QA + Lighthouse', day: 6, length: 0.5, variant: 'us' },
  { name: 'Final review', day: 6.5, length: 0.5, variant: 'you' },
  { name: 'Launch ✦', day: 7, length: 0.3, variant: 'launch' },
];

const VARIANT_BG: Record<Phase['variant'], string> = {
  us: 'bg-brand-600',
  you: 'bg-amber-500',
  launch: 'bg-emerald-500',
};

export function BuildTimeline() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Live in 7 days.
          </h2>
          <p className="mt-4 text-lg text-slate-700">Here&apos;s how.</p>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-10">
          {/* Day axis */}
          <div className="mb-3 grid grid-cols-7 text-xs font-medium text-slate-500">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div key={d} className="text-center">
                Day {d}
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="relative h-[280px]">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.name}
                style={{
                  left: `${((p.day - 1) / 7) * 100}%`,
                  width: `${(p.length / 7) * 100}%`,
                  top: i * 36,
                  transformOrigin: 'left',
                }}
                className={`absolute flex h-8 items-center rounded px-3 text-xs font-medium text-white shadow-sm ${VARIANT_BG[p.variant]}`}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="truncate">{p.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
            <Legend swatch="bg-brand-600" label="Our work" />
            <Legend swatch="bg-amber-500" label="You" />
            <Legend swatch="bg-emerald-500" label="Launch" />
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Step
            n={1}
            title="Discovery"
            body="20-minute call. Brand, audience, what success looks like, photos and copy you already have."
          />
          <Step
            n={2}
            title="Build"
            body="We pick a template, customize it to your brand, fill it with real content, and ship a preview link by day 4."
          />
          <Step
            n={3}
            title="Launch"
            body="DNS pointed, SSL active, Search Console submitted, you get the editor. Live in 7 days from contract."
          />
        </div>
      </Container>
    </section>
  );
}

const Legend = ({ swatch, label }: { swatch: string; label: string }) => (
  <span className="inline-flex items-center gap-2">
    <span className={`h-2.5 w-2.5 rounded-sm ${swatch}`} />
    {label}
  </span>
);

const Step = ({ n, title, body }: { n: number; title: string; body: string }) => (
  <div>
    <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">Step {n}</div>
    <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
  </div>
);
