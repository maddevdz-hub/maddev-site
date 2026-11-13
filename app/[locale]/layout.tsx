import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import '@/app/globals.css';
import { fontVariables } from '@/app/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale, locales, localeDirection, type Locale } from '@/i18n/config';
import { site } from '@/content/site';
import { ogImageUrl, openGraph } from '@/lib/metadata';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0e0f14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);

  return {
    metadataBase: new URL(site.url),
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    applicationName: site.name,
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        ar: '/ar',
        fr: '/fr',
        'x-default': '/ar',
      },
    },
    // Même construction que les autres pages : l'image de partage passe par
    // ogImageUrl(), donc un PNG déposé dans public/og/ la remplace partout.
    openGraph: openGraph({
      locale: params.locale,
      title: dict.meta.home.title,
      description: dict.meta.home.description,
    }),
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.home.title,
      description: dict.meta.home.description,
      images: [ogImageUrl(params.locale)],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir} className={fontVariables}>
      <body className="min-h-dvh">
        <LocaleProvider locale={locale}>
          <Header locale={locale} nav={dict.nav} />
          {/*
            La clé sur la langue force React à remonter l'arbre à la bascule :
            l'animation d'entrée rejoue et le changement se lit comme un fondu
            plutôt que comme un remplacement brutal de texte.
          */}
          <main id="main" key={locale} className="animate-fade-in pt-16 lg:pt-[72px]">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
        </LocaleProvider>
      </body>
    </html>
  );
}
