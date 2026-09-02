'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { DDMark } from '@/components/brand/DDMark';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { localeDirection } from '@/i18n/config';
import { localeFromPathname, systemMessages } from '@/i18n/systemMessages';

/**
 * Écran système (404, erreur) dans la charte du site.
 *
 * La langue est déduite de l'URL courante : /fr/page-absente affiche du
 * français, /ar/... de l'arabe. Ces écrans ne reçoivent pas de params, d'où
 * la lecture du chemin côté client.
 */
export function SystemScreen({
  code,
  variant,
  children,
  patternId,
}: {
  /** Affiché en grand, en chiffres latins. */
  code: string;
  variant: 'notFound' | 'error';
  /** Boutons d'action, rendus sous le texte. */
  children: (t: ReturnType<typeof useSystemText>) => ReactNode;
  patternId: string;
}) {
  const t = useSystemText();

  return (
    <section
      // dir explicite : cet écran peut s'afficher hors du layout localisé.
      dir={localeDirection[t.locale]}
      className="relative isolate overflow-hidden py-24 lg:py-32"
    >
      <AmbientBackground patternId={patternId} intensity="soft" />
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <DDMark gradientId={`${patternId}-mark`} className="w-20 opacity-70" />

          <p className="numerals font-display text-5xl font-bold text-gradient">
            {code}
          </p>

          <h1 className="text-2xl font-bold text-txt">
            {variant === 'notFound' ? t.notFoundTitle : t.errorTitle}
          </h1>

          <p className="leading-relaxed text-txt2">
            {variant === 'notFound' ? t.notFoundText : t.errorText}
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row">{children(t)}</div>
        </div>
      </Container>
    </section>
  );
}

/** Textes système + langue courante, déduits de l'URL. */
export function useSystemText() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  return { ...systemMessages[locale], locale };
}
