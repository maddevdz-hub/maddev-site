import type { ServiceIcon as IconName } from '@/content/services';
import { cn } from '@/lib/utils';

/**
 * Jeu d'icônes des services — tracés uniformes (stroke 1.6, coins arrondis)
 * pour que les quatre pictogrammes forment une famille cohérente.
 */
const paths: Record<IconName, JSX.Element> = {
  // Site vitrine : une fenêtre de navigateur
  window: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M6.5 6.75h.01M9 6.75h.01" />
    </>
  ),
  // Boutique : un panier
  cart: (
    <>
      <path d="M3 4h2.2l2.1 10.4a1.6 1.6 0 0 0 1.6 1.3h7.9a1.6 1.6 0 0 0 1.6-1.25L20 7.5H6" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </>
  ),
  // Application : des blocs empilés / tableau de bord
  app: (
    <>
      <rect x="3" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <path d="M17.25 13.5v7.5M13.5 17.25h7.5" />
    </>
  ),
  // Publicité : un mégaphone
  megaphone: (
    <>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l7 4.5V4L8 8.5H5.5A1.5 1.5 0 0 0 4 10Z" />
      <path d="M18.5 9.2a4 4 0 0 1 0 5.6" />
    </>
  ),
};

export function ServiceIconGlyph({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
    >
      {paths[name]}
    </svg>
  );
}

/** Icône dans sa pastille dégradée — la présentation par défaut sur le site. */
export function ServiceIconBadge({
  name,
  className,
  size = 'md',
}: {
  name: IconName;
  className?: string;
  size?: 'md' | 'lg';
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-2xl border border-coral/25 bg-brand-soft text-coral2',
        size === 'lg' ? 'h-14 w-14' : 'h-11 w-11',
        className,
      )}
    >
      <ServiceIconGlyph name={name} className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'} />
    </span>
  );
}
