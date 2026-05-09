// Default content seeds for the restaurant_v2 template, populated with
// Southern Peak Brewery's verified facts (Apex, NC, two-location brewery + pizzeria).

import type {
  HomeContent,
  LocationDetailContent,
  BeerPageContent,
  FoodPageContent,
  EventsPageContent,
  AboutPageContent,
  PrivateEventsContent,
  CareersPageContent,
  ContactPageContent,
  Location,
  Beer,
  EventItem,
} from './schema';
import type { SiteSettings } from '../types';

const TOAST_ORDER_URL =
  'https://order.toasttab.com/online/southern-peak-brewery-2-1451-richardson-road-ste-130';
const TOAST_EGIFT_URL =
  'https://order.toasttab.com/egiftcards/southern-peak-brewery-2-1451-richardson-road-ste-130';

// Spec-preview asset paths. When this template is used by a real client, these
// are replaced via the editor with the client's own uploaded photography.
const PHOTO_TAPROOM = '/spec/southern-peak/DSC_1559.JPG';
const PHOTO_PRINT = '/spec/southern-peak/Sweetwaterprint5.jpeg';
const PHOTO_LOGO = '/spec/southern-peak/SPB-Logo_GreenBox_500pi.png';

const sweetwaterLocation: Location = {
  key: 'sweetwater',
  name: 'Sweetwater Taproom & Pizzeria',
  shortName: 'Sweetwater',
  tagline: 'Now open in Sweetwater Town Center',
  address: {
    line1: '1451 Richardson Road',
    line2: 'Suite 130',
    city: 'Apex',
    state: 'NC',
    postalCode: '27523',
  },
  phone: '919-629-4015',
  email: 'info@southernpeakbrewery.com',
  hours: {
    mon: { open: '11:00', close: '22:00' },
    tue: { open: '11:00', close: '22:00' },
    wed: { open: '11:00', close: '22:00' },
    thu: { open: '11:00', close: '22:00' },
    fri: { open: '11:00', close: '23:00' },
    sat: { open: '11:00', close: '23:00' },
    sun: { open: '12:00', close: '21:00' },
    note: 'Food orders end one hour before close.',
  },
  hoursNote: 'Food orders end one hour before close.',
  primaryPhoto: PHOTO_TAPROOM,
  toastOrderUrl: TOAST_ORDER_URL,
  toastEgiftUrl: TOAST_EGIFT_URL,
  features: ['kitchen', 'kid-friendly', 'patio', 'dog-friendly', 'parking', 'private-events'],
  socialLinks: {
    instagram: 'https://www.instagram.com/southernpeaksweetwater/',
    facebook: 'https://www.facebook.com/Southern-Peak-Brewery-787473081321842',
  },
};

const windyRoadLocation: Location = {
  key: 'windy-road',
  name: 'Windy Road Original Brewery',
  shortName: 'Windy Road',
  tagline: 'The original taproom — where it all started',
  address: {
    line1: '950 Windy Road',
    line2: 'Suite 100',
    city: 'Apex',
    state: 'NC',
    postalCode: '27502',
  },
  phone: '919-629-4015',
  email: 'info@southernpeakbrewery.com',
  hours: {
    mon: { open: '15:00', close: '22:00' },
    tue: { open: '15:00', close: '22:00' },
    wed: { open: '15:00', close: '22:00' },
    thu: { open: '15:00', close: '22:00' },
    fri: { open: '12:00', close: '22:00' },
    sat: { open: '12:00', close: '22:00' },
    sun: { open: '12:00', close: '20:00' },
    note: 'Food trucks rotate — check our events page for the weekly schedule.',
  },
  hoursNote: 'Food trucks rotate — check the events page for the weekly schedule.',
  primaryPhoto: PHOTO_TAPROOM,
  features: ['food-trucks', 'patio', 'dog-friendly', 'parking'],
  socialLinks: {
    instagram: 'https://www.instagram.com/southernpeakbrewery/',
    facebook: 'https://www.facebook.com/Southern-Peak-Brewery-787473081321842',
  },
};

const alloraPilsner: Beer = {
  name: 'Allora Italian Pilsner',
  slug: 'allora-italian-pilsner',
  style: 'Italian Pilsner',
  abv: 5.2,
  ibu: 32,
  description: 'A crisp Italian-style pilsner dry-hopped for a soft floral lift.',
  tastingNotes: 'Bready malt, white-pepper hop bite, clean lager finish.',
  pairingSuggestion: 'Allora Meatballs or the Cheesy Quartet pie.',
  servedAt: ['sweetwater', 'windy-road'],
  isFlagship: true,
  isCurrentlyOnTap: true,
};

