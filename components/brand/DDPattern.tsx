import { cn } from '@/lib/utils';
import { DD_BACK, DD_FRONT, DD_WIDTH } from './dd-paths';

/**
 * Motif DD répété en filigrane.
 *
 * Deux variantes, mêmes tracés (dd-paths.ts, généré par `npm run logo`) :
 *
 *   - `outline` (défaut) : le monogramme en contour fin, 1 px à l'écran
 *     quelle que soit l'échelle de la tuile (`vector-effect:
 *     non-scaling-stroke`). C'est le filigrane du site : un trait se devine
 *     derrière le texte sans le concurrencer, là où un aplat faisait tache.
 *   - `fill` : le monogramme plein, gardé pour les cadres de visuels.
 *
 * Purement décoratif : aucun contenu accessible. Un trait étant bien moins
 * visible qu'un aplat, l'opacité d'un filigrane `outline` se règle autour
 * de 0.04–0.07, contre 0.015–0.02 pour un aplat.
 */
export function DDPattern({
  className,
  opacity = 0.05,
  scale = 120,
  id = 'dd-pattern',
  variant = 'outline',
}: {
  className?: string;
  opacity?: number;
  /** Taille d'une tuile en pixels. */
  scale?: number;
  id?: string;
  variant?: 'fill' | 'outline';
}) {
  const k = (scale * 0.42) / DD_WIDTH;

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
          {/* Décalage d'un demi-trait pour que le contour ne soit pas rogné
              par le bord de la tuile. */}
          <g transform={`translate(1 1) scale(${k})`}>
            {variant === 'outline' ? (
              <g
                fill="none"
                stroke="#ffffff"
                strokeWidth={1}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              >
                <path d={DD_BACK} vectorEffect="non-scaling-stroke" />
                <path d={DD_FRONT} vectorEffect="non-scaling-stroke" />
              </g>
            ) : (
              <g fill="#ffffff">
                <path d={DD_BACK} />
                <path d={DD_FRONT} />
              </g>
            )}
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
