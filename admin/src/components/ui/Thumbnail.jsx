import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

const Thumbnail = ({ src, alt, size = 'h-10 w-10', className, iconSize = 16 }) => {
  const [errored, setErrored] = React.useState(false);

  React.useEffect(() => {
    setErrored(false);
  }, [src]);

  if (!src || errored) {
    return (
      <div
        className={cn(
          'rounded-md bg-slate-100 grid place-items-center text-ink-subtle shrink-0',
          size,
          className
        )}
      >
        <ImageIcon size={iconSize} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={cn('rounded-md object-cover shrink-0', size, className)}
    />
  );
};

export default Thumbnail;
