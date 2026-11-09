import type { SoinId } from "./soins";

/**
 * Guide d'orientation : un aiguillage vers un type de rendez-vous.
 *
 * Règles de rédaction, à respecter en modifiant ce fichier :
 * - les questions portent sur le besoin et la situation, jamais sur des
 *   symptômes cliniques ;
 * - aucun diagnostic, aucune pathologie nommée, aucune parole rassurante
 *   sur un symptôme ;
 * - le résultat dit « voici le rendez-vous qui correspond », jamais
 *   « vous avez probablement… ».
 *
 * Chaque réponse mène soit à une autre question, soit directement à une
 * issue. Une réponse qui évoque une douleur mène toujours, sans question
 * supplémentaire, à une issue marquée `urgence: true`.
 */
export type QuestionId = "besoin" | "appareil" | "esthetique" | "premiere-visite";

export type IssueId =
  | "douleur"
  | "reglage"
  | "element-casse"
  | "nouvel-appareil"
  | "alignement"
  | "tartre"
  | "couleur"
  | "tartre-et-couleur"
  | "indecis-premiere-visite"
  | "indecis-deja-venu";

export type Suite = { readonly question: QuestionId } | { readonly issue: IssueId };

export interface ReponseGuide {
  readonly id: string;
  readonly libelle: string;
  readonly suite: Suite;
}

export interface QuestionGuide {
  readonly id: QuestionId;
  readonly titre: string;
  readonly reponses: readonly ReponseGuide[];
}

export interface IssueGuide {
  readonly soin: SoinId;
  /** Une phrase, tirée des réponses, qui explique le choix. */
  readonly raison: string;
  /** Phrase d'accueil affichée au-dessus du résultat. */
  readonly accueil?: string;
  /** Arrêt immédiat : on propose le créneau d'urgence le plus proche. */
  readonly urgence?: boolean;
}

export const premiereQuestion: QuestionId = "besoin";

export const questions: Readonly<Record<QuestionId, QuestionGuide>> = {
  besoin: {
    id: "besoin",
    titre: "Qu’est-ce qui vous amène ?",
    reponses: [
      { id: "douleur", libelle: "J’ai mal, c’est urgent", suite: { issue: "douleur" } },
      { id: "appareil", libelle: "Je porte déjà un appareil", suite: { question: "appareil" } },
      { id: "alignement", libelle: "Je veux corriger l’alignement", suite: { issue: "alignement" } },
      {
        id: "esthetique",
        libelle: "Je veux un nettoyage ou un sourire plus clair",
        suite: { question: "esthetique" },
      },
      { id: "indecis", libelle: "Je ne sais pas encore", suite: { question: "premiere-visite" } },
    ],
  },
  appareil: {
    id: "appareil",
    titre: "Votre rendez-vous concerne :",
    reponses: [
      { id: "reglage", libelle: "Un réglage prévu", suite: { issue: "reglage" } },
      { id: "casse", libelle: "Un élément cassé ou décollé", suite: { issue: "element-casse" } },
      { id: "pose", libelle: "La pose d’un nouvel appareil", suite: { issue: "nouvel-appareil" } },
    ],
  },
  esthetique: {
    id: "esthetique",
    titre: "Ce qui vous gêne le plus :",
    reponses: [
      { id: "tartre", libelle: "Le tartre et les gencives", suite: { issue: "tartre" } },
      { id: "couleur", libelle: "La couleur des dents", suite: { issue: "couleur" } },
      { id: "les-deux", libelle: "Les deux", suite: { issue: "tartre-et-couleur" } },
    ],
  },
  "premiere-visite": {
    id: "premiere-visite",
    titre: "Première visite dans ce cabinet ?",
    reponses: [
      { id: "oui", libelle: "Oui, c’est ma première visite", suite: { issue: "indecis-premiere-visite" } },
      { id: "non", libelle: "Non, je connais déjà le cabinet", suite: { issue: "indecis-deja-venu" } },
    ],
  },
};

export const issues: Readonly<Record<IssueId, IssueGuide>> = {
  douleur: {
    soin: "urgence",
    urgence: true,
    raison: "Vous avez besoin d’être reçu rapidement : voici le créneau d’urgence le plus proche.",
  },
  reglage: {
    soin: "controle-orthodontique",
    raison: "Vous portez un appareil et venez pour le réglage prévu.",
  },
  "element-casse": {
    soin: "urgence",
    raison: "Un élément de votre appareil est cassé ou décollé : ce rendez-vous court est prévu pour ce cas.",
  },
  "nouvel-appareil": {
    soin: "pose-appareil",
    raison: "Vous venez pour la pose d’un nouvel appareil.",
  },
  alignement: {
    soin: "premiere-consultation",
    raison: "Tout projet d’alignement commence par une première consultation, pour établir un plan avec vous.",
  },
  tartre: {
    soin: "detartrage",
    raison: "Votre priorité est le tartre et les gencives.",
  },
  couleur: {
    soin: "eclaircissement",
    raison: "Votre priorité est la couleur de vos dents.",
  },
  "tartre-et-couleur": {
    soin: "detartrage",
    raison: "Le détartrage vient en premier ; le praticien évalue la suite sur place.",
  },
  "indecis-premiere-visite": {
    soin: "premiere-consultation",
    accueil: "Bienvenue au cabinet.",
    raison: "Vous hésitez encore : la première consultation permet de faire le point ensemble.",
  },
  "indecis-deja-venu": {
    soin: "premiere-consultation",
    accueil: "Ravis de vous revoir.",
    raison: "Vous hésitez encore : la première consultation permet de faire le point ensemble.",
  },
};

/** Ligne affichée sous chaque résultat. */
export const avertissement = "Cette orientation ne remplace pas l’avis du praticien.";

/** Ligne affichée au pied du guide. */
export const confidentialite = "Vos réponses restent dans ce navigateur : rien n’est envoyé.";
