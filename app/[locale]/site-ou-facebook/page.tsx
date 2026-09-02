import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { CtaSection } from '@/components/ui/CtaSection';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { comparisonRows, facebookIsEnough } from '@/content/comparison';
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
    title: dict.meta.compare.title,
    description: dict.meta.compare.description,
    alternates: {
      canonical: `/${params.locale}/site-ou-facebook`,
      languages: { ar: '/ar/site-ou-facebook', fr: '/fr/site-ou-facebook' },
    },
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.compare.title,
      description: dict.meta.compare.description,
      path: '/site-ou-facebook',
    }),
  };
}

export default async function ComparePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.compare;

  return (
    <>
      <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
        <AmbientBackground patternId="dd-compare" intensity="soft" />
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

      {/* Comparatif */}
      <Container className="pb-16 lg:pb-20">
        <Reveal>
          {/*
            Sur mobile, un tableau à trois colonnes devient illisible :
            chaque critère est donc rendu en carte empilée. Le tableau
            n'apparaît qu'à partir de lg, où la comparaison ligne à ligne
            reprend tout son sens.
          */}
          <div className="flex flex-col gap-4 lg:hidden">
            {comparisonRows.map((row) => (
              <div key={row.id} className="card flex flex-col gap-4 p-5">
                <h2 className="text-base font-bold text-txt">
                  {row.criterion[locale]}
                </h2>

                <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-white/[.02] p-4">
                  <span className="eyebrow-label text-txt2">
                    {t.facebookColumn}
                  </span>
                  <p className="text-sm leading-relaxed text-txt2">
                    {row.facebook[locale]}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 rounded-xl border border-coral/25 bg-brand-soft p-4">
                  <span className="eyebrow-label text-coral2">
                    {t.websiteColumn}
                  </span>
                  <p className="text-sm leading-relaxed text-txt">
                    {row.website[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-3xl border border-line lg:block">
            <table className="w-full border-collapse text-start">
              <caption className="sr-only">{t.tableCaption}</caption>
              <thead>
                <tr className="bg-ink3/70">
                  <th
                    scope="col"
                    className="w-[22%] p-5 text-start text-sm font-bold text-txt"
                  >
                    {t.criterionColumn}
                  </th>
                  <th
                    scope="col"
                    className="w-[39%] border-s border-line p-5 text-start text-sm font-bold text-txt2"
                  >
                    {t.facebookColumn}
                  </th>
                  <th
                    scope="col"
                    className="w-[39%] border-s border-coral/25 bg-brand-soft p-5 text-start text-sm font-bold text-coral2"
                  >
                    {t.websiteColumn}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.id} className="border-t border-line align-top">
                    <th
                      scope="row"
                      className="p-5 text-start text-[15px] font-bold text-txt"
                    >
                      {row.criterion[locale]}
                    </th>
                    <td className="border-s border-line p-5 text-sm leading-relaxed text-txt2">
                      {row.facebook[locale]}
                    </td>
                    <td className="border-s border-coral/25 bg-brand-soft/60 p-5 text-sm leading-relaxed text-txt">
                      {row.website[locale]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>

      {/* Quand une page Facebook suffit — le bloc qui rend le reste crédible */}
      <Section tone="alt" bordered>
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-6">
          <h2 className="text-[clamp(1.6rem,4vw,2.3rem)] font-bold leading-tight tracking-tight text-txt">
            {facebookIsEnough.title[locale]}
          </h2>

          <p className="text-base leading-relaxed text-txt2 sm:text-lg">
            {facebookIsEnough.intro[locale]}
          </p>

          <ul className="flex flex-col gap-3">
            {facebookIsEnough.cases.map((item) => (
              <li
                key={item.fr}
                className="flex items-start gap-3 rounded-2xl border border-line bg-ink3/60 p-5"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral2"
                />
                <span className="text-[15px] leading-relaxed text-txt2">
                  {item[locale]}
                </span>
              </li>
            ))}
          </ul>

          <p className="rounded-2xl border border-coral/25 bg-brand-soft p-5 text-[15px] font-medium leading-relaxed text-txt sm:text-base">
            {facebookIsEnough.conclusion[locale]}
          </p>
        </Reveal>
      </Section>

      <CtaSection
        title={t.finalCta.title}
        text={t.finalCta.text}
        primary={{ label: t.finalCta.primary, href: href(locale, routes.quiz) }}
        secondary={{ label: dict.nav.contact, href: href(locale, routes.contact) }}
        patternId="dd-compare-cta"
      />
    </>
  );
}
