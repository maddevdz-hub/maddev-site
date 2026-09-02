import { statSync } from 'node:fs';
import { join } from 'node:path';
import type { MetadataRoute } from 'next';
import { locales, routes } from '@/i18n/config';
import { site } from '@/content/site';

/**
 * Sitemap bilingue : chaque page dans les deux langues, avec ses alternates
 * hreflang.
 *
 * `lastModified` est la date réelle de dernière modification du fichier
 * source de la page, pas la date de construction : sans cela, chaque
 * déploiement signalerait à Google que tout le site a changé, ce qui est
 * faux et dilue le signal.
 */

/** Fichier source correspondant à chaque route. */
const sourceFile: Record<string, string> = {
  [routes.home]: 'app/[locale]/page.tsx',
  [routes.services]: 'app/[locale]/services/page.tsx',
  [routes.work]: 'app/[locale]/realisations/page.tsx',
  [routes.process]: 'app/[locale]/process/page.tsx',
  [routes.contact]: 'app/[locale]/contact/page.tsx',
  [routes.quiz]: 'app/[locale]/quiz/page.tsx',
  [routes.about]: 'app/[locale]/a-propos/page.tsx',
  [routes.compare]: 'app/[locale]/site-ou-facebook/page.tsx',
};

/**
 * Date de dernière modification du fichier, ou la date du jour s'il est
 * introuvable — mieux vaut une date plausible qu'un sitemap incomplet.
 */
function lastModified(path: string): Date {
  const file = sourceFile[path];
  if (!file) return new Date();
  try {
    return statSync(join(process.cwd(), file)).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = Object.values(routes);

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: lastModified(path),
      changeFrequency:
        path === routes.home ? ('weekly' as const) : ('monthly' as const),
      priority:
        path === routes.home
          ? 1
          : path === routes.services || path === routes.compare
            ? 0.9
            : 0.7,
      alternates: {
        languages: {
          ar: `${site.url}/ar${path}`,
          fr: `${site.url}/fr${path}`,
        },
      },
    })),
  );
}
