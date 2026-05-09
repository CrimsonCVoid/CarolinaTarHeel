'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@tarheel/ui';
import { ArrowLeftRight } from 'lucide-react';

interface Box {
  label: string;
  sub?: string;
  variant?: 'good' | 'bad' | 'neutral';
}

const OURS: Box[] = [
  { label: 'Cloudflare DNS + SSL', sub: 'You own this', variant: 'good' },
  { label: 'Vercel Edge Network', sub: '200+ global PoPs', variant: 'good' },
  { label: 'Next.js (static + ISR)', sub: '<150 KB JS shipped', variant: 'good' },
  { label: 'Supabase Postgres', sub: 'Your content', variant: 'good' },
];

const TYPICAL: Box[] = [
  { label: 'Wix / Squarespace platform', sub: 'They own your domain', variant: 'bad' },
  { label: 'Page builder runtime', sub: '~2 MB JS', variant: 'bad' },
  { label: 'Ad networks + tracking', sub: '8–12 third-party scripts', variant: 'bad' },
  { label: 'Bundled analytics', sub: 'Their dashboard, not yours', variant: 'bad' },
  { label: 'Their database', sub: 'Export = pay extra', variant: 'bad' },
];

export function ArchitectureDiagram() {
  const [view, setView] = useState<'ours' | 'theirs'>('ours');
  const boxes = view === 'ours' ? OURS : TYPICAL;

  return (
    <section className="bg-slate-900 py-20 text-white md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">No bloat. Built like 2026.</h2>
          <p className="mt-4 text-lg text-slate-300">
            Your stack is a stack you can audit in five minutes. Theirs is a black box.
          </p>
          <button
            type="button"
            onClick={() => setView((v) => (v === 'ours' ? 'theirs' : 'ours'))}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors duration-[var(--dur-fast)] hover:bg-white/15 active:scale-[0.97] motion-reduce:active:scale-100"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Compare to {view === 'ours' ? 'Wix / Squarespace' : 'Tar Heel Web Co.'}
          </button>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <AnimatePresence mode="wait">
            <motion.ol
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              {boxes.map((box, i) => (
                <motion.li
                  key={`${view}-${i}`}
                  initial={{ opacity: 0, scale: 0.97, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.4, ease: [0.34, 1.4, 0.64, 1] }}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 ${
                    box.variant === 'good'
                      ? 'border-emerald-400/30 bg-emerald-500/5'
                      : 'border-amber-400/30 bg-amber-500/5'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{box.label}</div>
                    {box.sub ? <div className="mt-0.5 text-xs text-slate-300">{box.sub}</div> : null}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      box.variant === 'good' ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {box.variant === 'good' ? '✓ Yours' : '✕ Theirs'}
                  </span>
                </motion.li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
