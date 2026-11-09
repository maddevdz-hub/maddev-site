import type { Visuel } from "./visuels";

/**
 * Réglages de la clinique.
 * Tout ce qui est affiché sur le site à propos de la clinique vient d'ici.
 *
 * Clinique FICTIVE, conçue pour la démonstration de MADDEV. Le nom, l'adresse
 * et le numéro n'appartiennent à personne. Le bandeau en haut de chaque page
 * le dit, et c'est la condition qui rend cette page acceptable.
 * Jours de la semaine : 0 = dimanche, 1 = lundi … 5 = vendredi, 6 = samedi.
 */
export interface Reglages {
  readonly cabinet: {
    readonly nom: string;
    /** Le nom tel qu'il s'écrit dans la navigation et le pied de page. */
    readonly nomCourt: string;
    /** La ligne sous le nom court, en petites capitales. */
    readonly designation: string;
    readonly specialites: readonly string[];
    readonly quartier: string;
    readonly ville: string;
    /** Adresse affichée dans le pied de page. */
    readonly adresse: string;
  };
  /** Fuseau utilisé pour tous les calculs d'horaires. */
  readonly fuseau: "Africa/Algiers";
  readonly horaires: {
    /** Minutes depuis minuit : 8 h = 480. */
    readonly ouverture: number;
    /** Minutes depuis minuit : 16 h = 960. */
    readonly fermeture: number;
    /** Limite entre matin et après-midi pour regrouper les créneaux. */
    readonly midi: number;
    /** Jours ouverts, dans l'ordre d'affichage : samedi → jeudi. */
    readonly joursOuverts: readonly number[];
    readonly jourFerme: number;
    readonly messageFermeture: string;
  };
  /** Numéros des fauteuils. Aucun nom de praticien n'est affiché. */
  readonly fauteuils: readonly number[];
  readonly reservation: {
    /** Écart entre deux heures de début proposées, en minutes. */
    readonly pasMinutes: number;
    /** Délai minimum entre maintenant et un rendez-vous pris le jour même. */
    readonly delaiMinimumMinutes: number;
    /** Nombre de jours ouverts à la réservation, aujourd'hui compris. */
    readonly horizonJours: number;
  };
  readonly rappel: {
    readonly canal: "WhatsApp";
    /** Délai du rappel avant le rendez-vous, en heures. */
    readonly delaiHeures: number;
  };
  /** Visuel de l'accueil : dessin aujourd'hui, photo demain. */
  readonly visuelAccueil: Visuel;
}

export const reglages: Reglages = {
  cabinet: {
    nom: "Clinique Dentaire El Yasmine",
    nomCourt: "El Yasmine",
    designation: "Clinique dentaire",
    specialites: ["Orthodontie", "Esthétique dentaire"],
    quartier: "Hydra",
    ville: "Alger",
    adresse: "14 rue des Oliviers, Hydra, Alger",
  },
  fuseau: "Africa/Algiers",
  horaires: {
    ouverture: 8 * 60,
    fermeture: 16 * 60,
    midi: 12 * 60,
    joursOuverts: [6, 0, 1, 2, 3, 4],
    jourFerme: 5,
    messageFermeture: "Le cabinet est fermé le vendredi.",
  },
  fauteuils: [1, 2],
  reservation: {
    pasMinutes: 20,
    delaiMinimumMinutes: 30,
    horizonJours: 14,
  },
  rappel: {
    canal: "WhatsApp",
    delaiHeures: 24,
  },
  visuelAccueil: { type: "dessin", dessin: "arcade" },
};
