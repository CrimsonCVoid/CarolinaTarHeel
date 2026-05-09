// Editor metadata for the restaurant_v2 template — every Zod schema field
// in ./schema gets a FieldMeta entry here so the hub editor can render it.

import type { FieldMeta, FieldOption } from '../types';

const DIETARY_OPTIONS: FieldOption[] = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Gluten-free', value: 'gf' },
  { label: 'GF available', value: 'gf-available' },
  { label: 'Contains pork', value: 'contains-pork' },
  { label: 'Spicy', value: 'spicy' },
  { label: 'Popular', value: 'popular' },
  { label: 'Featured', value: 'featured' },
];

const FEATURE_OPTIONS: FieldOption[] = [
  { label: 'Kitchen on-site', value: 'kitchen' },
  { label: 'Food trucks', value: 'food-trucks' },
  { label: 'Patio', value: 'patio' },
  { label: 'Dog-friendly', value: 'dog-friendly' },
  { label: 'Kid-friendly', value: 'kid-friendly' },
  { label: 'Reservations', value: 'reservations' },
  { label: 'Private events', value: 'private-events' },
  { label: 'Live music', value: 'live-music' },
  { label: 'Parking', value: 'parking' },
];

const EVENT_TYPE_OPTIONS: FieldOption[] = [
  { label: 'Live music', value: 'live-music' },
  { label: 'Trivia', value: 'trivia' },
  { label: 'Food truck', value: 'food-truck' },
  { label: 'Tap release', value: 'tap-release' },
  { label: 'Community', value: 'community' },
  { label: 'Private', value: 'private' },
  { label: 'Other', value: 'other' },
];

const DAY_OF_WEEK_OPTIONS: FieldOption[] = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' },
];

const GOOD_TO_KNOW_ICON_OPTIONS: FieldOption[] = [
  { label: 'Parking', value: 'parking' },
  { label: 'Kids', value: 'kids' },
  { label: 'Dogs', value: 'dogs' },
  { label: 'Patio', value: 'patio' },
  { label: 'Reservations', value: 'reservations' },
  { label: 'Private', value: 'private' },
  { label: 'Music', value: 'music' },
  { label: 'Food truck', value: 'food-truck' },
  { label: 'WiFi', value: 'wifi' },
  { label: 'Capacity', value: 'capacity' },
];

const OPENING_TYPE_OPTIONS: FieldOption[] = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Contract', value: 'contract' },
];

const seoFields: Record<string, FieldMeta> = {
  title: { label: 'SEO title', kind: 'text', maxLength: 120, placeholder: 'Page title for search engines' },
  description: { label: 'SEO description', kind: 'textarea', maxLength: 200, placeholder: 'Meta description shown in search results' },
};

const seoMeta: FieldMeta = {
  label: 'SEO overrides',
  kind: 'object',
  help: 'Optional. Leave blank to use site defaults.',
  fields: seoFields,
};