const boxcarBelle: Beer = {
  name: 'Boxcar Belle Amber Lager',
  slug: 'boxcar-belle-amber-lager',
  style: 'Amber Lager',
  abv: 5.4,
  ibu: 24,
  description: 'A smooth amber lager with toasted caramel and a clean lager finish.',
  tastingNotes: 'Toffee, light toasted bread, faint herbal hop.',
  pairingSuggestion: 'Porky Belle pie — built around the caramelized-onion reduction we make with this beer.',
  servedAt: ['sweetwater', 'windy-road'],
  isFlagship: true,
  isCurrentlyOnTap: true,
};

const midnightConductor: Beer = {
  name: 'Midnight Conductor Baltic Porter',
  slug: 'midnight-conductor-baltic-porter',
  style: 'Baltic Porter',
  abv: 7.2,
  ibu: 30,
  description: 'A lager-fermented Baltic porter — dark, smooth, and unexpectedly drinkable.',
  tastingNotes: 'Cocoa, dark fruit, a whisper of licorice. Long, dry finish.',
  pairingSuggestion: 'Playful Pig & Fig — its fig jam is built with this beer.',
  servedAt: ['sweetwater', 'windy-road'],
  isFlagship: false,
  isCurrentlyOnTap: true,
};

const oneMileWheat: Beer = {
  name: 'One Mile Wheat Ale',
  slug: 'one-mile-wheat-ale',
  style: 'American Wheat Ale',
  abv: 4.8,
  ibu: 18,
  description: 'A bright American wheat ale brewed for porch sessions.',
  tastingNotes: 'Soft wheat, lemon zest, faint clove. Easy and crushable.',
  pairingSuggestion: 'Spicy Soprano — its hot honey is cut with this wheat ale.',
  servedAt: ['sweetwater', 'windy-road'],
  isFlagship: true,
  isCurrentlyOnTap: true,
};

const tropikolIpa: Beer = {
  name: 'Tropiköl IPA',
  slug: 'tropikol-ipa',
  style: 'Tropical IPA',
  abv: 6.5,
  ibu: 55,
  description: 'A juice-forward tropical IPA balanced by a firm bitterness.',
  tastingNotes: 'Mango, passionfruit, pine resin, citrus pith.',
  pairingSuggestion: 'Tropiköl Firebird pie — its buffalo sauce is built on this beer.',
  servedAt: ['sweetwater', 'windy-road'],
  isFlagship: false,
  isCurrentlyOnTap: true,
};

const peakHazeIpa: Beer = {
  name: 'Peak Haze IPA',
  slug: 'peak-haze-ipa',
  style: 'New England IPA',
  abv: 6.8,
  ibu: 40,
  description: 'A soft, hazy IPA hopped heavy with Citra and Mosaic.',
  tastingNotes: 'Stone fruit, citrus pulp, pillowy mouthfeel, dry finish.',
  pairingSuggestion: 'Garden of Eatin’ — the hop oils cut through the EVOO and roasted veg.',
  servedAt: ['sweetwater', 'windy-road'],
  isFlagship: false,
  isCurrentlyOnTap: true,
};

const summerSeasonal: Beer = {
  name: 'Apex Sunset Saison',
  slug: 'apex-sunset-saison',
  style: 'Farmhouse Saison',
  abv: 5.8,
  ibu: 22,
  description: 'A bright Belgian-style saison with peppery yeast character.',
  tastingNotes: 'Pear, white pepper, lemon peel. Dry, effervescent.',
  servedAt: ['sweetwater'],
  isFlagship: false,
  isCurrentlyOnTap: true,
};

const stoutSeasonal: Beer = {
  name: 'Coal Yard Coffee Stout',
  slug: 'coal-yard-coffee-stout',
  style: 'Coffee Stout',
  abv: 6.4,
  ibu: 28,
  description: 'A medium-bodied stout brewed with locally roasted coffee.',
  tastingNotes: 'Espresso, cocoa nibs, a touch of vanilla. Roasty without being sharp.',
  servedAt: ['windy-road'],
  isFlagship: false,
  isCurrentlyOnTap: true,
};

const homeUpcomingEvents: EventItem[] = [
  {
    title: 'Trivia Tuesday',
    slug: 'trivia-tuesday-2026-05-12',
    locationKey: 'sweetwater',
    startsAt: '2026-05-12T19:00:00-04:00',
    endsAt: '2026-05-12T21:00:00-04:00',
    description: 'Six rounds, no app needed, prizes for the top three teams. Free to play.',
    type: 'trivia',
  },
  {
    title: 'Live Music: Local Bluegrass Band',
    slug: 'live-music-bluegrass-2026-05-16',
    locationKey: 'windy-road',
    startsAt: '2026-05-16T19:30:00-04:00',
    endsAt: '2026-05-16T22:00:00-04:00',
    description: 'A Triangle bluegrass quartet on the patio. No cover.',
    type: 'live-music',
  },
  {
    title: 'Tap Release: New Hazy IPA',
    slug: 'tap-release-new-hazy-ipa-2026-05-23',
    locationKey: 'sweetwater',
    startsAt: '2026-05-23T16:00:00-04:00',
    endsAt: '2026-05-23T22:00:00-04:00',
    description: 'First pour of our newest hazy IPA. Limited release, draft only.',
    type: 'tap-release',
  },
];

