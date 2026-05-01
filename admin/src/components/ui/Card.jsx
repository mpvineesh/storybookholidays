import React from 'react';
import { cn } from '@/lib/cn';

export const Card = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-border bg-white shadow-card',
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('p-6 pb-4', className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h2
    className={cn('text-lg font-semibold text-ink', className)}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p
    className={cn('mt-1 text-sm text-ink-muted', className)}
    {...props}
  />
);

export const CardBody = ({ className, ...props }) => (
  <div className={cn('p-6 pt-2', className)} {...props} />
);

export default Card;
