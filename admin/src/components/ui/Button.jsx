import React from 'react';
import { cn } from '@/lib/cn';

const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700 disabled:bg-brand-600/50',
  secondary:
    'bg-white text-ink border border-border hover:bg-slate-50 disabled:opacity-60',
  ghost: 'bg-transparent text-ink hover:bg-slate-100 disabled:opacity-60',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-700 disabled:bg-red-600/50',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

const Button = React.forwardRef(
  (
    { className, variant = 'primary', size = 'md', children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
