import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SITE_ID: z.string().uuid(),
  REVALIDATION_SECRET: z.string().min(32),
  PREVIEW_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  FORM_NOTIFICATION_EMAIL: z.string().email().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
});

export const env = schema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SITE_ID: process.env.SITE_ID,
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
  PREVIEW_SECRET: process.env.PREVIEW_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  FORM_NOTIFICATION_EMAIL: process.env.FORM_NOTIFICATION_EMAIL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
});
