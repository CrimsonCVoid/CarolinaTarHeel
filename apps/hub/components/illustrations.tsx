'use client';

/*
 * MOTION.md §6.3 — single-line drawings, stroke 1.5px in brand-700.
 * No fills, color via line weight only. Drawn in via stroke-dasharray on
 * first viewport entry. Permanent state after — no loops, no exceptions
 * (the mailbox flag in §4.6 is its own choreographed exception, below).
 *
 * These three are the three empty states we ship today: dashboard with no
 * sites, media library empty, form-submissions empty. UNC art student
 * commission for the rest of the vocabulary (compass, ruler, lighthouse,
 * pier, dogwood, etc.) is tracked separately.
 */

const PATH_BASE = 'fill-none stroke-brand-700 [stroke-width:1.5] [stroke-linecap:round] [stroke-linejoin:round]';

export function SaplingIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden className={className} role="img">
      {/* Pot */}
      <path
        d="M28 56 L52 56 L48 72 L32 72 Z"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:120] motion-safe:[stroke-dashoffset:120] motion-safe:animate-[thw-draw_var(--dur-deliberate)_var(--ease-out-quint)_both]`}
      />
      {/* Stem */}
      <path
        d="M40 56 L40 28"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:32] motion-safe:[stroke-dashoffset:32] motion-safe:animate-[thw-draw_var(--dur-medium)_var(--ease-out-quint)_300ms_both]`}
      />
      {/* Needles */}
      <path
        d="M40 32 L30 24 M40 32 L50 24 M40 38 L26 32 M40 38 L54 32 M40 44 L28 40 M40 44 L52 40"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:80] motion-safe:[stroke-dashoffset:80] motion-safe:animate-[thw-draw_var(--dur-slow)_var(--ease-out-quint)_500ms_both]`}
      />
    </svg>
  );
}

export function EmptyFrameIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden className={className} role="img">
      {/* Frame */}
      <rect
        x="14"
        y="18"
        width="52"
        height="44"
        rx="2"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:200] motion-safe:[stroke-dashoffset:200] motion-safe:animate-[thw-draw_var(--dur-deliberate)_var(--ease-out-quint)_both]`}
      />
      {/* Mountain inside */}
      <path
        d="M22 52 L34 38 L42 46 L52 32 L58 52"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:80] motion-safe:[stroke-dashoffset:80] motion-safe:animate-[thw-draw_var(--dur-slow)_var(--ease-out-quint)_400ms_both]`}
      />
      {/* Sun */}
      <circle
        cx="48"
        cy="30"
        r="3"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:20] motion-safe:[stroke-dashoffset:20] motion-safe:animate-[thw-draw_var(--dur-medium)_var(--ease-out-quint)_700ms_both]`}
      />
    </svg>
  );
}

export function EmptyMailboxIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden className={className} role="img">
      {/* Post */}
      <path
        d="M40 72 L40 50"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:24] motion-safe:[stroke-dashoffset:24] motion-safe:animate-[thw-draw_var(--dur-medium)_var(--ease-out-quint)_both]`}
      />
      {/* Box */}
      <path
        d="M22 50 H58 V36 H22 Z M22 36 Q22 26 32 26 H48 Q58 26 58 36"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:160] motion-safe:[stroke-dashoffset:160] motion-safe:animate-[thw-draw_var(--dur-deliberate)_var(--ease-out-quint)_200ms_both]`}
      />
      {/* Slot */}
      <path
        d="M28 42 H38"
        className={`${PATH_BASE} motion-safe:[stroke-dasharray:12] motion-safe:[stroke-dashoffset:12] motion-safe:animate-[thw-draw_var(--dur-fast)_var(--ease-out-quint)_900ms_both]`}
      />
      {/* Flag — animates up/down on a slow cycle (the §4.6 exception). */}
      <g className="origin-[60px_38px] motion-safe:animate-[thw-flag-wave_8s_ease-in-out_infinite]">
        <path
          d="M60 38 L60 28 L68 32 L60 36"
          className={`${PATH_BASE} motion-safe:[stroke-dasharray:30] motion-safe:[stroke-dashoffset:30] motion-safe:animate-[thw-draw_var(--dur-medium)_var(--ease-out-quint)_1100ms_both]`}
        />
      </g>
    </svg>
  );
}