const allUpcomingEvents: EventItem[] = [
  ...homeUpcomingEvents,
  {
    title: 'Food Truck: Tacos La Chiquita',
    slug: 'food-truck-tacos-la-chiquita-2026-05-30',
    locationKey: 'windy-road',
    startsAt: '2026-05-30T17:00:00-04:00',
    endsAt: '2026-05-30T21:00:00-04:00',
    description: 'Street tacos, elotes, and aguas frescas on the Windy Road patio.',
    type: 'food-truck',
  },
];

export const defaultHome: HomeContent = {
  hero: {
    eyebrow: 'Now open in Sweetwater Town Center',
    headline: 'Craft Beer. From-Scratch Pizza. In Apex.',
    subheadline:
      'Two taprooms in Apex, NC. Award-winning beer at both. Hand-stretched pizza at our new Sweetwater spot.',
    backgroundImage: PHOTO_TAPROOM,
    primaryCta: { label: 'Order online', url: TOAST_ORDER_URL },
    secondaryCta: { label: 'See the menu', url: '/food' },
  },
  locationsHeadline: 'Two locations in Apex',
  locationsSubheadline:
    'Same beer program, two distinct rooms. Sweetwater has the kitchen — Windy Road has the food trucks.',
  locations: [sweetwaterLocation, windyRoadLocation],
  onTap: {
    enabled: true,
    headline: 'On tap this week',
    subheadline: 'A rotating list of flagships and seasonals. Updated weekly.',
    beers: [alloraPilsner, boxcarBelle, oneMileWheat, tropikolIpa, peakHazeIpa, midnightConductor],
    ctaUrl: '/beer',
    ctaLabel: 'See the full tap list',
  },
  featuredFood: {
    enabled: true,
    headline: 'From the kitchen',
    subheadline: 'Hand-stretched dough, scratch sauces, and beer-built toppings.',
    items: [
      {
        name: 'Porky Belle',
        description:
          'tomato sauce, mozzarella applewood bacon, arugula, gorgonzola crumbles, Boxcar Belle Amber Lager caramelized onion, Porter beersalmic glaze',
        priceSmall: '$16',
        priceLarge: '$24',
        dietaryTags: ['contains-pork', 'popular'],
        pairsWith: 'Boxcar Belle Amber Lager',
        isFeatured: true,
      },
      {
        name: 'Tropiköl Firebird',
        description:
          'IPA Buffalo Sauce, mozzarella, Sharp cheddar, chicken, gorgonzola, scallions, blue cheese swirl',
        priceSmall: '$16',
        priceLarge: '$24',
        dietaryTags: ['spicy', 'featured'],
        pairsWith: 'Tropiköl IPA',
        isFeatured: true,
      },
      {
        name: 'Garden of Eatin’',
        description:
          'EVOO, mozzarella, fresh garlic roasted red pepper, kalamata olive roasted mushroom, Porter beersalmic glaze, Boxcar Belle Amber caramelized onion',
        priceSmall: '$15',
        priceLarge: '$22',
        dietaryTags: ['vegetarian'],
        pairsWith: 'Peak Haze IPA',
      },
    ],
    ctaUrl: '/food',
    ctaLabel: 'See the full menu',
  },
  upcomingEvents: {
    enabled: true,
    headline: 'Upcoming events',
    events: homeUpcomingEvents,
    ctaUrl: '/events',
    ctaLabel: 'See all events',
  },
  aboutSnippet: {
    enabled: true,
    eyebrow: 'Our story',
    headline: 'Brewed in Apex. Built for the neighborhood.',
    body:
      'Southern Peak started with a simple idea: craft great beer, serve great food, bring people together. Our original Windy Road taproom remains the brewhouse and the rotating-food-truck patio that locals know. In 2025 we opened a second location in Sweetwater Town Center, where Chef Anthony Masino runs a from-scratch pizzeria built around the same beer program.',
    image: PHOTO_PRINT,
    ctaLabel: 'Read our story',
    ctaUrl: '/about',
  },
  finalCta: {
    headline: 'Pull up a chair.',
    subheadline: 'Order ahead, swing by either location, or book the room for your next gathering.',
    primaryLabel: 'Order online',
    primaryUrl: TOAST_ORDER_URL,
    secondaryLabel: 'Book private events',
    secondaryUrl: '/private-events',
  },
};

