import type { HomeContent, MenuPageContent, AboutPageContent, ContactPageContent } from './schema.js';

export const defaultHome: HomeContent = {
  hero: {
    headline: 'Neighborhood food, done right.',
    subheadline: 'Open for dinner six nights a week. Counter open until 9.',
    ctaLabel: 'See the menu',
    ctaUrl: '/menu',
  },
  intro: {
    headline: 'Made by hand, every day',
    body: 'Family-run since 1998. Local where we can, scratch when it counts.',
  },
  featuredMenu: {
    enabled: true,
    headline: 'From the Kitchen',
    items: [
      { name: 'Margherita', description: 'San Marzano, fresh mozz, basil', price: '$14' },
      { name: 'Pepperoni', description: 'Crispy edges, lots of cheese', price: '$16' },
      { name: 'White Pie', description: 'Ricotta, garlic, rosemary', price: '$17' },
    ],
  },
  press: { enabled: false, logos: [] },
  finalCta: { headline: 'Hungry yet?', label: 'Order online', url: '/order' },
};

export const defaultMenu: MenuPageContent = {
  hero: { headline: 'Menu', note: 'Prices and items may change. Ask your server about specials.' },
  categories: [
    {
      name: 'Pies',
      items: [
        { name: 'Margherita', description: 'San Marzano, fresh mozz, basil', price: '$14' },
        { name: 'Pepperoni', price: '$16', tags: ['popular'] },
      ],
    },
    {
      name: 'Sides',
      items: [
        { name: 'Caesar', description: 'Anchovy dressing, parm, croutons', price: '$9' },
      ],
    },
  ],
};

export const defaultAbout: AboutPageContent = {
  hero: { headline: 'Our story' },
  story: {
    headline: 'Three generations, one recipe',
    body: "We've been making the same dough since 1998. The kids run the kitchen now.",
  },
};

export const defaultContact: ContactPageContent = {
  hero: { headline: 'Find us' },
  formHeadline: 'Send us a note',
  showMap: true,
};
