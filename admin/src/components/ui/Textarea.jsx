import React from 'react';
import { cn } from '@/lib/cn';

const Textarea = React.forwardRef(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink',
      'placeholder:text-ink-subtle',
      'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
      'disabled:bg-slate-50 disabled:cursor-not-allowed',
      'transition-colors',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

export default Textarea;
