import type { Locale } from '@/i18n/config';

/**
 * Types partagés par les démonstrations.
 *
 * Les démos sont volontairement indépendantes du contenu du site : elles ont
 * leur propre identité, leur propre vocabulaire, et ne doivent jamais être
 * modifiées par ricochet quand la charte MADDEV évolue.
 */
export type Bilingual = Record<Locale, string>;

/** Identité d'une démonstration — sert la carte de la galerie et la démo. */
export type DemoBrand = {
  slug: string;
  /** Nom fictif de l'établissement. */
  name: Bilingual;
  /** Le secteur, en clair. */
  sector: Bilingual;
  /** Ce que le projet résout, en une ligne. */
  solves: Bilingual;
};
