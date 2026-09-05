/**
 * Types partagés par les démonstrations.
 *
 * Les démonstrations sont en FRANÇAIS SEUL depuis septembre 2026. Elles
 * s'adressent à des professionnels — médecins, gérants de showroom, avocats —
 * qui lisent le français ; le site MADDEV, lui, reste bilingue. D'où des
 * chaînes simples ici, là où le contenu du site utilise `{ fr, ar }`.
 *
 * Les démos sont volontairement indépendantes du contenu du site : elles ont
 * leur propre identité et leur propre vocabulaire, et ne doivent jamais être
 * modifiées par ricochet quand la charte MADDEV évolue.
 */

/** Identité d'une démonstration — sert la carte de /services et la démo. */
export type DemoBrand = {
  slug: string;
  /** Nom de l'établissement. Fictif, sauf pour le showroom de meubles. */
  name: string;
  /** Le secteur, en clair. */
  sector: string;
  /** Ce que le projet résout, en une ligne. */
  solves: string;
};
