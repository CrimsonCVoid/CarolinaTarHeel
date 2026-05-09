'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@tarheel/ui';
import { TickerNumber } from '@/components/ui/ticker-number';

interface Case {
  business: string;
  vertical: string;
  city: string;
  built: string;
  before: { lighthouse: number; pageWeightKb: number; formsPerMo: number };
  after: { lighthouse: number; pageWeightKb: number; formsPerMo: number };
  quote: { text: string; author: string };
  isPlaceholder?: boolean;
}

const CASES: Case[] = [
  {
    business: "Joe's Pizza",
    vertical: 'Restaurant',
    city: 'Apex, NC',
    built: 'March 2026',
    before: { lighthouse: 38, pageWeightKb: 4100, formsPerMo: 8 },
    after: { lighthouse: 99, pageWeightKb: 134, formsPerMo: 31 },
    quote: { text: 'We had a website. Now we have customers.', author: 'Joe Marchetti, Owner' },
    isPlaceholder: true,
  },
  {
    business: 'Triangle HVAC',
    vertical: 'Home services',
    city: 'Cary, NC',
    built: 'February 2026',
    before: { lighthouse: 47, pageWeightKb: 5600, formsPerMo: 12 },
    after: { lighthouse: 97, pageWeightKb: 142, formsPerMo: 38 },
    quote: { text: 'Calls per lead form went up 62% in the first 60 days.', author: 'Marcus L., Owner' },
    isPlaceholder: true,
  },
  {
    business: 'Pinecone Aesthetics',
    vertical: 'Med spa',
    city: 'Chapel Hill, NC',
    built: 'January 2026',
    before: { lighthouse: 71, pageWeightKb: 3800, formsPerMo: 6 },
    after: { lighthouse: 98, pageWeightKb: 121, formsPerMo: 22 },
    quote: { text: 'Bookings doubled. Real ones, not bots.', author: 'Dr. R. Chen' },
    isPlaceholder: true,
  },
];

export function CaseStudies() {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Built. Shipped. Performing.
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            Three sites, three numbers each — before us, after us. Real metrics where we have them; honest sample
            cases until your business is one of these cards.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {CASES.map((c) => (
            <CaseCard key={c.business} c={c} />
          ))}
        </ul>
      </Container>
    </section>
  );
}

function CaseCard({ c }: { c: Case }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const lh = inView ? c.after.lighthouse : c.before.lighthouse;
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-[border-color,transform,box-shadow] duration-[var(--dur-base)] hover:-translate-y-1 hover:border-brand-700 hover:shadow-md"
    >
      <div className="aspect-[16/10] bg-gradient-to-br from-brand-200 via-brand-400 to-brand-700">
        <div className="flex h-full items-end p-4 text-white">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{c.vertical}</div>
            <div className="mt-1 font-display text-xl font-semibold">{c.business}</div>
            <div className="text-xs text-white/80">{c.city} · Built {c.built}</div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <dl className="grid grid-cols-3 gap-3 text-center">
          <Metric label="Lighthouse" before={c.before.lighthouse} after={c.after.lighthouse} shown={inView} />
          <Metric
            label="Page weight"
            before={c.before.pageWeightKb}
            after={c.after.pageWeightKb}
            shown={inView}
            suffix=" KB"
            thousands
          />
          <Metric label="Forms/mo" before={c.before.formsPerMo} after={c.after.formsPerMo} shown={inView} />
        </dl>
        <blockquote className="mt-6 border-l-2 border-brand-300 pl-4">
          <p className="font-display text-base leading-snug text-slate-900">&ldquo;{c.quote.text}&rdquo;</p>
          <footer className="mt-2 text-xs text-slate-500">— {c.quote.author}</footer>
        </blockquote>
        {c.isPlaceholder ? (
          <p className="mt-4 text-[11px] text-slate-400">
            Sample case — replaced with live numbers from this client&apos;s Search Console + Resend inbox once we
            have ~30 days of post-launch data.
          </p>
        ) : null}
      </div>
      {/* Suppress unused-var warning for `lh` in dev — surface for screen readers */}
      <span className="sr-only">Current Lighthouse score: {lh}</span>
    </motion.li>
  );
}

function Metric({
  label,
  before,
  after,
  shown,
  suffix,
  thousands,
}: {
  label: string;
  before: number;
  after: number;
  shown: boolean;
  suffix?: string;
  thousands?: boolean;
}) {
  const better = after >= before; // Most metrics: higher is better
  const isPageWeight = label === 'Page weight';
  const isImprovement = isPageWeight ? after < before : better;
  return (
    <div>
      <div className={`font-display text-xl font-semibold ${isImprovement ? 'text-emerald-700' : 'text-slate-900'}`}>
        <TickerNumber value={after} from={before} duration={1400} shown={shown} thousands={thousands} />
        {suffix ? <span className="ml-0.5 text-[10px] font-normal text-slate-500">{suffix}</span> : null}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-[10px] text-slate-400">
        was {thousands ? before.toLocaleString() : before}
        {suffix}
      </div>
    </div>
  );
}
