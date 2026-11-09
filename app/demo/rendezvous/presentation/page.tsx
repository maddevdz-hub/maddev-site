import type { Metadata } from "next";
import { Site } from "@/components/demo/rendezvous/Site";
import { ChargeurVisite } from "@/components/demo/rendezvous/visite/ChargeurVisite";
import { reglages } from "@/content/demos/rendezvous/reglages";

// Même site, même heure réelle ; la visite guidée s’y ajoute.
export const dynamic = "force-dynamic";

const description =
  "Visite guidée en une minute : le site de réservation se présente seul, sur le vrai calendrier. Démonstration — projet fictif conçu par MADDEV.";

// Une page qui définit son aperçu doit redonner l’image : elle ne l’hérite pas.
const image = {
  url: "/demo/rendezvous/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${reglages.cabinet.nom} — réservation en ligne, démonstration. Arcade dentaire dessinée au trait.`,
};

export const metadata: Metadata = {
  title: `Présentation — ${reglages.cabinet.nom}`,
  description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: reglages.cabinet.nom,
    title: `${reglages.cabinet.nom} — la réservation en ligne, en visite guidée`,
    description,
    url: "/demo/rendezvous/presentation",
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title: `${reglages.cabinet.nom} — la réservation en ligne, en visite guidée`,
    description,
    images: [image],
  },
};

export default function Presentation() {
  return (
    <Site maintenant={Date.now()}>
      <ChargeurVisite />
    </Site>
  );
}
