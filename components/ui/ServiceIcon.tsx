import { ServiceGlyph } from '@/components/services/ServiceGlyphs';
import type { ServiceGlyphName } from '@/content/services';
import { cn } from '@/lib/utils';

/**
 * L'icône d'un service, dans sa pastille.
 *
 * Les tracés ne sont plus ici : ils vivent tous dans ServiceGlyphs.tsx.
 * Ce fichier dessinait auparavant son propre jeu de quatre pictogrammes,
 * pendant que le sommaire de /services en dessinait six autres pour les
 * mêmes services. Deux familles pour une seule liste : elles avaient déjà
 * divergé, et chaque service ajouté demandait deux dessins.
 *
 * Il ne reste ici que la présentation — la pastille dégradée, les tailles.
 */

export function ServiceIconGlyph({
  name,
  className,
}: {
  name: ServiceGlyphName;
  className?: string;
}) {
  return <ServiceGlyph name={name} className={cn('h-6 w-6', className)} />;
}

/** Icône dans sa pastille — la présentation par défaut sur le site. */
export function ServiceIconBadge({
  name,
  className,
  size = 'md',
}: {
  name: ServiceGlyphName;
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
      <ServiceIconGlyph
        name={name}
        className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'}
      />
    </span>
  );
}
