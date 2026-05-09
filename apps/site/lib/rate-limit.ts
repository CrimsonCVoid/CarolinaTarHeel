import { LRUCache } from './lru.js';

const buckets = new LRUCache<string, { count: number; resetAt: number }>(2000);

/**
 * In-memory IP rate limit. Per-instance only — for global limits across
 * Vercel regions, swap to Upstash Redis. TODO before public scale.
 */
export function rateLimit(key: string, opts: { windowMs: number; max: number }): {
  ok: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + opts.windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: opts.max - 1, resetAt: fresh.resetAt };
  }
  entry.count += 1;
  buckets.set(key, entry);
  return {
    ok: entry.count <= opts.max,
    remaining: Math.max(0, opts.max - entry.count),
    resetAt: entry.resetAt,
  };
}