const locationFields: Record<string, FieldMeta> = {
  key: {
    label: 'Location key',
    kind: 'text',
    maxLength: 60,
    required: true,
    placeholder: 'sweetwater',
    help: 'Stable identifier — once set, do not change. Lowercase letters, numbers, and dashes only.',
  },
  name: { label: 'Full name', kind: 'text', maxLength: 160, required: true, placeholder: 'Sweetwater Taproom & Pizzeria' },
  shortName: { label: 'Short name', kind: 'text', maxLength: 60, required: true, placeholder: 'Sweetwater' },
  tagline: { label: 'Tagline', kind: 'text', maxLength: 200, placeholder: 'Now open in Sweetwater Town Center' },
  address: { label: 'Address', kind: 'address', required: true },
  geo: {
    label: 'Map coordinates',
    kind: 'object',
    help: 'Optional latitude/longitude for the map pin.',
    fields: {
      lat: { label: 'Latitude', kind: 'number', placeholder: '35.7327' },
      lng: { label: 'Longitude', kind: 'number', placeholder: '-78.8503' },
    },
  },
  phone: { label: 'Phone', kind: 'phone', required: true, placeholder: '919-555-1234' },
  email: { label: 'Email', kind: 'email', placeholder: 'info@yourbrewery.com' },
  hours: { label: 'Hours', kind: 'hours', required: true },
  hoursNote: { label: 'Hours note', kind: 'text', maxLength: 200, placeholder: 'Food orders end one hour before close.' },
  primaryPhoto: { label: 'Primary photo', kind: 'image', help: 'Used as the location card hero. 16:9 at least 1600 px wide.' },
  toastOrderUrl: { label: 'Toast online-order URL', kind: 'url', placeholder: 'https://order.toasttab.com/online/...' },
  toastEgiftUrl: { label: 'Toast gift-card URL', kind: 'url', placeholder: 'https://order.toasttab.com/egiftcards/...' },
  reservationUrl: { label: 'Reservations URL', kind: 'url', placeholder: 'https://resy.com/...' },
  googlePlaceId: { label: 'Google Place ID', kind: 'text', help: 'Used for the map embed and reviews badge.' },
  features: {
    label: 'Features',
    kind: 'select',
    help: 'Hold cmd/ctrl to select multiple.',
    options: FEATURE_OPTIONS,
  },
  socialLinks: {
    label: 'Per-location social links',
    kind: 'object',
    help: 'Use these to override the global social links for this location only.',
    fields: {
      instagram: { label: 'Instagram URL', kind: 'url' },
      facebook: { label: 'Facebook URL', kind: 'url' },
      untappd: { label: 'Untappd URL', kind: 'url' },
    },
  },
};

const locationItemFields: Record<string, FieldMeta> = locationFields;

const beerFields: Record<string, FieldMeta> = {
  name: { label: 'Name', kind: 'text', maxLength: 120, required: true, placeholder: 'Allora Italian Pilsner' },
  slug: { label: 'Slug', kind: 'text', maxLength: 80, required: true, placeholder: 'allora-italian-pilsner', help: 'URL-safe identifier — lowercase, dashes only.' },
  style: { label: 'Style', kind: 'text', maxLength: 80, required: true, placeholder: 'Italian Pilsner' },
  abv: { label: 'ABV %', kind: 'number', placeholder: '5.2' },
  ibu: { label: 'IBU', kind: 'number', placeholder: '32' },
  description: { label: 'Description', kind: 'textarea', maxLength: 400 },
  tastingNotes: { label: 'Tasting notes', kind: 'textarea', maxLength: 300 },
  pairingSuggestion: { label: 'Pairs with', kind: 'text', maxLength: 200, placeholder: 'Pizza or appetizer this beer plays well with.' },
  servedAt: {
    label: 'Served at',
    kind: 'select',
    help: 'Which locations currently pour this beer.',
    options: [
      { label: 'Sweetwater', value: 'sweetwater' },
      { label: 'Windy Road', value: 'windy-road' },
    ],
  },
  isFlagship: { label: 'Flagship beer', kind: 'boolean', help: 'Year-round, always on tap.' },
  isCurrentlyOnTap: { label: 'Currently on tap', kind: 'boolean' },
  untappdUrl: { label: 'Untappd URL', kind: 'url' },
  image: { label: 'Image', kind: 'image' },
};

const menuItemRichFields: Record<string, FieldMeta> = {
  name: { label: 'Name', kind: 'text', maxLength: 120, required: true },
  slug: { label: 'Slug', kind: 'text', maxLength: 80, help: 'Optional — URL-safe identifier.' },
  description: { label: 'Description', kind: 'textarea', maxLength: 400 },
  ingredients: { label: 'Ingredients', kind: 'textarea', maxLength: 400, help: 'Optional — used for dietary filtering and JSON-LD.' },
  priceSmall: { label: 'Price (small)', kind: 'text', maxLength: 20, placeholder: '$13' },
  priceLarge: { label: 'Price (large)', kind: 'text', maxLength: 20, placeholder: '$18' },
  price: { label: 'Price', kind: 'text', maxLength: 20, placeholder: '$12', help: 'Use this when there’s only one size.' },
  dietaryTags: { label: 'Dietary tags', kind: 'select', options: DIETARY_OPTIONS, help: 'Hold cmd/ctrl to select multiple.' },
  pairsWith: { label: 'Pairs with (beer)', kind: 'text', maxLength: 120, placeholder: 'Boxcar Belle Amber Lager' },
  image: { label: 'Image', kind: 'image' },
  isFeatured: { label: 'Featured', kind: 'boolean', help: 'Highlights this item in featured-food sections.' },
};

