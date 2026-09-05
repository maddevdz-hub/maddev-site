import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { CtaSection } from '@/components/ui/CtaSection';
import { DDMark } from '@/components/brand/DDMark';
import { DDPattern } from '@/components/brand/DDPattern';
import { Eyebrow } from '@/components/ui/Badge';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { about } from '@/content/about';
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
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    alternates: {
      canonical: `/${params.locale}/a-propos`,
      languages: { ar: '/ar/a-propos', fr: '/fr/a-propos' },
    },
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.about.title,
      description: dict.meta.about.description,
      path: '/a-propos',
    }),
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.about;

  return (
    <>
      {/* Qui je suis */}
      <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
        <AmbientBackground patternId="dd-about" intensity="soft" />
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            {/*
              Bloc visible au chargement : ni le portrait ni le h1 ne sont
              animés, c'est ici que se joue le LCP de la page.
            */}
            <div className="order-1 mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-none">
              <Portrait />
            </div>

            <div className="order-2 flex flex-col items-start gap-5">
              <Eyebrow>{t.eyebrow}</Eyebrow>

              <h1 className="text-[clamp(1.9rem,5vw,3rem)] font-bold leading-[1.12] tracking-tight text-txt">
                {t.title}
              </h1>

              {/* Trois phrases, à la première personne. */}
              <div className="flex flex-col gap-3">
                {about.intro[locale].map((line) => (
                  <p
                    key={line}
                    className="text-base leading-relaxed text-txt2 sm:text-lg"
                  >
                    {line}
                  </p>
                ))}
              </div>

              {about.identity.name ? (
                <p className="text-[15px] font-semibold text-txt">
                  {about.identity.name}
                  <span className="font-normal text-txt2">
                    {' — '}
                    {about.identity.role[locale]}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* Pourquoi MADDEV existe */}
      <Section tone="alt" bordered>
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,4vw,2.3rem)] font-bold leading-tight tracking-tight text-txt">
              {about.why.title[locale]}
            </h2>
          </Reveal>

          {about.why.paragraphs[locale].map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.06}>
              <p className="text-base leading-relaxed text-txt2 sm:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <a
              href={href(locale, routes.compare)}
              className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-coral2 hover:text-coral"
            >
              {t.compareLink}
            </a>
          </Reveal>
        </div>
      </Section>

      {/* Comment je travaille */}
      <Section>
        <div className="flex flex-col gap-10">
          <Reveal>
            <h2 className="max-w-2xl text-[clamp(1.6rem,4vw,2.3rem)] font-bold leading-tight tracking-tight text-txt">
              {about.how.title[locale]}
            </h2>
          </Reveal>

          <RevealGroup as="ul" className="grid gap-4 lg:grid-cols-3">
            {about.how.points.map((point, index) => (
              <RevealItem
                as="li"
                key={point.title.fr}
                className="card flex flex-col gap-3 p-6"
              >
                <span
                  aria-hidden="true"
                  className="numerals font-display text-sm font-bold text-coral2"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-bold leading-snug text-txt">
                  {point.title[locale]}
                </h3>
                <p className="text-sm leading-relaxed text-txt2">
                  {point.text[locale]}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CtaSection
        title={t.finalCta.title}
        text={t.finalCta.text}
        primary={{ label: t.finalCta.primary, href: href(locale, routes.contact) }}
        secondary={{ label: dict.nav.services, href: href(locale, routes.services) }}
        patternId="dd-about-cta"
        className="border-t border-line"
      />
    </>
  );
}

/**
 * Portrait du fondateur.
 *
 * Tant que `about.photo` est vide, on affiche un cadre de marque plutôt
 * qu'une photo d'illustration achetée : sur une page dont tout l'objet est
 * de montrer un visage réel, une fausse photo ruinerait le propos.
 * Déposez le fichier dans /public/about/ et renseignez le chemin.
 */
function Portrait() {
  if (about.photo) {
    return (
      <Image
        src={about.photo}
        alt=""
        width={640}
        height={800}
        priority
        sizes="(max-width: 1024px) 280px, 380px"
        className="aspect-[4/5] w-full rounded-3xl border border-line object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-coral/[.12] via-transparent to-coral2/[.08]"
    >
      <DDPattern id="dd-portrait" opacity={0.018} scale={110} />
      <DDMark gradientId="dd-portrait-mark" className="relative w-[38%] opacity-70" />
    </div>
  );
}
