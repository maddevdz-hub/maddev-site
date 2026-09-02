import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { CtaSection } from '@/components/ui/CtaSection';
import { ProjectCard } from '@/components/work/ProjectCard';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { DemoCard } from '@/components/demo/DemoCard';
import { demos } from '@/content/demos';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projects } from '@/content/projects';
import { getDictionary } from '@/i18n/dictionaries';
import { openGraph } from '@/lib/metadata';
import { href, isLocale, routes, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  return {
    title: dict.meta.work.title,
    description: dict.meta.work.description,
    alternates: {
      canonical: `/${params.locale}/realisations`,
      languages: { ar: '/ar/realisations', fr: '/fr/realisations' },
    },
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.work.title,
      description: dict.meta.work.description,
      path: '/realisations',
    }),
  };
}

export default async function WorkPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.work;

  return (
    <>
      <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
        <AmbientBackground patternId="dd-work" intensity="soft" />
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
            subtitle={t.intro}
          />
        </Container>
      </section>

      {/*
        SECTION 1 — le travail réel.
        Un seul projet, mais présenté large : c'est la seule chose ici qu'un
        prospect peut vérifier en appelant le client. Les démonstrations qui
        suivent ne doivent jamais lui disputer cette place.
      */}
      <Container className="pb-14 lg:pb-20">
        <h2 className="mb-6 text-2xl font-bold text-txt sm:text-3xl">
          {t.realTitle}
        </h2>
        <RevealGroup className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              dict={dict}
            />
          ))}
        </RevealGroup>
      </Container>

      {/*
        SECTION 2 — les démonstrations.
        Séparées par un filet et par une phrase qui dit sans détour qu'elles
        sont fictives. Cette franchise n'affaiblit pas la section précédente :
        c'est elle qui la rend croyable.
      */}
      <Container className="pb-16 lg:pb-24">
        <div className="border-t border-line pt-12 lg:pt-16">
          <h2 className="text-2xl font-bold text-txt sm:text-3xl">
            {t.demos.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-txt2 sm:text-base">
            {t.demos.intro}
          </p>

          <RevealGroup className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {demos.map((demo) => (
              <RevealItem key={demo.slug}>
                <DemoCard demo={demo} locale={locale} dict={dict} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>

      <CtaSection
        title={t.finalCta.title}
        text={t.finalCta.text}
        primary={{ label: t.finalCta.primary, href: href(locale, routes.contact) }}
        secondary={{ label: dict.nav.services, href: href(locale, routes.services) }}
        patternId="dd-work-cta"
        className="border-t border-line"
      />
    </>
  );
}
