import Image from 'next/image';
import Link from 'next/link';

import { ArrowIcon } from '@/components/ui/Button';
import type { Demo } from '@/content/demos';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

/**
 * Carte d'une démonstration dans la galerie.
 *
 * La vignette porte les couleurs de la démo, pas celles du studio : c'est le
 * premier signe que chaque projet a son identité. Tant que la capture réelle
 * n'existe pas, la vignette reste un aplat de cette palette — jamais un
 * cadre vide, jamais une fausse interface dessinée.
 */
export function DemoCard({
  demo,
  locale,
  dict,
}: {
  demo: Demo;
  locale: Locale;
  dict: Dictionary;
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
            alt={demo.name[locale]}
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
              {demo.name[locale]}
            </span>
            <span
              className="h-1 w-12 rounded-full"
              style={{ background: demo.palette.accent }}
            />
            <span
              className="text-[13px] font-medium"
              style={{ color: demo.palette.accent }}
            >
              {demo.mood[locale]}
            </span>
          </span>
        )}

        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="eyebrow-label text-txt2">{demo.sector[locale]}</p>
          <h3 className="text-lg font-bold text-txt">{demo.name[locale]}</h3>
          <p className="text-[15px] leading-relaxed text-txt2">
            {demo.solves[locale]}
          </p>

          <span className="mt-3 inline-flex items-center gap-2 text-[15px] font-semibold text-coral2">
            {dict.work.demos.cta}
            <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