export const defaultSweetwater: LocationDetailContent = {
  location: sweetwaterLocation,
  hero: {
    eyebrow: 'Now open · Sweetwater Town Center',
    headline: 'Sweetwater Taproom & Pizzeria',
    subheadline:
      'Our beer program, plus a from-scratch pizzeria from Chef Anthony Masino. Family-friendly, dog-friendly patio, full kitchen.',
    backgroundImage: PHOTO_TAPROOM,
  },
  intro: {
    headline: 'Beer + pizza, under one roof.',
    body:
      'Sweetwater is our second location and the home of the Southern Peak pizzeria. The full draft list is here, and so is a kid-friendly dining room, a covered patio, and a private space for your event. Order at the counter, grab a table, or order ahead on Toast and swing through.',
  },
  goodToKnow: [
    { icon: 'kids', headline: 'Kid-friendly', body: 'High chairs, kids’ menu, and plenty of room to wiggle.' },
    { icon: 'dogs', headline: 'Dogs on the patio', body: 'Leashed pups welcome on the covered patio.' },
    { icon: 'parking', headline: 'Easy parking', body: 'Free lot parking in Sweetwater Town Center.' },
    { icon: 'private', headline: 'Private events', body: 'Buyouts and reservations for parties up to 80.' },
  ],
  galleryHeadline: 'Inside Sweetwater',
  gallery: [
    { url: PHOTO_TAPROOM, alt: 'Inside the Sweetwater taproom' },
    { url: PHOTO_PRINT, alt: 'Sweetwater Taproom & Pizzeria opening announcement' },
  ],
  featuredFoodHeadline: 'Pizzeria favorites',
  featuredFood: [
    {
      name: 'Porky Belle',
      description:
        'tomato sauce, mozzarella applewood bacon, arugula, gorgonzola crumbles, Boxcar Belle Amber Lager caramelized onion, Porter beersalmic glaze',
      priceSmall: '$16',
      priceLarge: '$24',
      dietaryTags: ['contains-pork', 'popular'],
      pairsWith: 'Boxcar Belle Amber Lager',
    },
    {
      name: 'Spicy Soprano',
      description:
        'tomato sauce, mozzarella, italian sausage, calabrian chili pepper, Boxcar Belle Amber caramelized onion, One Mile wheat ale hot honey, fresh basil',
      priceSmall: '$16',
      priceLarge: '$24',
      dietaryTags: ['spicy', 'contains-pork'],
      pairsWith: 'One Mile Wheat Ale',
    },
    {
      name: 'Cheesy Quartet',
      description: 'white pie, ricotta, mozz, romano shaved parm, fresh basil, EVOO',
      priceSmall: '$13',
      priceLarge: '$18',
      dietaryTags: ['vegetarian'],
      pairsWith: 'Allora Italian Pilsner',
    },
  ],
  featuredBeerHeadline: 'On tap at Sweetwater',
  featuredBeers: [alloraPilsner, boxcarBelle, oneMileWheat, peakHazeIpa],
  showMap: true,
  finalCta: {
    headline: 'Order online for pickup at Sweetwater.',
    label: 'Order on Toast',
    url: TOAST_ORDER_URL,
  },
};

export const defaultWindyRoad: LocationDetailContent = {
  location: windyRoadLocation,
  hero: {
    eyebrow: 'Original brewery · Apex, NC',
    headline: 'Where it all started',
    subheadline:
      'Our flagship Windy Road taproom and brewhouse. The full beer program, a covered patio, and a different food truck most nights.',
    backgroundImage: PHOTO_TAPROOM,
  },
  intro: {
    headline: 'The original room.',
    body:
      'Windy Road is the brewhouse and the room where Southern Peak started. There’s no kitchen here — instead, we host a rotating slate of local food trucks. Bring the family, bring the dog, grab a flight, and see who’s parked outside.',
  },
  goodToKnow: [
    { icon: 'food-truck', headline: 'Food trucks rotate', body: 'A different truck most nights. See the events page for the weekly schedule.' },
    { icon: 'dogs', headline: 'Dogs welcome', body: 'Leashed pups always welcome on the patio.' },
    { icon: 'parking', headline: 'On-site parking', body: 'Free parking lot directly outside.' },
    { icon: 'patio', headline: 'Covered patio', body: 'Open year-round with heaters in the cold months.' },
  ],
  galleryHeadline: 'Inside Windy Road',
  gallery: [{ url: PHOTO_TAPROOM, alt: 'The Windy Road taproom' }],
  featuredFood: [],
  featuredBeerHeadline: 'Brewed on-site',
  featuredBeers: [alloraPilsner, boxcarBelle, midnightConductor, tropikolIpa],
  showMap: true,
  finalCta: {
    headline: 'Come see the brewhouse.',
    label: 'Get directions',
    url: 'https://maps.google.com/?q=950+Windy+Rd+Suite+100+Apex+NC+27502',
  },
};

