import * as React from 'react';
import { cn } from './cn.js';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium leading-none text-slate-900 peer-disabled:opacity-50', className)}
      {...props}
    />
  ),
);
Label.displayName = 'Label';
