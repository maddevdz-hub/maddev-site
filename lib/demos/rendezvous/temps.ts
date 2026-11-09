import { reglages } from "@/content/demos/rendezvous/reglages";

/**
 * Heure réelle, lue dans le fuseau du cabinet (Africa/Algiers),
 * quel que soit le fuseau de l'appareil du visiteur.
 */
export interface InstantCabinet {
  /** AAAA-MM-JJ */
  readonly jour: string;
  /** 0 = dimanche … 6 = samedi */
  readonly jourSemaine: number;
  /** Minutes depuis minuit. */
  readonly minutes: number;
}

const lecteur = new Intl.DateTimeFormat("en-GB", {
  timeZone: reglages.fuseau,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function instantCabinet(ms: number): InstantCabinet {
  const parts = Object.fromEntries(
    lecteur.formatToParts(new Date(ms)).map((p) => [p.type, p.value]),
  ) as Record<string, string>;
  const annee = Number(parts.year);
  const mois = Number(parts.month);
  const jour = Number(parts.day);
  const jourSemaine = new Date(Date.UTC(annee, mois - 1, jour)).getUTCDay();
  return {
    jour: `${parts.year}-${parts.month}-${parts.day}`,
    jourSemaine,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** « jeudi 24 septembre » à partir de AAAA-MM-JJ. */
export function formatJourLong(jour: string): string {
  const [a, m, j] = jour.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(a, m - 1, j)));
}

function versDate(jour: string): Date {
  const [a, m, j] = jour.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, j));
}

/** AAAA-MM-JJ décalé de n jours (calendrier civil, sans fuseau). */
export function ajouterJours(jour: string, n: number): string {
  const d = versDate(jour);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** 0 = dimanche … 6 = samedi. */
export function jourSemaineDe(jour: string): number {
  return versDate(jour).getUTCDay();
}

/** « aujourd’hui », « demain » ou « samedi 26 septembre ». */
export function libelleJour(jour: string, aujourdhui: string): string {
  if (jour === aujourdhui) return "aujourd’hui";
  if (jour === ajouterJours(aujourdhui, 1)) return "demain";
  return formatJourLong(jour);
}

/** « aujourd’hui », « demain » ou « le samedi 26 septembre », pour une phrase. */
export function jourDansPhrase(jour: string, aujourdhui: string): string {
  const l = libelleJour(jour, aujourdhui);
  return l === "aujourd’hui" || l === "demain" ? l : `le ${l}`;
}
