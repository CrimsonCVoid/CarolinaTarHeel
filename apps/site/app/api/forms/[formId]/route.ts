import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { z } from 'zod';
import { env } from '@/lib/env';
import { siteSupabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';

const RAW_FIELD_SCHEMA = z.record(z.string(), z.union([z.string(), z.array(z.string()), z.boolean(), z.number()]));

interface RouteContext {
  params: Promise<{ formId: string }>;
}

export async function POST(req: Request, ctx: RouteContext) {
  const { formId } = await ctx.params;
  if (!/^[a-z0-9_-]{1,40}$/i.test(formId)) {
    return Response.json({ error: 'Invalid form id' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const ua = req.headers.get('user-agent') ?? null;

  const limit = rateLimit(`forms:${env.SITE_ID}:${ip ?? 'unknown'}`, { windowMs: 60_000, max: 5 });
  if (!limit.ok) return Response.json({ error: 'Too many requests' }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = RAW_FIELD_SCHEMA.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid payload' }, { status: 400 });

  // Honeypot
  if (typeof parsed.data['website'] === 'string' && parsed.data['website'].length > 0) {
    return Response.json({ ok: true });
  }

  // Turnstile (optional)
  const turnstileToken = typeof parsed.data['cf-turnstile-response'] === 'string'
    ? (parsed.data['cf-turnstile-response'] as string)
    : null;
  if (env.TURNSTILE_SECRET_KEY && !(await verifyTurnstile(turnstileToken, ip))) {
    return Response.json({ error: 'Verification failed' }, { status: 403 });
  }

  const ipHash = ip ? createHash('sha256').update(ip).digest('hex') : null;

  const supabase = siteSupabase();
  const { error } = await supabase.from('form_submissions').insert({
    site_id: env.SITE_ID,
    form_id: formId,
    data: parsed.data,
    ip_hash: ipHash,
    user_agent: ua,
    status: 'new',
  });
  if (error) {
    console.error('form insert failed', error);
    return Response.json({ error: 'Storage failed' }, { status: 500 });
  }

  if (env.RESEND_API_KEY && env.FORM_NOTIFICATION_EMAIL && env.RESEND_FROM_EMAIL) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.FORM_NOTIFICATION_EMAIL,
        subject: `New ${formId} submission`,
        text: Object.entries(parsed.data)
          .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
          .join('\n'),
      });
    } catch (e) {
      console.warn('Resend notify failed (non-fatal):', e);
    }
  }

  return Response.json({ ok: true });
}