const eventFields: Record<string, FieldMeta> = {
  title: { label: 'Title', kind: 'text', maxLength: 160, required: true, placeholder: 'Trivia Tuesday' },
  slug: { label: 'Slug', kind: 'text', maxLength: 80, required: true, placeholder: 'trivia-tuesday-2026-05-12' },
  locationKey: {
    label: 'Location',
    kind: 'select',
    options: [
      { label: 'Sweetwater', value: 'sweetwater' },
      { label: 'Windy Road', value: 'windy-road' },
    ],
  },
  startsAt: { label: 'Starts at', kind: 'text', maxLength: 40, required: true, placeholder: '2026-05-12T19:00:00-04:00', help: 'ISO 8601 with time zone.' },
  endsAt: { label: 'Ends at', kind: 'text', maxLength: 40, placeholder: '2026-05-12T21:00:00-04:00' },
  recurrence: { label: 'Recurrence', kind: 'text', help: 'Optional human-readable label, e.g. "Every Tuesday".' },
  description: { label: 'Description', kind: 'textarea', maxLength: 800 },
  image: { label: 'Image', kind: 'image' },
  type: { label: 'Type', kind: 'select', options: EVENT_TYPE_OPTIONS },
  ticketUrl: { label: 'Ticket / RSVP URL', kind: 'url' },
};

export const homeEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      eyebrow: { label: 'Eyebrow', kind: 'text', maxLength: 80, placeholder: 'Now open in Sweetwater Town Center' },
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image', help: 'Full-bleed; pick a 16:9 photo at least 1920 px wide.' },
      primaryCta: {
        label: 'Primary CTA',
        kind: 'object',
        fields: {
          label: { label: 'Button label', kind: 'text', maxLength: 40, placeholder: 'Order online' },
          url: { label: 'Button link', kind: 'text', maxLength: 300, placeholder: 'https://order.toasttab.com/...' },
        },
      },
      secondaryCta: {
        label: 'Secondary CTA',
        kind: 'object',
        fields: {
          label: { label: 'Button label', kind: 'text', maxLength: 40, placeholder: 'See the menu' },
          url: { label: 'Button link', kind: 'text', maxLength: 300, placeholder: '/food' },
        },
      },
    },
  },
  locationsHeadline: { label: 'Locations section headline', kind: 'text', maxLength: 120 },
  locationsSubheadline: { label: 'Locations section sub-headline', kind: 'textarea', maxLength: 240 },
  locations: {
    label: 'Locations',
    kind: 'array',
    itemLabel: 'shortName',
    help: 'Each location renders as a card on the home page and as its own location detail page.',
    fields: locationItemFields,
  },
  onTap: {
    label: 'On-tap section',
    kind: 'object',
    fields: {
      enabled: { label: 'Show this section', kind: 'boolean' },
      headline: { label: 'Headline', kind: 'text', maxLength: 80 },
      subheadline: { label: 'Sub-headline', kind: 'text', maxLength: 200 },
      beers: { label: 'Beers', kind: 'array', itemLabel: 'name', fields: beerFields },
      ctaUrl: { label: 'CTA link', kind: 'text', maxLength: 300, placeholder: '/beer' },
      ctaLabel: { label: 'CTA label', kind: 'text', maxLength: 40, placeholder: 'See the full tap list' },
    },
  },
  featuredFood: {
    label: 'Featured food section',
    kind: 'object',
    fields: {
      enabled: { label: 'Show this section', kind: 'boolean' },
      headline: { label: 'Headline', kind: 'text', maxLength: 80 },
      subheadline: { label: 'Sub-headline', kind: 'text', maxLength: 200 },
      items: { label: 'Items', kind: 'array', itemLabel: 'name', fields: menuItemRichFields },
      ctaUrl: { label: 'CTA link', kind: 'text', maxLength: 300, placeholder: '/food' },
      ctaLabel: { label: 'CTA label', kind: 'text', maxLength: 40, placeholder: 'See the full menu' },
    },
  },
  upcomingEvents: {
    label: 'Upcoming events section',
    kind: 'object',
    fields: {
      enabled: { label: 'Show this section', kind: 'boolean' },
      headline: { label: 'Headline', kind: 'text', maxLength: 80 },
      events: { label: 'Events', kind: 'array', itemLabel: 'title', fields: eventFields },
      ctaUrl: { label: 'CTA link', kind: 'text', maxLength: 300, placeholder: '/events' },
      ctaLabel: { label: 'CTA label', kind: 'text', maxLength: 40, placeholder: 'See all events' },
    },
  },
  aboutSnippet: {
    label: 'About snippet',
    kind: 'object',
    fields: {
      enabled: { label: 'Show this section', kind: 'boolean' },
      eyebrow: { label: 'Eyebrow', kind: 'text', maxLength: 60, placeholder: 'Our story' },
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 800, required: true },
      image: { label: 'Image', kind: 'image' },
      ctaLabel: { label: 'CTA label', kind: 'text', maxLength: 40 },
      ctaUrl: { label: 'CTA link', kind: 'text', maxLength: 300, placeholder: '/about' },
    },
  },
  finalCta: {
    label: 'Closing call-to-action',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      primaryLabel: { label: 'Primary button label', kind: 'text', maxLength: 40, required: true },
      primaryUrl: { label: 'Primary button link', kind: 'text', maxLength: 300, required: true },
      secondaryLabel: { label: 'Secondary button label', kind: 'text', maxLength: 40 },
      secondaryUrl: { label: 'Secondary button link', kind: 'text', maxLength: 300 },
    },
  },
  seo: seoMeta,
};

