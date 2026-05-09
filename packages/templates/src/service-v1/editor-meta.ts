import type { FieldMeta } from '../types';

export const homeEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Hero',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      subheadline: { label: 'Sub-headline', kind: 'textarea', maxLength: 200 },
      backgroundImage: { label: 'Background image', kind: 'image' },
      primaryCta: {
        label: 'Primary CTA',
        kind: 'object',
        fields: {
          label: { label: 'Button label', kind: 'text', maxLength: 40 },
          url: { label: 'Button link', kind: 'text' },
        },
      },
      emergencyPhone: { label: 'Emergency phone (shown bold)', kind: 'phone' },
    },
  },
  trustBar: {
    label: 'Trust bar',
    kind: 'object',
    fields: {
      items: {
        label: 'Items',
        kind: 'array',
        itemLabel: "headline",
        fields: {
          headline: { label: 'Headline', kind: 'text', maxLength: 60, required: true },
          body: { label: 'Body', kind: 'text', maxLength: 140 },
        },
      },
    },
  },
  servicesIntro: {
    label: 'Services intro',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120 },
      body: { label: 'Body', kind: 'textarea', maxLength: 800 },
    },
  },
  services: {
    label: 'Services grid',
    kind: 'array',
    itemLabel: "name",
    fields: {
      name: { label: 'Name', kind: 'text', maxLength: 80, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 300, required: true },
      icon: {
        label: 'Icon',
        kind: 'select',
        options: [
          { label: 'Wrench', value: 'wrench' },
          { label: 'Flame', value: 'flame' },
          { label: 'Snowflake', value: 'snowflake' },
          { label: 'Droplet', value: 'droplet' },
          { label: 'Bolt', value: 'bolt' },
          { label: 'Leaf', value: 'leaf' },
        ],
      },
      url: { label: 'Link', kind: 'text' },
    },
  },
  serviceAreasTeaser: {
    label: 'Service areas teaser',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120 },
      body: { label: 'Body', kind: 'textarea', maxLength: 400 },
      primaryAreas: {
        label: 'Cities / areas',
        kind: 'array',
        itemLabel: "_",
        fields: { _: { label: 'Area', kind: 'text', maxLength: 60 } },
      },
    },
  },
  testimonials: {
    label: 'Testimonials',
    kind: 'array',
    itemLabel: "author",
    fields: {
      quote: { label: 'Quote', kind: 'textarea', maxLength: 400, required: true },
      author: { label: 'Author', kind: 'text', maxLength: 80, required: true },
      rating: { label: 'Stars (1–5)', kind: 'number' },
    },
  },
  finalCta: {
    label: 'Closing CTA',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      label: { label: 'Button label', kind: 'text', maxLength: 40, required: true },
      url: { label: 'Button link (URL or tel:…)', kind: 'text', required: true },
    },
  },
};

export const servicesEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Header',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      subheadline: { label: 'Sub-headline', kind: 'text', maxLength: 200 },
    },
  },
  services: {
    label: 'Services',
    kind: 'array',
    itemLabel: "name",
    fields: {
      name: { label: 'Name', kind: 'text', maxLength: 80, required: true },
      body: { label: 'Body', kind: 'textarea', maxLength: 800, required: true },
      bullets: {
        label: 'Bullets',
        kind: 'array',
        itemLabel: "_",
        fields: { _: { label: 'Bullet', kind: 'text', maxLength: 120 } },
      },
      image: { label: 'Image', kind: 'image' },
    },
  },
};

export const areasEditorMeta: Record<string, FieldMeta> = {
  hero: {
    label: 'Header',
    kind: 'object',
    fields: {
      headline: { label: 'Headline', kind: 'text', maxLength: 120, required: true },
      subheadline: { label: 'Sub-headline', kind: 'text', maxLength: 200 },
    },
  },
  areas: {
    label: 'Areas',
    kind: 'array',
    itemLabel: "name",
    fields: {
      name: { label: 'Name', kind: 'text', maxLength: 60, required: true },
      zip: { label: 'ZIP code(s)', kind: 'text', maxLength: 20 },
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
  team: {
    label: 'Team',
    kind: 'array',
    itemLabel: "name",
    fields: {
      name: { label: 'Name', kind: 'text', maxLength: 80, required: true },
      role: { label: 'Role', kind: 'text', maxLength: 80, required: true },
      photo: { label: 'Photo', kind: 'image' },
      bio: { label: 'Bio', kind: 'textarea', maxLength: 500 },
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
  faq: {
    label: 'FAQ',
    kind: 'array',
    itemLabel: "question",
    fields: {
      question: { label: 'Question', kind: 'text', maxLength: 160, required: true },
      answer: { label: 'Answer', kind: 'textarea', maxLength: 800, required: true },
    },
  },
};

export { settingsEditorMeta } from '../restaurant-v1/editor-meta';
