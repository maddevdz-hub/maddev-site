import { reglages } from "@/content/demos/rendezvous/reglages";
import { soins } from "@/content/demos/rendezvous/soins";
import { estOuvert, joursReservables, journeeCabinet } from "./creneaux";
import type { InstantCabinet } from "./temps";
import type { Attente, RendezVous } from "./types";

/**
 * Agenda illustratif qui peuple la démonstration au chargement.
 *
 * Les rendez-vous sont tirés d’un générateur pseudo-aléatoire initialisé par
 * la date : une même journée donne toujours le même agenda, sur le serveur
 * comme dans le navigateur. Les débuts tombent sur la grille des créneaux.
 * Le deuxième jour ouvert est complet, pour montrer la liste d’attente, et
 * la journée affichée côté cabinet compte des personnes en attente.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const PREFIXES = ["0550", "0551", "0555", "0661", "0662", "0696", "0770", "0771", "0792"];

function empreinte(texte: string): number {
  let h = 2166136261;
  for (let i = 0; i < texte.length; i++) {
    h ^= texte.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function generateur(graine: number): () => number {
  let a = graine;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function reference(alea: () => number = Math.random): string {
  let r = "CDC-";
  for (let i = 0; i < 4; i++) r += ALPHABET[Math.floor(alea() * ALPHABET.length)];
  return r;
}

function telephoneFictif(alea: () => number): string {
  let t = PREFIXES[Math.floor(alea() * PREFIXES.length)];
  for (let i = 0; i < 6; i++) t += Math.floor(alea() * 10);
  return t;
}

/** Part du temps occupée, par fauteuil : le fauteuil 1 (orthodontie) est le plus demandé. */
const DENSITE: Record<number, number> = { 1: 0.55, 2: 0.48 };

export interface Amorce {
  readonly rendezVous: RendezVous[];
  readonly attentes: Attente[];
}

export function amorce(maintenant: InstantCabinet): Amorce {
  const { ouverture, fermeture } = reglages.horaires;
  const pas = reglages.reservation.pasMinutes;
  const joursOuverts = joursReservables(maintenant).filter(estOuvert);
  const jourComplet = joursOuverts[1] ?? joursOuverts[0];
  const rendezVous: RendezVous[] = [];

  for (const jour of joursOuverts) {
    const complet = jour === jourComplet;
    for (const fauteuil of reglages.fauteuils) {
      const possibles = soins.filter((s) => s.fauteuil === fauteuil);
      if (possibles.length === 0) continue;
      const alea = generateur(empreinte(`${jour}#${fauteuil}`));
      const densite = complet ? 1 : (DENSITE[fauteuil] ?? 0.5);
      let t = ouverture;

      while (t < fermeture) {
        if (alea() < densite) {
          const tiennent = possibles.filter((s) => t + s.duree <= fermeture);
          if (tiennent.length === 0) break;
          const soin = tiennent[Math.floor(alea() * tiennent.length)];
          rendezVous.push({
            id: `amorce-${jour}-${fauteuil}-${t}`,
            reference: reference(alea),
            soinId: soin.id,
            fauteuil,
            jour,
            debut: t,
            duree: soin.duree,
            statut: "confirme",
            patient: { telephone: telephoneFictif(alea) },
            origine: "amorce",
          });
          // Le rendez-vous suivant reprend sur la grille des créneaux.
          t = ouverture + Math.ceil((t + soin.duree - ouverture) / pas) * pas;
        } else {
          t += pas * (1 + Math.floor(alea() * 2));
        }
      }
    }
  }

  const jourCabinet = journeeCabinet(maintenant);
  const alea = generateur(empreinte(`attente#${maintenant.jour}`));
  const lignes: readonly (readonly [string, number])[] = [
    [jourCabinet, 1],
    [jourCabinet, 2],
    [jourComplet, 1],
    [jourComplet, 1],
    [jourComplet, 2],
  ];
  const attentes: Attente[] = lignes.map(([jour, fauteuil], i) => {
    const possibles = soins.filter((s) => s.fauteuil === fauteuil);
    return {
      id: `attente-amorce-${i}`,
      jour,
      fauteuil,
      soinId: possibles[Math.floor(alea() * possibles.length)].id,
      telephone: telephoneFictif(alea),
      origine: "amorce",
    };
  });

  return { rendezVous, attentes };
}
