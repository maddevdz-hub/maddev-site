import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, Sora } from 'next/font/google';

import './rendezvous.css';
import { cabinet } from '@/content/demos/rendezvous';

/**
 * Enveloppe de la démonstration « Cabinet dentaire Amel ».
 *
 * Elle rend son propre <html> : la démo vit hors de app/[locale], donc elle
 * n'hérite ni de l'en-tête, ni du pied de page, ni des polices du studio.
 *
 * Polices choisies pour ce métier seul : Sora, géométrique et un peu
 * technique, pour les titres ; Inter pour le texte courant, taillé pour les
 * interfaces denses. Aucune n'est utilisée ailleurs sur le site.
 *
 * Readex Pro a été retirée avec la version arabe — une police chargée pour
 * un texte qui n'existe plus est du poids gratuit sur chaque visite.
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

export const viewport: Viewport = {
  themeColor: '#0d2b31',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${cabinet.name} — ${cabinet.sector}`,
  description: cabinet.solves,
  // Un projet fictif indexé finirait par être pris pour un vrai cabinet,
  // avec de vrais patients au bout du fil.
  robots: { index: false, follow: false, nocache: true },
};

export default function RendezvousDemoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
