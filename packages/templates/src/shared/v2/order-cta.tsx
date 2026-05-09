import { cn } from '@tarheel/ui';
import { ArrowUpRight } from 'lucide-react';

interface OrderCTAProps {
  toastUrl?: string;
  variant?: 'primary' | 'inline' | 'hero';
  label?: string;
  egiftUrl?: string;
}

export function OrderCTA({
  toastUrl,
  variant = 'primary',
  label,
  egiftUrl,
}: OrderCTAProps): JSX.Element | null {
  if (!toastUrl) return null;
  const text = label ?? 'Order online';

  const baseFocus =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';

  if (variant === 'inline') {
    return (
      <a
        href={toastUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 hover:bg-brand-100',
          baseFocus,
        )}
      >
        {text}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    );
  }

  const buttonClasses =
    variant === 'hero'
      ? 'inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-100'
      : 'inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 text-base font-semibold text-white shadow-sm hover:bg-brand-700';

  return (
    <div className="inline-flex flex-col items-start gap-1.5">
      <a
        href={toastUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonClasses, baseFocus)}
      >
        {text}
        <span aria-hidden>→</span>
      </a>
      <p
        className={cn(
          'text-xs',
          variant === 'hero' ? 'text-white/80' : 'text-slate-500',
        )}
      >
        Continues on Toast in a new tab.
      </p>
      {egiftUrl ? (
        <a
          href={egiftUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'text-xs font-medium underline-offset-2 hover:underline',
            variant === 'hero' ? 'text-white/90' : 'text-slate-600 hover:text-brand-700',
            baseFocus,
          )}
        >
          Buy a gift card
        </a>
      ) : null}
    </div>
  );
}
