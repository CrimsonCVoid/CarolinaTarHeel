/**
 * JsonLd — server component that renders a single
 * <script type="application/ld+json"> tag.
 *
 * API: <JsonLd type="..." data={...} />  (separate type prop)
 *
 * The `type` prop is the discriminator. The `data` prop's shape varies by
 * type. This separated-prop form was chosen over a discriminated `data` prop
 * because the v2 page components already exist and call this signature.
 *
 * Supported types and the `data` shapes they accept:
 *
 *   Organization     { settings, locations? } | { brand, sameAs?, url? }
 *   WebSite          { settings } | { name, url }
 *   Restaurant       Location | { location, servesCuisine?, priceRange? }
 *   LocalBusiness    same as Restaurant
 *   Menu             { categories, restaurantName? }
 *   Event            EventItem | { event, location? }
 *   BreadcrumbList   Array<{ name, url }> | { items: Array<{name, url}> }
 *
 * Output: a server-rendered <script> with `dangerouslySetInnerHTML`,
 * with `</` sanitized to `<\/` to defeat naive HTML-context escapes.
 */

import type { Location, MenuCategory, EventItem } from '../../restaurant-v2/schema';
import type { SiteSettings } from '../../types';

type JsonLdType =
  | 'Organization'
  | 'WebSite'
  | 'Restaurant'
  | 'LocalBusiness'
  | 'Menu'
  | 'Event'
  | 'BreadcrumbList';

interface JsonLdProps {
  type: JsonLdType;
  // Loose union covering both spec'd and existing call sites.
  // Concrete shape is selected by `type` at runtime; we coerce inside the
  // per-type builders below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const DAY_MAP: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

type AnyObj = Record<string, unknown>;

function omitUndef<T extends AnyObj>(obj: T): T {
  const out: AnyObj = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

function postalAddress(location: Location): AnyObj {
  const a = location.address;
  return omitUndef({
    '@type': 'PostalAddress',
    streetAddress: a.line2 ? `${a.line1}, ${a.line2}` : a.line1,
    addressLocality: a.city,
    addressRegion: a.state,
    postalCode: a.postalCode,
    addressCountry: 'US',
  });
}

function openingHoursSpec(location: Location): AnyObj[] {
  const hours = location.hours ?? {};
  const out: AnyObj[] = [];
  for (const key of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const) {
    const d = hours[key];
    if (!d || d.closed || !d.open || !d.close) continue;
    out.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_MAP[key],
      opens: d.open,
      closes: d.close,
    });
  }
  return out;
}

function geoBlock(location: Location): AnyObj | undefined {
  if (!location.geo) return undefined;
  return {
    '@type': 'GeoCoordinates',
    latitude: location.geo.lat,
    longitude: location.geo.lng,
  };
}

function socialSameAs(location?: Location, settings?: SiteSettings): string[] {
  const urls: string[] = [];
  if (location?.socialLinks) {
    if (location.socialLinks.instagram) urls.push(location.socialLinks.instagram);
    if (location.socialLinks.facebook) urls.push(location.socialLinks.facebook);
    if (location.socialLinks.untappd) urls.push(location.socialLinks.untappd);
  }
  if (settings?.social) {
    for (const v of Object.values(settings.social)) {
      if (typeof v === 'string' && v && !urls.includes(v)) urls.push(v);
    }
  }
  return urls;
}

function buildOrganization(data: AnyObj): AnyObj {
  // Accepts either { settings, locations? } or { brand, sameAs?, url? }
  const settings = data.settings as SiteSettings | undefined;
  const locations = data.locations as Location[] | undefined;
  const brand = (data.brand ?? settings?.brand) as
    | { name?: string; logoUrl?: string }
    | undefined;
  const url = (data.url as string | undefined) ?? undefined;

  const sameAs =
    (data.sameAs as string[] | undefined) ??
    socialSameAs(locations?.[0], settings);

  return omitUndef({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand?.name,
    url,
    logo: brand?.logoUrl,
    sameAs,
  });
}

function buildWebSite(data: AnyObj): AnyObj {
  const settings = data.settings as SiteSettings | undefined;
  const name = (data.name as string | undefined) ?? settings?.brand?.name;
  const url = (data.url as string | undefined) ?? '/';
  return omitUndef({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  });
}

