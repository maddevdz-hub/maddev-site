'use client';

import { useEffect, useState } from 'react';

import { produit, type Produit } from '@/content/demos/boutique';

/**
 * Le panier, pour qui veut plusieurs produits. La fiche se commande seule,
 * sans passer par lui : le panier est un chemin de plus, jamais un détour
 * obligatoire.
 *
 * Stocké dans le navigateur (clé nada-demo-panier), en try/catch. Un
 * évènement « nada-panier » prévient l'en-tête, qui met son compteur à jour.
 */
export const CLE_PANIER = 'nada-demo-panier';
/** Le code de réduction vu sur une fiche suit le visiteur jusqu'au panier. */
export const CLE_CODE = 'nada-demo-code';

export type ArticlePanier = { slug: string; contenance: number; quantite: number };

export type LignePanier = ArticlePanier & { produit: Produit };

function lire(): ArticlePanier[] {
  try {
    const brut = window.localStorage.getItem(CLE_PANIER);
    const liste = brut ? (JSON.parse(brut) as ArticlePanier[]) : [];
    // Un produit retiré du catalogue ne doit pas casser le panier.
    return liste.filter((a) => produit(a.slug));
  } catch {
    return [];
  }
}

function ecrire(liste: ArticlePanier[]) {
  try {
    window.localStorage.setItem(CLE_PANIER, JSON.stringify(liste));
  } catch {
    /* stockage indisponible : le panier ne survivra pas au rechargement */
  }
  window.dispatchEvent(new Event('nada-panier'));
}

export function ajouterAuPanier(slug: string, contenance = 0, quantite = 1) {
  const liste = lire();
  const deja = liste.find((a) => a.slug === slug && a.contenance === contenance);
  if (deja) deja.quantite = Math.min(5, deja.quantite + quantite);
  else liste.push({ slug, contenance, quantite });
  ecrire(liste);
}

export function changerQuantite(slug: string, contenance: number, quantite: number) {
  const liste = lire()
    .map((a) => (a.slug === slug && a.contenance === contenance ? { ...a, quantite } : a))
    .filter((a) => a.quantite > 0);
  ecrire(liste);
}

export function viderPanier() {
  ecrire([]);
}

export function usePanier(): LignePanier[] | null {
  const [liste, setListe] = useState<ArticlePanier[] | null>(null);
  useEffect(() => {
    const relire = () => setListe(lire());
    relire();
    window.addEventListener('nada-panier', relire);
    window.addEventListener('storage', relire);
    return () => {
      window.removeEventListener('nada-panier', relire);
      window.removeEventListener('storage', relire);
    };
  }, []);
  return liste === null ? null : liste.map((a) => ({ ...a, produit: produit(a.slug)! }));
}

export function lireCode(): string | null {
  try {
    return window.localStorage.getItem(CLE_CODE);
  } catch {
    return null;
  }
}

export function ecrireCode(code: string) {
  try {
    window.localStorage.setItem(CLE_CODE, code);
  } catch {
    /* sans stockage, le code ne suit pas jusqu'au panier */
  }
}
