'use client';

import { useEffect, useState } from 'react';

import { produits } from '@/content/demos/boutique';

/**
 * Les stocks de la démo, partagés entre la vitrine et le tableau de bord.
 *
 * Le tableau de bord (A3) écrit les stocks modifiés dans le localStorage du
 * navigateur ; la vitrine les relit ici. Sans valeur enregistrée, ou si le
 * stockage est indisponible (navigation privée, stockage bloqué), on repart
 * des stocks de content/demos/boutique.ts. Lecture et écriture en try/catch :
 * la démo doit s'afficher même quand le stockage refuse.
 */
export const CLE_STOCKS = 'nada-demo-stocks';

export type Stocks = Record<string, number>;

export function stocksInitiaux(): Stocks {
  return Object.fromEntries(produits.map((p) => [p.slug, p.stock]));
}

export function lireStocks(): Stocks {
  const base = stocksInitiaux();
  try {
    const brut = window.localStorage.getItem(CLE_STOCKS);
    if (!brut) return base;
    const lu = JSON.parse(brut) as Stocks;
    return { ...base, ...lu };
  } catch {
    return base;
  }
}

export function ecrireStocks(stocks: Stocks): void {
  try {
    window.localStorage.setItem(CLE_STOCKS, JSON.stringify(stocks));
    window.dispatchEvent(new Event('nada-stocks'));
  } catch {
    /* stockage indisponible : la démo continue sans mémoire */
  }
}

/**
 * Les stocks à jour. Rendu serveur et premier rendu client sur les stocks
 * initiaux, puis relecture du navigateur : pas d'écart d'hydratation.
 */
export function useStocks(): Stocks {
  const [stocks, setStocks] = useState<Stocks>(stocksInitiaux);

  useEffect(() => {
    const relire = () => setStocks(lireStocks());
    relire();
    window.addEventListener('nada-stocks', relire);
    // Un autre onglet (le tableau de bord ouvert à côté) peut les changer.
    window.addEventListener('storage', relire);
    return () => {
      window.removeEventListener('nada-stocks', relire);
      window.removeEventListener('storage', relire);
    };
  }, []);

  return stocks;
}

/** Le badge de stock, calculé du vrai stock de la démo. */
export function badgeStock(stock: number): { texte: string; ton: 'rupture' | 'rare' } | null {
  if (stock <= 0) return { texte: 'Rupture', ton: 'rupture' };
  if (stock <= 5) return { texte: `Plus que ${stock}`, ton: 'rare' };
  return null;
}
