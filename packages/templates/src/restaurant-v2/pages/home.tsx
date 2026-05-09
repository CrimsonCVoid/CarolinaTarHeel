import Image from 'next/image';
import { Container } from '@tarheel/ui';
import type { PageRenderProps } from '../../types';
import type { HomeContent, EventItem, Location } from '../schema';
import { Nav } from '../../shared/nav';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { CTA } from '../../shared/cta/index';
import { LocationCard } from '../../shared/v2/location-card';
import { BeerCard } from '../../shared/v2/beer-card';
import { EventCard } from '../../shared/v2/event-card';
import { RichMenuItem } from '../../shared/v2/menu-item-rich';
import { MultiLocationFooter } from '../../shared/v2/multi-location-footer';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function RestaurantV2Home({ content, settings }: PageRenderProps<HomeContent>) {
  const locations = content.locations ?? [];
  const primaryLocation = locations[0];
  const onTapBeers = content.onTap?.beers ?? [];
  const featuredItems = content.featuredFood?.items ?? [];
  const upcomingEvents = content.upcomingEvents?.events ?? [];

  const resolveLocation = (key?: string): Location | undefined =>
    key ? locations.find((l) => l.key === key) : undefined;

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        <HeroCentered
          eyebrow={content.hero?.eyebrow}
          headline={content.hero?.headline ?? settings.brand?.name ?? ''}
          subheadline={content.hero?.subheadline}
          bgImage={content.hero?.backgroundImage}
          cta={content.hero?.primaryCta ? { label: content.hero.primaryCta.label, href: content.hero.primaryCta.url } : undefined}
          secondaryCta={
            content.hero?.secondaryCta
              ? { label: content.hero.secondaryCta.label, href: content.hero.secondaryCta.url }
              : undefined
          }
        />

        {locations.length > 0 ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.locationsHeadline ?? 'Two locations in Apex'}
                </h2>
                {content.locationsSubheadline ? (
                  <p className="mt-4 text-lg text-slate-700">{content.locationsSubheadline}</p>
                ) : null}
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-2">
                {locations.map((loc) => (
                  <LocationCard key={loc.key} location={loc} variant="grid" />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {content.onTap?.enabled && onTapBeers.length > 0 ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    {content.onTap.headline}
                  </h2>
                  {content.onTap.subheadline ? (
                    <p className="mt-3 max-w-prose text-base text-slate-700">{content.onTap.subheadline}</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {onTapBeers.slice(0, 8).map((beer, i) => (
                  <BeerCard key={beer.slug ?? i} beer={beer} />
                ))}
              </div>
              <div className="mt-10">
                <a
                  href={content.onTap.ctaUrl ?? '/beer'}
                  className="inline-flex h-11 items-center rounded-2xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  {content.onTap.ctaLabel ?? 'See the full tap list'}
                </a>
              </div>
            </Container>
          </section>
        ) : null}

        {content.featuredFood?.enabled && featuredItems.length > 0 ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.featuredFood.headline}
                </h2>
                {content.featuredFood.subheadline ? (
                  <p className="mt-3 max-w-prose text-base text-slate-700">{content.featuredFood.subheadline}</p>
                ) : null}
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredItems.map((item, i) => (
                  <RichMenuItem key={item.slug ?? i} item={item} layout="card" />
                ))}
              </div>
              <div className="mt-10">
                <a
                  href={content.featuredFood.ctaUrl ?? '/food'}
                  className="inline-flex h-11 items-center rounded-2xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  {content.featuredFood.ctaLabel ?? 'See the full menu'}
                </a>
              </div>
            </Container>
          </section>
        ) : null}

        {content.upcomingEvents?.enabled && upcomingEvents.length > 0 ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.upcomingEvents.headline}
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event: EventItem, i) => (
                  <EventCard key={event.slug ?? i} event={event} location={resolveLocation(event.locationKey)} />
                ))}
              </div>
              <div className="mt-10">
                <a
                  href={content.upcomingEvents.ctaUrl ?? '/events'}
                  className="inline-flex h-11 items-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-100"
                >
                  {content.upcomingEvents.ctaLabel ?? 'See all events'}
                </a>
              </div>
            </Container>
          </section>
        ) : null}

        {content.aboutSnippet?.enabled ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <div className="grid items-center gap-12 md:grid-cols-2">
                <div>
                  {content.aboutSnippet.eyebrow ? (
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700">
                      {content.aboutSnippet.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    {content.aboutSnippet.headline}
                  </h2>
                  <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
                    {content.aboutSnippet.body}
                  </p>
                  <a
                    href={content.aboutSnippet.ctaUrl ?? '/about'}
                    className="mt-8 inline-flex h-11 items-center rounded-2xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    {content.aboutSnippet.ctaLabel ?? 'Read our story'}
                  </a>
                </div>
                {content.aboutSnippet.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={content.aboutSnippet.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </Container>
          </section>
        ) : null}

        {content.finalCta ? (
          <>
            <CTA
              headline={content.finalCta.headline}
              subheadline={content.finalCta.subheadline}
              label={content.finalCta.primaryLabel}
              href={content.finalCta.primaryUrl}
            />
            {content.finalCta.secondaryUrl && content.finalCta.secondaryLabel ? (
              <div className="bg-slate-900 pb-12 text-center">
                <a
                  href={content.finalCta.secondaryUrl}
                  className="text-sm font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
                >
                  {content.finalCta.secondaryLabel}
                </a>
              </div>
            ) : null}
          </>
        ) : null}
      </main>

      <MultiLocationFooter settings={settings} locations={locations} />

      <JsonLd type="Organization" data={{ settings, locations }} />
      <JsonLd type="WebSite" data={{ settings }} />
      {primaryLocation ? <JsonLd type="Restaurant" data={primaryLocation} /> : null}
      <JsonLd type="BreadcrumbList" data={[{ name: 'Home', url: '/' }]} />
    </>
  );
}
