import * as React from 'react';
import { cn } from './cn.js';

export function Badge({
  className,
  variant = 'default',
  ...p
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warning' | 'danger' | 'muted' }) {
  const variants: Record<string, string> = {
    default: 'bg-brand-100 text-brand-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    muted: 'bg-slate-100 text-slate-700',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...p}
    />
  );
}
