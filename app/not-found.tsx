import './globals.css';
import { fontVariables } from './fonts';
import { RootNotFoundBody } from '@/components/layout/RootNotFoundBody';
import { defaultLocale, localeDirection } from '@/i18n/config';
import { systemMessages } from '@/i18n/systemMessages';

/**
 * 404 du site.
 *
 * Le layout racine étant transparent, cette page rend elle-même <html>.
 * Les attributs lang/dir de départ sont ceux de l'arabe, langue principale ;
 * RootNotFoundBody les corrige au montage si l'URL indiquait le français.
 */
export default function RootNotFound() {
  return (
    <html
      lang={defaultLocale}
      dir={localeDirection[defaultLocale]}
      className={fontVariables}
    >
      {/*
        Titre d'onglet : sans lui, la 404 s'affichait sans nom. Celui de la
        langue principale ; RootNotFoundBody le remplace si l'URL est en
        français.
      */}
      <head>
        <title>{`${systemMessages[defaultLocale].notFoundTitle} — MADDEV`}</title>
      </head>
      <body className="min-h-dvh bg-ink">
        <RootNotFoundBody />
      </body>
    </html>
  );
}
