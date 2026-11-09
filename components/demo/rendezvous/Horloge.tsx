"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Heure réelle partagée par toute la page.
 * Le serveur fournit l'heure de la requête ; le navigateur la fait avancer
 * en gardant l'écart constaté, pour ne pas dépendre d'une horloge d'appareil
 * mal réglée. Les calculs se font ensuite dans le fuseau Africa/Algiers.
 */
const Contexte = createContext<number | null>(null);

export function HorlogeProvider({ initial, children }: { initial: number; children: ReactNode }) {
  const [maintenant, setMaintenant] = useState(initial);

  useEffect(() => {
    const ecart = initial - Date.now();
    const lire = () => Date.now() + ecart;
    let intervalle: number | undefined;
    // Aligné sur le début de chaque minute.
    const attente = window.setTimeout(() => {
      setMaintenant(lire());
      intervalle = window.setInterval(() => setMaintenant(lire()), 60_000);
    }, 60_000 - (lire() % 60_000));
    return () => {
      window.clearTimeout(attente);
      if (intervalle !== undefined) window.clearInterval(intervalle);
    };
  }, [initial]);

  return <Contexte.Provider value={maintenant}>{children}</Contexte.Provider>;
}

export function useMaintenant(): number {
  const valeur = useContext(Contexte);
  if (valeur === null) throw new Error("useMaintenant doit être appelé sous HorlogeProvider.");
  return valeur;
}
