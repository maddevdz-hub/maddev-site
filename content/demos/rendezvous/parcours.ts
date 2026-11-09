/** Les quatre étapes du parcours patient, affichées dans l’ordre. */
export interface EtapeParcours {
  readonly titre: string;
  readonly texte: string;
}

export const parcours: readonly EtapeParcours[] = [
  {
    titre: "Réservation",
    texte:
      "Vous choisissez un soin, un jour et une heure, à tout moment. La référence s’affiche aussitôt.",
  },
  {
    titre: "Rappel",
    texte:
      "La veille, un message WhatsApp vous rappelle l’heure du rendez-vous et l’adresse du cabinet.",
  },
  {
    titre: "Soin",
    texte: "Vous êtes reçu à l’heure : la durée réservée correspond à celle de votre soin.",
  },
  {
    titre: "Suivi",
    texte: "Le prochain contrôle se réserve en ligne, au moment qui vous convient.",
  },
];
