import Link from 'next/link';
import { DDMark } from './DDMark';
import { href, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/**
 * Logo complet : symbole DD + mot-symbole « MADDEV ».
 * Le texte est rendu en HTML (et non dans le SVG) pour garantir la même
 * police que le reste du site, quel que soit le rendu de fontes du navigateur.
 */
export function Logo({
  locale,
  className,
  showWordmark = true,
  gradientId = 'dd-logo',
}: {
  locale: Locale;
  className?: string;
  showWordmark?: boolean;
  gradientId?: string;
}) {
  return (
    <Link
      href={href(locale)}
      /*
       * dir="ltr" sur le conteneur : en arabe, le BLOC logo se place bien à
       * droite du header (c'est le flux du header qui s'en charge), mais son
       * contenu suivait lui aussi le sens RTL et le symbole passait à droite
       * du mot. Un lockup ne se retourne pas — l'ordre latin est figé ici.
       */
      dir="ltr"
      className={cn(
        // min-h : le logo est un lien, il doit rester confortable au pouce.
        'group inline-flex min-h-[44px] items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90',
        className,
      )}
      aria-label="MADDEV"
    >
      <DDMark
        gradientId={gradientId}
        className="h-7 w-auto transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:transform-none"
      />
      {showWordmark ? (
        <span
          className="font-display text-lg font-bold tracking-tight text-txt"
          /* Le nom de marque reste en latin, y compris en version arabe. */
          dir="ltr"
        >
          MADDEV
        </span>
      ) : null}
    </Link>
  );
}