export const locationDetailEditorMeta: Record<string, FieldMeta> = {
  location: {
    label: 'Location',
    kind: 'object',
    help: 'Address, hours, and contact info for this location. Used by the page hero and the JSON-LD.',
    fields: locationFields,
  },
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      eyebrow: { label: 'Eyebrow', kind: 'text', maxLength: 80 },
      headline: { label: 'Headline', kind: 'text', maxLength: 140 },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image' },
    },
  },
  intro: {
    label: 'Intro section',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 1200, required: true },
    },
  },
  goodToKnow: {
    label: 'Good to know',
    kind: 'array',
    itemLabel: 'headline',
    help: 'Short callouts: parking, dogs, patio, etc.',
    fields: {
      icon: { label: 'Icon', kind: 'select', options: GOOD_TO_KNOW_ICON_OPTIONS },
      headline: { label: 'Headline', kind: 'text', maxLength: 80, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 300, required: true },
    },
  },
  galleryHeadline: { label: 'Gallery headline', kind: 'text', maxLength: 80 },
  gallery: {
    label: 'Gallery',
    kind: 'array',
    itemLabel: 'alt',
    fields: {
      url: { label: 'Image', kind: 'image', required: true },
      alt: { label: 'Alt text', kind: 'text', maxLength: 200, help: 'Describes the image for screen readers.' },
    },
  },
  featuredFoodHeadline: { label: 'Featured food headline', kind: 'text', maxLength: 80 },
  featuredFood: { label: 'Featured food', kind: 'array', itemLabel: 'name', fields: menuItemRichFields },
  featuredBeerHeadline: { label: 'Featured beer headline', kind: 'text', maxLength: 80 },
  featuredBeers: { label: 'Featured beers', kind: 'array', itemLabel: 'name', fields: beerFields },
  showMap: { label: 'Show map', kind: 'boolean' },
  reviewsBadge: {
    label: 'Reviews badge',
    kind: 'object',
    help: 'Optional Google reviews badge.',
    fields: {
      placeId: { label: 'Google Place ID', kind: 'text' },
      rating: { label: 'Rating', kind: 'number', placeholder: '4.8' },
      reviewCount: { label: 'Review count', kind: 'number', placeholder: '123' },
      profileUrl: { label: 'Profile URL', kind: 'url' },
    },
  },
  finalCta: {
    label: 'Closing call-to-action',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      label: { label: 'Button label', kind: 'text', maxLength: 40, required: true },
      url: { label: 'Button link', kind: 'text', maxLength: 300, required: true },
    },
  },
  seo: seoMeta,
};

