import type { FieldMeta } from '../types';

export const homeEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 200 },
      backgroundImage: { label: 'Background image', kind: 'image', help: 'Used at full bleed; pick a 16:9 photo at least 1600 px wide.' },
      ctaLabel: { label: 'Button label', kind: 'text', maxLength: 40, placeholder: 'See the menu' },
      ctaUrl: { label: 'Button link', kind: 'text', placeholder: '/menu' },
    },
  },
  intro: {
    label: 'Intro section',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120 },
      body: { label: 'Body', kind: 'textarea', maxLength: 800 },
    },
  },
  featuredMenu: {
    label: 'Featured menu',
    kind: 'object',
    fields: {
      enabled: { label: 'Show this section', kind: 'boolean' },
      headline: { label: 'Section headline', kind: 'text', maxLength: 80 },
      items: {
        label: 'Items',
        kind: 'array',
        itemLabel: (i) => (i as { name?: string }).name ?? 'Item',
        fields: {
          name: { label: 'Name', kind: 'text', maxLength: 80, required: true },
          description: { label: 'Description', kind: 'text', maxLength: 200 },
          price: { label: 'Price', kind: 'text', maxLength: 20, placeholder: '$14' },
          image: { label: 'Image', kind: 'image' },
        },
      },
    },
  },
  press: {
    label: 'Press logos',
    kind: 'object',
    fields: {
      enabled: { label: 'Show', kind: 'boolean' },
      logos: { label: 'Logos', kind: 'array', fields: { _: { label: 'Logo', kind: 'image' } } },
    },
  },
  testimonials: {
    label: 'Testimonials',
    kind: 'array',
    itemLabel: (t) => (t as { author?: string }).author ?? 'Quote',
    fields: {
      quote: { label: 'Quote', kind: 'textarea', maxLength: 400, required: true },
      author: { label: 'Author', kind: 'text', maxLength: 80, required: true },
      source: { label: 'Source / outlet', kind: 'text', maxLength: 80 },
    },
  },
  finalCta: {
    label: 'Closing call-to-action',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      label: { label: 'Button label', kind: 'text', maxLength: 40, required: true },
      url: { label: 'Button link', kind: 'text', required: true },
    },
  },
};

export const menuEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Page header',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      note: { label: 'Note', kind: 'textarea', maxLength: 300 },
    },
  },
  categories: {
    label: 'Categories',
    kind: 'array',
    itemLabel: (c) => (c as { name?: string }).name ?? 'Category',
    fields: {
      name: { label: 'Category name', kind: 'text', maxLength: 80, required: true },
      description: { label: 'Description', kind: 'textarea', maxLength: 300 },
      items: {
        label: 'Items',
        kind: 'array',
        itemLabel: (i) => (i as { name?: string }).name ?? 'Item',
        fields: {
          name: { label: 'Name', kind: 'text', maxLength: 80, required: true },
          description: { label: 'Description', kind: 'textarea', maxLength: 300 },
          price: { label: 'Price', kind: 'text', maxLength: 20, required: true },
          tags: {
            label: 'Tags',
            kind: 'select',
            options: [
              { label: 'Gluten-free', value: 'gf' },
              { label: 'Vegetarian', value: 'vg' },
              { label: 'Vegan', value: 'v' },
              { label: 'Spicy', value: 'spicy' },
              { label: 'Popular', value: 'popular' },
            ],
          },
        },
      },
    },
  },
};

export const aboutEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Header',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      subheadline: { label: 'Sub-headline', kind: 'text', maxLength: 200 },
    },
  },
  story: {
    label: 'Story',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120 },
      body: { label: 'Body', kind: 'textarea', maxLength: 2000 },
      image: { label: 'Image', kind: 'image' },
    },
  },
  values: {
    label: 'Values / pillars',
    kind: 'array',
    itemLabel: (v) => (v as { headline?: string }).headline ?? 'Value',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 80, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 300 },
    },
  },
};

export const contactEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Header',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      subheadline: { label: 'Sub-headline', kind: 'text', maxLength: 200 },
    },
  },
  formHeadline: { label: 'Form headline', kind: 'text', maxLength: 80 },
  showMap: { label: 'Show map', kind: 'boolean' },
  faq: {
    label: 'FAQ',
    kind: 'array',
    itemLabel: (f) => (f as { question?: string }).question ?? 'Q',
    fields: {
      question: { label: 'Question', kind: 'text', maxLength: 160, required: true },
      answer: { label: 'Answer', kind: 'textarea', maxLength: 800, required: true },
    },
  },
};

export const settingsEditorMeta: Record<string, FieldMeta> = {
  brand: {
    label: 'Brand',
    kind: 'object',
    fields: {
      name: { label: 'Business name', kind: 'text', required: true },
      logoUrl: { label: 'Logo', kind: 'image' },
      primary: { label: 'Primary brand color', kind: 'color' },
    },
  },
  contact: {
    label: 'Contact',
    kind: 'object',
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
    },
  },
};
