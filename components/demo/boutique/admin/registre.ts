'use client';

import { useEffect, useState } from 'react';

import {
  CLE_COMMANDES,
  ecrireCommandes,
  lireCommandes,
  type Commande,
  type Ligne,
  type Statut,
} from '@/components/demo/boutique/commandes';
import { formaterTelephone } from '@/components/demo/boutique/telephone';
import { CODES_PROMO, OFFRE_JOINTE, fraisLivraison } from '@/content/demos/boutique-livraison';
import { libelleContenance, produit } from '@/content/demos/boutique';
import { wilayas } from '@/content/demos/wilayas';

/**
 * Le registre du marchand : lecture des commandes, alertes, commandes
 * d'exemple, liste noire.
 *
 * Tout est calculé à partir des commandes stockées dans ce navigateur :
 * aucun chiffre n'est écrit en dur. Les commandes d'exemple sont marquées
 * `exemple: true`, et leurs numéros sont masqués dès l'écriture
 * (« 05 •• •• •• 12 ») : ils ne peuvent pas être composés, même en lisant
 * le stockage du navigateur.
 */

export const CLE_EXEMPLES = 'nada-demo-exemples';
export const CLE_LISTE_NOIRE = 'nada-demo-liste-noire';

export const LIBELLE_STATUT: Record<Statut, string> = {
  nouvelle: 'À confirmer',
  'a-rappeler': 'À rappeler',
  confirmee: 'Confirmée',
  expediee: 'Expédiée',
  livree: 'Livrée',
  retournee: 'Retournée',
  annulee: 'Annulée',
};

/** Une commande d'exemple garde son numéro masqué ; une vraie est mise en forme. */
export function telephoneAffiche(c: Commande): string {
  return c.exemple ? c.client.telephone : formaterTelephone(c.client.telephone);
}

/** Les chiffres (ou leurs masques) du numéro : sert aux comparaisons. */
function cle(tel: string): string {
  return tel.replace(/[^\d•]/g, '');
}

// ── Alertes ────────────────────────────────────────────────────────────────

export type Alerte =
  | { type: 'numero'; texte: string }
  | { type: 'doublon'; texte: string; autre: string }
  | { type: 'refus'; texte: string; autre: string }
  | { type: 'liste-noire'; texte: string };

export type EntreeListeNoire = { telephone: string; nom: string; motif: string; date: string };

/**
 * Les alertes d'une commande, au regard des autres :
 *  - numéro qui n'est pas un mobile de 10 chiffres ;
 *  - même numéro, autre commande dans les 24 heures précédentes (doublon) ;
 *  - même numéro, colis déjà refusé à la livraison ;
 *  - numéro inscrit sur la liste noire.
 * Une commande close (livrée, retournée, annulée) n'alerte plus.
 */
export function alertesDe(c: Commande, toutes: Commande[], listeNoire: EntreeListeNoire[]): Alerte[] {
  if (['livree', 'retournee', 'annulee'].includes(c.statut)) return [];
  const a: Alerte[] = [];
  const k = cle(c.client.telephone);
  if (!/^0[567][\d•]{8}$/.test(k)) a.push({ type: 'numero', texte: 'Numéro invalide' });

  const t = new Date(c.date).getTime();
  const doublon = toutes.find(
    (x) => x.id !== c.id && cle(x.client.telephone) === k && x.statut !== 'annulee' &&
      new Date(x.date).getTime() < t && t - new Date(x.date).getTime() < 24 * 3600e3,
  );
  if (doublon) a.push({ type: 'doublon', texte: `Doublon possible de ${doublon.id}`, autre: doublon.id });

  const refus = toutes.find((x) => x.id !== c.id && cle(x.client.telephone) === k && x.statut === 'retournee');
  if (refus) a.push({ type: 'refus', texte: `A déjà refusé un colis (${refus.id})`, autre: refus.id });

  if (listeNoire.some((e) => cle(e.telephone) === k)) a.push({ type: 'liste-noire', texte: 'Sur la liste noire' });
  return a;
}

// ── Lecture et abonnement ─────────────────────────────────────────────────

export function lireListeNoire(): EntreeListeNoire[] {
  try {
    const brut = window.localStorage.getItem(CLE_LISTE_NOIRE);
    return brut ? (JSON.parse(brut) as EntreeListeNoire[]) : [];
  } catch {
    return [];
  }
}

