import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { CtaSection } from '@/components/ui/CtaSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ShowcaseBlock } from '@/components/services/ShowcaseBlock';
import { ShowcaseSummary } from '@/components/services/ShowcaseSummary';
import { RecurringServices } from '@/components/services/RecurringServices';
import { ServiceGlyph } from '@/components/services/ServiceGlyphs';
import {
  primaryServices,
  secondaryServices,
  showcaseUi,
} from '@/content/services';
import { getDictionary } from '@/i18n/dictionaries';
import { openGraph } from '@/lib/metadata';
import { href, isLocale, routes, type Locale } from '@/i18n/config';
import { services } from '@/content/services';
import { site } from '@/content/site';

/**
 * La page /services — la page qui décide.
 *
 * Elle a remplacé /realisations, supprimée faute de clients à y montrer. Un
 * visiteur qui hésite entre nous et un concurrent ne lit pas notre discours :
 * il regarde ce qu'on a fait. Chaque service est donc accompagné de sa
 * démonstration, visible immédiatement, sans avoir à naviguer ailleurs.
 *
 * La règle de composition tient en une phrase : **l'image domine**. On doit
 * pouvoir parcourir la page en diagonale, sans lire une ligne, et comprendre
 * les six services.
 *
 * Performance : ce sont des captures optimisées par `next/image`, jamais des
 * iframes ni des démos intégrées en direct. Une page d'agence lente se
 * disqualifie toute seule — six démos en iframe pèseraient six sites.
 */

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
    itemListElement: services.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: item.benefit[locale],
        description: item.lead[locale],
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        url: `${site.url}/${locale}/services#${item.slug}`,
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
      <section className="relative isolate overflow-hidden py-14 sm:py-16 lg:py-20">
        <AmbientBackground patternId="dd-services" intensity="soft" />
        <Container>
          {/*
            Pas de Reveal ici : cet en-tête est visible au chargement, donc
            c'est lui l'élément LCP de la page.
          */}
          <SectionHeading
            as="h1"
            eyebrow={t.eyebrow}
            title={t.title}
            accent={t.titleAccent}
            subtitle={t.intro}
          />

          {/*
            Le sommaire, dans le premier écran. C'est pour lui que l'en-tête
            reste court : le principe « aucun template » occupait cette place
            et a reçu son propre bloc, juste en dessous.
          */}
          <ShowcaseSummary items={primaryServices} locale={locale} />
        </Container>
      </section>

      {/*
        Le sur-mesure — notre seule vraie différence face à la concurrence
        locale, qui revend des modèles tout faits. En petit caractère sous
        l'en-tête, la phrase passait pour une précaution d'usage ; elle mérite
        d'être lue comme un engagement, donc elle a son bloc.
      */}
      <section className="border-t border-line bg-ink2/40 py-12 sm:py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12">
            <h2 className="text-[clamp(1.5rem,3.2vw,2.1rem)] font-bold leading-[1.15] tracking-tight text-txt">
              {t.principle.title}
            </h2>
            <p className="max-w-2xl text-[16px] leading-relaxed text-txt2 sm:text-[17px]">
              {t.principle.text}
            </p>
          </div>
        </Container>
      </section>

      {/* Les six services, chacun avec sa démonstration */}
      {primaryServices.map((item, index) => (
        <ShowcaseBlock
          key={item.slug}
          item={item}
          index={index}
          locale={locale}
        />
      ))}

      {/*
        Les deux offres secondaires, côte à côte.

        Elles n'ont pas de bloc : leur donner la même place qu'un menu QR
        déséquilibrerait la page en faveur d'offres rares. Mais elles sont des
        services entiers — elles mènent au formulaire avec leur identifiant,
        comme les six autres.
      */}
      <section className="border-t border-line py-14 lg:py-16">
        <Container>
          <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {secondaryServices.map((service) => (
              <li key={service.slug} className="h-full">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-ink2/60 p-6 sm:p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-coral/25 bg-brand-soft">
                    <ServiceGlyph
                      name={service.glyph}
                      className="h-6 w-6 text-coral2"
                    />
                  </span>

                  <div className="flex-1">
                    <p className="eyebrow-label mb-1 text-txt2">
                      {showcaseUi.alsoKicker[locale]}
                    </p>
                    <h2 className="text-lg font-bold text-txt">
                      {service.name[locale]}
                    </h2>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-txt2">
                      {service.lead[locale]}
                    </p>
                  </div>

                  <Link
                    href={`${href(locale, routes.contact)}?service=${service.slug}`}
                    className="inline-flex min-h-[44px] w-fit items-center rounded-xl border border-line2 px-4 text-[15px] font-semibold text-txt transition-colors hover:border-coral/50"
                  >
                    {showcaseUi.alsoCta[locale]}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

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
