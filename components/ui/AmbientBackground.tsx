import { DDPattern } from '@/components/brand/DDPattern';
import { cn } from '@/lib/utils';

/**
 * Fond décoratif : deux dégradés radiaux corail qui « respirent » lentement,
 * plus le motif DD en filigrane. Purement visuel — aucun contenu, aucun
 * impact sur la mise en page (position absolue, pointer-events désactivés).
 *
 * L'animation `breathe` est neutralisée par la règle prefers-reduced-motion
 * globale dans globals.css.
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
        opacity={strong ? 0.022 : 0.014}
        scale={140}
        className="mask-fade"
      />
    </div>
  );
}
