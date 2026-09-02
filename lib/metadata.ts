import type { Metadata } from 'next';
import { site } from '@/content/site';
import type { Locale } from '@/i18n/config';

/**
 * Construit le bloc Open Graph d'une page.
 *
 * ⚠️ Pourquoi ce helper existe : dans Next, l'image générée par
 * `opengraph-image.tsx` est bien héritée par les pages enfants — mais dès
 * qu'une page déclare son propre objet `openGraph`, celui-ci REMPLACE
 * l'objet hérité, image comprise. Sept pages sur neuf partaient donc sans
 * visuel sur WhatsApp, le canal principal de diffusion, alors que les
 * balises title et description étaient bien là.
 *
 * Passer par cette fonction garantit que l'image accompagne toujours la
 * page, quelle que soit la personnalisation du titre.
 */
export function openGraph({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  title: string;
  description: string;
  /** Chemin sans le préfixe de langue, ex. '/services'. */
  path?: string;
}): Metadata['openGraph'] {
  return {
    type: 'website',
    siteName: site.name,
    locale: locale === 'ar' ? 'ar_DZ' : 'fr_FR',
    alternateLocale: locale === 'ar' ? 'fr_FR' : 'ar_DZ',
    title,
    description,
    url: `/${locale}${path ?? ''}`,
    images: [
      {
        url: `/${locale}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'MADDEV — studio digital algérien',
      },
    ],
  };
}
