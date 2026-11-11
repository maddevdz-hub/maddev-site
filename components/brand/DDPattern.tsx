import { cn } from '@/lib/utils';
import { DD_BACK, DD_FRONT, DD_WIDTH } from './dd-paths';

/**
 * Motif DD répété en filigrane très subtil.
 * Purement décoratif : aucun contenu accessible, et l'opacité reste
 * assez basse pour ne jamais gêner la lecture du texte par-dessus.
 */
export function DDPattern({
  className,
  opacity = 0.02,
  scale = 120,
  id = 'dd-pattern',
}: {
  className?: string;
  opacity?: number;
  /** Taille d'une tuile en pixels. */
  scale?: number;
  id?: string;
}) {
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-12)"
        >
          {/* Mêmes tracés que le logo (dd-paths.ts, généré). */}
          <g transform={`scale(${(scale * 0.42) / DD_WIDTH})`} fill="#ffffff">
            <path d={DD_BACK} />
            <path d={DD_FRONT} />
          </g>
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id})`}
        opacity={opacity}
      />
    </svg>
  );
}
