import { cn } from '@/lib/utils';

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
          <g
            transform={`scale(${(scale * 0.42) / 134})`}
            fill="#ffffff"
            fillRule="evenodd"
          >
            <path d="M18 12 H44 A38 38 0 0 1 44 88 H18 Z M32 26 H44 A24 24 0 0 1 44 74 H32 Z" />
            <path
              d="M52 12 H78 A38 38 0 0 1 78 88 H52 Z M66 26 H78 A24 24 0 0 1 78 74 H66 Z"
              opacity="0.6"
            />
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
