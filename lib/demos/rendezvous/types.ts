import type { SoinId } from "@/content/demos/rendezvous/soins";

export type StatutRendezVous = "confirme" | "annule";

export interface Patient {
  readonly prenom?: string;
  /** Numéro normalisé, par exemple 0555123456. Jamais envoyé nulle part. */
  readonly telephone: string;
}

/** Un rendez-vous, conservé en mémoire pendant la visite. */
export interface RendezVous {
  readonly id: string;
  /** Référence lisible remise au patient, par exemple CDC-4K7Q. */
  readonly reference: string;
  readonly soinId: SoinId;
  readonly fauteuil: number;
  /** Jour au format AAAA-MM-JJ, dans le fuseau du cabinet. */
  readonly jour: string;
  /** Minutes depuis minuit, heure d’Alger. */
  readonly debut: number;
  readonly duree: number;
  readonly statut: StatutRendezVous;
  readonly patient: Patient;
  /** « amorce » : agenda illustratif ; « en-ligne » : réservé sur le site. */
  readonly origine: "amorce" | "en-ligne";
}

/** Une personne inscrite sur la liste d’attente d’une journée complète. */
export interface Attente {
  readonly id: string;
  readonly jour: string;
  readonly fauteuil: number;
  readonly soinId: SoinId;
  readonly telephone: string;
  readonly origine: "amorce" | "en-ligne";
}

/** Un créneau libéré par une annulation côté cabinet. */
export interface Liberation {
  readonly id: string;
  readonly jour: string;
  readonly fauteuil: number;
  readonly soinId: SoinId;
  readonly debut: number;
  readonly duree: number;
  /** Moment de l’annulation, en millisecondes. */
  readonly instant: number;
  /** Personne en attente prévenue, s’il y en avait une. */
  readonly prevenu: Attente | null;
}
