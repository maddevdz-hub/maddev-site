"use client";

import dynamic from "next/dynamic";

// Le moteur de la visite est chargé à part, seulement sur /presentation :
// la page d’accueil n’en télécharge pas une ligne.
const VisiteGuidee = dynamic(() => import("./VisiteGuidee"), { ssr: false });

export function ChargeurVisite() {
  return <VisiteGuidee />;
}
