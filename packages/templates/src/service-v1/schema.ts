import { z } from 'zod';

export const homeContent = z.object({
  hero: z.object({
    headline: z.string().min(1).max(120),
    subheadline: z.string().max(200).optional(),
    backgroundImage: z.string().url().optional(),
    primaryCta: z.object({ label: z.string().max(40), url: z.string() }).optional(),
    emergencyPhone: z.string().max(40).optional(),
  }),
  trustBar: z.object({
    items: z
      .array(
        z.object({
          headline: z.string().max(60),
          body: z.string().max(140).optional(),
        }),
      )
      .max(4),
  }),
  servicesIntro: z.object({
    headline: z.string().max(120),
    body: z.string().max(800).optional(),
  }),
  services: z
    .array(
      z.object({
        name: z.string().max(80),
        body: z.string().max(300),
        icon: z.enum(['wrench', 'flame', 'snowflake', 'droplet', 'bolt', 'leaf']).default('wrench'),
        url: z.string().optional(),
      }),
    )
    .max(8),
  serviceAreasTeaser: z.object({
    headline: z.string().max(120),
    body: z.string().max(400).optional(),
    primaryAreas: z.array(z.string().max(60)).max(12),
  }),
  testimonials: z
    .array(
      z.object({
        quote: z.string().max(400),
        author: z.string().max(80),
        rating: z.number().int().min(1).max(5).optional(),
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

export const servicesPageContent = z.object({
  hero: z.object({
    headline: z.string().max(120),
    subheadline: z.string().max(200).optional(),
  }),
  services: z
    .array(
      z.object({
        name: z.string().max(80),
        body: z.string().max(800),
        bullets: z.array(z.string().max(120)).max(8).optional(),
        image: z.string().url().optional(),
      }),
    )
    .max(20),
});

export const areasPageContent = z.object({
  hero: z.object({
    headline: z.string().max(120),
    subheadline: z.string().max(200).optional(),
  }),
  areas: z
    .array(
      z.object({
        name: z.string().max(60),
        zip: z.string().max(20).optional(),
      }),
    )
    .max(40),
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
  team: z
    .array(
      z.object({
        name: z.string().max(80),
        role: z.string().max(80),
        photo: z.string().url().optional(),
        bio: z.string().max(500).optional(),
      }),
    )
    .max(8)
    .optional(),
});

export const contactPageContent = z.object({
  hero: z.object({
    headline: z.string().max(120),
    subheadline: z.string().max(200).optional(),
  }),
  formHeadline: z.string().max(80).default('Request service'),
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
export type ServicesPageContent = z.infer<typeof servicesPageContent>;
export type AreasPageContent = z.infer<typeof areasPageContent>;
export type AboutPageContent = z.infer<typeof aboutPageContent>;
export type ContactPageContent = z.infer<typeof contactPageContent>;
