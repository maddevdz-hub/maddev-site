import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Hero } from '@/components/home/Hero';
import { QuizEntry } from '@/components/home/QuizEntry';
import { TrustBar } from '@/components/home/TrustBar';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { WhyMaddev } from '@/components/home/WhyMaddev';
import { FaqSection } from '@/components/faq/FaqSection';
import { CtaSection } from '@/components/ui/CtaSection';
import { getDictionary } from '@/i18n/dictionaries';
import { href, isLocale, routes, type Locale } from '@/i18n/config';
import { site } from '@/content/site';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    // Les langues sont répétées ici : un `alternates` de page REMPLACE celui
    // du layout, il ne s'y ajoute pas. Sans elles, l'accueil partait sans
    // aucun hreflang.
    alternates: {
      canonical: `/${params.locale}`,
      languages: { ar: '/ar', fr: '/fr', 'x-default': '/ar' },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.home.finalCta;

  /*
   * Données structurées du studio. Uniquement ce qui est vrai et fourni :
   * nom, adresse du site, téléphone, email, zone desservie, langues.
   * Pas d'adresse postale, pas de note, pas d'avis, pas d'horaires.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#studio`,
    name: site.name,
    url: `${site.url}/${locale}`,
    logo: `${site.url}/icons/icon-512.png`,
    image: `${site.url}/${locale}/opengraph-image`,
    description: dict.meta.home.description,
    telephone: `+${site.whatsappNumber}`,
    email: site.email,
    areaServed: { '@type': 'Country', name: 'Algeria' },
    availableLanguage: ['ar', 'fr'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Contenu généré par nous, à partir de content/site.ts.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero locale={locale} dict={dict} />
      <QuizEntry locale={locale} dict={dict} />
      <TrustBar dict={dict} />
      <ServicesPreview locale={locale} dict={dict} />
      <FeaturedWork locale={locale} dict={dict} />
      <WhyMaddev dict={dict} />
      <FaqSection locale={locale} dict={dict} />
      <CtaSection
        title={t.title}
        text={t.text}
        primary={{ label: t.primary, href: href(locale, routes.contact) }}
        secondary={{ label: t.secondary, href: href(locale, routes.process) }}
        patternId="dd-home-cta"
      />
    </>
  );
}
