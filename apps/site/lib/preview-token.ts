import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

interface TokenPayload {
  siteId: string;
  exp: number;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

export function signPreviewToken(siteId: string, ttlSeconds = 60 * 30): string {
  const payload: TokenPayload = { siteId, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac('sha256', env.PREVIEW_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyPreviewToken(token: string): TokenPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', env.PREVIEW_SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.siteId !== env.SITE_ID) return null;
    return payload;
  } catch {
    return null;
  }
}
