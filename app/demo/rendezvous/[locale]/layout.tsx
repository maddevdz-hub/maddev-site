import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Inter, Readex_Pro, Sora } from 'next/font/google';

import './rendezvous.css';
import { cabinet } from '@/content/demos/rendezvous';
import { isLocale, localeDirection, locales, type Locale } from '@/i18n/config';

/**
 * Enveloppe de la démonstration « Cabinet dentaire Amel ».
 *
 * Elle rend son propre <html> : la démo vit hors de app/[locale], donc elle
 * n'hérite ni de l'en-tête, ni du pied de page, ni des polices du studio.
 *
 * Polices choisies pour ce métier seul : Sora, géométrique et un peu
 * technique, pour les titres ; Inter pour le texte courant, taillé pour les
 * interfaces denses ; Readex Pro pour l'arabe, dont le dessin géométrique
 * répond à celui de Sora. Aucune n'est utilisée ailleurs sur le site.
 */

const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const readex = Readex_Pro({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-readex',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0d2b31',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;

  return {
    title: `${cabinet.name[locale]} — ${cabinet.sector[locale]}`,
    description: cabinet.solves[locale],
    // Un projet fictif indexé finirait par être pris pour un vrai cabinet,
    // avec de vrais patients au bout du fil.
    robots: { index: false, follow: false, nocache: true },
  };
}

export default function RendezvousDemoLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`${sora.variable} ${inter.variable} ${readex.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
