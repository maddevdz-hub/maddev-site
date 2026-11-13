'use client';

import { useEffect, useRef, useState } from 'react';

import { useActiveService } from '@/components/services/useActiveService';
import { Container } from '@/components/ui/Container';
import type { Service } from '@/content/services';
import type { Locale } from '@/i18n/config';

/**
 * Barre de sous-navigation des six services.
 *
 * Le sommaire en tuiles reste en haut de page ; il disparaît dès qu'on
 * défile, et le visiteur perd l'accès aux autres services au moment précis
 * où il compare. Cette barre reprend la main sous l'en-tête fixe, une fois
 * le sommaire passé.
 *
 * Desktop seulement : sous 1024 px, l'en-tête occupe déjà le haut de
 * l'écran et une seconde barre collante mangerait le tiers de la page. Sur
 * mobile, le sommaire du haut et le pied de page suffisent.
 *
 * Elle est masquée à l'assistance vocale quand elle est invisible, pour ne
 * pas proposer une navigation qu'on ne voit pas.
 */
export function ServicesSubNav({
  items,
  locale,
}: {
  items: Service[];
  locale: Locale;
}) {
  const active = useActiveService(items.map((item) => item.slug));
  const [visible, setVisible] = useState(false);
  const sentinelle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cible = sentinelle.current;
    if (!cible) return;
    // La barre apparaît quand la sentinelle (posée juste après le sommaire)
    // sort par le haut.
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(cible);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelle} aria-hidden="true" className="h-px w-full" />

      <div
        className={[
          'pointer-events-none sticky top-16 z-30 hidden border-y border-line bg-ink/90 backdrop-blur-xl transition-opacity duration-300 lg:top-[72px] lg:block',
          visible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        // Hors d'usage tant qu'elle n'est pas visible : ni clic, ni
        // tabulation, ni lecture par une synthèse vocale.
        aria-hidden={!visible}
      >
        <Container>
          <nav
            aria-label={locale === 'ar' ? 'الخدمات' : 'Nos services'}
            className={visible ? 'pointer-events-auto' : undefined}
          >
            <ul className="flex items-center gap-1 overflow-x-auto py-2">
              {items.map((item) => {
                const on = active === item.slug;
                return (
                  <li key={item.slug}>
                    <a
                      href={`#${item.slug}`}
                      aria-current={on ? 'true' : undefined}
                      // Invisible : on la saute aussi au clavier.
                      tabIndex={visible ? undefined : -1}
                      className={[
                        'inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-3.5 text-[14px] font-semibold transition-colors duration-200',
                        on
                          ? 'bg-brand-soft text-txt'
                          : 'text-txt2 hover:bg-white/[.05] hover:text-txt',
                      ].join(' ')}
                    >
                      {item.name[locale]}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </>
  );
}
