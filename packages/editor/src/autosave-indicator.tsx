'use client';

import { useEffect, useState } from 'react';
import { cn } from '@tarheel/ui';

export type AutosaveStatus = 'idle' | 'editing' | 'saving' | 'saved' | 'error';

interface Props {
  status: AutosaveStatus;
  /** Timestamp of last successful save. Used to render relative time. */
  savedAt?: Date | null;
  /** When `status='error'`, an optional message shown after a click on Retry. */
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

/*
 * Autosave indicator — the most important micro-interaction in the editor
 * (MOTION.md §4.2). Color-coded dot + text with cross-fade between states.
 * Saved state ticks a relative-time label every 30s. Error state animates
 * a gentle horizontal shake (--ease-out-quint, 240ms) on first transition
 * via the `thw-shake-gentle` keyframe — communicates concern, not alarm.
 */
export function AutosaveIndicator({ status, savedAt, errorMessage, onRetry, className }: Props) {
  const label = useRelativeTime(savedAt);

  const dotClass = {
    idle: 'bg-slate-300',
    editing: 'bg-slate-400 motion-safe:animate-[thw-pulse-soft_2s_ease-in-out_infinite]',
    saving: 'bg-brand-600',
    saved: 'bg-emerald-500',
    error: 'bg-red-500',
  }[status];

  const text = {
    idle: 'No changes',
    editing: 'Editing…',
    saving: 'Saving…',
    saved: savedAt ? `Saved · ${label}` : 'Saved',
    error: errorMessage ?? "Couldn't save",
  }[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 text-xs text-slate-500 transition-colors duration-[var(--dur-base)] ease-[var(--ease-out-quint)]',
        status === 'error' && 'motion-safe:animate-[thw-shake-gentle_var(--dur-base)_var(--ease-out-quint)]',
        className,
      )}
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span
          className={cn(
            'h-2 w-2 rounded-full transition-colors duration-[var(--dur-base)] ease-[var(--ease-out-quint)]',
            dotClass,
          )}
        />
        {status === 'saving' ? (
          <span className="absolute h-3 w-3 animate-spin rounded-full border border-brand-300 border-t-brand-700" />
        ) : null}
        {status === 'saved' ? <CheckMark /> : null}
      </span>
      <span>{text}</span>
      {status === 'error' && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="font-medium text-red-700 underline-offset-2 hover:underline"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

function CheckMark() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className="absolute h-3 w-3 text-emerald-700 motion-safe:animate-[thw-rise_var(--dur-fast)_var(--ease-out-quint)]"
    >
      <path
        d="M2.5 6.2l2.4 2.4 4.6-4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        strokeDashoffset="0"
        className="motion-safe:animate-[thw-draw-check_var(--dur-base)_var(--ease-out-quint)]"
      />
    </svg>
  );
}

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

function formatRelative(savedAt: Date): string {
  const delta = Date.now() - savedAt.getTime();
  if (delta < 5 * SECOND) return 'just now';
  if (delta < MINUTE) return `${Math.round(delta / SECOND)}s ago`;
  if (delta < HOUR) return `${Math.round(delta / MINUTE)}m ago`;
  return savedAt.toLocaleTimeString();
}

function useRelativeTime(savedAt?: Date | null): string {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!savedAt) return;
    const id = setInterval(() => tick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [savedAt]);
  return savedAt ? formatRelative(savedAt) : '';
}
