'use client';

import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { SystemScreen } from '@/components/layout/SystemScreen';
import { href, routes } from '@/i18n/config';

/**
 * Écran d'erreur d'une page.
 *
 * Obligatoirement un composant client — c'est une frontière d'erreur React.
 * La langue vient du chemin, comme pour la 404.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Le digest est la seule trace exploitable côté serveur en production.
    console.error('[erreur]', error.digest ?? error.message);
  }, [error]);

  return (
    <SystemScreen code="500" variant="error" patternId="dd-error">
      {(t) => (
        <>
          <Button type="button" onClick={reset} size="lg">
            {t.retry}
          </Button>
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
