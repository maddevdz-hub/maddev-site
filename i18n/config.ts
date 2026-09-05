/**
 * Configuration i18n centrale.
 * L'arabe est la langue par défaut (RTL) ; le français est la seconde langue.
 */
export const locales = ['ar', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  fr: 'ltr',
};

/** Libellé affiché dans le bouton de bascule (on affiche TOUJOURS l'autre langue). */
export const localeLabel: Record<Locale, string> = {
  ar: 'العربية',
  fr: 'Français',
};

export const localeShortLabel: Record<Locale, string> = {
  ar: 'ع',
  fr: 'FR',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'fr' : 'ar';
}

/**
 * Chemins des pages, sans le préfixe de langue.
 *
 * `/realisations` a été retirée en septembre 2026 : avec un seul client
 * réel, une page « Réalisations » soulignait le vide au lieu de montrer la
 * force. Le projet réel est passé sur /services, et l'ancienne adresse y
 * redirige en 301 (voir next.config.mjs). La page reviendra quand il y aura
 * plusieurs clients à y mettre.
 */
export const routes = {
  home: '',
  services: '/services',
  process: '/process',
  contact: '/contact',
  quiz: '/quiz',
  about: '/a-propos',
  compare: '/site-ou-facebook',
} as const;

/** Construit une URL localisée : href('fr', '/services') -> '/fr/services' */
export function href(locale: Locale, path: string = ''): string {
  return `/${locale}${path}`;
}
