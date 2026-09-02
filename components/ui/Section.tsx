import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

/**
 * Section de page avec rythme vertical constant.
 * `tone` alterne les fonds : ink (par défaut) et ink2 pour les sections paires.
 */
export function Section({
  children,
  className,
  innerClassName,
  tone = 'default',
  id,
  bordered = false,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: 'default' | 'alt';
  id?: string;
  /** Ajoute un filet supérieur pour séparer visuellement deux sections de même ton. */
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-16 sm:py-20 lg:py-28',
        tone === 'alt' && 'bg-ink2',
        bordered && 'border-t border-line',
        className,
      )}
    >
      <Container className={innerClassName}>{children}</Container>
    </section>
  );
}
