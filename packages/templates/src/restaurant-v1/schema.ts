import { z } from 'zod';

export const homeContent = z.object({
  hero: z.object({
    headline: z.string().min(1).max(120),
    subheadline: z.string().max(200).optional(),
    backgroundImage: z.string().url().optional(),
    ctaLabel: z.string().max(40).optional(),
    ctaUrl: z.string().optional(),
  }),
  intro: z.object({
    headline: z.string().max(120),
    body: z.string().max(800),
  }),
  featuredMenu: z.object({
    enabled: z.boolean().default(true),
    headline: z.string().max(80).default('From the Kitchen'),
    items: z
      .array(
        z.object({
          name: z.string().max(80),
          description: z.string().max(200).optional(),
          price: z.string().max(20),
          image: z.string().url().optional(),
        }),
      )
      .max(6),
  }),
  press: z.object({
    enabled: z.boolean().default(false),
    logos: z.array(z.string().url()).max(8),
  }),
  testimonials: z
    .array(
      z.object({
        quote: z.string().max(400),
        author: z.string().max(80),
        source: z.string().max(80).optional(),
      }),
    )
    .max(3)
    .optional(),
  finalCta: z.object({
    headline: z.string().max(120),
    label: z.string().max(40),
    url: z.string(),
  }),
});

export const menuPageContent = z.object({
  hero: z.object({
    headline: z.string().max(120),
    note: z.string().max(300).optional(),
  }),
  categories: z
    .array(
      z.object({
        name: z.string().max(80),
        description: z.string().max(300).optional(),
        items: z
          .array(
            z.object({
              name: z.string().max(80),
              description: z.string().max(300).optional(),
              price: z.string().max(20),
              tags: z.array(z.enum(['gf', 'vg', 'v', 'spicy', 'popular'])).optional(),
            }),
          )
          .max(50),
      }),
    )
    .max(20),
});

export const aboutPageContent = z.object({
  hero: z.object({
    headline: z.string().max(120),
    subheadline: z.string().max(200).optional(),
  }),
  story: z.object({
    headline: z.string().max(120),
    body: z.string().max(2000),
    image: z.string().url().optional(),
  }),
  values: z
    .array(
      z.object({
        headline: z.string().max(80),
        body: z.string().max(300),
      }),
    )
    .max(4)
    .optional(),
});

export const contactPageContent = z.object({
  hero: z.object({
    headline: z.string().max(120),
    subheadline: z.string().max(200).optional(),
  }),
  formHeadline: z.string().max(80).default('Send us a note'),
  showMap: z.boolean().default(true),
  faq: z
    .array(
      z.object({
        question: z.string().max(160),
        answer: z.string().max(800),
      }),
    )
    .max(8)
    .optional(),
});

export type HomeContent = z.infer<typeof homeContent>;
export type MenuPageContent = z.infer<typeof menuPageContent>;
export type AboutPageContent = z.infer<typeof aboutPageContent>;
export type ContactPageContent = z.infer<typeof contactPageContent>;
