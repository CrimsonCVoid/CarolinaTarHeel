import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '@tarheel/ui';
import { HeroBrowserDemo } from '@/components/hero/hero-browser-demo';
import { LiveTicker } from '@/components/live-ticker';
import { NumbersStrip } from '@/components/numbers-strip';
import { FAQ, FAQ_ITEMS } from '@/components/faq';
import { FinalCTA } from '@/components/final-cta';
import { CardsRowSkeleton, ChartGridSkeleton, RaceSkeleton, SectionSkeleton } from '@/components/skeletons';

// Below-the-fold heavy sections dynamic-load with shape-matching skeletons —
// page never pops empty regions while chunks hydrate. Recharts ~50 KB and
// framer-motion ~30 KB gzipped stay out of the initial paint.
const PerformanceRace = dynamic(
  () => import('@/components/race/performance-race').then((m) => m.PerformanceRace),
  { loading: () => <RaceSkeleton /> },
);
const SeoProofPanel = dynamic(
  () => import('@/components/seo/seo-proof-panel').then((m) => m.SeoProofPanel),
  { loading: () => <ChartGridSkeleton /> },
);
const PricingSummary = dynamic(
  () => import('@/components/pricing/pricing-summary').then((m) => m.PricingSummary),
  { loading: () => <SectionSkeleton height={520} bg="bg-slate-50" /> },
);
const BuildTimeline = dynamic(
  () => import('@/components/process/build-timeline').then((m) => m.BuildTimeline),
  { loading: () => <SectionSkeleton height={400} /> },
);
const ArchitectureDiagram = dynamic(
  () => import('@/components/architecture-diagram').then((m) => m.ArchitectureDiagram),
  { loading: () => <SectionSkeleton height={420} bg="bg-slate-900" /> },
);
const ComparisonRadar = dynamic(
  () => import('@/components/comparison-radar').then((m) => m.ComparisonRadar),
  { loading: () => <SectionSkeleton height={520} /> },
);
const NCMap = dynamic(() => import('@/components/nc-map').then((m) => m.NCMap), {
  loading: () => <SectionSkeleton height={420} bg="bg-slate-900" />,
});
const ActivityFeed = dynamic(
  () => import('@/components/activity-feed').then((m) => m.ActivityFeed),
  { loading: () => <SectionSkeleton height={300} bg="bg-slate-50" /> },
);
const CaseStudies = dynamic(
  () => import('@/components/case-studies').then((m) => m.CaseStudies),
  { loading: () => <CardsRowSkeleton /> },
);
const RoiCalculator = dynamic(
  () => import('@/components/calc/roi-calculator').then((m) => m.RoiCalculator),
  { loading: () => <SectionSkeleton height={460} bg="bg-slate-50" /> },
);

const ORG_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': 'https://tarheelweb.co/#org',
      name: 'Tar Heel Web Co.',
      url: 'https://tarheelweb.co',
      telephone: '+1-919-555-0100',
      email: 'hello@tarheelweb.co',
      areaServed: [{ '@type': 'State', name: 'North Carolina' }],
      address: { '@type': 'PostalAddress', addressRegion: 'NC', addressCountry: 'US' },
      priceRange: '$$',
      offers: [
        { '@type': 'Offer', name: 'Starter', price: '750', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Standard', price: '1500', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Premium', price: '2750', priceCurrency: 'USD' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((q) => ({
        '@type': 'Question',
        name: q.q,
        acceptedAnswer: { '@type': 'Answer', text: q.a },
      })),
    },
  ],
};

export default function MarketingHome() {
  return (
    <>
      {/* §1 Hero */}
      <section className="bg-white">
        <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-16">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-700 motion-safe:animate-[thw-rise_var(--dur-medium)_var(--ease-out-expo)]">
              Modern websites for North Carolina small businesses
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl motion-safe:animate-[thw-rise-large_var(--dur-slow)_var(--ease-out-expo)]">
              Built in 7 days.
              <br />
              Hosted by a Carolina team.
              <br />
              <span className="text-brand-700">Half the price of an agency.</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-[thw-rise_var(--dur-medium)_var(--ease-out-expo)_120ms_both]">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-2xl bg-brand-600 px-6 text-base font-medium text-white transition-colors duration-[var(--dur-fast)] hover:bg-brand-700 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                Book a 15-min call →
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex h-12 items-center rounded-2xl border border-slate-300 px-6 text-base font-medium text-slate-900 transition-colors duration-[var(--dur-fast)] hover:bg-slate-50 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                See our work →
              </Link>
            </div>
            <ul className="mt-10 space-y-2 text-sm text-slate-700 motion-safe:animate-[thw-rise_var(--dur-medium)_var(--ease-out-expo)_240ms_both]">
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span>UNC Kenan-Flagler + ECU engineering
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span>Live in 5–7 days with content in hand
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span>From $750 to launch · $39/mo to host
              </li>
            </ul>
          </div>
          <div className="flex items-center">
            <HeroBrowserDemo />
          </div>
        </Container>
      </section>

      {/* §2 Live ticker */}
      <LiveTicker />

      {/* Big numbers — animated count-up of the 6 stats we lead with. */}
      <NumbersStrip />

      {/* §3 Performance race */}
      <PerformanceRace />

      {/* Activity feed — fleet activity streaming in. */}
      <ActivityFeed />

      {/* §4 SEO proof */}
      <SeoProofPanel />

      {/* §5 Pricing + math callout */}
      <PricingSummary />

      {/* §6 Build timeline */}
      <BuildTimeline />

      {/* §7 Architecture comparison */}
      <ArchitectureDiagram />

      {/* Radar comparison — us vs Wix vs agency on six dimensions. */}
      <ComparisonRadar />

      {/* NC service map — pulsing dots for each Carolina city we ship in. */}
      <NCMap />

      {/* §8 Case studies */}
      <CaseStudies />

      {/* §9 ROI calculator */}
      <RoiCalculator />

      {/* §10 FAQ */}
      <FAQ />

      {/* §11 Final CTA */}
      <FinalCTA />

      {/* JSON-LD: ProfessionalService + FAQPage (FRONTPAGE.md §6) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }}
      />
    </>
  );
}
