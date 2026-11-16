import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

import './boutique.css';

/**
 * Enveloppe de la démonstration « Nadâ — parfums & soins ».
 *
 * Comme les autres démos, elle rend son propre <html> : elle vit hors de
 * app/[locale] et n'hérite ni de l'en-tête, ni des polices du studio. Un
 * visiteur doit voir la boutique d'une parfumerie, pas une page MADDEV.
 *
 * Polices différentes des deux autres démos (Fraunces / Karla pour le café,
 * celles de la clinique) : un serif à fort contraste pour les titres, une
 * sans lisible pour tout ce qui se lit vite — prix, formulaire, livraison.
 * Graisses limitées à celles réellement employées : chaque graisse est un
 * fichier de plus à télécharger sur la 4G d'un visiteur venu de TikTok.
 */

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  // L'italique porte la voix du carnet : notes, en-têtes de page, légendes.
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#f7f2ea',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  // Les images de partage des fiches doivent être des adresses absolues.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maddev.dev'),
  title: {
    default: 'Nadâ — parfums & soins',
    template: '%s — Nadâ',
  },
  description:
    'Parfumerie en ligne : livraison dans toutes les wilayas, paiement à la livraison. Démonstration conçue par MADDEV.',
  // Une démonstration ne doit jamais apparaître dans les résultats de
  // recherche : une boutique fictive indexée finirait par être prise pour
  // une vraie.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function BoutiqueDemoLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
