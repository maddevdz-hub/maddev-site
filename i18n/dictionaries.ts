import type { Locale } from './config';

/**
 * Chargement des dictionnaires côté serveur.
 * Les fichiers messages/*.json restent la source unique des chaînes d'interface.
 */
const dictionaries = {
  ar: () => import('@/messages/ar.json').then((m) => m.default),
  fr: () => import('@/messages/fr.json').then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['fr']>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]() as Promise<Dictionary>;
}
