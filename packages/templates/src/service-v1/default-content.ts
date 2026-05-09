import type {
  HomeContent,
  ServicesPageContent,
  AreasPageContent,
  AboutPageContent,
  ContactPageContent,
} from './schema';

export const defaultHome: HomeContent = {
  hero: {
    headline: 'Same-day HVAC service across the Triangle',
    subheadline: 'Family-owned. Up-front pricing. 24/7 emergency line.',
    primaryCta: { label: 'Schedule service', url: '/contact' },
    emergencyPhone: '(919) 555-0100',
  },
  trustBar: {
    items: [
      { headline: 'Licensed & insured', body: 'NC HVAC license #12345' },
      { headline: '24/7 emergency', body: 'Real humans on the phone' },
      { headline: '5-star Google reviews', body: '700+ verified' },
      { headline: 'Up-front pricing', body: 'No surprises' },
    ],
  },
  servicesIntro: {
    headline: 'What we do',
    body: 'AC, heat, and air quality across Wake, Durham, and Orange counties.',
  },
  services: [
    { name: 'AC repair & install', body: 'Same-day diagnostics, free estimates on replacements.', icon: 'snowflake' },
    { name: 'Heating', body: 'Furnace, heat pump, and mini-split tune-ups and installs.', icon: 'flame' },
    { name: 'Maintenance plans', body: 'Two visits a year, priority scheduling, 15% off repairs.', icon: 'wrench' },
    { name: 'Indoor air quality', body: 'Filtration, dehumidification, duct cleaning.', icon: 'leaf' },
  ],
  serviceAreasTeaser: {
    headline: 'Where we work',
    body: 'Local family business serving the Triangle since 2007.',
    primaryAreas: ['Raleigh', 'Cary', 'Apex', 'Durham', 'Chapel Hill', 'Wake Forest', 'Holly Springs', 'Morrisville'],
  },
  testimonials: [
    { quote: 'On-time, polite, and the AC has never run colder.', author: 'Lauren M.', rating: 5 },
    { quote: 'Saved us during a July heatwave — there in two hours.', author: 'James P.', rating: 5 },
  ],
  finalCta: { headline: 'Need it fixed today?', label: 'Call now', url: 'tel:9195550100' },
};

export const defaultServices: ServicesPageContent = {
  hero: { headline: 'Services', subheadline: 'Everything we do, in detail.' },
  services: [
    {
      name: 'AC repair & install',
      body: 'Diagnostics, repair, and full-system replacement with up-front pricing.',
      bullets: ['Same-day repair', 'Free replacement estimates', '10-year parts warranty'],
    },
    {
      name: 'Heating',
      body: 'Furnaces, heat pumps, mini-splits.',
      bullets: ['Tune-ups', 'Repair', 'Install'],
    },
  ],
};

export const defaultAreas: AreasPageContent = {
  hero: { headline: 'Service areas', subheadline: 'If you\'re inside the Triangle, we\'ll get there.' },
  areas: [
    { name: 'Raleigh' },
    { name: 'Cary' },
    { name: 'Apex' },
    { name: 'Durham' },
    { name: 'Chapel Hill' },
    { name: 'Wake Forest' },
    { name: 'Morrisville' },
    { name: 'Holly Springs' },
  ],
};

export const defaultAbout: AboutPageContent = {
  hero: { headline: 'Family-owned since 2007' },
  story: {
    headline: 'Built on neighbors',
    body: 'We started with one truck. Now we run twelve and we still answer the phone ourselves.',
  },
};

export const defaultContact: ContactPageContent = {
  hero: { headline: 'Get a quote' },
  formHeadline: 'Request service',
};
