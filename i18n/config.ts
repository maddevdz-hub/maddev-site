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

/** Chemins des pages, sans le préfixe de langue. */
export const routes = {
  home: '',
  services: '/services',
  work: '/realisations',
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
