import { cn } from '@/lib/utils';
import {
  DD_BACK,
  DD_BACK_COLOR,
  DD_FRONT,
  DD_FRONT_COLOR,
  DD_VIEWBOX,
} from './dd-paths';

/**
 * Le symbole MADDEV : deux « D » qui se suivent, en deux tons de corail.
 * C'est la signature de marque — on le réutilise en filigrane dans les fonds
 * (voir DDPattern) et en grand dans le hero.
 *
 * Les tracés ne vivent pas ici : ils sont générés depuis
 * `public/logo/maddev-mark.svg` par `npm run logo`, qui met à jour d'un
 * même geste le favicon, les icônes d'application et les SVG de `public/`.
 *
 * Deux aplats, aucun dégradé : le D de derrière porte une réserve autour du
 * D de devant, c'est elle qui sépare les lettres.
 */

type DDMarkProps = {
  className?: string;
  title?: string;
};

export function DDMark({ className, title }: DDMarkProps) {
  return (
    <svg
      viewBox={DD_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d={DD_BACK} fill={DD_BACK_COLOR} />
      <path d={DD_FRONT} fill={DD_FRONT_COLOR} />
    </svg>
  );
}

/**
 * Version monochrome, utilisée en filigrane et dans les fonds.
 * Aplat plein, sans opacité : la réserve autour du D de devant suffit à
 * séparer les deux lettres, et une opacité donnerait un gris qui change
 * selon le fond.
 */
export function DDMarkMono({
  className,
  color = 'currentColor',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox={DD_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      aria-hidden="true"
    >
      <path d={DD_BACK} fill={color} />
      <path d={DD_FRONT} fill={color} />
    </svg>
  );
}
