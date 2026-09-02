'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { SystemScreen } from '@/components/layout/SystemScreen';
import { href, localeDirection, routes } from '@/i18n/config';
import { localeFromPathname } from '@/i18n/systemMessages';

/**
 * Corps de la 404 racine.
 *
 * Next rend `app/not-found.tsx` pour tout chemin qui ne correspond à aucune
 * route — y compris `/fr/page-absente`. Cette page ne reçoit ni params ni
 * layout localisé : la langue est donc déduite du chemin ici, côté client,
 * puis reportée sur <html lang dir> une fois monté.
 *
 * Une route attrape-tout sous [locale] serait plus élégante, mais elle passe
 * derrière la frontière de streaming ouverte par loading.tsx : la réponse
 * partirait en 200 avant que la 404 ne soit connue. Ici, le statut 404 est
 * correct parce que Next le décide avant tout rendu.
 */
export function RootNotFoundBody() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection[locale];
  }, [locale]);

  return (
    <SystemScreen code="404" variant="notFound" patternId="dd-404-root">
      {(t) => (
        <>
          <ButtonLink href={href(t.locale)} size="lg">
            {t.backHome}
          </ButtonLink>
          <ButtonLink
            href={href(t.locale, routes.contact)}
            variant="secondary"
            size="lg"
          >
            {t.contact}
          </ButtonLink>
        </>
      )}
    </SystemScreen>
  );
}
