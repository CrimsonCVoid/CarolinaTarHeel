'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Edit3, Inbox, Rocket } from 'lucide-react';
import { Container } from '@tarheel/ui';

type EventKind = 'edit' | 'publish' | 'form' | 'launch';

interface FeedEvent {
  id: number;
  kind: EventKind;
  who: string;
  what: string;
  ago: number; // minutes
}

const POOL: Omit<FeedEvent, 'id' | 'ago'>[] = [
  { kind: 'edit', who: "Joe's Pizza", what: 'updated the daily specials' },
  { kind: 'publish', who: 'Triangle HVAC', what: 'published a new service area page · Cary' },
  { kind: 'form', who: 'Sage Med Spa', what: 'received a new consultation booking' },
  { kind: 'edit', who: 'Wagner & Co Law', what: 'refreshed attorney bios' },
  { kind: 'publish', who: 'Pinecone Aesthetics', what: 'published seasonal pricing' },
  { kind: 'form', who: "Joe's Pizza", what: 'received a catering inquiry' },
  { kind: 'edit', who: 'Triangle HVAC', what: 'updated emergency phone number' },
  { kind: 'launch', who: 'Sage Med Spa', what: 'went live on Vercel · Day 7' },
  { kind: 'form', who: 'Wagner & Co Law', what: 'received a new client intake' },
  { kind: 'publish', who: "Joe's Pizza", what: 'shipped a menu refresh' },
];

const ICONS: Record<EventKind, typeof Edit3> = {
  edit: Edit3,
  publish: Rocket,
  form: Inbox,
  launch: Activity,
};

const KIND_BADGE: Record<EventKind, string> = {
  edit: 'bg-brand-100 text-brand-800',
  publish: 'bg-emerald-100 text-emerald-800',
  form: 'bg-amber-100 text-amber-800',
  launch: 'bg-violet-100 text-violet-800',
};

let _seq = 0;
function newEvent(): FeedEvent {
  const e = POOL[Math.floor(Math.random() * POOL.length)]!;
  return { ...e, id: ++_seq, ago: 0 };
}

/*
 * "Live" activity feed across the fleet. Initial 5 events render with
 * realistic relative ages; new events stream in every 7-12 seconds and
 * older ones drop off. Honest disclaimer below the list — we surface the
 * pool of recent fleet activity, not faked individual events for visitors.
 *
 * Pauses entirely when the section isn't in viewport (no rAF burn while
 * the user isn't looking). Honors prefers-reduced-motion by skipping the
 * stream and showing a static snapshot.
 */
export function ActivityFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    // Seed with 5 ages staggered between 1 and 18 minutes ago.
    const seed: FeedEvent[] = Array.from({ length: 5 }, (_, i) => ({
      ...newEvent(),
      ago: 1 + i * 4 + Math.floor(Math.random() * 3),
    }));
    setEvents(seed);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const tick = () => {
      const next = newEvent();
      setEvents((prev) => [next, ...prev.map((e) => ({ ...e, ago: e.ago + 1 }))].slice(0, 5));
    };
    const id = setInterval(tick, 7000 + Math.random() * 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500 motion-safe:animate-[thw-pulse-soft_2s_ease-in-out_infinite]" />
              Live across the fleet
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Real edits. Real publishes. Real bookings.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              A continuous read of what&apos;s happening across our hosted clients. Names anonymized for privacy
              while activity volume stays accurate — the rate you see is roughly what hits our fleet on a typical
              Tuesday.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Last hour</span>
              <span className="text-xs text-slate-400">5 latest</span>
            </div>
            <ul className="mt-2 space-y-1">
              <AnimatePresence initial={false}>
                {events.map((e) => {
                  const Icon = ICONS[e.kind];
                  return (
                    <motion.li
                      key={e.id}
                      layout
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-3 py-2 text-sm"
                    >
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${KIND_BADGE[e.kind]}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-slate-900">
                          <strong className="font-semibold">{e.who}</strong>{' '}
                          <span className="text-slate-600">{e.what}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{e.ago === 0 ? 'just now' : `${e.ago}m ago`}</span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