export const defaultBeer: BeerPageContent = {
  hero: {
    headline: 'Our beer',
    subheadline: 'A working tap list — flagships year-round, seasonals when the weather calls for them.',
    backgroundImage: PHOTO_TAPROOM,
  },
  intro:
    'Every beer poured at Southern Peak is brewed at our Windy Road brewhouse in Apex. Three flagships you can count on, plus a rotating cast of seasonals and one-offs. The list below is updated weekly — if you’re looking for something specific, give the bar a call.',
  showFilters: true,
  beers: [
    alloraPilsner,
    boxcarBelle,
    oneMileWheat,
    midnightConductor,
    tropikolIpa,
    peakHazeIpa,
    summerSeasonal,
    stoutSeasonal,
  ],
  retiredBeers: [],
  lastUpdated: '2026-05-09',
  finalCta: {
    headline: 'Want to taste the lineup?',
    label: 'Build a flight at the bar',
    url: '/locations/sweetwater',
  },
};

export const defaultFood: FoodPageContent = {
  hero: {
    headline: 'Pizzeria menu',
    subheadline: 'From-scratch dough, house-made sauces, and toppings built around our beer.',
    backgroundImage: PHOTO_TAPROOM,
    note: 'Pizzeria menu is served at our Sweetwater location. Windy Road hosts rotating food trucks — see the events page.',
  },
  categories: [
    {
      name: 'Peak Snacks',
      items: [
        {
          name: 'Allora Meatballs',
          description: '6 Meatballs made with a touch of the Allora Italian Pilsner and served in our house marinara',
          price: '$12',
          dietaryTags: [],
          pairsWith: 'Allora Italian Pilsner',
        },
        {
          name: 'Brewchos',
          description: 'kettle chips topped w applewood bacon Pilsner beer cheese & scallions',
          price: '$11',
          dietaryTags: ['contains-pork'],
          pairsWith: 'Allora Italian Pilsner',
        },
        {
          name: 'Knotty by Nature',
          description: '8 knots tossed in garlic sauce served w house marinara',
          price: '$8',
          dietaryTags: ['vegetarian'],
        },
        {
          name: 'Peak Pizza Pretzel',
          description: 'freshly baked pizza dough pretzel topped w salt & served w side of Pilsner beer cheese',
          price: '$10.50',
          dietaryTags: ['vegetarian'],
          pairsWith: 'Allora Italian Pilsner',
        },
      ],
    },
    {
      name: 'Peak Pockets',
      description: 'Folded pies stuffed and baked to order.',
      items: [
        {
          name: 'Cheesy Does It',
          description: 'ricotta, Mozzarella, Romano, Parmesan',
          price: '$12',
          dietaryTags: ['vegetarian'],
        },
        {
          name: 'Get Figgy With It',
          description: 'ricotta, mozzarella, prosciutto Porter fig jam, arugula, Parmesan',
          price: '$14',
          dietaryTags: ['contains-pork'],
          pairsWith: 'Midnight Conductor Baltic Porter',
        },
        {
          name: 'Stingeroni',
          description: 'ricotta, Mozzarella, Pepperoni',
          price: '$13',
          dietaryTags: ['contains-pork'],
        },
        {
          name: 'Pesto My Heart',
          description: 'ricotta, mozzarella,  prosciutto roasted red peppers, pesto fresh garlic',
          price: '$14',
          dietaryTags: ['contains-pork'],
        },
      ],
    },
    {
      name: 'Craft Peak Pies',
      description: 'Our signature pies. Small or large — small feeds one, large feeds two to three.',
      items: [
        {
          name: 'Cheesy Quartet',
          description: 'white pie, ricotta, mozz, romano shaved parm, fresh basil, EVOO',
          priceSmall: '$13',
          priceLarge: '$18',
          dietaryTags: ['vegetarian'],
          pairsWith: 'Allora Italian Pilsner',
        },
        {
          name: 'Porky Belle',
          description:
            'tomato sauce, mozzarella applewood bacon, arugula, gorgonzola crumbles, Boxcar Belle Amber Lager caramelized onion, Porter beersalmic glaze',
          priceSmall: '$16',
          priceLarge: '$24',
          dietaryTags: ['contains-pork', 'popular'],
          pairsWith: 'Boxcar Belle Amber Lager',
          isFeatured: true,
        },
        {
          name: 'Playful Pig & Fig',
          description:
            'white pie, prosciutto, arugula, Midnight Conductor Baltic Porter Fig Jam, shaved parm',
          priceSmall: '$16',
          priceLarge: '$24',
          dietaryTags: ['contains-pork'],
          pairsWith: 'Midnight Conductor Baltic Porter',
        },
        {
          name: 'Pep In Your Step',
          description: 'tomato sauce, mozzarella, pepperoni ricotta dollops, Wheat Ale hot honey, fresh basil',
          priceSmall: '$15',
          priceLarge: '$22',
          dietaryTags: ['contains-pork', 'popular'],
          pairsWith: 'One Mile Wheat Ale',
        },
        {
          name: 'Tropiköl Firebird',
          description:
            'IPA Buffalo Sauce, mozzarella, Sharp cheddar, chicken, gorgonzola, scallions, blue cheese swirl',
          priceSmall: '$16',
          priceLarge: '$24',
          dietaryTags: ['spicy', 'featured'],
          pairsWith: 'Tropiköl IPA',
          isFeatured: true,
        },
        {
          name: 'Garden of Eatin’',
          description:
            'EVOO, mozzarella, fresh garlic roasted red pepper, kalamata olive roasted mushroom, Porter beersalmic glaze, Boxcar Belle Amber caramelized onion',
          priceSmall: '$15',
          priceLarge: '$22',
          dietaryTags: ['vegetarian'],
          pairsWith: 'Peak Haze IPA',
        },
        {
          name: 'Shroom & Bloom',
          description:
            'white pie, roasted mushrooms shaved parmesan, Porter beersalmic glaze, Boxcar Belle Amber caramelized onion, black truffle oil drizzle',
          priceSmall: '$15',
          priceLarge: '$22',
          dietaryTags: ['vegetarian'],
          pairsWith: 'Midnight Conductor Baltic Porter',
        },
        {
          name: 'Spicy Soprano',
          description:
            'tomato sauce, mozzarella, italian sausage, calabrian chili pepper, Boxcar Belle Amber caramelized onion, One Mile wheat ale hot honey, fresh basil',
          priceSmall: '$16',
          priceLarge: '$24',
          dietaryTags: ['spicy', 'contains-pork'],
          pairsWith: 'One Mile Wheat Ale',
        },
        {
          name: 'Smokey & The Basil',
          description:
            'EVOO, fresh garlic, mozzarella, prosciutto, roasted red pepper ricotta dollops, pesto swirl',
          priceSmall: '$16',
          priceLarge: '$24',
          dietaryTags: ['contains-pork'],
        },
        {
          name: 'Ultimate Carnivore',
          description:
            'tomato sauce, mozzarella, pepperoni Italian sausage, Allora meatballs applewood bacon, fresh basil',
          priceSmall: '$16',
          priceLarge: '$24',
          dietaryTags: ['contains-pork'],
          pairsWith: 'Allora Italian Pilsner',
        },
      ],
    },
  ],
  buildYourOwn: {
    enabled: true,
    headline: 'Build Your Own Pie',
    note: 'GF crust available SM only (+$3.50). Toppings $1.50 SM / $3 LG.',
    sizes: [
      { label: 'Small (personal)', price: '$12', description: 'Personal-size pie.' },
      { label: 'Large', price: '$17', description: 'Feeds 2–3.' },
    ],
    toppingsHeadline: 'Toppings',
    toppings: [
      'pepperoni',
      'italian sausage',
      'bacon',
      'meatball',
      'prosciutto',
      'caramelized onion',
      'calabrian chili pepper',
      'kalamata olive',
      'mushroom',
      'ricotta',
      'roasted red pepper',
      'pesto swirl',
      'fig jam',
      'arugula',
      'gorgonzola',
      'shaved parmesan',
    ],
    addOnNote: 'Toppings $1.50 small / $3 large. GF crust available on small pies only (+$3.50).',
  },
  toastOrderUrl: TOAST_ORDER_URL,
  toastEgiftUrl: TOAST_EGIFT_URL,
  orderCtaLabel: 'Order online',
};