export const beerEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image' },
    },
  },
  intro: { label: 'Intro paragraph', kind: 'textarea', maxLength: 800 },
  showFilters: { label: 'Show style filters', kind: 'boolean', help: 'Renders client-side filter UI on the beer page.' },
  beers: { label: 'Beers', kind: 'array', itemLabel: 'name', fields: beerFields },
  retiredHeadline: { label: 'Retired beers headline', kind: 'text', maxLength: 80, placeholder: 'Off the menu (for now)' },
  retiredBeers: { label: 'Retired beers', kind: 'array', itemLabel: 'name', help: 'Past beers, kept for the archive.', fields: beerFields },
  lastUpdated: { label: 'Last updated', kind: 'text', placeholder: '2026-05-09', help: 'YYYY-MM-DD or any short label shown above the list.' },
  finalCta: {
    label: 'Closing call-to-action',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      label: { label: 'Button label', kind: 'text', maxLength: 40, required: true },
      url: { label: 'Button link', kind: 'text', maxLength: 300, required: true },
    },
  },
  seo: seoMeta,
};

export const foodEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image' },
      note: { label: 'Note', kind: 'textarea', maxLength: 300, help: 'Shown under the headline — e.g. allergens, location-only menu, etc.' },
    },
  },
  categories: {
    label: 'Menu categories',
    kind: 'array',
    itemLabel: 'name',
    fields: {
      name: { label: 'Category name', kind: 'text', maxLength: 80, required: true, placeholder: 'Craft Peak Pies' },
      slug: { label: 'Slug', kind: 'text', maxLength: 80 },
      description: { label: 'Description', kind: 'textarea', maxLength: 300 },
      items: { label: 'Items', kind: 'array', itemLabel: 'name', fields: menuItemRichFields },
    },
  },
  buildYourOwn: {
    label: 'Build your own',
    kind: 'object',
    help: 'Optional. Renders a separate section with sizes and toppings.',
    fields: {
      enabled: { label: 'Show this section', kind: 'boolean' },
      headline: { label: 'Headline', kind: 'text', maxLength: 80, placeholder: 'Build Your Own Pie' },
      note: { label: 'Note', kind: 'textarea', maxLength: 300, placeholder: 'GF crust available SM only (+$3.50). Toppings $1.50 SM / $3 LG.' },
      sizes: {
        label: 'Sizes',
        kind: 'array',
        itemLabel: 'label',
        fields: {
          label: { label: 'Size label', kind: 'text', maxLength: 60, required: true, placeholder: 'Small (personal)' },
          price: { label: 'Price', kind: 'text', maxLength: 20, required: true, placeholder: '$12' },
          description: { label: 'Description', kind: 'text', maxLength: 160, placeholder: 'Feeds 2–3.' },
        },
      },
      toppingsHeadline: { label: 'Toppings headline', kind: 'text', maxLength: 80, placeholder: 'Toppings' },
      toppings: { label: 'Toppings', kind: 'array', itemLabel: '_', fields: { _: { label: 'Topping', kind: 'text', maxLength: 60, required: true } } },
      addOnNote: { label: 'Add-on note', kind: 'textarea', maxLength: 200 },
    },
  },
  toastOrderUrl: { label: 'Toast order URL', kind: 'url', placeholder: 'https://order.toasttab.com/online/...' },
  toastEgiftUrl: { label: 'Toast gift-card URL', kind: 'url', placeholder: 'https://order.toasttab.com/egiftcards/...' },
  orderCtaLabel: { label: 'Order CTA label', kind: 'text', maxLength: 40, placeholder: 'Order online' },
  seo: seoMeta,
};

