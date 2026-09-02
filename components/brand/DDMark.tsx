import { cn } from '@/lib/utils';

/**
 * Le symbole MADDEV : deux « D » qui se chevauchent, en dégradé corail.
 * C'est la signature de marque — on le réutilise en filigrane dans les fonds
 * (voir DDPattern) et en grand dans le hero.
 *
 * Chaque D est un tracé unique avec fill-rule="evenodd" : la contre-forme
 * intérieure est soustraite du contour, ce qui garde le fichier léger et
 * permet au dégradé de traverser les deux lettres d'un seul tenant.
 */

const D_OUTER_1 = 'M18 12 H44 A38 38 0 0 1 44 88 H18 Z';
const D_INNER_1 = 'M32 26 H44 A24 24 0 0 1 44 74 H32 Z';
const D_OUTER_2 = 'M52 12 H78 A38 38 0 0 1 78 88 H52 Z';
const D_INNER_2 = 'M66 26 H78 A24 24 0 0 1 78 74 H66 Z';

type DDMarkProps = {
  className?: string;
  /** Identifiant unique du dégradé — obligatoire si le symbole apparaît plusieurs fois. */
  gradientId?: string;
  title?: string;
};

export function DDMark({
  className,
  gradientId = 'dd-brand',
  title,
}: DDMarkProps) {
  return (
    <svg
      viewBox="0 0 134 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5a5f" />
          <stop offset="100%" stopColor="#ff8a5f" />
        </linearGradient>
      </defs>
      <path
        d={`${D_OUTER_1} ${D_INNER_1}`}
        fill={`url(#${gradientId})`}
        fillRule="evenodd"
      />
      {/* Le second D est légèrement transparent : la zone de recouvrement
          s'éclaircit d'elle-même et donne sa profondeur au symbole. */}
      <path
        d={`${D_OUTER_2} ${D_INNER_2}`}
        fill={`url(#${gradientId})`}
        fillRule="evenodd"
        opacity="0.72"
      />
    </svg>
  );
}

/** Version monochrome, utilisée en filigrane et dans les fonds. */
export function DDMarkMono({
  className,
  color = 'currentColor',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 134 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      aria-hidden="true"
    >
      <path d={`${D_OUTER_1} ${D_INNER_1}`} fill={color} fillRule="evenodd" />
      <path
        d={`${D_OUTER_2} ${D_INNER_2}`}
        fill={color}
        fillRule="evenodd"
        opacity="0.6"
      />
    </svg>
  );
}
