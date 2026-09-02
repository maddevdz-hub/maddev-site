import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Hero } from '@/components/home/Hero';
import { TrustBar } from '@/components/home/TrustBar';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { WhyMaddev } from '@/components/home/WhyMaddev';
import { FaqSection } from '@/components/faq/FaqSection';
import { CtaSection } from '@/components/ui/CtaSection';
import { getDictionary } from '@/i18n/dictionaries';
import { href, isLocale, routes, type Locale } from '@/i18n/config';

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
    alternates: { canonical: `/${params.locale}` },
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

  return (
    <>
      <Hero locale={locale} dict={dict} />
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
