import 'server-only';
import { PostHog } from 'posthog-node';
import { env } from './env';

/*
 * Server-side analytics. Wraps posthog-node so callers don't need to
 * worry about SDK availability or env-var presence — everything no-ops
 * when keys are missing, which is the correct behavior for development
 * and for self-hosted clients who haven't wired their own PostHog.
 *
 * Use a single shared client per process (PostHog buffers events and
 * flushes on a timer; spawning new clients per call leaks memory and
 * drops the buffer).
 */

let _client: PostHog | null = null;

function client(): PostHog | null {
  const key = env.POSTHOG_SERVER_KEY ?? env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!_client) {
    _client = new PostHog(key, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      // Vercel functions are short-lived; flush quickly so events ship before
      // the function freezes.
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return _client;
}

interface BaseProps {
  /** Stable user identifier — Supabase user.id when available, else
   *  an anonymous distinct_id from a cookie. */
  distinctId: string;
  /** Per-event payload. */
  properties?: Record<string, unknown>;
  /** Group analytics — usually the org_id so events can be rolled up
   *  per Carolina business. */
  groups?: { organization?: string; site?: string };
}

export async function track(event: string, { distinctId, properties, groups }: BaseProps): Promise<void> {
  const c = client();
  if (!c) return;
  c.capture({
    distinctId,
    event,
    properties: { ...properties, $process_person_profile: true },
    groups,
  });
  // Wait for the flush so the lambda doesn't terminate before send. Catches
  // network errors silently — analytics must never break the user-facing
  // request.
  try {
    await c.flush();
  } catch {
    // ignore
  }
}

export async function identify(
  distinctId: string,
  properties: Record<string, unknown>,
): Promise<void> {
  const c = client();
  if (!c) return;
  c.identify({ distinctId, properties });
  try {
    await c.flush();
  } catch {
    // ignore
  }
}

export async function groupIdentify(
  groupType: 'organization' | 'site',
  groupKey: string,
  properties: Record<string, unknown>,
): Promise<void> {
  const c = client();
  if (!c) return;
  c.groupIdentify({ groupType, groupKey, properties });
  try {
    await c.flush();
  } catch {
    // ignore
  }
}
