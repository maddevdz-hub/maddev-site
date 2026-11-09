import { reglages } from "@/content/demos/rendezvous/reglages";
import type { Soin } from "@/content/demos/rendezvous/soins";
import { ajouterJours, jourSemaineDe, type InstantCabinet } from "./temps";
import type { RendezVous } from "./types";

/**
 * Calcul des créneaux, dans le fuseau du cabinet.
 *
 * Une heure de début est proposée tous les `pasMinutes`. Pour un soin donné :
 * - « pris » : l’heure tombe pendant un rendez-vous déjà réservé sur son fauteuil ;
 * - « libre » : le soin tient en entier avant le rendez-vous suivant et avant
 *   la fermeture ;
 * - sinon l’heure n’est pas proposée du tout : le soin n’y tiendrait pas.
 */
export type EtatCreneau = "libre" | "pris";

export interface Creneau {
  readonly debut: number;
  readonly etat: EtatCreneau;
}

export interface CreneauChoisi {
  readonly jour: string;
  readonly debut: number;
}

export function estOuvert(jour: string): boolean {
  return reglages.horaires.joursOuverts.includes(jourSemaineDe(jour));
}

function occupations(
  rendezVous: readonly RendezVous[],
  jour: string,
  fauteuil: number,
): readonly (readonly [number, number])[] {
  return rendezVous
    .filter((r) => r.statut === "confirme" && r.jour === jour && r.fauteuil === fauteuil)
    .map((r) => [r.debut, r.debut + r.duree] as const);
}

export function creneauxDuJour(
  soin: Soin,
  jour: string,
  rendezVous: readonly RendezVous[],
  maintenant: InstantCabinet,
): Creneau[] {
  if (!estOuvert(jour) || jour < maintenant.jour) return [];
  const { ouverture, fermeture } = reglages.horaires;
  const { pasMinutes, delaiMinimumMinutes } = reglages.reservation;
  const limite = jour === maintenant.jour ? maintenant.minutes + delaiMinimumMinutes : ouverture;
  const occ = occupations(rendezVous, jour, soin.fauteuil);
  const liste: Creneau[] = [];

  for (let debut = ouverture; debut < fermeture; debut += pasMinutes) {
    if (debut < limite) continue;
    if (occ.some(([a, b]) => debut >= a && debut < b)) {
      liste.push({ debut, etat: "pris" });
      continue;
    }
    const fin = debut + soin.duree;
    if (fin > fermeture) continue;
    if (occ.some(([a, b]) => a < fin && b > debut)) continue;
    liste.push({ debut, etat: "libre" });
  }
  return liste;
}

export function libresDuJour(
  soin: Soin,
  jour: string,
  rendezVous: readonly RendezVous[],
  maintenant: InstantCabinet,
): number {
  return creneauxDuJour(soin, jour, rendezVous, maintenant).filter((c) => c.etat === "libre").length;
}

/** Jours proposés à la réservation, aujourd’hui compris, vendredis inclus (fermés). */
export function joursReservables(maintenant: InstantCabinet): string[] {
  const jours: string[] = [];
  let ouverts = 0;
  for (let i = 0; ouverts < reglages.reservation.horizonJours; i++) {
    const jour = ajouterJours(maintenant.jour, i);
    jours.push(jour);
    if (estOuvert(jour)) ouverts++;
  }
  return jours;
}

/** Les sept jours d’une semaine du calendrier : 0 = à partir d’aujourd’hui. */
export function joursDeLaSemaine(maintenant: InstantCabinet, semaine: number): string[] {
  return joursReservables(maintenant).slice(semaine * 7, semaine * 7 + 7);
}

export function nombreSemaines(maintenant: InstantCabinet): number {
  return Math.ceil(joursReservables(maintenant).length / 7);
}

export function semaineDuJour(maintenant: InstantCabinet, jour: string): number {
  const i = joursReservables(maintenant).indexOf(jour);
  return i < 0 ? 0 : Math.floor(i / 7);
}

/** Nombre de créneaux libres sur les sept jours affichés « cette semaine ». */
export function libresCetteSemaine(
  soin: Soin,
  rendezVous: readonly RendezVous[],
  maintenant: InstantCabinet,
): number {
  return joursDeLaSemaine(maintenant, 0).reduce(
    (total, jour) => total + libresDuJour(soin, jour, rendezVous, maintenant),
    0,
  );
}

export type StatutJour = "ferme" | "termine" | "complet" | "libre";

export function statutDuJour(
  soin: Soin | null,
  jour: string,
  rendezVous: readonly RendezVous[],
  maintenant: InstantCabinet,
): { statut: StatutJour; libres: number } {
  if (!estOuvert(jour)) return { statut: "ferme", libres: 0 };
  const { fermeture } = reglages.horaires;
  const { delaiMinimumMinutes } = reglages.reservation;
  if (jour === maintenant.jour && maintenant.minutes + delaiMinimumMinutes >= fermeture) {
    return { statut: "termine", libres: 0 };
  }
  if (!soin) return { statut: "libre", libres: 0 };
  const creneaux = creneauxDuJour(soin, jour, rendezVous, maintenant);
  const libres = creneaux.filter((c) => c.etat === "libre").length;
  if (libres > 0) return { statut: "libre", libres };
  return { statut: creneaux.length === 0 && jour === maintenant.jour ? "termine" : "complet", libres: 0 };
}

/** Premier jour, parmi ceux donnés, où ce soin a au moins un créneau libre. */
export function premierJourLibre(
  soin: Soin,
  rendezVous: readonly RendezVous[],
  maintenant: InstantCabinet,
  jours: readonly string[] = joursReservables(maintenant),
): string | null {
  return jours.find((jour) => libresDuJour(soin, jour, rendezVous, maintenant) > 0) ?? null;
}

/** Premier créneau libre pour ce soin, à partir de maintenant. */
export function premierCreneauLibre(
  soin: Soin,
  rendezVous: readonly RendezVous[],
  maintenant: InstantCabinet,
): CreneauChoisi | null {
  for (const jour of joursReservables(maintenant)) {
    const libre = creneauxDuJour(soin, jour, rendezVous, maintenant).find((c) => c.etat === "libre");
    if (libre) return { jour, debut: libre.debut };
  }
  return null;
}

/**
 * Journée affichée dans l’espace cabinet : aujourd’hui si le cabinet est
 * ouvert et que la journée n’est pas finie, sinon le prochain jour ouvert.
 */
export function journeeCabinet(maintenant: InstantCabinet): string {
  const { fermeture } = reglages.horaires;
  if (estOuvert(maintenant.jour) && maintenant.minutes < fermeture - 30) return maintenant.jour;
  for (let i = 1; i < 8; i++) {
    const jour = ajouterJours(maintenant.jour, i);
    if (estOuvert(jour)) return jour;
  }
  return maintenant.jour;
}
