import * as React from 'react';
import { cn } from './cn';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400',
        // Focus + bg-warm token wiring (MOTION.md §4.3)
        'transition-[background-color,border-color,outline-color] duration-[var(--dur-fast)] ease-[var(--ease-out-quint)]',
        'focus-visible:bg-brand-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
        'aria-invalid:border-red-400 aria-invalid:focus-visible:outline-red-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
