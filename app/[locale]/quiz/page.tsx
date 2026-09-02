import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Configurator } from '@/components/quiz/Configurator';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary } from '@/i18n/dictionaries';
import { openGraph } from '@/lib/metadata';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  return {
    title: dict.meta.quiz.title,
    description: dict.meta.quiz.description,
    alternates: {
      canonical: `/${params.locale}/quiz`,
      languages: { ar: '/ar/quiz', fr: '/fr/quiz' },
    },
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.quiz.title,
      description: dict.meta.quiz.description,
      path: '/quiz',
    }),
  };
}

export default async function QuizPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.quiz;

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
      <AmbientBackground patternId="dd-quiz" intensity="soft" />

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
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

          {/* useSearchParams impose une frontière Suspense pour que le
              reste de la page reste rendu statiquement. */}
          <Suspense fallback={<div className="card min-h-[520px] animate-pulse" />}>
            <Configurator locale={locale} dict={dict} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
