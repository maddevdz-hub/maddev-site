import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import { site } from '@/content/site';
import type { Locale } from '@/i18n/config';

/**
 * Image de partage d'une langue.
 *
 * Par défaut, l'image générée par app/[locale]/og/route.tsx — en
 * écriture latine pour les deux langues, son moteur de rendu ne sachant pas
 * façonner l'arabe. Pour la remplacer dans une langue, déposer un PNG
 * 1200×630 ici :
 *
 *     public/og/og-ar.png      public/og/og-fr.png
 *
 * Il est pris tel quel au prochain build, sans autre changement de code.
 */
export function ogImageUrl(locale: Locale): string {
  const fichier = `og-${locale}.png`;
  return existsSync(join(process.cwd(), 'public', 'og', fichier))
    ? `/og/${fichier}`
    : `/${locale}/og`;
}

/**
 * Construit le bloc Open Graph d'une page.
 *
 * ⚠️ Pourquoi ce helper existe : dans Next, dès qu'une page déclare son
 * propre objet `openGraph`, celui-ci REMPLACE l'objet hérité du layout,
 * image comprise. Sept pages sur neuf partaient ainsi sans visuel sur
 * WhatsApp, le canal principal de diffusion, alors que les balises title
 * et description étaient bien là. Le layout passe lui aussi par ici.
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
        url: ogImageUrl(locale),
        width: 1200,
        height: 630,
        alt: 'MADDEV — studio web algérien',
        type: 'image/png',
      },
    ],
  };
}
