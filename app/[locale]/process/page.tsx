import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { CtaSection } from '@/components/ui/CtaSection';
import { ProcessTimeline } from '@/components/process/ProcessTimeline';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
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
    title: dict.meta.process.title,
    description: dict.meta.process.description,
    alternates: {
      canonical: `/${params.locale}/process`,
      languages: { ar: '/ar/process', fr: '/fr/process' },
    },
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.process.title,
      description: dict.meta.process.description,
      path: '/process',
    }),
  };
}

export default async function ProcessPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.process;

  return (
    <>
      <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
        <AmbientBackground patternId="dd-process" intensity="soft" />
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

      <Container className="pb-16 lg:pb-24">
        <ProcessTimeline locale={locale} dict={dict} />
      </Container>

      <CtaSection
        title={t.finalCta.title}
        text={t.finalCta.text}
        primary={{ label: t.finalCta.primary, href: href(locale, routes.contact) }}
        secondary={{ label: dict.nav.services, href: href(locale, routes.services) }}
        patternId="dd-process-cta"
        className="border-t border-line"
      />
    </>
  );
}