export function ecrireListeNoire(l: EntreeListeNoire[]): void {
  try {
    window.localStorage.setItem(CLE_LISTE_NOIRE, JSON.stringify(l));
    window.dispatchEvent(new Event('nada-commandes'));
  } catch {
    /* stockage indisponible : la démo continue sans mémoire */
  }
}

/**
 * Les commandes et la liste noire, tenues à jour (autre onglet compris).
 * `null` tant que le navigateur n'a pas été lu : l'écran ne montre pas une
 * liste vide qui n'en est pas une.
 */
export function useRegistre(): { commandes: Commande[]; listeNoire: EntreeListeNoire[] } | null {
  const [etat, setEtat] = useState<{ commandes: Commande[]; listeNoire: EntreeListeNoire[] } | null>(null);
  useEffect(() => {
    assurerExemples();
    const lire = () => setEtat({ commandes: lireCommandes(), listeNoire: lireListeNoire() });
    lire();
    const surStockage = (e: StorageEvent) => {
      if (e.key === CLE_COMMANDES || e.key === CLE_LISTE_NOIRE) lire();
    };
    window.addEventListener('nada-commandes', lire);
    window.addEventListener('storage', surStockage);
    return () => {
      window.removeEventListener('nada-commandes', lire);
      window.removeEventListener('storage', surStockage);
    };
  }, []);
  return etat;
}

// ── Commandes d'exemple ───────────────────────────────────────────────────

type Gabarit = {
  id: string;
  /** Il y a combien de minutes. */
  il: number;
  nom: string;
  tel: string;
  wilaya: number;
  commune: string;
  daira: string;
  mode: 'domicile' | 'bureau';
  adresse?: string;
  /** slug, index de contenance, quantité ; `offre` pour la crème à −30 %. */
  lignes: [string, number, number, 'offre'?][];
  code?: string;
  /** Parcours des statuts, avec leur décalage en minutes après la commande. */
  parcours: [Statut, number, string?][];
  appels?: [number, 'joint' | 'pas-de-reponse' | 'occupe' | 'eteint' | 'rappeler'][];
  motif?: string;
};

const H = 60;
const J = 24 * H;

/**
 * Quatorze commandes fictives, datées par rapport au moment où le registre
 * est ouvert pour la première fois. Deux sont suspectes : un doublon
 * (ND-7QK2D, même numéro que ND-3HW8P trois heures plus tôt) et un numéro à
 * neuf chiffres (ND-9VB4L). Noms et numéros inventés ; numéros masqués.
 */
