import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Karla } from 'next/font/google';

import './menu.css';
import { cafe } from '@/content/demos/menu';

/**
 * Enveloppe de la démonstration « Café Zitouna ».
 *
 * Elle rend son propre <html> : la démo vit HORS de app/[locale], donc elle
 * n'hérite ni de l'en-tête, ni du pied de page, ni des polices du studio.
 * Un visiteur doit voir le site d'un café, pas une page MADDEV déguisée.
 *
 * Français seul depuis septembre 2026 : ces démos s'adressent à des
 * professionnels qui lisent le français, et une version arabe à maintenir
 * pour chacune des six coûterait plus qu'elle ne rapporte. Le site MADDEV,
 * lui, reste bilingue.

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

export const viewport: Viewport = {
  themeColor: '#fbf3e7',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  // La carte se consulte à une main : on laisse le visiteur zoomer.
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${cafe.name} — ${cafe.sector}`,
  description: cafe.solves,
  // Les démonstrations ne doivent jamais apparaître dans les résultats de
  // recherche : un projet fictif indexé finirait par être pris pour un vrai.
  robots: { index: false, follow: false, nocache: true },
};

export default function MenuDemoLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${fraunces.variable} ${karla.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
