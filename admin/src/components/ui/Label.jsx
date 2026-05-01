import React from 'react';
import { cn } from '@/lib/cn';

const Label = ({ className, ...props }) => (
  <label
    className={cn('block text-sm font-medium text-ink mb-1.5', className)}
    {...props}
  />
);

export default Label;
