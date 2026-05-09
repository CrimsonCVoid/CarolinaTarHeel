import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

/*
 * Press feedback (MOTION.md §7.1):
 *   active:scale(0.97) for the duration of the press, returning via
 *   --ease-out-back over --dur-base. CSS-only, costs nothing.
 *   `motion-reduce:transition-none` collapses to instant when the user
 *   prefers reduced motion (the global reset in globals.css also catches it).
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium',
    'transition-[background-color,color,border-color,transform,box-shadow]',
    'duration-[var(--dur-fast)] ease-[var(--ease-out-quint)]',
    'active:scale-[0.97] active:duration-[var(--dur-instant)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
    'disabled:pointer-events-none disabled:opacity-50',
    'motion-reduce:transition-none motion-reduce:active:scale-100',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-brand-600 text-white hover:bg-brand-700',
        outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
        ghost: 'text-slate-900 hover:bg-slate-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-brand-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
