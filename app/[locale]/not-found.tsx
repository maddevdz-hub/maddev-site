'use client';

import { ButtonLink } from '@/components/ui/Button';
import { SystemScreen } from '@/components/layout/SystemScreen';
import { href, routes } from '@/i18n/config';

/**
 * 404 à l'intérieur d'une langue.
 *
 * Next ne transmet pas les params à not-found : la langue est donc lue
 * dans le chemin de l'URL par SystemScreen. Un visiteur qui se trompe
 * d'adresse sous /fr reste en français.
 */
export default function LocaleNotFound() {
  return (
    <SystemScreen code="404" variant="notFound" patternId="dd-404">
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