function buildRestaurant(type: 'Restaurant' | 'LocalBusiness', data: AnyObj): AnyObj {
  // Accepts either a bare Location or { location, servesCuisine?, priceRange? }.
  const location: Location | undefined = (data.location as Location | undefined) ??
    // Heuristic: if data itself has shape of a Location, use it.
    (data && (data as Location).address ? (data as unknown as Location) : undefined);

  if (!location) {
    return omitUndef({
      '@context': 'https://schema.org',
      '@type': type,
    });
  }

  const servesCuisine = data.servesCuisine as string[] | undefined;
  const priceRange = data.priceRange as string | undefined;
  const hasMenu = data.hasMenu as string | undefined;

  return omitUndef({
    '@context': 'https://schema.org',
    '@type': type,
    name: location.name,
    image: location.primaryPhoto,
    address: postalAddress(location),
    telephone: location.phone,
    url: `/locations/${location.key}`,
    geo: geoBlock(location),
    openingHoursSpecification: openingHoursSpec(location),
    servesCuisine,
    priceRange,
    acceptsReservations: !!location.reservationUrl,
    hasMenu,
    sameAs: socialSameAs(location),
  });
}

function buildMenu(data: AnyObj): AnyObj {
  const categories = (data.categories as MenuCategory[] | undefined) ?? [];
  const restaurantName = data.restaurantName as string | undefined;

  return omitUndef({
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: restaurantName ? `${restaurantName} Menu` : 'Menu',
    hasMenuSection: categories.map((cat) =>
      omitUndef({
        '@type': 'MenuSection',
        name: cat.name,
        description: cat.description,
        hasMenuItem: cat.items.map((it) => {
          const hasSizes = !!(it.priceSmall || it.priceLarge);
          if (hasSizes) {
            const offers: AnyObj[] = [];
            if (it.priceSmall) {
              offers.push({
                '@type': 'Offer',
                name: 'Small',
                price: it.priceSmall.replace(/[^0-9.]/g, ''),
                priceCurrency: 'USD',
              });
            }
            if (it.priceLarge) {
              offers.push({
                '@type': 'Offer',
                name: 'Large',
                price: it.priceLarge.replace(/[^0-9.]/g, ''),
                priceCurrency: 'USD',
              });
            }
            return omitUndef({
              '@type': 'MenuItem',
              name: it.name,
              description: it.description,
              image: it.image,
              offers,
            });
          }
          return omitUndef({
            '@type': 'MenuItem',
            name: it.name,
            description: it.description,
            image: it.image,
            offers: it.price
              ? {
                  '@type': 'Offer',
                  price: it.price.replace(/[^0-9.]/g, ''),
                  priceCurrency: 'USD',
                }
              : undefined,
          });
        }),
      }),
    ),
  });
}

function buildEvent(data: AnyObj): AnyObj {
  const event: EventItem | undefined =
    (data.event as EventItem | undefined) ??
    (data && (data as EventItem).startsAt ? (data as unknown as EventItem) : undefined);
  const location: Location | undefined = data.location as Location | undefined;
  if (!event) {
    return { '@context': 'https://schema.org', '@type': 'Event' };
  }
  const startDate = event.startsAt;
  const endDate =
    event.endsAt ??
    (() => {
      const d = new Date(event.startsAt);
      if (Number.isNaN(d.getTime())) return undefined;
      return new Date(d.getTime() + 2 * 60 * 60 * 1000).toISOString();
    })();

  const place = location
    ? omitUndef({
        '@type': 'Place',
        name: location.name,
        address: postalAddress(location),
      })
    : undefined;

  const offers = event.ticketUrl
    ? {
        '@type': 'Offer',
        url: event.ticketUrl,
        availability: 'https://schema.org/InStock',
      }
    : undefined;

  return omitUndef({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate,
    endDate,
    description: event.description,
    image: event.image,
    location: place,
    offers,
  });
}

function buildBreadcrumb(data: unknown): AnyObj {
  const items: { name: string; url: string }[] = Array.isArray(data)
    ? (data as { name: string; url: string }[])
    : ((data as AnyObj)?.items as { name: string; url: string }[]) ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function buildPayload(type: JsonLdType, data: unknown): AnyObj {
  const d = (data ?? {}) as AnyObj;
  switch (type) {
    case 'Organization':
      return buildOrganization(d);
    case 'WebSite':
      return buildWebSite(d);
    case 'Restaurant':
      return buildRestaurant('Restaurant', d);
    case 'LocalBusiness':
      return buildRestaurant('LocalBusiness', d);
    case 'Menu':
      return buildMenu(d);
    case 'Event':
      return buildEvent(d);
    case 'BreadcrumbList':
      return buildBreadcrumb(data);
  }
}

export function JsonLd({ type, data }: JsonLdProps): JSX.Element {
  const payload = buildPayload(type, data);
  // Compact stringify; sanitize closing-script sequences to neutralize
  // any user-provided string that could break out of the <script> tag.
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
