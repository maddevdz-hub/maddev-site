'use client';

import { useEffect, useState } from 'react';

import { ServiceGlyph } from '@/components/services/ServiceGlyphs';
import type { Service } from '@/content/services';
import type { Locale } from '@/i18n/config';

/**
 * Le sommaire de /services.
 *
 * Un visiteur n'arrive pas pour découvrir six services : il arrive avec un
 * besoin précis. Le faire défiler jusqu'au bloc qui le concerne, c'est
 * parier qu'il ira au bout — et la plupart n'y vont pas.
 *
 * Cette rangée fait deux choses en même temps. Elle emmène en un clic vers
 * le bloc voulu, et elle donne en trois secondes la mesure de ce que le
 * studio sait faire : six métiers couverts, visibles d'un coup d'œil, sans
 * avoir à lire une ligne.
 *
 * Elle tient donc dans le premier écran. C'est la raison pour laquelle
 * l'en-tête au-dessus est court et que le principe « aucun template » a été
 * déplacé plus bas : chaque phrase gardée en haut aurait repoussé la rangée
 * sous le pli, où elle n'aurait plus servi à rien.
 */
export function ShowcaseSummary({
  items,
  locale,
}: {
  items: Service[];
  locale: Locale;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    /*
     * On ne marque pas « le bloc visible » — à mi-défilement il y en a deux —
     * mais celui qui occupe la bande centrale de l'écran. C'est celui que le
     * visiteur est en train de lire.
     *
     * Le repère reste discret : il indique où l'on se trouve, il ne réclame
     * pas de clic. Une tuile qui s'allume franchement à chaque défilement
     * transforme le sommaire en animation, et on regarde l'animation au lieu
     * du service.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-42% 0px -50% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={locale === 'ar' ? 'الخدمات' : 'Nos services'}
      className="mt-9 sm:mt-10"
    >
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {items.map((item) => {
          const on = active === item.slug;
          return (
            <li key={item.slug}>
              {/*
                Une ancre, pas un bouton : le défilement doux est déjà réglé
                en CSS pour tout le site (et neutralisé sous
                prefers-reduced-motion). Un clic reste donc un lien — il
                s'ouvre dans un onglet, se copie, et fonctionne sans
                JavaScript.
              */}
              <a
                href={`#${item.slug}`}
                aria-current={on ? 'true' : undefined}
                className={[
                  'flex h-full min-h-[92px] flex-col gap-2 rounded-xl border p-3 transition-colors duration-200 sm:p-3.5',
                  on
                    ? 'border-coral/45 bg-brand-soft'
                    : 'border-line bg-ink2/50 hover:border-line2 hover:bg-ink2',
                ].join(' ')}
              >
                <ServiceGlyph
                  name={item.glyph}
                  className={[
                    'h-[22px] w-[22px] shrink-0 transition-colors duration-200',
                    on ? 'text-coral2' : 'text-txt2',
                  ].join(' ')}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[13.5px] font-bold leading-tight text-txt">
                    {item.name[locale]}
                  </span>
                  <span className="text-[12.5px] leading-snug text-txt2">
                    {item.solves[locale]}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
