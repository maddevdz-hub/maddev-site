import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Almarai, Fraunces, Karla } from 'next/font/google';

import './menu.css';
import { cafe } from '@/content/demos/menu';
import { isLocale, localeDirection, locales, type Locale } from '@/i18n/config';

/**
 * Enveloppe de la démonstration « Café Zitouna ».
 *
 * Elle rend son propre <html> : la démo vit HORS de app/[locale], donc elle
 * n'hérite ni de l'en-tête, ni du pied de page, ni des polices du studio.
 * Un visiteur doit voir le site d'un café, pas une page MADDEV déguisée.
 *
 * Polices choisies pour ce métier et pour lui seul — aucune n'est utilisée
 * ailleurs sur le site.
 */

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-karla',
  display: 'swap',
});

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#fbf3e7',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  // La carte se consulte à une main, téléphone en main : on laisse le
  // visiteur zoomer sur un plat s'il en a besoin.
  maximumScale: 5,
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;

  return {
    title: `${cafe.name[locale]} — ${cafe.sector[locale]}`,
    description: cafe.solves[locale],
    // Les démonstrations ne doivent jamais apparaître dans les résultats de
    // recherche : un projet fictif indexé finirait par être pris pour vrai.
    robots: { index: false, follow: false, nocache: true },
  };
}

export default function MenuDemoLayout({
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
      className={`${fraunces.variable} ${karla.variable} ${almarai.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
