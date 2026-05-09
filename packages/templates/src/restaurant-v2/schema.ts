import { z } from 'zod';
import { optionalUrl, optionalString } from '../zod-helpers';

/* -----------------------------------------------------------------
 * Shared sub-schemas
 * v2 supports multi-location breweries / restaurant groups. Locations
 * are stored on page content (not site_settings) so editors can manage
 * each location independently without changing the whole-site Brand.
 * ----------------------------------------------------------------- */

const dayHours = z.object({
  open: optionalString(),
  close: optionalString(),
  closed: z.boolean().optional(),
});

const weeklyHours = z.object({
  mon: dayHours.optional(),
  tue: dayHours.optional(),
  wed: dayHours.optional(),
  thu: dayHours.optional(),
  fri: dayHours.optional(),
  sat: dayHours.optional(),
  sun: dayHours.optional(),
  note: z.string().max(200).optional(),
});

const addressSchema = z.object({
  line1: z.string().max(200),
  line2: z.string().max(200).optional(),
  city: z.string().max(80),
  state: z.string().length(2),
  postalCode: z.string().max(10),
});

const locationKey = z.string().regex(/^[a-z0-9-]+$/).max(60);

export const locationSchema = z.object({
  key: locationKey,
  name: z.string().max(160),
  shortName: z.string().max(60),
  tagline: z.string().max(200).optional(),
  address: addressSchema,
  geo: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  phone: z.string().max(40),
  email: z.string().max(160).optional(),
  hours: weeklyHours,
  hoursNote: z.string().max(200).optional(),
  primaryPhoto: optionalUrl(),
  toastOrderUrl: optionalUrl(),
  toastEgiftUrl: optionalUrl(),
  reservationUrl: optionalUrl(),
  googlePlaceId: optionalString(),
  features: z
    .array(
      z.enum([
        'kitchen',
        'food-trucks',
        'patio',
        'dog-friendly',
        'kid-friendly',
        'reservations',
        'private-events',
        'live-music',
        'parking',
      ]),
    )
    .default([]),
  socialLinks: z
    .object({
      instagram: optionalUrl(),
      facebook: optionalUrl(),
      untappd: optionalUrl(),
    })
    .default({}),
});

export const beerSchema = z.object({
  name: z.string().max(120),
  slug: z.string().max(80),
  style: z.string().max(80),
  abv: z.number().min(0).max(20).optional(),
  ibu: z.number().min(0).max(150).optional(),
  description: z.string().max(400).optional(),
  tastingNotes: z.string().max(300).optional(),
  pairingSuggestion: z.string().max(200).optional(),
  servedAt: z.array(locationKey).default([]),
  isFlagship: z.boolean().default(false),
  isCurrentlyOnTap: z.boolean().default(true),
  untappdUrl: optionalUrl(),
  image: optionalUrl(),
});

export const menuItemRichSchema = z.object({
  name: z.string().max(120),
  slug: z.string().max(80).optional(),
  description: z.string().max(400).optional(),
  ingredients: z.string().max(400).optional(),
  priceSmall: z.string().max(20).optional(),
  priceLarge: z.string().max(20).optional(),
  price: z.string().max(20).optional(), // single price (when not small/large)
  dietaryTags: z
    .array(z.enum(['vegetarian', 'vegan', 'gf', 'gf-available', 'contains-pork', 'spicy', 'popular', 'featured']))
    .default([]),
  pairsWith: z.string().max(120).optional(), // beer pairing reference
  image: optionalUrl(),
  isFeatured: z.boolean().optional(),
});

export const menuCategorySchema = z.object({
  name: z.string().max(80),
  slug: z.string().max(80).optional(),
  description: z.string().max(300).optional(),
  items: z.array(menuItemRichSchema).max(60),
});

export const eventSchema = z.object({
  title: z.string().max(160),
  slug: z.string().max(80),
  locationKey: locationKey.optional(),
  startsAt: z.string().max(40), // ISO 8601 or human-readable; component formats
  endsAt: z.string().max(40).optional(),
  recurrence: optionalString(),
  description: z.string().max(800).optional(),
  image: optionalUrl(),
  type: z.enum(['live-music', 'trivia', 'food-truck', 'tap-release', 'community', 'private', 'other']).default('other'),
  ticketUrl: optionalUrl(),
});

const seoOverrides = z
  .object({
    title: z.string().max(120).optional(),
    description: z.string().max(200).optional(),
  })
  .optional();

/* -----------------------------------------------------------------
 * Page schemas
 * ----------------------------------------------------------------- */

