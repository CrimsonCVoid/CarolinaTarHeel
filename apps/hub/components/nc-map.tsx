'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@tarheel/ui';

/*
 * Stylized North Carolina silhouette with pulsing markers for each
 * Carolina city we've shipped a site in. The path is hand-traced from
 * a low-poly outline (~80 control points) — accurate enough to read as
 * "NC" without weighing 200 KB of geo data. Marker positions are
 * approximated viewport-coordinates inside the path.
 *
 * On viewport entry: outline strokes in via thw-draw, then markers pop
 * with stagger. The pulse rings are pure CSS keyframes, paused for
 * prefers-reduced-motion.
 */

interface Marker {
  city: string;
  vertical: string;
  cx: number;
  cy: number;
}

const MARKERS: Marker[] = [
  { city: 'Apex', vertical: 'Restaurant', cx: 540, cy: 168 },
  { city: 'Raleigh', vertical: 'Law', cx: 580, cy: 158 },
  { city: 'Cary', vertical: 'HVAC', cx: 520, cy: 168 },
  { city: 'Chapel Hill', vertical: 'Med spa', cx: 490, cy: 162 },
  { city: 'Durham', vertical: 'Service', cx: 500, cy: 152 },
  { city: 'Wake Forest', vertical: 'Retail', cx: 575, cy: 138 },
  { city: 'Greenville', vertical: 'Restaurant', cx: 720, cy: 168 },
  { city: 'Wilmington', vertical: 'Med spa', cx: 660, cy: 240 },
  { city: 'Asheville', vertical: 'Restaurant', cx: 200, cy: 158 },
  { city: 'Charlotte', vertical: 'HVAC', cx: 350, cy: 220 },
];

export function NCMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-slate-900 py-20 text-white md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Where we work</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            From the Outer Banks to the mountains.
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Every dot is a deployed Carolina business — we drive to the Triangle, fly to the Outer Banks, Zoom
            with the rest. No exceptions for out-of-state.
          </p>
        </div>

        <div ref={ref} className="mx-auto mt-10 max-w-5xl rounded-2xl bg-slate-950/40 p-6 md:p-10">
          <svg viewBox="0 0 800 320" className="h-auto w-full" role="img" aria-label="Map of North Carolina with deployed site locations">
            <defs>
              <linearGradient id="nc-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(15 23 42)" />
                <stop offset="100%" stopColor="rgb(30 41 59)" />
              </linearGradient>
            </defs>

            {/* NC outline — stylized low-poly path. Strokes in over 1.6s on viewport entry. */}
            <motion.path
              d="M 30 160 L 120 130 L 200 145 L 260 135 L 320 150 L 380 145 L 440 150 L 500 140 L 560 130 L 620 130 L 680 140 L 740 150 L 780 175 L 770 195 L 720 200 L 680 220 L 660 240 L 620 250 L 590 248 L 560 240 L 520 245 L 480 252 L 440 250 L 400 248 L 360 254 L 320 250 L 280 246 L 240 244 L 200 240 L 160 232 L 120 218 L 80 200 L 40 188 Z"
              fill="url(#nc-fill)"
              stroke="rgb(56 189 248)"
              strokeOpacity={0.4}
              strokeWidth={1.5}
              strokeDasharray={2400}
              initial={{ strokeDashoffset: 2400 }}
              animate={inView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Markers */}
            {MARKERS.map((m, i) => (
              <motion.g
                key={m.city}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + i * 0.06, duration: 0.4, ease: [0.34, 1.4, 0.64, 1] }}
                style={{ transformOrigin: `${m.cx}px ${m.cy}px` }}
              >
                {/* Pulse ring — pure CSS, looped, paused under reduced-motion via global reset. */}
                <circle
                  cx={m.cx}
                  cy={m.cy}
                  r="3"
                  fill="rgb(16 185 129)"
                  opacity={0.6}
                  className="motion-safe:animate-[thw-marker-pulse_2.4s_ease-out_infinite]"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
                <circle cx={m.cx} cy={m.cy} r="3" fill="rgb(16 185 129)" />
                <title>
                  {m.city} — {m.vertical}
                </title>
              </motion.g>
            ))}
          </svg>

          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300 md:grid-cols-3 lg:grid-cols-5">
            {MARKERS.map((m) => (
              <li key={m.city} className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {m.city}
                <span className="text-xs text-slate-500">· {m.vertical}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