export const defaultEvents: EventsPageContent = {
  hero: {
    headline: 'Events at Southern Peak',
    subheadline: 'Trivia, live music, tap releases, and a rotating food truck schedule.',
  },
  showFilters: true,
  upcomingHeadline: 'Upcoming',
  events: allUpcomingEvents,
  recurringHeadline: 'Every week',
  recurring: [
    {
      dayOfWeek: 'tue',
      title: 'Trivia Tuesday',
      timeLabel: '7:00 – 9:00 PM',
      locationKey: 'sweetwater',
      description: 'Six rounds, pizza & beer specials, prizes for the top three teams.',
    },
    {
      dayOfWeek: 'sat',
      title: 'Live Music Saturdays',
      timeLabel: '7:30 – 10:00 PM',
      locationKey: 'windy-road',
      description: 'Local bands on the patio. No cover, dogs welcome, food truck on-site.',
    },
  ],
  foodTruckHeadline: 'Food trucks at Windy Road',
  foodTruckIntro:
    'Windy Road doesn’t have a kitchen — instead, we host a rotating slate of local food trucks. Check the weekly lineup on Instagram or call ahead.',
  bookingLabel: 'Book a private event',
  bookingUrl: '/private-events',
};

export const defaultAbout: AboutPageContent = {
  hero: {
    eyebrow: 'About Southern Peak',
    headline: 'Brewed in Apex.',
    subheadline: 'Two locations, one beer program, a neighborhood gathering place since day one.',
    backgroundImage: PHOTO_TAPROOM,
  },
  story: {
    headline: 'Craft great beer. Serve great food. Bring people together.',
    body:
      'Southern Peak Brewery opened on Windy Road as a neighborhood place — a small brewhouse, a covered patio, and the kind of room where regulars know the bartenders by name. For years our food program ran on a rotating slate of local food trucks parked outside. In 2025 we doubled down on the neighborhood by opening a second location in Sweetwater Town Center, this time with a kitchen of our own. Chef Anthony Masino runs the pizzeria there, building a from-scratch menu around the beers we already brew. The mission hasn’t changed: craft great beer, serve great food, bring people together.',
    image: PHOTO_PRINT,
  },
  team: [
    {
      name: 'Ken Michalski',
      role: 'Co-Founder & Brewer',
      bio:
        'Ken runs the brewhouse at Windy Road and leads recipe development for the Southern Peak lineup. He started brewing at home, opened the original Apex brewery with Nathan, and still writes every recipe.',
    },
    {
      name: 'Nathan Poissant',
      role: 'Co-Founder',
      bio:
        'Nathan runs operations across both locations and steers the bigger picture for Southern Peak. He grew up in the Triangle and built the company around the kind of neighborhood places he wanted to spend his own time in.',
    },
    {
      name: 'Anthony Masino',
      role: 'Chef-Partner',
      bio:
        'Chef Anthony runs the pizzeria kitchen at Sweetwater. He built the menu around Southern Peak’s beers — caramelized onions in Boxcar Belle, fig jam in Midnight Conductor Porter, hot honey cut with One Mile Wheat — because the food and the beer are supposed to belong together.',
    },
  ],
  pillars: [
    { headline: 'Beer first', body: 'Every recipe is brewed in Apex. Three flagships year-round, seasonals when the weather calls for them.' },
    { headline: 'Scratch kitchen', body: 'At Sweetwater, dough, sauces, and beer-built toppings are all made in-house, every day.' },
    { headline: 'Neighborhood place', body: 'Dogs on the patio, kids in the dining room, regulars at the bar. That’s the room we want to keep.' },
    { headline: 'Local first', body: 'We work with Triangle farmers, roasters, and food trucks because the neighborhood comes back when we do.' },
  ],
  finalCta: {
    headline: 'Stop in for a pour.',
    label: 'Find a location',
    url: '/#locations',
  },
};

