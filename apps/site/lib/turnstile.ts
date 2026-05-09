import { env } from './env.js';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true; // not configured — skip
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as TurnstileResponse;
  return data.success === true;
}
