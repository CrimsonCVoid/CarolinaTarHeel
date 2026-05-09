'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { env } from '@/lib/env';

const Lead = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  business: z.string().max(120).optional(),
  tier: z.enum(['', 'starter', 'standard', 'premium']).optional(),
  message: z.string().max(2000).optional(),
});

export async function submitLead(input: z.infer<typeof Lead>) {
  const parsed = Lead.parse(input);
  if (env.RESEND_API_KEY && env.RESEND_FROM_EMAIL) {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: env.RESEND_FROM_EMAIL,
      reply_to: parsed.email,
      subject: `New lead: ${parsed.name}${parsed.business ? ` (${parsed.business})` : ''}`,
      text: [
        `Name: ${parsed.name}`,
        `Email: ${parsed.email}`,
        `Phone: ${parsed.phone ?? '—'}`,
        `Business: ${parsed.business ?? '—'}`,
        `Tier: ${parsed.tier || 'not sure'}`,
        '',
        parsed.message ?? '(no message)',
      ].join('\n'),
    });
  } else {
    console.warn('[lead] Resend not configured — lead captured but no email sent', parsed);
  }
}
