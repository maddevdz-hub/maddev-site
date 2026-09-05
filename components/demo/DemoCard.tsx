import Image from 'next/image';
import Link from 'next/link';

import { ArrowIcon } from '@/components/ui/Button';
import type { Demo } from '@/content/demos';

/**
 * Carte d'une démonstration.
 *
 * Conservée depuis la page /realisations supprimée, et adaptée : elle servira
 * les blocs de /services. Elle a perdu sa dépendance au dictionnaire — les
 * démonstrations sont en français seul, et une carte qui va chercher un
 * libellé dans `messages/` casserait dès qu'on touche à ces fichiers.
 *
 * La vignette porte les couleurs de la démo, pas celles du studio : c'est le
 * premier signe que chaque projet a son identité. Tant que la capture réelle
 * n'existe pas, elle reste un aplat de cette palette — jamais un cadre vide,
 * jamais une fausse interface dessinée.
 */
export function DemoCard({
  demo,
  cta = 'Voir la démonstration',
}: {
  demo: Demo;
  cta?: string;
}) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-coral/30 motion-reduce:hover:transform-none">
      <Link
        href={demo.path}
        className="flex flex-1 flex-col focus-visible:outline-none"
      >
        {demo.preview ? (
          <Image
            src={demo.preview}
            alt={demo.name}
            width={800}
            height={500}
            sizes="(max-width: 768px) 100vw, 380px"
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2"
            style={{ background: demo.palette.bg }}
          >
            <span
              className="text-[22px] font-bold"
              style={{ color: demo.palette.ink }}
            >
              {demo.name}
            </span>
            <span
              className="h-1 w-12 rounded-full"
              style={{ background: demo.palette.accent }}
            />
            <span
              className="text-[13px] font-medium"
              style={{ color: demo.palette.accent }}
            >
              {demo.mood}
            </span>
          </span>
        )}

        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="eyebrow-label text-txt2">{demo.sector}</p>
          <h3 className="text-lg font-bold text-txt">{demo.name}</h3>
          <p className="text-[15px] leading-relaxed text-txt2">{demo.solves}</p>

          <span className="mt-3 inline-flex items-center gap-2 text-[15px] font-semibold text-coral2">
            {cta}
            <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
