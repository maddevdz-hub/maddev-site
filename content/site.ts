/**
 * Coordonnées et informations générales du studio.
 *
 * Rien d'inventé ici : un champ sans valeur réelle est supprimé plutôt que
 * rempli d'un placeholder. Les réseaux sociaux réapparaîtront le jour où les
 * comptes existeront — trois liens morts valent moins qu'aucun lien.
 */
export const site = {
  name: 'MADDEV',
  /** URL canonique (sert au SEO, à l'Open Graph et au sitemap). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maddev.dev',

  /** Format international sans espaces ni '+', utilisé pour les liens wa.me */
  whatsappNumber: '213551584581',
  /** Format lisible affiché à l'écran */
  phoneDisplay: '+213 551 58 45 81',
  email: 'maddev.dz@gmail.com',
} as const;

/** Message WhatsApp pré-rempli, dans la langue de l'utilisateur. */
export function whatsappLink(locale: 'ar' | 'fr', serviceLabel?: string): string {
  const base =
    locale === 'ar'
      ? 'مرحبًا MADDEV، أرغب في مناقشة مشروع'
      : 'Bonjour MADDEV, je souhaite discuter d’un projet';
  const text = serviceLabel ? `${base} — ${serviceLabel}` : base;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Lien WhatsApp depuis le configurateur : le message rappelle la
 * recommandation obtenue, pour qu'on sache d'emblée de quoi il s'agit.
 */
export function whatsappQuizLink(
  locale: 'ar' | 'fr',
  serviceLabel: string,
): string {
  const text =
    locale === 'ar'
      ? `مرحبًا MADDEV، أوصى بي المُوجِّه بـ«${serviceLabel}»، وأودّ مناقشة الأمر.`
      : `Bonjour MADDEV, le configurateur m’a recommandé « ${serviceLabel} », je souhaite en discuter.`;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
