import type { Variants } from 'framer-motion';

/**
 * Variantes d'animation partagées.
 * Uniquement transform + opacity : ce sont les deux seules propriétés
 * que le navigateur peut animer sans recalculer la mise en page.
 */

/**
 * Une seule courbe pour tout le site, une seule durée. Elles ont leur
 * équivalent CSS dans globals.css (--ease, --duration) : les transitions
 * écrites en CSS et celles pilotées par Framer Motion doivent rester
 * indiscernables, sinon deux éléments voisins bougent différemment.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const DURATION = 0.4;
/** Décalage entre les enfants d'une même grille. */
export const STAGGER = 0.06;

/** Apparition au scroll — sobre, un léger décalage vertical. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION, ease: EASE } },
};

/** Conteneur qui décale l'apparition de ses enfants. */
export const stagger = (delayChildren = 0, staggerChildren = STAGGER): Variants => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren },
  },
});

/** Entrée latérale, dans le sens de lecture (inversée en RTL). */
export const slideIn = (from: 'start' | 'end', isRtl: boolean): Variants => {
  const sign = from === 'start' ? -1 : 1;
  const x = (isRtl ? -sign : sign) * 28;
  return {
    hidden: { opacity: 0, x },
    visible: { opacity: 1, x: 0, transition: { duration: DURATION, ease: EASE } },
  };
};

/** Réglage commun pour les révélations au scroll. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
