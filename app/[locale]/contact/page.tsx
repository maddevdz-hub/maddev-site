import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { FaqSection } from '@/components/faq/FaqSection';
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
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    alternates: {
      canonical: `/${params.locale}/contact`,
      languages: { ar: '/ar/contact', fr: '/fr/contact' },
    },
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.contact.title,
      description: dict.meta.contact.description,
      path: '/contact',
    }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.contact;

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
      <AmbientBackground patternId="dd-contact" intensity="soft" />

      <Container>
        <div className="flex flex-col gap-12">
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

          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-10">
            <Reveal>
              {/*
                useSearchParams impose une frontière Suspense pour permettre
                le rendu statique du reste de la page.
              */}
              <Suspense fallback={<FormSkeleton />}>
                <ContactForm locale={locale} dict={dict} />
              </Suspense>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactInfo locale={locale} dict={dict} />
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Les objections se lèvent au moment où l'on hésite à écrire. */}
      <FaqSection locale={locale} dict={dict} tone="alt" />
    </section>
  );
}

/** Réserve la hauteur du formulaire pendant l'hydratation, sans décalage. */
function FormSkeleton() {
  return (
    <div className="card min-h-[560px] animate-pulse p-8" aria-hidden="true" />
  );
}
