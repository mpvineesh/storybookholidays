import React from 'react';
import { cn } from '@/lib/cn';

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink',
      'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
      'disabled:bg-slate-50 disabled:cursor-not-allowed',
      'transition-colors',
      className
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = 'Select';

export default Select;