export const eventsEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image' },
    },
  },
  showFilters: { label: 'Show filters', kind: 'boolean' },
  upcomingHeadline: { label: 'Upcoming section headline', kind: 'text', maxLength: 80 },
  events: { label: 'Upcoming events', kind: 'array', itemLabel: 'title', fields: eventFields },
  recurringHeadline: { label: 'Recurring section headline', kind: 'text', maxLength: 80 },
  recurring: {
    label: 'Recurring weekly events',
    kind: 'array',
    itemLabel: 'title',
    fields: {
      dayOfWeek: { label: 'Day of week', kind: 'select', options: DAY_OF_WEEK_OPTIONS, required: true },
      title: { label: 'Title', kind: 'text', maxLength: 120, required: true, placeholder: 'Trivia Tuesday' },
      timeLabel: { label: 'Time label', kind: 'text', maxLength: 60, placeholder: '7:00 – 9:00 PM' },
      locationKey: {
        label: 'Location',
        kind: 'select',
        options: [
          { label: 'Sweetwater', value: 'sweetwater' },
          { label: 'Windy Road', value: 'windy-road' },
        ],
      },
      description: { label: 'Description', kind: 'textarea', maxLength: 300 },
    },
  },
  foodTruckHeadline: { label: 'Food truck section headline', kind: 'text', maxLength: 80 },
  foodTruckIntro: { label: 'Food truck intro', kind: 'textarea', maxLength: 400 },
  bookingUrl: { label: 'Private-event booking URL', kind: 'url', placeholder: '/private-events' },
  bookingLabel: { label: 'Booking CTA label', kind: 'text', maxLength: 40, placeholder: 'Book a private event' },
  seo: seoMeta,
};

export const aboutEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      eyebrow: { label: 'Eyebrow', kind: 'text', maxLength: 60 },
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image' },
    },
  },
  story: {
    label: 'Our story',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 3000, required: true },
      image: { label: 'Image', kind: 'image' },
    },
  },
  team: {
    label: 'Team',
    kind: 'array',
    itemLabel: 'name',
    fields: {
      name: { label: 'Name', kind: 'text', maxLength: 80, required: true },
      role: { label: 'Role', kind: 'text', maxLength: 80, required: true, placeholder: 'Co-Founder & Brewer' },
      bio: { label: 'Bio', kind: 'textarea', maxLength: 800 },
      image: { label: 'Photo', kind: 'image' },
    },
  },
  pillars: {
    label: 'Values / pillars',
    kind: 'array',
    itemLabel: 'headline',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 80, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 300, required: true },
    },
  },
  finalCta: {
    label: 'Closing call-to-action',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      label: { label: 'Button label', kind: 'text', maxLength: 40, required: true },
      url: { label: 'Button link', kind: 'text', maxLength: 300, required: true },
    },
  },
  seo: seoMeta,
};

export const privateEventsEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image' },
    },
  },
  intro: {
    label: 'Intro section',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 1200, required: true },
    },
  },
  spaces: {
    label: 'Spaces',
    kind: 'array',
    itemLabel: 'name',
    fields: {
      name: { label: 'Space name', kind: 'text', maxLength: 80, required: true },
      capacity: { label: 'Capacity', kind: 'text', maxLength: 80, required: true, placeholder: 'up to 80 guests' },
      priceFrom: { label: 'Starting at', kind: 'text', maxLength: 40, placeholder: '$1,500 minimum' },
      features: {
        label: 'Features',
        kind: 'array',
        itemLabel: '_',
        fields: { _: { label: 'Feature', kind: 'text', maxLength: 80, required: true } },
      },
      description: { label: 'Description', kind: 'textarea', maxLength: 400 },
      image: { label: 'Image', kind: 'image' },
    },
  },
  inquiry: {
    label: 'Inquiry block',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 300 },
      email: { label: 'Inquiry email', kind: 'email', required: true, placeholder: 'info@yourbrewery.com' },
      phone: { label: 'Inquiry phone', kind: 'phone' },
    },
  },
  faq: {
    label: 'FAQ',
    kind: 'array',
    itemLabel: 'question',
    fields: {
      question: { label: 'Question', kind: 'text', maxLength: 160, required: true },
      answer: { label: 'Answer', kind: 'textarea', maxLength: 800, required: true },
    },
  },
  seo: seoMeta,
};