const GABARITS: Gabarit[] = [
  { id: 'ND-K4M7R', il: 25, nom: 'Amina Belkacem', tel: '05 •• •• •• 12', wilaya: 16, commune: 'Bab Ezzouar', daira: 'Dar El Beida', mode: 'domicile', adresse: 'Cité 5 Juillet, bât. 12', lignes: [['rose-de-blida', 0, 1]], parcours: [['nouvelle', 0]] },
  { id: 'ND-P8T3N', il: 70, nom: 'Yacine Kaci', tel: '06 •• •• •• 47', wilaya: 31, commune: 'Bir El Djir', daira: 'Bir El Djir', mode: 'bureau', lignes: [['ambre-du-sahara', 1, 1], ['creme-mains', 0, 1, 'offre']], parcours: [['nouvelle', 0]] },
  { id: 'ND-7QK2D', il: 2 * H, nom: 'Sara Medjahed', tel: '07 •• •• •• 85', wilaya: 19, commune: 'El Eulma', daira: 'El Eulma', mode: 'domicile', adresse: 'Rue des frères Bouzid, près de la poste', lignes: [['neroli-de-tipaza', 0, 1]], parcours: [['nouvelle', 0]] },
  { id: 'ND-9VB4L', il: 3 * H, nom: 'Karim Zerrouki', tel: '06 •• •• •• 3', wilaya: 5, commune: 'Batna', daira: 'Batna', mode: 'domicile', adresse: 'Cité 1 200 logements', lignes: [['musc-blanc', 0, 1]], parcours: [['nouvelle', 0]] },
  { id: 'ND-3HW8P', il: 5 * H, nom: 'Sara Medjahed', tel: '07 •• •• •• 85', wilaya: 19, commune: 'El Eulma', daira: 'El Eulma', mode: 'domicile', adresse: 'Rue des frères Bouzid, près de la poste', lignes: [['neroli-de-tipaza', 0, 1]], parcours: [['nouvelle', 0], ['a-rappeler', 40, 'Pas de réponse']], appels: [[40, 'pas-de-reponse']] },
  { id: 'ND-F6R9C', il: J + 3 * H, nom: 'Nour El Houda Bensalem', tel: '05 •• •• •• 64', wilaya: 47, commune: 'Metlili', daira: 'Metlili', mode: 'bureau', lignes: [['huile-d-oud', 0, 1]], parcours: [['nouvelle', 0], ['a-rappeler', 30, 'Pas de réponse'], ['a-rappeler', 4 * H, 'Demande à être rappelée après 17 h']], appels: [[30, 'pas-de-reponse'], [4 * H, 'rappeler']] },
  { id: 'ND-2XJ5T', il: J + 6 * H, nom: 'Mehdi Hamidi', tel: '07 •• •• •• 21', wilaya: 9, commune: 'Boufarik', daira: 'Boufarik', mode: 'domicile', adresse: 'Lotissement El Wiam, villa 8', lignes: [['coffret-decouverte', 0, 1]], parcours: [['nouvelle', 0], ['confirmee', 50]], appels: [[50, 'joint']] },
  { id: 'ND-L3D8W', il: J + 9 * H, nom: 'Lydia Ait Ahmed', tel: '05 •• •• •• 90', wilaya: 15, commune: 'Azazga', daira: 'Azazga', mode: 'domicile', adresse: 'Route de Yakouren, en face de la pharmacie', lignes: [['rose-de-blida', 1, 1], ['musc-blanc', 0, 1]], parcours: [['nouvelle', 0], ['confirmee', 2 * H]], appels: [[H, 'occupe'], [2 * H, 'joint']] },
  { id: 'ND-B7N2Q', il: 2 * J + 4 * H, nom: 'Riad Boudiaf', tel: '06 •• •• •• 38', wilaya: 25, commune: 'El Khroub', daira: 'El Khroub', mode: 'bureau', lignes: [['ambre-du-sahara', 0, 1]], parcours: [['nouvelle', 0], ['confirmee', 35], ['expediee', 20 * H]], appels: [[35, 'joint']] },
  { id: 'ND-W5C9H', il: 3 * J + 2 * H, nom: 'Imene Larbi', tel: '07 •• •• •• 56', wilaya: 6, commune: 'Akbou', daira: 'Akbou', mode: 'domicile', adresse: 'Cité Guendouza, bloc C', lignes: [['brume-cheveux', 0, 1], ['creme-mains', 0, 1]], parcours: [['nouvelle', 0], ['confirmee', H], ['expediee', 22 * H]], appels: [[H, 'joint']] },
  { id: 'ND-M8P4K', il: 5 * J + 7 * H, nom: 'Sofiane Mekki', tel: '05 •• •• •• 77', wilaya: 16, commune: 'Kouba', daira: 'Hussein Dey', mode: 'domicile', adresse: 'Rue Garidi, immeuble 4', lignes: [['rose-de-blida', 0, 1]], code: 'TIKTOK10', parcours: [['nouvelle', 0], ['confirmee', 25], ['expediee', 18 * H], ['livree', 2 * J]], appels: [[25, 'joint']] },
  { id: 'ND-T2G6V', il: 6 * J + 5 * H, nom: 'Wafa Benali', tel: '06 •• •• •• 09', wilaya: 13, commune: 'Maghnia', daira: 'Maghnia', mode: 'bureau', lignes: [['neroli-de-tipaza', 1, 1]], parcours: [['nouvelle', 0], ['confirmee', 3 * H], ['expediee', J], ['livree', 3 * J]], appels: [[3 * H, 'joint']] },
  { id: 'ND-R9S3F', il: 7 * J + 3 * H, nom: 'Hichem Touati', tel: '07 •• •• •• 43', wilaya: 7, commune: 'Tolga', daira: 'Tolga', mode: 'bureau', lignes: [['huile-d-oud', 0, 1]], parcours: [['nouvelle', 0], ['confirmee', 2 * H], ['expediee', J], ['retournee', 5 * J]], appels: [[2 * H, 'joint']], motif: 'Refusé à la livraison' },
  { id: 'ND-C5Z7J', il: 4 * J + 8 * H, nom: 'Meriem Saidi', tel: '05 •• •• •• 31', wilaya: 23, commune: 'El Bouni', daira: 'El Bouni', mode: 'domicile', adresse: 'Cité Boukhadra 3', lignes: [['ambre-du-sahara', 1, 1]], parcours: [['nouvelle', 0], ['annulee', 2 * H]], appels: [[2 * H, 'joint']], motif: 'A changé d’avis' },
];

