import React from 'react';
import { cn } from '@/lib/cn';

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink',
      'placeholder:text-ink-subtle',
      'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
      'disabled:bg-slate-50 disabled:cursor-not-allowed',
      'transition-colors',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
