import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Petite étiquette : eyebrow de section, délai, tag de projet. */
export function Badge({
  children,
  className,
  tone = 'neutral',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'brand';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide',
        tone === 'brand'
          ? 'border-coral/30 bg-coral/10 text-coral2'
          : 'border-line bg-white/[.03] text-txt2',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Eyebrow : petit libellé au-dessus d'un titre de section, avec un point corail. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'eyebrow-label inline-flex items-center gap-2.5 text-txt2',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
      />
      {children}
    </span>
  );
}
