'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@tarheel/ui';
import { TickerNumber } from '@/components/ui/ticker-number';

interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  thousands?: boolean;
  context?: string;
}

const STATS: Stat[] = [
  { label: 'avg page weight', value: 142, suffix: ' KB', context: 'Wix avg: 3,200 KB' },
  { label: 'avg LCP', value: 0.9, decimals: 1, suffix: 's', context: '6× faster than industry median' },
  { label: 'avg Lighthouse', value: 97, context: 'Industry median: 49' },
  { label: 'days to launch', value: 7, context: 'Standard tier · contract → live' },
  { label: 'support response', value: 4, suffix: ' hr', context: 'Same-day on Standard' },
  { label: 'uptime', value: 99.98, decimals: 2, suffix: '%', context: 'Vercel edge SLA' },
];

export function NumbersStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="border-y border-slate-200 bg-white py-16 md:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">By the numbers</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Numbers we&apos;re proud to put on the front page.
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="font-display text-3xl font-semibold leading-none text-slate-900 md:text-5xl">
                <TickerNumber
                  value={s.value}
                  decimals={s.decimals ?? 0}
                  thousands={s.thousands}
                  duration={1600}
                  delay={i * 60}
                  shown={inView}
                />
                {s.suffix ? (
                  <span className="text-xl font-medium text-slate-500 md:text-2xl">{s.suffix}</span>
                ) : null}
              </div>
              <div className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-700">{s.label}</div>
              {s.context ? <div className="mt-1 text-[11px] text-slate-500">{s.context}</div> : null}
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
