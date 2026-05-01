import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const tones = {
  error: {
    cls: 'bg-red-50 text-red-800 border-red-200',
    Icon: AlertCircle,
  },
  success: {
    cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Icon: CheckCircle2,
  },
};

const Alert = ({ tone = 'error', children, className }) => {
  const { cls, Icon } = tones[tone] || tones.error;
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
        cls,
        className
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
};

export default Alert;