export const homeContent = z.object({
  hero: z.object({
    eyebrow: z.string().max(80).optional(),
    headline: z.string().min(1).max(140),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
    primaryCta: z
      .object({ label: z.string().max(40), url: z.string().max(300) })
      .optional(),
    secondaryCta: z
      .object({ label: z.string().max(40), url: z.string().max(300) })
      .optional(),
  }),
  locationsHeadline: z.string().max(120).default('Two locations in Apex'),
  locationsSubheadline: z.string().max(240).optional(),
  locations: z.array(locationSchema).min(1).max(6),
  onTap: z.object({
    enabled: z.boolean().default(true),
    headline: z.string().max(80).default('On tap this week'),
    subheadline: z.string().max(200).optional(),
    beers: z.array(beerSchema).max(8),
    ctaUrl: z.string().max(300).default('/beer'),
    ctaLabel: z.string().max(40).default('See the full tap list'),
  }),
  featuredFood: z.object({
    enabled: z.boolean().default(true),
    headline: z.string().max(80).default('From the kitchen'),
    subheadline: z.string().max(200).optional(),
    items: z.array(menuItemRichSchema).max(6),
    ctaUrl: z.string().max(300).default('/food'),
    ctaLabel: z.string().max(40).default('See the full menu'),
  }),
  upcomingEvents: z.object({
    enabled: z.boolean().default(true),
    headline: z.string().max(80).default('Upcoming events'),
    events: z.array(eventSchema).max(6),
    ctaUrl: z.string().max(300).default('/events'),
    ctaLabel: z.string().max(40).default('See all events'),
  }),
  aboutSnippet: z.object({
    enabled: z.boolean().default(true),
    eyebrow: z.string().max(60).optional(),
    headline: z.string().max(140),
    body: z.string().max(800),
    image: optionalUrl(),
    ctaLabel: z.string().max(40).default('Read our story'),
    ctaUrl: z.string().max(300).default('/about'),
  }),
  finalCta: z.object({
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
    primaryLabel: z.string().max(40),
    primaryUrl: z.string().max(300),
    secondaryLabel: z.string().max(40).optional(),
    secondaryUrl: z.string().max(300).optional(),
  }),
  seo: seoOverrides,
});

export const locationDetailContent = z.object({
  location: locationSchema,
  hero: z.object({
    eyebrow: z.string().max(80).optional(),
    headline: z.string().max(140).optional(),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
  }),
  intro: z
    .object({
      headline: z.string().max(140),
      body: z.string().max(1200),
    })
    .optional(),
  goodToKnow: z
    .array(
      z.object({
        icon: z
          .enum(['parking', 'kids', 'dogs', 'patio', 'reservations', 'private', 'music', 'food-truck', 'wifi', 'capacity'])
          .optional(),
        headline: z.string().max(80),
        body: z.string().max(300),
      }),
    )
    .max(8)
    .default([]),
  galleryHeadline: z.string().max(80).optional(),
  gallery: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string().max(200).optional(),
      }),
    )
    .max(20)
    .default([]),
  featuredFoodHeadline: z.string().max(80).optional(),
  featuredFood: z.array(menuItemRichSchema).max(6).default([]),
  featuredBeerHeadline: z.string().max(80).optional(),
  featuredBeers: z.array(beerSchema).max(6).default([]),
  showMap: z.boolean().default(true),
  reviewsBadge: z
    .object({
      placeId: optionalString(),
      rating: z.number().min(0).max(5).optional(),
      reviewCount: z.number().int().min(0).optional(),
      profileUrl: optionalUrl(),
    })
    .optional(),
  finalCta: z
    .object({
      headline: z.string().max(140),
      label: z.string().max(40),
      url: z.string().max(300),
    })
    .optional(),
  seo: seoOverrides,
});

export const beerPageContent = z.object({
  hero: z.object({
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
  }),
  intro: z.string().max(800).optional(),
  showFilters: z.boolean().default(true),
  beers: z.array(beerSchema).max(40),
  retiredHeadline: z.string().max(80).optional(),
  retiredBeers: z.array(beerSchema).max(40).default([]),
  lastUpdated: optionalString(),
  finalCta: z
    .object({ headline: z.string().max(140), label: z.string().max(40), url: z.string().max(300) })
    .optional(),
  seo: seoOverrides,
});

export const foodPageContent = z.object({
  hero: z.object({
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
    note: z.string().max(300).optional(),
  }),
  categories: z.array(menuCategorySchema).max(20),
  buildYourOwn: z
    .object({
      enabled: z.boolean().default(false),
      headline: z.string().max(80),
      note: z.string().max(300).optional(),
      sizes: z
        .array(
          z.object({
            label: z.string().max(60),
            price: z.string().max(20),
            description: z.string().max(160).optional(),
          }),
        )
        .max(6)
        .default([]),
      toppingsHeadline: z.string().max(80).optional(),
      toppings: z.array(z.string().max(60)).max(50).default([]),
      addOnNote: z.string().max(200).optional(),
    })
    .optional(),
  toastOrderUrl: optionalUrl(),
  toastEgiftUrl: optionalUrl(),
  orderCtaLabel: z.string().max(40).default('Order online'),
  seo: seoOverrides,
});

