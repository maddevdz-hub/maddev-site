import { DDPattern } from '@/components/brand/DDPattern';
import { cn } from '@/lib/utils';

/**
 * Fond décoratif : deux dégradés radiaux corail qui « respirent » lentement,
 * et le filigrane DD en contour fin.
 *
 * Opacité du filigrane, réglée une fois pour tout le site :
 *   - 0.07 dans le hero de l'accueil (`intensity="default"`), sur toute la
 *     surface, sans fondu : le motif court derrière le texte comme derrière
 *     le grand symbole ;
 *   - 0.05 en tête des autres pages, dans les CtaSection et les écrans
 *     système (`intensity="soft"`), avec un fondu vers les bords.
 * Le pied de page pose son propre filigrane, à 0.04.
 *
 * Purement visuel : aucun contenu, aucun impact sur la mise en page
 * (position absolue, pointer-events désactivés). L'animation `breathe` est
 * neutralisée par la règle prefers-reduced-motion globale de globals.css.
 */
export function AmbientBackground({
  className,
  patternId = 'dd-ambient',
  intensity = 'default',
}: {
  className?: string;
  patternId?: string;
  intensity?: 'default' | 'soft';
}) {
  const strong = intensity === 'default';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      <div
        className={cn(
          'absolute -top-1/4 start-[-10%] h-[70vh] w-[70vh] rounded-full blur-3xl animate-breathe',
          strong ? 'opacity-100' : 'opacity-50',
        )}
        style={{
          background:
            'radial-gradient(circle, rgba(255,90,95,.20) 0%, rgba(255,90,95,0) 68%)',
        }}
      />
      <div
        className={cn(
          'absolute -bottom-1/3 end-[-15%] h-[65vh] w-[65vh] rounded-full blur-3xl animate-breathe',
          strong ? 'opacity-100' : 'opacity-50',
        )}
        style={{
          background:
            'radial-gradient(circle, rgba(255,138,95,.16) 0%, rgba(255,138,95,0) 68%)',
          animationDelay: '-7s',
        }}
      />
      <DDPattern
        id={patternId}
        opacity={strong ? 0.07 : 0.05}
        scale={140}
        className={strong ? undefined : 'mask-fade'}
      />
    </div>
  );
}
