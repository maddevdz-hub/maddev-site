import type { Bilingual, DemoBrand } from './types';
import { cafe } from './menu';
import { cabinet } from './rendezvous';

/**
 * Registre des démonstrations.
 *
 * Une démonstration est un projet FICTIF, complet et fonctionnel, qui montre
 * concrètement ce qu'un client obtient dans son métier. Elle ne remplace pas
 * une référence : la galerie les sépare nettement, et chaque démo porte sa
 * bande d'avertissement.
 *
 * Chaque entrée porte sa propre palette — c'est elle qui habille la carte de
 * la galerie. Six vignettes aux couleurs de la charte MADDEV donneraient
 * l'impression d'un gabarit repeint six fois, exactement ce que les
 * démonstrations doivent démentir.
 */
export type Demo = DemoBrand & {
  /** Chemin sans langue : le middleware complète avec celle du visiteur. */
  path: string;
  /** Aperçu à venir — déposer le fichier puis renseigner ce champ. */
  preview?: string;
  /** Couleurs de la démo, pour la vignette de la galerie. */
  palette: { bg: string; ink: string; accent: string };
  /** Mot d'ordre de l'identité, affiché sur la vignette. */
  mood: Bilingual;
};

export const demos: Demo[] = [
  {
    ...cafe,
    slug: 'menu',
    path: '/demo/menu',
    palette: { bg: '#fbf3e7', ink: '#2a1d16', accent: '#b4532a' },
    mood: { fr: 'Terre cuite et crème', ar: 'لون الطين والكريمي' },
  },
  {
    ...cabinet,
    slug: 'rendezvous',
    path: '/demo/rendezvous',
    palette: { bg: '#0d2b31', ink: '#ffffff', accent: '#7fd3da' },
    mood: { fr: 'Pétrole et menthe', ar: 'أزرق داكن ونعناعي' },
  },
];

export function getDemo(slug: string): Demo | undefined {
  return demos.find((demo) => demo.slug === slug);
}