export const eventsPageContent = z.object({
  hero: z.object({
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
  }),
  showFilters: z.boolean().default(true),
  upcomingHeadline: z.string().max(80).default('Upcoming'),
  events: z.array(eventSchema).max(40),
  recurringHeadline: z.string().max(80).optional(),
  recurring: z
    .array(
      z.object({
        dayOfWeek: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
        title: z.string().max(120),
        timeLabel: z.string().max(60).optional(),
        locationKey: locationKey.optional(),
        description: z.string().max(300).optional(),
      }),
    )
    .max(20)
    .default([]),
  foodTruckHeadline: z.string().max(80).optional(),
  foodTruckIntro: z.string().max(400).optional(),
  bookingUrl: optionalUrl(),
  bookingLabel: z.string().max(40).optional(),
  seo: seoOverrides,
});

export const aboutPageContent = z.object({
  hero: z.object({
    eyebrow: z.string().max(60).optional(),
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
  }),
  story: z.object({
    headline: z.string().max(140),
    body: z.string().max(3000),
    image: optionalUrl(),
  }),
  team: z
    .array(
      z.object({
        name: z.string().max(80),
        role: z.string().max(80),
        bio: z.string().max(800).optional(),
        image: optionalUrl(),
      }),
    )
    .max(8)
    .default([]),
  pillars: z
    .array(
      z.object({
        headline: z.string().max(80),
        body: z.string().max(300),
      }),
    )
    .max(4)
    .optional(),
  finalCta: z
    .object({
      headline: z.string().max(140),
      label: z.string().max(40),
      url: z.string().max(300),
    })
    .optional(),
  seo: seoOverrides,
});

export const privateEventsContent = z.object({
  hero: z.object({
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
  }),
  intro: z.object({
    headline: z.string().max(140),
    body: z.string().max(1200),
  }),
  spaces: z
    .array(
      z.object({
        name: z.string().max(80),
        capacity: z.string().max(80),
        priceFrom: z.string().max(40).optional(),
        features: z.array(z.string().max(80)).max(8).default([]),
        description: z.string().max(400).optional(),
        image: optionalUrl(),
      }),
    )
    .max(6),
  inquiry: z.object({
    headline: z.string().max(120),
    subheadline: z.string().max(300).optional(),
    email: z.string().max(160),
    phone: z.string().max(40).optional(),
  }),
  faq: z
    .array(
      z.object({
        question: z.string().max(160),
        answer: z.string().max(800),
      }),
    )
    .max(8)
    .default([]),
  seo: seoOverrides,
});

export const careersPageContent = z.object({
  hero: z.object({
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
    backgroundImage: optionalUrl(),
  }),
  intro: z.string().max(800).optional(),
  openings: z
    .array(
      z.object({
        title: z.string().max(120),
        locationKey: locationKey.optional(),
        type: z.enum(['full-time', 'part-time', 'seasonal', 'contract']).default('full-time'),
        description: z.string().max(800),
        applyUrl: optionalUrl(),
        postedOn: optionalString(),
      }),
    )
    .max(20)
    .default([]),
  emptyStateMessage: z.string().max(400).optional(),
  apply: z.object({
    headline: z.string().max(140),
    body: z.string().max(800),
    email: z.string().max(160),
  }),
  seo: seoOverrides,
});

export const contactPageContent = z.object({
  hero: z.object({
    headline: z.string().max(140),
    subheadline: z.string().max(240).optional(),
  }),
  showLocations: z.boolean().default(true),
  formHeadline: z.string().max(80).default('Send us a note'),
  formSubheadline: z.string().max(240).optional(),
  showMap: z.boolean().default(true),
  faq: z
    .array(
      z.object({
        question: z.string().max(160),
        answer: z.string().max(800),
      }),
    )
    .max(8)
    .default([]),
  seo: seoOverrides,
});

/* -----------------------------------------------------------------
 * Inferred types — components import from here, never redeclare
 * ----------------------------------------------------------------- */

export type Location = z.infer<typeof locationSchema>;
export type LocationKey = string; // narrow at use-site
export type Beer = z.infer<typeof beerSchema>;
export type MenuItemRich = z.infer<typeof menuItemRichSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type EventItem = z.infer<typeof eventSchema>;

export type HomeContent = z.infer<typeof homeContent>;
export type LocationDetailContent = z.infer<typeof locationDetailContent>;
export type BeerPageContent = z.infer<typeof beerPageContent>;
export type FoodPageContent = z.infer<typeof foodPageContent>;
export type EventsPageContent = z.infer<typeof eventsPageContent>;
export type AboutPageContent = z.infer<typeof aboutPageContent>;
export type PrivateEventsContent = z.infer<typeof privateEventsContent>;
export type CareersPageContent = z.infer<typeof careersPageContent>;
export type ContactPageContent = z.infer<typeof contactPageContent>;
