import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'transition-[transform,box-shadow,background-color,border-color] duration-300 ' +
  'active:translate-y-px motion-reduce:transform-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-[#1a0c0c] shadow-glow-sm hover:shadow-glow hover:-translate-y-0.5',
  secondary:
    'border border-line2 bg-white/[.04] text-txt hover:border-coral/45 hover:bg-white/[.07] hover:-translate-y-0.5',
  ghost: 'text-txt2 hover:text-txt',
};

/*
 * Les hauteurs garantissent une zone tactile d'au moins 44 px, seuil en
 * dessous duquel un bouton devient difficile à viser au pouce.
 */
const sizes: Record<Size, string> = {
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[52px] px-7 py-3.5 text-[15px]',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

/** Bouton-lien interne ou externe. */
export function ButtonLink({
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & {
  href: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/** Bouton d'action (soumission de formulaire). */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Flèche directionnelle qui suit le sens de lecture :
 * elle pointe à droite en LTR, à gauche en RTL (miroir automatique).
 */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        'h-4 w-4 shrink-0 transition-transform duration-300 rtl:-scale-x-100',
        className,
      )}
    >
      <path
        d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
