/**
 * Livraison de la démonstration Nadâ : zones, tarifs, délais. TOUT EST
 * FICTIF — ce sont les conditions de la marque inventée, pas celles d'un
 * transporteur. Aucun nom ni logo de transporteur n'apparaît dans la démo.
 *
 * Les tarifs suivent quatre zones, du centre au Sud. Le délai s'affiche en
 * jours de semaine (le vendredi ne compte pas).
 *
 * Règle de la livraison à domicile : partout dans le Nord et les Hauts
 * Plateaux ; dans le Sud, seulement au chef-lieu de daïra. Ailleurs, le
 * colis attend au bureau du livreur, au chef-lieu de la daïra de la commune —
 * une donnée réelle, tirée du jeu de données des communes.
 */

export type Zone = 'centre' | 'nord' | 'hauts-plateaux' | 'sud';
export type Mode = 'domicile' | 'bureau';

const ZONES: Record<Zone, number[]> = {
  centre: [9, 16, 35, 42],
  nord: [2, 4, 6, 10, 13, 15, 18, 19, 21, 22, 23, 24, 25, 26, 27, 29, 31, 34, 36, 41, 43, 44, 46, 48],
  'hauts-plateaux': [3, 5, 12, 14, 17, 20, 28, 32, 38, 40, 45, 59, 60, 62, 63, 64, 65, 66, 67, 68],
  sud: [1, 7, 8, 11, 30, 33, 37, 39, 47, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 61, 69],
};

export const TARIFS: Record<Zone, { domicile: number; bureau: number; jours: [number, number] }> = {
  centre: { domicile: 600, bureau: 400, jours: [1, 2] },
  nord: { domicile: 700, bureau: 450, jours: [2, 3] },
  'hauts-plateaux': { domicile: 850, bureau: 550, jours: [3, 4] },
  sud: { domicile: 1100, bureau: 700, jours: [4, 6] },
};

/** La livraison est offerte à partir de ce nombre d'articles (condition de la marque). */
export const ARTICLES_LIVRAISON_OFFERTE = 2;

export function zoneDe(codeWilaya: number): Zone {
  for (const [zone, codes] of Object.entries(ZONES) as [Zone, number[]][]) {
    if (codes.includes(codeWilaya)) return zone;
  }
  return 'sud';
}

export type Commune = { nom: string; daira: string };

const normaliser = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/gi, '')
    .toLowerCase();

/** Le chef-lieu de daïra porte le nom de sa daïra. */
export function estChefLieu(c: Commune): boolean {
  return normaliser(c.nom) === normaliser(c.daira);
}

export function domicileDisponible(codeWilaya: number, c: Commune): boolean {
  return zoneDe(codeWilaya) !== 'sud' || estChefLieu(c);
}

export function fraisLivraison(codeWilaya: number, mode: Mode, articles: number): number {
  if (articles >= ARTICLES_LIVRAISON_OFFERTE) return 0;
  return TARIFS[zoneDe(codeWilaya)][mode];
}

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

/** Ajoute n jours ouvrés (le vendredi est sauté). */
function ajouterJours(depart: Date, n: number): Date {
  const d = new Date(depart);
  let restant = n;
  while (restant > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 5) restant--;
  }
  return d;
}

/** « entre mardi 18 et jeudi 20 » — calculé à partir d'aujourd'hui. */
export function delaiEstime(codeWilaya: number, aujourdhui = new Date()): string {
  const [min, max] = TARIFS[zoneDe(codeWilaya)].jours;
  const a = ajouterJours(aujourdhui, min);
  const b = ajouterJours(aujourdhui, max);
  return `entre ${JOURS[a.getDay()]} ${a.getDate()} et ${JOURS[b.getDay()]} ${b.getDate()}`;
}

/** « de Blida », mais « d’Aougrout » : l'élision devant une voyelle ou un h. */
export function de(nom: string): string {
  return /^[aeiouyâàéèêëîïôöûüh]/i.test(nom) ? `d’${nom}` : `de ${nom}`;
}

/** Codes de réduction : ils arrivent par le lien de la publicité, jamais par un champ à remplir. */
export const CODES_PROMO: Record<string, number> = { TIKTOK10: 10, INSTA10: 10 };

/** L'offre jointe de la fiche : la crème mains à −30 % avec une commande. */
export const OFFRE_JOINTE = { slug: 'creme-mains', remise: 30 };