export const defaultPrivateEvents: PrivateEventsContent = {
  hero: {
    headline: 'Host your event with us',
    subheadline: 'Birthdays, rehearsal dinners, work parties, watch parties — our Sweetwater room is built for it.',
  },
  intro: {
    headline: 'A room of your own — with our kitchen attached.',
    body:
      'Our Sweetwater Taproom & Pizzeria is set up for private gatherings of every size. Reserve the patio for an intimate dinner, take over a corner of the dining room for a birthday, or buy out the whole space for a company event. We’ll work with you on a beer-and-pizza package that fits your headcount and budget.',
  },
  spaces: [
    {
      name: 'Sweetwater Full Buyout',
      capacity: 'up to 80 guests',
      priceFrom: '$1,500 minimum',
      features: ['private bar', 'kitchen open', 'AV / TV', 'patio access'],
      description:
        'The full taproom — dining room, bar, and patio — reserved exclusively for your group. Custom beer-and-pizza package built around your headcount.',
    },
    {
      name: 'Sweetwater Patio Reservation',
      capacity: 'up to 30 guests',
      priceFrom: '$300 minimum',
      features: ['covered patio', 'dog-friendly', 'heaters in winter'],
      description:
        'Reserve our covered patio for a semi-private gathering. The taproom stays open to the public; the patio is yours.',
    },
  ],
  inquiry: {
    headline: 'Tell us about your event',
    subheadline: 'Send a quick note — date, headcount, anything special — and we’ll get back within one business day.',
    email: 'info@southernpeakbrewery.com',
    phone: '919-629-4015',
  },
  faq: [
    {
      question: 'How far in advance should we book?',
      answer:
        'Most private events are booked 4–8 weeks out. For weekend buyouts in our peak season (Sept–Dec), book 8–12 weeks ahead.',
    },
    {
      question: 'Can you accommodate dietary restrictions?',
      answer:
        'Yes — our pizzeria offers vegetarian options on every category and a gluten-free crust on small pies. Tell us about your guests’ needs in your inquiry and Chef Anthony will build a menu that works.',
    },
    {
      question: 'Is there a deposit?',
      answer: 'Yes. We collect a 25% deposit at booking to hold your date. The balance is settled the night of the event.',
    },
    {
      question: 'Can we bring outside cake or desserts?',
      answer: 'Outside cakes and desserts are welcome — there’s no plating fee. Outside food beyond that, we’ll need to discuss case-by-case.',
    },
  ],
};

