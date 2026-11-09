/**
 * Visite guidée de la page /presentation, destinée au cabinet.
 * Les textes s’affichent dans le bandeau du bas, un par étape.
 */
export const dureeEtapeMs = 7000;

export const etapesVisite: readonly string[] = [
  "Voici votre cabinet tel qu’un nouveau patient le découvre. Vos horaires, le rappel et vos six soins, dès la première seconde.",
  "Six soins, chacun avec sa durée réelle et ses créneaux disponibles cette semaine.",
  "Regardez : je choisis une pose d’appareil, soixante minutes. Le calendrier ne propose plus que les créneaux qui peuvent l’accueillir.",
  "Le patient qui ne sait pas quoi choisir répond à trois questions et arrive au bon rendez-vous.",
  "À la confirmation, le rappel de la veille est prêt à partir.",
  "Et voici votre côté. Une annulation libère le créneau à l’instant, et la personne en attente est prévenue.",
];

/** Ce que la visite saisit à l’étape 5, pour montrer le message tel qu’il sera reçu. */
export const saisieDemonstration = {
  prenom: "Amina",
  telephone: "0555 12 34 56",
} as const;

export const textesVisite = {
  depart: "Visite guidée en six étapes, sur le vrai site. Vous pouvez reprendre la main à tout moment.",
  libre: "Visite en pause : vous avez la main. Reprenez-la quand vous voulez.",
  fin: "La visite est terminée. Le site est à vous.",
} as const;
