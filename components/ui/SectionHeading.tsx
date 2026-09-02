import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Badge';

/**
 * En-tête de section : eyebrow + titre + sous-titre optionnel.
 * `align` accepte 'start' (aligné dans le sens de lecture) ou 'center'.
 */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  align = 'start',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Fragment de titre affiché en dégradé, sur une seconde ligne. */
  accent?: ReactNode;
  subtitle?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <div
      className={cn(
        'flex max-w-2xl flex-col gap-4',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        className={cn(
          'font-bold leading-[1.12] tracking-tight text-txt',
          Tag === 'h1'
            ? 'text-[clamp(2.1rem,6vw,3.6rem)]'
            : 'text-[clamp(1.75rem,4.2vw,2.6rem)]',
        )}
      >
        {title}
        {accent ? (
          <>
            <br />
            <span className="text-gradient">{accent}</span>
          </>
        ) : null}
      </Tag>
      {subtitle ? (
        <p className="text-base leading-relaxed text-txt2 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
