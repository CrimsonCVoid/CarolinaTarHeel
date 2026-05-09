import * as React from 'react';
import { cn } from './cn';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400',
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
Textarea.displayName = 'Textarea';
