import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./rendezvous.css";
import { reglages } from "@/content/demos/rendezvous/reglages";
import { ThemeScript } from "@/components/demo/rendezvous/ThemeScript";
import { adresseDuSite } from "@/lib/demos/rendezvous/site";

// Polices servies depuis le dépôt (app/fonts), jamais par un lien externe.
const serif = localFont({
  src: "./fonts/newsreader-latin-normal.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const sans = localFont({
  src: "./fonts/inter-latin-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

const { cabinet } = reglages;

/*
 * Démonstration « prise de rendez-vous » de MADDEV.
 *
 * Clinique FICTIVE. Elle vit hors de app/[locale] et rend son propre <html> :
 * elle n'hérite ni de l'en-tête, ni des polices, ni de la palette du studio.
 * Un visiteur doit voir le site d'une clinique, pas une page MADDEV déguisée.
 *
 * Le titre et la description le disent aussi : un aperçu de partage circule
 * sans le bandeau, il doit porter la mention à lui seul.
 */
const titre = `${cabinet.nom} — Orthodontie et esthétique dentaire à ${cabinet.quartier}`;
const description = `Orthodontie et esthétique dentaire à ${cabinet.quartier}, ${cabinet.ville}. Réservez votre rendez-vous en ligne, en une minute. Démonstration — projet fictif conçu par MADDEV.`;

export const metadata: Metadata = {
  // Les liens de l’aperçu de partage doivent être absolus.
  metadataBase: adresseDuSite(),
  title: titre,
  description,
  applicationName: cabinet.nom,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: cabinet.nom,
    title: cabinet.nom,
    description,
    url: "/demo/rendezvous",
  },
  twitter: {
    card: "summary_large_image",
    title: cabinet.nom,
    description,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e7" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1626" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="bouton-primaire sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
