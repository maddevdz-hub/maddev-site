import type { Visuel } from "./visuels";

/**
 * Les soins proposés à la réservation.
 * La durée pilote le calcul des créneaux : un horaire qui ne peut pas
 * contenir le soin en entier n’est jamais proposé.
 * Le fauteuil indique l’agenda sur lequel le soin est réservé.
 */
export type SoinId =
  | "premiere-consultation"
  | "controle-orthodontique"
  | "pose-appareil"
  | "detartrage"
  | "eclaircissement"
  | "urgence";

export type DureeMinutes = 20 | 30 | 60;

export interface Soin {
  readonly id: SoinId;
  readonly nom: string;
  readonly description: string;
  readonly duree: DureeMinutes;
  readonly fauteuil: number;
  readonly visuel: Visuel;
}

export const soins: readonly Soin[] = [
  {
    id: "premiere-consultation",
    nom: "Première consultation",
    description:
      "Examen, écoute de vos attentes et plan de traitement expliqué pas à pas.",
    duree: 30,
    fauteuil: 1,
    visuel: { type: "dessin", dessin: "premiere-consultation" },
  },
  {
    id: "controle-orthodontique",
    nom: "Contrôle orthodontique",
    description: "Suivi et réglage de votre appareil ou de vos aligneurs.",
    duree: 20,
    fauteuil: 1,
    visuel: { type: "dessin", dessin: "controle-orthodontique" },
  },
  {
    id: "pose-appareil",
    nom: "Pose d’appareil",
    description:
      "Pose des bagues ou remise des aligneurs, avec les conseils des premiers jours.",
    duree: 60,
    fauteuil: 1,
    visuel: { type: "dessin", dessin: "pose-appareil" },
  },
  {
    id: "detartrage",
    nom: "Détartrage",
    description: "Nettoyage professionnel et polissage, pour des gencives saines.",
    duree: 30,
    fauteuil: 2,
    visuel: { type: "dessin", dessin: "detartrage" },
  },
  {
    id: "eclaircissement",
    nom: "Éclaircissement",
    description: "Séance au fauteuil pour éclaircir la teinte de vos dents, en douceur.",
    duree: 30,
    fauteuil: 2,
    visuel: { type: "dessin", dessin: "eclaircissement" },
  },
  {
    id: "urgence",
    nom: "Urgence",
    description:
      "Douleur, bague décollée, fil qui blesse : un créneau court pour vous soulager.",
    duree: 20,
    fauteuil: 1,
    visuel: { type: "dessin", dessin: "urgence" },
  },
];

export function soinParId(id: SoinId): Soin {
  const soin = soins.find((s) => s.id === id);
  if (!soin) throw new Error(`Soin inconnu : ${id}`);
  return soin;
}
