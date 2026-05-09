'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@tarheel/ui';

/*
 * Real-shape North Carolina silhouette.
 *
 * Coordinates use a simple equirectangular projection:
 *   x = (WEST - lon)  * SCALE      (lon stored as positive degrees west)
 *   y = (NORTH - lat) * SCALE
 *
 * That maps real lat/lon onto a viewBox we can hand-author. The state's
 * lon range is ~84.3°W → 75.5°W (8.8°), lat range 36.6°N → 33.85°N
 * (2.75°). At SCALE=90.9 px/degree the path is ~800 wide × 250 tall.
 *
 * Outline traces real boundary landmarks clockwise from the NC/VA/TN
 * tri-point (Mountain City area) → straight east along the VA border
 * → Currituck NE corner → bows east at Cape Hatteras (Outer Banks
 * baked into the outline rather than a separate barrier strip) →
 * Cape Lookout → coast curves SW → Cape Fear southward push → west
 * along the SC border with the Charlotte kink → GA/SC tri-point →
 * GA/TN tri-point near Murphy → NE up the Smokies / Blue Ridge to
 * the start.
 *
 * City markers are placed by their actual coordinates — no hand-tuning
 * needed.
 */

const NORTH = 36.6; // y=0 of the projection
const WEST = 84.3; // x=0 of the projection (treat lon as positive)
const SCALE = 90.9; // px per degree

interface Marker {
  city: string;
  vertical: string;
  lat: number;
  lon: number; // positive degrees west (e.g. 78.64 for -78.64°)
}

const MARKERS: Marker[] = [
  { city: 'Apex', vertical: 'Restaurant', lat: 35.73, lon: 78.85 },
  { city: 'Raleigh', vertical: 'Law', lat: 35.78, lon: 78.64 },
  { city: 'Cary', vertical: 'HVAC', lat: 35.79, lon: 78.78 },
  { city: 'Chapel Hill', vertical: 'Med spa', lat: 35.91, lon: 79.05 },
  { city: 'Durham', vertical: 'Service', lat: 35.99, lon: 78.9 },
  { city: 'Wake Forest', vertical: 'Retail', lat: 35.98, lon: 78.51 },
  { city: 'Greensboro', vertical: 'Service', lat: 36.07, lon: 79.79 },
  { city: 'Greenville', vertical: 'Restaurant', lat: 35.61, lon: 77.37 },
  { city: 'Wilmington', vertical: 'Med spa', lat: 34.23, lon: 77.94 },
  { city: 'Asheville', vertical: 'Restaurant', lat: 35.6, lon: 82.55 },
  { city: 'Charlotte', vertical: 'HVAC', lat: 35.23, lon: 80.84 },
];

const project = (lat: number, lon: number) => ({
  x: (WEST - lon) * SCALE,
  y: (NORTH - lat) * SCALE,
});

// Outline path — clockwise from NW tri-point, hand-traced through real
// boundary landmarks. ~50 control points, ~3 KB rendered.
const OUTLINE = [
  'M 237 0', // NC/VA/TN tri-point (Mountain City)
  // VA border running east, mostly straight with a slight wave
  'L 320 2 L 410 4 L 500 4 L 600 4 L 700 4 L 760 4',
  // NE corner at Currituck, then down along the Outer Banks (which bow east)
  'L 778 22 L 790 50 L 798 78',
  'L 808 100', // Cape Hatteras eastern bump
  'L 798 120 L 782 142',
  'L 770 162', // Cape Lookout
  'L 748 182',
  // Mainland coast curving SW
  'L 720 196 L 690 208 L 660 218 L 632 226 L 612 232',
  // Cape Fear southward push
  'L 600 244 L 580 250 L 560 246',
  // SC border running NW with the Charlotte-area kink
  'L 528 240 L 488 234 L 448 228 L 408 222 L 368 215',
  'L 330 207 L 290 197',
  'L 252 184 L 218 174',
  // GA/SC tri-point area
  'L 180 158 L 140 142 L 109 132',
  // Short western leg along GA border
  'L 60 140 L 22 144',
  // GA/TN tri-point near Murphy, then NE up the Smokies / Blue Ridge
  'L 0 144',
  'L 30 122 L 70 96 L 110 70 L 152 46 L 195 24 L 220 10',
  'L 237 0',
  'Z',
].join(' ');

export function NCMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-slate-900 py-20 text-white md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Where we work</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            From the Smokies to the Outer Banks.
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Every dot is a deployed Carolina business. We drive to the Triangle, fly to the coast, Zoom with
            the mountains. No exceptions for out-of-state.
          </p>
        </div>

        <div ref={ref} className="mx-auto mt-10 max-w-5xl rounded-2xl bg-slate-950/40 p-6 md:p-10">
          <svg
            viewBox="-15 -20 840 290"
            className="h-auto w-full"
            role="img"
            aria-label="Map of North Carolina with deployed site locations"
          >
            <defs>
              <linearGradient id="nc-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(15 23 42)" />
                <stop offset="100%" stopColor="rgb(30 41 59)" />
              </linearGradient>
              <filter id="nc-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* State silhouette — strokes in via stroke-dashoffset on
                viewport entry. */}
            <motion.path
              d={OUTLINE}
              fill="url(#nc-fill)"
              stroke="rgb(56 189 248)"
              strokeOpacity={0.5}
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeDasharray={3000}
              initial={{ strokeDashoffset: 3000 }}
              animate={inView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Markers — placed by real lat/lon. */}
            {MARKERS.map((m, i) => {
              const { x, y } = project(m.lat, m.lon);
              return (
                <motion.g
                  key={m.city}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.4 + i * 0.06, duration: 0.4, ease: [0.34, 1.4, 0.64, 1] }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={3}
                    fill="rgb(16 185 129)"
                    opacity={0.55}
                    className="motion-safe:animate-[thw-marker-pulse_2.4s_ease-out_infinite]"
                    style={{ animationDelay: `${i * 220}ms` }}
                  />
                  <circle cx={x} cy={y} r={3} fill="rgb(16 185 129)" filter="url(#nc-glow)" />
                  <title>
                    {m.city} — {m.vertical}
                  </title>
                </motion.g>
              );
            })}
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
