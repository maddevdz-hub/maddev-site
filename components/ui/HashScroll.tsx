'use client';

import { useEffect } from 'react';

/**
 * Amène la page sur l'ancre de l'URL une fois le contenu monté.
 *
 * Pourquoi : en navigation côté client (une carte de l'accueil vers
 * /services#boutique-en-ligne), le routeur cherche l'ancre pendant que
 * l'écran de chargement (app/[locale]/loading.tsx) est affiché — la section
 * n'existe pas encore, il ne trouve rien et ne réessaie pas. La page
 * s'ouvrait donc en haut. Un chargement direct de l'URL, lui, fonctionnait.
 *
 * Le décalage sous l'en-tête fixe vient du `scroll-margin-top` de chaque
 * section (scroll-mt-24) ; le défilement suit `scroll-behavior` du site,
 * donc sans animation quand prefers-reduced-motion est actif.
 */
/**
 * Ancres de services retirés : un lien ancien mène au service qui a pris
 * le relais au lieu de laisser la page en haut. Pendant serveur des 301 de
 * next.config.mjs (un fragment # n'arrive jamais au serveur).
 */
const ANCRES_REMPLACEES: Record<string, string> = {
  'campagne-publicitaire': 'page-produit',
  'plateforme-sur-mesure': 'application',
};

export function HashScroll() {
  useEffect(() => {
    const go = () => {
      const brute = decodeURIComponent(window.location.hash.slice(1));
      const id = ANCRES_REMPLACEES[brute] ?? brute;
      if (!id) return;
      if (id !== brute) window.history.replaceState(null, '', `#${id}`);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start' });
    };
    // Une image de section peut modifier la hauteur juste après le montage :
    // on vise au prochain rendu.
    const frame = requestAnimationFrame(go);
    window.addEventListener('hashchange', go);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', go);
    };
  }, []);

  return null;
}