export const careersEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
      backgroundImage: { label: 'Background image', kind: 'image' },
    },
  },
  intro: { label: 'Intro paragraph', kind: 'textarea', maxLength: 800 },
  openings: {
    label: 'Open positions',
    kind: 'array',
    itemLabel: 'title',
    fields: {
      title: { label: 'Title', kind: 'text', maxLength: 120, required: true, placeholder: 'Line Cook' },
      locationKey: {
        label: 'Location',
        kind: 'select',
        options: [
          { label: 'Sweetwater', value: 'sweetwater' },
          { label: 'Windy Road', value: 'windy-road' },
        ],
      },
      type: { label: 'Type', kind: 'select', options: OPENING_TYPE_OPTIONS },
      description: { label: 'Description', kind: 'textarea', maxLength: 800, required: true },
      applyUrl: { label: 'Apply URL', kind: 'url', help: 'Optional — overrides the apply email for this role.' },
      postedOn: { label: 'Posted on', kind: 'text', placeholder: '2026-05-01', help: 'YYYY-MM-DD.' },
    },
  },
  emptyStateMessage: {
    label: 'Empty state message',
    kind: 'textarea',
    maxLength: 400,
    help: 'Shown when there are no open positions.',
  },
  apply: {
    label: 'Apply block',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 800, required: true },
      email: { label: 'Apply email', kind: 'email', required: true, placeholder: 'info@yourbrewery.com' },
    },
  },
  seo: seoMeta,
};

export const contactEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 140, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 240 },
    },
  },
  showLocations: { label: 'Show locations block', kind: 'boolean' },
  formHeadline: { label: 'Form headline', kind: 'text', maxLength: 80 },
  formSubheadline: { label: 'Form sub-headline', kind: 'textarea', maxLength: 240 },
  showMap: { label: 'Show map', kind: 'boolean' },
  faq: {
    label: 'FAQ',
    kind: 'array',
    itemLabel: 'question',
    fields: {
      question: { label: 'Question', kind: 'text', maxLength: 160, required: true },
      answer: { label: 'Answer', kind: 'textarea', maxLength: 800, required: true },
    },
  },
  seo: seoMeta,
};

export const settingsEditorMeta: Record<string, FieldMeta> = {
  brand: {
    label: 'Brand',
    kind: 'object',
    fields: {
      name: { label: 'Business name', kind: 'text', required: true, placeholder: 'Southern Peak Brewery' },
      logoUrl: { label: 'Logo', kind: 'image' },
      primary: { label: 'Primary brand color', kind: 'color', placeholder: '#3a7a3a' },
      font: { label: 'Display font', kind: 'text', placeholder: 'Manrope' },
    },
  },
  contact: {
    label: 'Contact',
    kind: 'object',
    help: 'Defaults to the flagship location. Per-location info lives on each location page.',
    fields: {
      phone: { label: 'Phone', kind: 'phone' },
      email: { label: 'Email', kind: 'email' },
      address: { label: 'Address', kind: 'address' },
    },
  },
  hours: { label: 'Hours', kind: 'hours' },
  social: {
    label: 'Social',
    kind: 'object',
    fields: {
      instagram: { label: 'Instagram URL', kind: 'url' },
      facebook: { label: 'Facebook URL', kind: 'url' },
      tiktok: { label: 'TikTok URL', kind: 'url' },
      google: { label: 'Google profile URL', kind: 'url' },
      yelp: { label: 'Yelp URL', kind: 'url' },
    },
  },
  seo: {
    label: 'SEO defaults',
    kind: 'object',
    fields: {
      defaultOgImage: { label: 'Default share image', kind: 'image' },
      twitterHandle: { label: 'X / Twitter handle', kind: 'text', placeholder: '@yourbrand' },
      gtmId: { label: 'GTM container ID', kind: 'text', placeholder: 'GTM-XXXXXXX' },
    },
  },
};
