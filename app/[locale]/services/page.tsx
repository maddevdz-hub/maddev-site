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
import { alsoCard, showcase } from '@/content/showcase';
import { getDictionary } from '@/i18n/dictionaries';
import { openGraph } from '@/lib/metadata';
import { href, isLocale, routes, type Locale } from '@/i18n/config';
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
    itemListElement: showcase.map((item, i) => ({
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
        // Contenu généré par nous, à partir de content/showcase.ts.
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
          <ShowcaseSummary items={showcase} locale={locale} />
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
      {showcase.map((item, index) => (
        <ShowcaseBlock
          key={item.slug}
          item={item}
          index={index}
          locale={locale}
        />
      ))}

      {/* La carte discrète : un service réel, mais qui ne mérite pas un bloc */}
      <section className="border-t border-line py-14 lg:py-16">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-start gap-3 rounded-2xl border border-line bg-ink2/60 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-coral/25 bg-brand-soft">
              <RingsGlyph className="h-6 w-6 text-coral2" />
            </span>

            <div className="flex-1">
              <p className="eyebrow-label mb-1 text-txt2">
                {alsoCard.kicker[locale]}
              </p>
              <h2 className="text-lg font-bold text-txt">
                {alsoCard.title[locale]}
              </h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-txt2">
                {alsoCard.text[locale]}
              </p>
            </div>

            <Link
              href={href(locale, routes.contact)}
              className="inline-flex min-h-[44px] shrink-0 items-center rounded-xl border border-line2 px-4 text-[15px] font-semibold text-txt transition-colors hover:border-coral/50"
            >
              {alsoCard.cta[locale]}
            </Link>
          </div>
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

/** Deux anneaux entrelacés, pour la carte « invitations de mariage ». */
function RingsGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className={className}
    >
      <circle cx="9" cy="14" r="6" />
      <circle cx="15" cy="10" r="6" />
    </svg>
  );
}
