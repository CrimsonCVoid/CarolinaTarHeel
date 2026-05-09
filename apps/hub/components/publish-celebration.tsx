'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type PublishStage = 'idle' | 'saving' | 'updating' | 'verifying' | 'done' | 'error';

interface Props {
  stage: PublishStage;
  /** Public site URL to surface in the success toast (e.g., joespizza.com). */
  liveUrl?: string;
  errorMessage?: string;
  onDismiss?: () => void;
}

const STEPS: Array<{ id: PublishStage; label: string }> = [
  { id: 'saving', label: 'Saving content' },
  { id: 'updating', label: 'Updating live site' },
  { id: 'verifying', label: 'Verifying' },
];

const STEP_ORDER: Record<PublishStage, number> = {
  idle: 0,
  saving: 1,
  updating: 2,
  verifying: 3,
  done: 4,
  error: 4,
};

/*
 * Publish flow choreography (MOTION.md §4.5).
 *
 *  - Renders a small progress card during stages 'saving' → 'verifying'.
 *  - On 'done', collapses into a bottom-right success toast and fires a
 *    short confetti burst (12 dots in brand / emerald / amber, drift up
 *    80px, fade 800ms). Confetti is the *only* place we fire celebratory
 *    motion in the product — reserved for publish, never for save/draft.
 *  - On 'error', the card transforms in place into a red error state.
 */
export function PublishCelebration({ stage, liveUrl, errorMessage, onDismiss }: Props) {
  const [showConfetti, setShowConfetti] = useState(false);
  const lastStageRef = useRef<PublishStage>('idle');

  useEffect(() => {
    if (stage === 'done' && lastStageRef.current !== 'done') {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 900);
      lastStageRef.current = stage;
      return () => clearTimeout(t);
    }
    lastStageRef.current = stage;
  }, [stage]);

  return (
    <AnimatePresence>
      {(stage === 'saving' || stage === 'updating' || stage === 'verifying' || stage === 'error') && (
        <motion.div
          key="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.16 } }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
          role="status"
          aria-live="polite"
        >
          {stage === 'error' ? (
            <div>
              <p className="text-sm font-semibold text-red-700">Publish failed</p>
              <p className="mt-1 text-xs text-slate-600">{errorMessage ?? 'Unknown error.'}</p>
              <button
                type="button"
                onClick={onDismiss}
                className="mt-3 text-xs font-medium text-slate-700 hover:text-brand-700"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-900">Publishing…</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {STEPS.map((step) => {
                  const reached = STEP_ORDER[stage] > STEPS.findIndex((s) => s.id === step.id);
                  const active = stage === step.id;
                  return (
                    <li key={step.id} className="flex items-center gap-2">
                      <span className="relative inline-flex h-4 w-4 items-center justify-center">
                        {reached ? (
                          <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
                        ) : active ? (
                          <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                        )}
                      </span>
                      <span className={reached ? 'text-slate-900' : 'text-slate-600'}>{step.label}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </motion.div>
      )}

      {stage === 'done' && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.16 } }}
          transition={{ duration: 0.32, ease: [0.34, 1.4, 0.64, 1] }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-lg"
          role="status"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-4 w-4 text-emerald-700" strokeWidth={3} />
          </span>
          <div className="text-sm">
            <p className="font-semibold text-slate-900">Published</p>
            {liveUrl ? (
              <a
                href={`https://${liveUrl}`}
                target="_blank"
                rel="noopener"
                className="text-xs text-brand-700 hover:underline"
              >
                View live site ↗
              </a>
            ) : null}
          </div>
        </motion.div>
      )}

      {showConfetti && <ConfettiBurst key="confetti" />}
    </AnimatePresence>
  );
}

/*
 * 12 dots, three colors, drift up 80px while fading. Anchored to the
 * bottom-right where the toast will land — feels like the toast emits them.
 * Pure DOM transforms, no canvas, ~600 bytes after gzip.
 */
function ConfettiBurst() {
  const dots = Array.from({ length: 12 });
  const colors = ['bg-brand-600', 'bg-emerald-500', 'bg-amber-400'];
  return (
    <div className="pointer-events-none fixed bottom-12 right-16 z-50">
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const dx = Math.cos(angle) * (40 + (i % 3) * 12);
        const dy = -(60 + (i % 4) * 12);
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute block h-1.5 w-1.5 rounded-full ${colors[i % colors.length]}`}
          />
        );
      })}
    </div>
  );
}
