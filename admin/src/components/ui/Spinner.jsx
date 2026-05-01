import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const Spinner = ({ size = 18, className }) => (
  <Loader2 size={size} className={cn('animate-spin text-ink-muted', className)} />
);

export default Spinner;
