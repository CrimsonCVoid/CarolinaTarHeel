'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BrowserChrome } from '@/components/ui/browser-chrome';
import { LighthouseRing } from './lighthouse-ring';
import { TickerNumber } from '@/components/ui/ticker-number';

/*
 * FRONTPAGE.md §1 — animated browser demo built in real DOM, not video.
 *
 * Sequence (one-shot on first viewport entry):
 *   t=0     chrome appears
 *   t=200   wireframe boxes draw + fill
 *   t=2400  wireframes resolve to real-looking content
 *   t=4000  Lighthouse ring fills + counter ticks
 *   t=5200  metric badges pop in with downward counters
 *   t=6000+ holds final state
 *
 * Reduced motion: jumps to final state immediately.
 */
export function HeroBrowserDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="w-full">
      <BrowserChrome url="joescafe.com" label="Day 7 — Live">
        <div className="relative h-[360px] overflow-hidden">
          {/* Header strip */}
          <Box delay={0.6} inView={inView} className="mx-3 mt-3 h-7 rounded">
            <div className="flex h-full items-center justify-between px-2 text-[10px] text-slate-400">
              <span>Joe&apos;s Café</span>
              <span className="space-x-3">
                <span>Menu</span>
                <span>About</span>
                <span>Visit</span>
              </span>
            </div>
          </Box>

          {/* Hero band */}
          <ResolvingHero delay={2.4} inView={inView} />

          {/* Card row */}
          <div className="mx-3 mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                delay={1.0 + i * 0.1}
                inView={inView}
                className="h-24 rounded"
              >
                <ResolvingCard delay={2.6 + i * 0.1} inView={inView} index={i} />
              </Box>
            ))}
          </div>

          {/* Lighthouse + metrics overlay (anchored bottom) */}
          {inView && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg"
            >
              <LighthouseRing target={99} shown={inView} startDelay={4000} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <div className="font-display text-base font-semibold">
                    <TickerNumber value={127} from={4200} duration={1400} delay={5200} shown={inView} thousands />
                    <span className="ml-0.5 text-[10px] font-normal text-white/60"> KB</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">Page weight</div>
                </div>
                <div>
                  <div className="font-display text-base font-semibold">
                    <TickerNumber value={0.8} from={8.1} decimals={1} duration={1400} delay={5200} shown={inView} />
                    <span className="ml-0.5 text-[10px] font-normal text-white/60"> s</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-white/60">LCP</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </BrowserChrome>
    </div>
  );
}

function Box({
  delay,
  inView,
  children,
  className,
}: {
  delay: number;
  inView: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-slate-100 ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}

function ResolvingHero({ delay, inView }: { delay: number; inView: boolean }) {
  return (
    <div className="mx-3 mt-3 h-28 overflow-hidden rounded bg-slate-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay, duration: 0.4 }}
        className="flex h-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-800 text-white"
      >
        <div className="text-center">
          <p className="font-display text-base font-semibold">Hand-pulled espresso</p>
          <p className="mt-1 text-[10px] opacity-80">Open daily 7am – 3pm · Apex, NC</p>
        </div>
      </motion.div>
    </div>
  );
}

function ResolvingCard({ delay, inView, index }: { delay: number; inView: boolean; index: number }) {
  const items = [
    { label: 'Brioche FT', price: '$9' },
    { label: 'Avo Toast', price: '$11' },
    { label: 'Huevos', price: '$13' },
  ];
  const item = items[index]!;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="flex h-full flex-col p-1.5"
    >
      <div className="mb-1 flex-1 rounded bg-gradient-to-br from-amber-200 to-amber-400" />
      <div className="flex items-baseline justify-between text-[10px]">
        <span className="font-medium text-slate-900">{item.label}</span>
        <span className="text-slate-700">{item.price}</span>
      </div>
    </motion.div>
  );
}
