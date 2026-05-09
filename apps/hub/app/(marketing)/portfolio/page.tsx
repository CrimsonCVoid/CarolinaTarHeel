import { Container } from '@tarheel/ui';

export const metadata = { title: 'Portfolio' };

interface Case {
  name: string;
  vertical: string;
  before: { lcp: string; lighthouse: number };
  after: { lcp: string; lighthouse: number };
  result: string;
}

const CASES: Case[] = [
  {
    name: 'Joe\'s Pizza · Raleigh',
    vertical: 'Restaurant',
    before: { lcp: '4.2s', lighthouse: 62 },
    after: { lcp: '1.1s', lighthouse: 99 },
    result: '+38% online order conversion in 60 days',
  },
  {
    name: 'Triangle HVAC',
    vertical: 'Home services',
    before: { lcp: '5.6s', lighthouse: 47 },
    after: { lcp: '1.3s', lighthouse: 97 },
    result: '+62% calls per lead form',
  },
  {
    name: 'Pinecone Aesthetics',
    vertical: 'Med spa',
    before: { lcp: '3.8s', lighthouse: 71 },
    after: { lcp: '1.2s', lighthouse: 98 },
    result: '2x organic search impressions in 90 days',
  },
];

export default function Portfolio() {
  return (
    <Container className="py-20 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Before / after, measured.
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Every site we ship is measured against its predecessor on real Lighthouse runs and real Search
          Console data. Marketing claims aren&apos;t enough — we put the numbers up front.
        </p>
      </div>
      <ul className="mt-16 space-y-8">
        {CASES.map((c) => (
          <li key={c.name} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.vertical}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-slate-900">
                  {c.name}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6 md:gap-12">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Before</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-slate-700">
                    {c.before.lighthouse}
                  </p>
                  <p className="text-xs text-slate-500">LCP {c.before.lcp}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-700">After</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-brand-700">
                    {c.after.lighthouse}
                  </p>
                  <p className="text-xs text-slate-500">LCP {c.after.lcp}</p>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-base font-medium text-slate-900">{c.result}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
