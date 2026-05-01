import React from 'react';
import { cn } from '@/lib/cn';

const tones = {
  default: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
};

const Badge = ({ tone = 'default', className, children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      tones[tone] || tones.default,
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
