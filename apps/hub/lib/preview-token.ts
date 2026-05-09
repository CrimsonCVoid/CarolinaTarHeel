import 'server-only';
import { createHmac } from 'node:crypto';

export function signPreviewToken(siteId: string, secret: string, ttlSeconds = 60 * 30): string {
  const payload = { siteId, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}
