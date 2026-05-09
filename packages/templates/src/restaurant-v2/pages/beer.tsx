import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { BeerPageContent, Beer } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { CTA } from '../../shared/cta/index';
import { BeerCard } from '../../shared/v2/beer-card';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function groupByStyle(beers: Beer[]): Array<{ style: string; beers: Beer[] }> {
  const sorted = [...beers].sort((a, b) => {
    if (a.isFlagship !== b.isFlagship) return a.isFlagship ? -1 : 1;
    return (a.name ?? '').localeCompare(b.name ?? '');
  });
  const map = new Map<string, Beer[]>();
  for (const beer of sorted) {
    const key = beer.style ?? 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(beer);
  }
  return Array.from(map.entries()).map(([style, beers]) => ({ style, beers }));
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function RestaurantV2Beer({ content, settings }: PageRenderProps<BeerPageContent>) {
  const beers = content.beers ?? [];
  const retired = content.retiredBeers ?? [];
  const groups = groupByStyle(beers);
  const updated = formatDate(content.lastUpdated);

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          headline={content.hero?.headline ?? 'On tap'}
          subheadline={content.hero?.subheadline}
          bgImage={content.hero?.backgroundImage}
        />

        {content.intro ? (
          <section className="bg-white">
            <Container className="py-12 md:py-16">
              <p className="mx-auto max-w-3xl whitespace-pre-line text-base leading-relaxed text-slate-700">
                {content.intro}
              </p>
            </Container>
          </section>
        ) : null}

        <Container className="py-12 md:py-16">
          {updated ? <p className="text-xs uppercase tracking-wide text-slate-500">Last updated: {updated}</p> : null}

          {groups.length === 0 ? (
            <p className="mt-8 text-base text-slate-600">Tap list updating soon — check back shortly.</p>
          ) : null}

          <div className="mt-8 space-y-14">
            {groups.map((group) => (
              <section key={group.style}>
                <h2
                  id={`style-${group.style.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-display text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
                >
                  {group.style}
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.beers.map((beer, i) => (
                    <BeerCard key={beer.slug ?? i} beer={beer} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {retired.length > 0 ? (
            <section className="mt-20 border-t border-slate-200 pt-12">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-500 md:text-3xl">
                {content.retiredHeadline ?? 'Retired'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">Past pours, gone but not forgotten.</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {retired.map((beer, i) => (
                  <li
                    key={beer.slug ?? i}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  >
                    <span className="font-medium text-slate-700">{beer.name}</span>
                    {beer.style ? <span className="text-slate-400"> · {beer.style}</span> : null}
                    {typeof beer.abv === 'number' ? <span className="text-slate-400"> · {beer.abv}% ABV</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Container>

        {content.finalCta ? (
          <CTA
            headline={content.finalCta.headline}
            label={content.finalCta.label}
            href={content.finalCta.url}
          />
        ) : null}
      </main>
      <Footer settings={settings} />

      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Beer', url: '/beer' },
        ]}
      />
    </>
  );
}
