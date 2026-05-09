import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

interface TokenPayload {
  siteId: string;
  exp: number;
}

export function signPreviewToken(siteId: string, secret: string, ttlSeconds = 60 * 30): string {
  const payload: TokenPayload = { siteId, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyPreviewToken(token: string, expectedSiteId: string, secret: string): boolean {
  const [body, sig] = token.split('.');
  if (!body || !sig) return false;
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.siteId !== expectedSiteId) return false;
    return true;
  } catch {
    return false;
  }
}