export const defaultCareers: CareersPageContent = {
  hero: {
    headline: 'Work with us',
    subheadline: 'A neighborhood brewery and pizzeria in Apex, NC. We hire for hospitality first.',
  },
  intro:
    'Southern Peak is family-feeling and locally owned. We pay fairly, we tip-pool transparently, and we promote from within whenever we can. If you don’t see your role open below, we still want to hear from you.',
  openings: [
    {
      title: 'Line Cook',
      locationKey: 'sweetwater',
      type: 'full-time',
      description:
        'Run the line at our Sweetwater pizzeria. Stretch dough, fire pies, plate snacks. Kitchen experience preferred but we’ll train the right person.',
      postedOn: '2026-05-01',
    },
    {
      title: 'Beertender',
      locationKey: 'windy-road',
      type: 'part-time',
      description:
        'Pour beer, talk shop, keep the room friendly. Cicerone certification a plus, training provided. Weekends required.',
      postedOn: '2026-05-03',
    },
    {
      title: 'Server',
      locationKey: 'sweetwater',
      type: 'full-time',
      description:
        'Anchor a section in our Sweetwater dining room. Restaurant experience required, beer knowledge a plus, hospitality required.',
      postedOn: '2026-05-05',
    },
  ],
  emptyStateMessage:
    'No open roles at the moment — but we keep applications on file. Send a note and we’ll be in touch when something opens.',
  apply: {
    headline: 'Send us your story',
    body:
      'Email a quick note about yourself, what you’re looking for, and where you’d like to work — Sweetwater or Windy Road. Resume optional but helpful.',
    email: 'info@southernpeakbrewery.com',
  },
};

export const defaultContact: ContactPageContent = {
  hero: {
    headline: 'Get in touch',
    subheadline: 'Questions, press, private events, beer trade — we read every note.',
  },
  showLocations: true,
  formHeadline: 'Send us a note',
  formSubheadline: 'For private events, please use the dedicated inquiry form on /private-events.',
  showMap: true,
  faq: [
    {
      question: 'Do you have parking?',
      answer:
        'Both locations have free on-site parking. Sweetwater shares the Sweetwater Town Center lot; Windy Road has a dedicated lot directly outside.',
    },
    {
      question: 'Are dogs allowed?',
      answer:
        'Leashed dogs are welcome on the patios at both locations. Inside the dining room at Sweetwater is service-dogs-only — health code, not personal preference.',
    },
    {
      question: 'Can I book the space for a private event?',
      answer:
        'Yes — head to /private-events for full details on Sweetwater buyouts and patio reservations.',
    },
  ],
};

export const defaultSettings: SiteSettings = {
  brand: {
    name: 'Southern Peak Brewery',
    primary: '#3a7a3a',
    logoUrl: PHOTO_LOGO,
  },
  contact: {
    phone: '919-629-4015',
    email: 'info@southernpeakbrewery.com',
    address: {
      line1: '1451 Richardson Road',
      line2: 'Suite 130',
      city: 'Apex',
      state: 'NC',
      postalCode: '27523',
    },
  },
  hours: {
    mon: { open: '11:00', close: '22:00' },
    tue: { open: '11:00', close: '22:00' },
    wed: { open: '11:00', close: '22:00' },
    thu: { open: '11:00', close: '22:00' },
    fri: { open: '11:00', close: '23:00' },
    sat: { open: '11:00', close: '23:00' },
    sun: { open: '12:00', close: '21:00' },
    note: 'Food orders end one hour before close.',
  },
  social: {
    instagram: 'https://www.instagram.com/southernpeaksweetwater/',
    facebook: 'https://www.facebook.com/Southern-Peak-Brewery-787473081321842',
  },
  seo: {
    twitterHandle: '',
  },
};
