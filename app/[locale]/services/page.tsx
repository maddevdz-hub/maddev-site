import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { CtaSection } from '@/components/ui/CtaSection';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceBlock } from '@/components/services/ServiceBlock';
import { RecurringServices } from '@/components/services/RecurringServices';
import { services } from '@/content/services';
import { getDictionary } from '@/i18n/dictionaries';
import { openGraph } from '@/lib/metadata';
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
    title: dict.meta.services.title,
    description: dict.meta.services.description,
    alternates: {
      canonical: `/${params.locale}/services`,
      languages: { ar: '/ar/services', fr: '/fr/services' },
    },
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.services.title,
      description: dict.meta.services.description,
      path: '/services',
    }),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.services;

  // Données structurées : aide les moteurs à comprendre l'offre du studio.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: service.name[locale],
        description: service.promise[locale],
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        url: `${site.url}/${locale}/services#${service.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Contenu généré par nous, à partir de content/services.ts.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* En-tête de page */}
      <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
        <AmbientBackground patternId="dd-services" intensity="soft" />
        <Container>
          {/*
            Pas de Reveal ici : cet en-tête est visible au chargement, donc
            c'est lui l'élément LCP de la page. L'envelopper le livrerait à
            `opacity: 0` jusqu'à l'hydratation. Reveal est réservé à ce qui
            entre par le défilement.
          */}
          <SectionHeading
            as="h1"
            eyebrow={t.eyebrow}
            title={t.title}
            accent={t.titleAccent}
            subtitle={t.intro}
          />

          {/*
            Le principe qui gouverne les quatre offres, donc en tête de page
            et non dans un bloc à lui. Il ne rejoint pas les piliers de
            l'accueil : ils forment un ensemble de trois qui tient déjà.
          */}
          <p className="mt-8 max-w-2xl border-s-2 border-coral/60 ps-5 text-[15px] leading-relaxed text-txt2 sm:text-base">
            <strong className="font-semibold text-txt">
              {t.principle.title}
            </strong>{' '}
            {t.principle.text}
          </p>
        </Container>
      </section>

      {/* Les quatre blocs détaillés */}
      <Container>
        <div className="pb-8">
          {services.map((service, index) => (
            <ServiceBlock
              key={service.slug}
              service={service}
              locale={locale}
              dict={dict}
              index={index}
            />
          ))}
        </div>
      </Container>

      <RecurringServices dict={dict} />

      <CtaSection
        title={t.finalCta.title}
        text={t.finalCta.text}
        primary={{ label: t.finalCta.primary, href: href(locale, routes.contact) }}
        secondary={{ label: dict.nav.quiz, href: href(locale, routes.quiz) }}
        patternId="dd-services-cta"
      />
    </>
  );
}
