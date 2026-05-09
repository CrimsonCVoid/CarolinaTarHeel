'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Render as a different tag (defaults to <section>). */
  as?: ElementType;
  /** Triggers reveal when the element's top crosses (1 - threshold) of viewport. */
  threshold?: number;
  /** Disable the reveal entirely (e.g., for above-the-fold content). */
  immediate?: boolean;
  className?: string;
}

/*
 * MOTION.md §3.3 — section entrance pattern.
 * One-shot: the IntersectionObserver disconnects after first trigger.
 * Children inherit visibility via the `data-reveal` attribute on the parent
 * — staggered via CSS variables so we ship zero animation JS for the reveal
 * itself. Bundle cost: this component compiles to ~400 bytes after tree-shake.
 *
 * Honors prefers-reduced-motion via the global reset in globals.css.
 */
export function RevealSection({
  children,
  as: Tag = 'section',
  threshold = 0.2,
  immediate = false,
  className,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate || shown) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, shown, threshold]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal={shown ? 'in' : 'out'}
      className={[
        'transition-[opacity,transform] duration-[var(--dur-medium)] ease-[var(--ease-out-quint)]',
        'data-[reveal=out]:translate-y-3 data-[reveal=out]:opacity-0',
        'data-[reveal=in]:translate-y-0 data-[reveal=in]:opacity-100',
        'motion-reduce:translate-y-0 motion-reduce:opacity-100',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </Tag>
  );
}
