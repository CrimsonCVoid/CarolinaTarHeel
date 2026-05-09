'use client';

import { motion } from 'framer-motion';
import { TickerNumber } from '@/components/ui/ticker-number';

interface Props {
  target: number;
  shown: boolean;
  startDelay?: number;
}

/*
 * SVG ring + center number. Ring fills clockwise via stroke-dashoffset
 * over 1.2s while a TickerNumber rAF-animates the score. Color shifts
 * to green/amber/red based on the standard Lighthouse thresholds.
 */
export function LighthouseRing({ target, shown, startDelay = 0 }: Props) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const color =
    target >= 90 ? 'var(--color-success-700)' : target >= 50 ? 'var(--color-warning-600)' : 'var(--color-danger-600)';

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.18)" strokeWidth="6" fill="none" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={shown ? { strokeDashoffset: circumference * (1 - target / 100) } : {}}
          transition={{ duration: 1.2, delay: startDelay / 1000, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="text-center">
        <div className="font-display text-2xl font-semibold leading-none text-white">
          <TickerNumber value={target} duration={1200} delay={startDelay} shown={shown} />
        </div>
        <div className="mt-1 text-[9px] font-medium uppercase tracking-wider text-white/80">Lighthouse</div>
      </div>
    </div>
  );
}