function construire(g: Gabarit, maintenant: number): Commande {
  const depart = maintenant - g.il * 60e3;
  const iso = (apres: number) => new Date(depart + apres * 60e3).toISOString();
  const lignes: Ligne[] = g.lignes.map(([slug, i, q, offre]) => {
    const p = produit(slug)!;
    const c = p.contenances[i];
    return {
      slug,
      nom: p.nom,
      contenance: libelleContenance(c),
      prixUnitaire: offre ? Math.round(c.prix * (1 - OFFRE_JOINTE.remise / 100)) : c.prix,
      quantite: q,
      ...(offre ? { remise: OFFRE_JOINTE.remise } : {}),
    };
  });
  const articles = lignes.reduce((s, l) => s + l.quantite, 0);
  const brut = g.lignes.reduce((s, [slug, i, q]) => s + produit(slug)!.contenances[i].prix * q, 0);
  const net = lignes.reduce((s, l) => s + l.prixUnitaire * l.quantite, 0);
  const promo = g.code ? Math.round((net * CODES_PROMO[g.code]) / 100) : 0;
  const frais = fraisLivraison(g.wilaya, g.mode, articles);
  return {
    id: g.id,
    jeton: `exemple-${g.id}`,
    date: iso(0),
    client: { nom: g.nom, telephone: g.tel },
    livraison: {
      codeWilaya: g.wilaya,
      wilaya: wilayas.find((w) => w.code === g.wilaya)!.nom,
      commune: g.commune,
      mode: g.mode,
      adresse: g.adresse,
      lieuBureau: g.mode === 'bureau' ? g.daira : undefined,
      frais,
      delai: '',
    },
    lignes,
    codePromo: g.code,
    sousTotal: brut,
    remise: brut - net + promo,
    total: net - promo + frais,
    statut: g.parcours[g.parcours.length - 1][0],
    historique: g.parcours.map(([statut, apres, note]) => ({ statut, date: iso(apres), ...(note ? { note } : {}) })),
    appels: g.appels?.map(([apres, issue]) => ({ date: iso(apres), issue })),
    motif: g.motif,
    exemple: true,
  };
}

/** Écrit les commandes d'exemple une seule fois par navigateur (ou après réinitialisation). */
export function assurerExemples(): void {
  try {
    if (window.localStorage.getItem(CLE_EXEMPLES)) return;
    const maintenant = Date.now();
    const vraies = lireCommandes().filter((c) => !c.exemple);
    const ok = ecrireCommandes([...vraies, ...GABARITS.map((g) => construire(g, maintenant))]);
    if (ok) window.localStorage.setItem(CLE_EXEMPLES, String(maintenant));
  } catch {
    /* stockage indisponible */
  }
}

/** Remet la démo à zéro : commandes, stocks, liste noire, puis les exemples. */
export function reinitialiserDemo(): void {
  try {
    for (const k of [CLE_COMMANDES, CLE_EXEMPLES, CLE_LISTE_NOIRE, 'nada-demo-stocks']) window.localStorage.removeItem(k);
  } catch {
    /* stockage indisponible */
  }
  assurerExemples();
  window.dispatchEvent(new Event('nada-commandes'));
  window.dispatchEvent(new Event('nada-stocks'));
}

// ── Mise en forme ─────────────────────────────────────────────────────────

/** « il y a 25 min », « aujourd’hui, 9 h 40 », « hier, 18 h 05 », « lun. 9 nov. ». */
export function quand(iso: string, maintenant = Date.now()): string {
  const d = new Date(iso);
  const ecart = (maintenant - d.getTime()) / 60e3;
  const heure = `${d.getHours()} h ${String(d.getMinutes()).padStart(2, '0')}`;
  if (ecart < 1) return 'à l’instant';
  if (ecart < 60) return `il y a ${Math.round(ecart)} min`;
  const minuit = new Date(maintenant);
  minuit.setHours(0, 0, 0, 0);
  if (d.getTime() >= minuit.getTime()) return `aujourd’hui, ${heure}`;
  if (d.getTime() >= minuit.getTime() - 24 * 3600e3) return `hier, ${heure}`;
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}
