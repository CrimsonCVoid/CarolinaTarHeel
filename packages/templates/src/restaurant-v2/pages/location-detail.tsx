import { Container, Card, CardHeader, CardTitle, CardContent } from '@tarheel/ui';
import {
  ParkingCircle,
  Baby,
  Dog,
  Sun,
  Calendar,
  Users,
  Music,
  Truck,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type { PageRenderProps } from '../../types';
import type { LocationDetailContent } from '../schema';
import { Nav } from '../../shared/nav';
import { Footer } from '../../shared/footer';
import { Hours } from '../../shared/hours';
import { MapEmbed } from '../../shared/map-embed';
import { HeroCentered } from '../../shared/hero/hero-centered';
import { CTA } from '../../shared/cta/index';
import { NAPBlock } from '../../shared/v2/nap-block';
import { RichMenuItem } from '../../shared/v2/menu-item-rich';
import { BeerCard } from '../../shared/v2/beer-card';
import { OrderCTA } from '../../shared/v2/order-cta';
import { JsonLd } from '../../shared/v2/jsonld';

const NAV_LINKS = [
  { label: 'Beer', href: '/beer' },
  { label: 'Food', href: '/food' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  parking: ParkingCircle,
  kids: Baby,
  dogs: Dog,
  patio: Sun,
  reservations: Calendar,
  private: Users,
  music: Music,
  'food-truck': Truck,
  wifi: Wifi,
  capacity: Users,
};

export function RestaurantV2LocationDetail({ content, settings }: PageRenderProps<LocationDetailContent>) {
  const location = content.location;
  const heroHeadline = content.hero?.headline ?? location?.name;
  const featuredFood = content.featuredFood ?? [];
  const featuredBeers = content.featuredBeers ?? [];
  const goodToKnow = content.goodToKnow ?? [];
  const showHero = content.hero?.backgroundImage && content.hero?.headline;

  return (
    <>
      <Nav settings={settings} links={NAV_LINKS} />
      <main>
        {showHero ? (
          <HeroCentered
            eyebrow={content.hero?.eyebrow}
            headline={heroHeadline ?? ''}
            subheadline={content.hero?.subheadline}
            bgImage={content.hero?.backgroundImage}
          />
        ) : (
          <section className="border-b border-slate-200 bg-white">
            <Container className="py-12 md:py-16">
              <div className="mx-auto max-w-3xl">
                {content.hero?.eyebrow ? (
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700">
                    {content.hero.eyebrow}
                  </p>
                ) : null}
                <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                  {heroHeadline ?? location?.shortName ?? ''}
                </h1>
                {content.hero?.subheadline ? (
                  <p className="mt-4 text-lg text-slate-700">{content.hero.subheadline}</p>
                ) : location?.tagline ? (
                  <p className="mt-4 text-lg text-slate-700">{location.tagline}</p>
                ) : null}
              </div>
            </Container>
          </section>
        )}

        {location ? (
          <section className="bg-white">
            <Container className="py-12 md:py-16">
              <div className="grid gap-10 md:grid-cols-2">
                <NAPBlock location={location} variant="full" />
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hours</h2>
                  <div className="mt-3">
                    <Hours hours={location.hours} />
                  </div>
                  {location.hoursNote ? (
                    <p className="mt-3 text-xs text-slate-500">{location.hoursNote}</p>
                  ) : null}
                  {location.toastOrderUrl ? (
                    <div className="mt-6">
                      <OrderCTA toastUrl={location.toastOrderUrl} variant="primary" />
                    </div>
                  ) : null}
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {content.intro?.headline ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {content.intro.headline}
                </h2>
                <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
                  {content.intro.body}
                </p>
              </div>
            </Container>
          </section>
        ) : null}

        {goodToKnow.length > 0 ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Good to know
              </h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {goodToKnow.map((g, i) => {
                  const Icon = g.icon ? ICON_MAP[g.icon] : null;
                  return (
                    <Card key={i}>
                      <CardHeader>
                        {Icon ? (
                          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                        ) : null}
                        <CardTitle>{g.headline}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-slate-700">{g.body}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Container>
          </section>
        ) : null}

        {featuredFood.length > 0 ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.featuredFoodHeadline ?? 'From the kitchen'}
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredFood.map((item, i) => (
                  <RichMenuItem key={item.slug ?? i} item={item} layout="card" />
                ))}
              </div>
              <div className="mt-10">
                <a
                  href="/food"
                  className="inline-flex h-11 items-center rounded-2xl bg-brand-600 px-5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  See the full menu
                </a>
              </div>
            </Container>
          </section>
        ) : null}

        {featuredBeers.length > 0 ? (
          <section className="bg-white">
            <Container className="py-16 md:py-20">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.featuredBeerHeadline ?? 'Pours we love'}
              </h2>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredBeers.map((beer, i) => (
                  <BeerCard key={beer.slug ?? i} beer={beer} />
                ))}
              </div>
              <div className="mt-10">
                <a
                  href="/beer"
                  className="inline-flex h-11 items-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-100"
                >
                  See the full tap list
                </a>
              </div>
            </Container>
          </section>
        ) : null}

        {content.showMap !== false && location?.address ? (
          <section className="bg-slate-50">
            <Container className="py-16 md:py-20">
              <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
                <MapEmbed address={location.address} />
                <div>
                  <NAPBlock location={location} variant="compact" />
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hours</h3>
                    <div className="mt-2">
                      <Hours hours={location.hours} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        {content.reviewsBadge?.rating ? (
          <section className="bg-white">
            <Container className="py-10">
              <div className="mx-auto inline-flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm">
                <span aria-hidden className="text-amber-500">
                  {'★'.repeat(Math.round(content.reviewsBadge.rating))}
                  {'☆'.repeat(5 - Math.round(content.reviewsBadge.rating))}
                </span>
                <span className="font-semibold text-slate-900">{content.reviewsBadge.rating.toFixed(1)}</span>
                {content.reviewsBadge.reviewCount ? (
                  <span className="text-slate-600">({content.reviewsBadge.reviewCount} reviews)</span>
                ) : null}
                {content.reviewsBadge.profileUrl ? (
                  <a
                    href={content.reviewsBadge.profileUrl}
                    className="font-medium text-brand-700 hover:underline"
                    rel="noopener"
                  >
                    Read on Google →
                  </a>
                ) : null}
              </div>
            </Container>
          </section>
        ) : null}

        {content.finalCta ? (
          <CTA
            headline={content.finalCta.headline}
            label={content.finalCta.label}
            href={content.finalCta.url}
          />
        ) : null}
      </main>

      <Footer settings={settings} />

      {location ? <JsonLd type="Restaurant" data={location} /> : null}
      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/' },
          { name: location?.shortName ?? location?.name ?? 'Location', url: `/locations/${location?.key ?? ''}` },
        ]}
      />
    </>
  );
}
