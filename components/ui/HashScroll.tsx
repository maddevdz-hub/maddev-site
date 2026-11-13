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
export function HashScroll() {
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
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
