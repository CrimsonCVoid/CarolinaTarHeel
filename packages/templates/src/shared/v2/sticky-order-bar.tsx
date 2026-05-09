'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { cn } from '@tarheel/ui';

interface StickyOrderBarProps {
  toastUrl?: string;
  label?: string;
}

const DISMISS_KEY = 'thw:v2:sticky-order-bar:dismissed';

export function StickyOrderBar({ toastUrl, label }: StickyOrderBarProps): JSX.Element | null {
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === '1') {
        setDismissed(true);
      }
    } catch {
      // sessionStorage may be unavailable (SSR / privacy mode); ignore.
    }
  }, []);

  if (!toastUrl || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(DISMISS_KEY, '1');
      } catch {
        // ignore
      }
    }
  };

  const text = label ?? 'Order online';

  return (
    <div
      role="region"
      aria-label="Order online"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-2xl md:hidden',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
      )}
    >
      <div className="flex items-center gap-3">
        <a
          href={toastUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 text-base font-semibold text-white hover:bg-brand-700',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
          )}
        >
          {text}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss order bar"
          className={cn(
            'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
          )}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
