'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { createBrowserClient } from '@/lib/supabase/browser';

interface Props {
  posthogKey?: string;
  posthogHost?: string;
  children: React.ReactNode;
}

/*
 * Client analytics bootstrap. Initializes PostHog once, identifies the
 * Supabase user from the browser session, and tracks pageviews on every
 * Next App Router pathname change. Wraps Vercel Analytics too — Web
 * Vitals + traffic baseline regardless of PostHog config.
 *
 * Both providers no-op gracefully when their env vars aren't set.
 */
export function AnalyticsProvider({ posthogKey, posthogHost, children }: Props) {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null);

  // PostHog one-time init.
  useEffect(() => {
    if (!posthogKey || typeof window === 'undefined') return;
    if (posthog.__loaded) return;
    posthog.init(posthogKey, {
      api_host: posthogHost ?? 'https://us.i.posthog.com',
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: 'identified_only',
      autocapture: false,
      session_recording: { recordCrossOriginIframes: false },
    });
  }, [posthogKey, posthogHost]);

  // Subscribe to Supabase auth state for identify/reset.
  useEffect(() => {
    const supabase = createBrowserClient();
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const u = data.user;
      setUser(u ? { id: u.id, email: u.email ?? null } : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email ?? null } : null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!posthogKey || typeof window === 'undefined') return;
    if (user) {
      posthog.identify(user.id, user.email ? { email: user.email } : undefined);
    } else {
      posthog.reset();
    }
  }, [posthogKey, user]);

  return (
    <>
      {/*
       * PageviewTracker uses useSearchParams which forces a Suspense
       * boundary at build time (per Next's static-route bail-out rule).
       * Wrapping it here lets the rest of the app stay statically
       * prerenderable.
       */}
      {posthogKey ? (
        <Suspense fallback={null}>
          <PageviewTracker />
        </Suspense>
      ) : null}
      {children}
      <VercelAnalytics />
    </>
  );
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    posthog.capture('$pageview', { $current_url: window.location.origin + url });
  }, [pathname, searchParams]);
  return null;
}

/*
 * Public helper for ad-hoc client-side events. Safe to call from any
 * client component — no-ops if PostHog isn't initialized.
 */
export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    posthog.capture(event, properties);
  } catch {
    // PostHog not initialized — silent no-op.
  }
}
