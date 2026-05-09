'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  /** Where to start counting from. Defaults to 0. */
  from?: number;
  /** ms. Default 1200. */
  duration?: number;
  /** Decimal places. Default 0 (integer). */
  decimals?: number;
  /** Begin animating only when shown=true. Default true. */
  shown?: boolean;
  /** Optional ms delay after `shown` flips true. */
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Format with thousands separators (4,200). Default false. */
  thousands?: boolean;
}

/*
 * Ticker number using requestAnimationFrame — ~400 bytes, no library.
 * Used in metric badges, the Lighthouse counter, the math callout, and
 * the case-study before→after counters (FRONTPAGE.md §4 inventory).
 *
 * Honors prefers-reduced-motion: snaps to the final value immediately
 * with no animation.
 */
export function TickerNumber({
  value,
  from = 0,
  duration = 1200,
  decimals = 0,
  shown = true,
  delay = 0,
  prefix,
  suffix,
  className,
  thousands = false,
}: Props) {
  const [display, setDisplay] = useState(from);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!shown || startedRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(value);
      startedRef.current = true;
      return;
    }
    const startTimer = setTimeout(() => {
      startedRef.current = true;
      const t0 = performance.now();
      let raf = 0;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        // ease-out-expo per MOTION.md
        const eased = 1 - Math.pow(2, -10 * t);
        setDisplay(from + (value - from) * eased);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [shown, value, from, duration, delay]);

  const formatted = thousands
    ? display.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
    : display.toFixed(decimals);

  return (
    <span className={className} aria-label={`${prefix ?? ''}${value}${suffix ?? ''}`}>
      {prefix}
      <span>{formatted}</span>
      {suffix}
    </span>
  );
}
