'use client';

import { Container } from '@/components/ui/Container';
import { DDMark } from '@/components/brand/DDMark';
import { localeDirection } from '@/i18n/config';
import { useSystemText } from '@/components/layout/SystemScreen';

/**
 * Écran de chargement d'une page.
 *
 * Volontairement sobre : le symbole de marque qui pulse et une annonce
 * vocale. Pas de squelette détaillé — il mentirait sur la mise en page à
 * venir, qui diffère d'une page à l'autre. L'animation est neutralisée
 * par la règle prefers-reduced-motion de globals.css.
 */
export default function LocaleLoading() {
  const t = useSystemText();

  return (
    <div dir={localeDirection[t.locale]} className="py-32">
      <Container>
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-5"
        >
          <DDMark
            gradientId="dd-loading"
            className="w-16 animate-halo"
            title={t.loading}
          />
          <p className="text-sm text-txt2">{t.loading}</p>
        </div>
      </Container>
    </div>
  );
}
