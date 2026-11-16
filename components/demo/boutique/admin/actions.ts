'use client';

import { ecrireListeNoire, lireListeNoire } from '@/components/demo/boutique/admin/registre';
import {
  ecrireCommandes,
  lireCommandes,
  type Commande,
  type IssueAppel,
  type Statut,
} from '@/components/demo/boutique/commandes';
import { ecrireStocks, lireStocks } from '@/components/demo/boutique/stocks';

/**
 * Les gestes du marchand sur une commande. Chacun relit le stockage, modifie
 * une seule commande, ajoute une ligne à l'historique et réécrit : deux
 * onglets ouverts ne s'écrasent pas sur une donnée périmée.
 *
 * Stock : il baisse à la CONFIRMATION, pas à la commande — une commande
 * qu'on n'arrive pas à confirmer ne bloque pas un flacon. Il remonte si une
 * commande confirmée est annulée ou revient (retour).
 */

export const MOTIFS_ANNULATION = [
  'Injoignable après plusieurs appels',
  'A changé d’avis',
  'Commande en double',
  'Numéro invalide',
  'Trouve la livraison trop chère',
  'Autre',
];

export const MOTIFS_RETOUR = [
  'Refusé à la livraison',
  'Injoignable par le livreur',
  'Absent au passage du livreur',
  'Adresse introuvable',
  'Autre',
];

export const LIBELLE_APPEL: Record<IssueAppel, string> = {
  joint: 'Joint',
  'pas-de-reponse': 'Pas de réponse',
  occupe: 'Occupé',
  eteint: 'Éteint',
  rappeler: 'Demande à être rappelé',
};

function modifier(id: string, f: (c: Commande) => Commande): Commande | undefined {
  const toutes = lireCommandes();
  const i = toutes.findIndex((c) => c.id === id);
  if (i < 0) return undefined;
  toutes[i] = f(toutes[i]);
  ecrireCommandes(toutes);
  return toutes[i];
}

function bouger(c: Commande, statut: Statut, note?: string): Commande {
  const date = new Date().toISOString();
  return { ...c, statut, historique: [...c.historique, { statut, date, ...(note ? { note } : {}) }] };
}

function mouvementStock(c: Commande, sens: 1 | -1): void {
  const stocks = lireStocks();
  for (const l of c.lignes) stocks[l.slug] = Math.max(0, (stocks[l.slug] ?? 0) + sens * l.quantite);
  ecrireStocks(stocks);
}

/** Note un appel. Non joint : la commande passe « à rappeler », avec la raison. */
export function noterAppel(id: string, issue: IssueAppel): void {
  modifier(id, (c) => {
    const avecAppel = { ...c, appels: [...(c.appels ?? []), { date: new Date().toISOString(), issue }] };
    return issue === 'joint' ? avecAppel : bouger(avecAppel, 'a-rappeler', LIBELLE_APPEL[issue]);
  });
}

export function confirmer(id: string): void {
  modifier(id, (c) => {
    if (!c.stockPris) mouvementStock(c, -1);
    return { ...bouger(c, 'confirmee', 'Confirmée par téléphone'), stockPris: true };
  });
}

/** Envoi simulé : un numéro de suivi fictif, aucun transporteur contacté. */
export function expedier(id: string): void {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let n = '';
  for (let i = 0; i < 8; i++) n += a[Math.floor(Math.random() * a.length)];
  modifier(id, (c) => ({
    ...bouger(c, 'expediee', 'Envoi simulé'),
    envoi: { numero: `SIM-${n}`, date: new Date().toISOString() },
  }));
}

export function marquerLivree(id: string): void {
  modifier(id, (c) => bouger(c, 'livree', 'Payée au livreur'));
}

export function marquerRetournee(id: string, motif: string): void {
  modifier(id, (c) => {
    if (c.stockPris) mouvementStock(c, 1);
    return { ...bouger(c, 'retournee', motif), motif, stockPris: false };
  });
}

export function annuler(id: string, motif: string): void {
  modifier(id, (c) => {
    if (c.stockPris) mouvementStock(c, 1);
    return { ...bouger(c, 'annulee', motif), motif, stockPris: false };
  });
}

// ── Liste noire ───────────────────────────────────────────────────────────

const cle = (t: string) => t.replace(/[^\d•]/g, '');

export function ajouterListeNoire(telephone: string, nom: string, motif: string): void {
  const l = lireListeNoire();
  if (l.some((e) => cle(e.telephone) === cle(telephone))) return;
  ecrireListeNoire([{ telephone, nom, motif, date: new Date().toISOString() }, ...l]);
}

export function retirerListeNoire(telephone: string): void {
  ecrireListeNoire(lireListeNoire().filter((e) => cle(e.telephone) !== cle(telephone)));
}
