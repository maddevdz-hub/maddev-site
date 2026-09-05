import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DemoBanner } from '@/components/demo/DemoBanner';
import { BookingFlow } from '@/components/demo/rendezvous/BookingFlow';
import {
  AmelMark,
  PlanningFigure,
  ZelligeField,
} from '@/components/demo/rendezvous/AmelMarks';
import { cabinet, rdvUi } from '@/content/demos/rendezvous';
import { isLocale, otherLocale, type Locale } from '@/i18n/config';

/**
 * Démonstration « Cabinet dentaire Amel ».
 *
 * La page tient en trois temps, dans cet ordre — c'est l'ordre dans lequel un
 * gérant de cabinet se laisse convaincre :
 *   1. le hero dit ce que l'outil fait, en une phrase et un dessin ;
 *   2. le module de réservation, qu'il essaie lui-même ;
 *   3. ce qui change pour LUI (téléphone libéré, moins d'absents, créneaux
 *      annulés qui se remplissent).
 *
 * Aucune photographie : le dessin géométrique évite les néons et les sourires
 * de banque d'images, et donne au cabinet une identité propre.
 */

export default function RendezvousDemoPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const other = otherLocale(locale);

  return (
    <>
      <DemoBanner
        locale={locale}
        backHref={`/${locale}/realisations`}
        backLabel={locale === 'ar' ? 'العودة إلى MADDEV' : 'Retour à MADDEV'}
      />

      {/* En-tête du cabinet */}
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <AmelMark className="h-8 w-10 shrink-0 text-[var(--teal)]" />
            <div className="min-w-0">
              <p className="text-[17px] font-semibold leading-tight">
                {cabinet.name[locale]}
              </p>
              <p className="text-[13px] text-[var(--ink-2)]">
                {cabinet.tagline[locale]}
              </p>
            </div>
          </div>

          <Link
            href={`/demo/rendezvous/${other}`}
            hrefLang={other}
            className="am-btn-ghost shrink-0 text-[15px]"
          >
            {other === 'ar' ? 'العربية' : 'Français'}
          </Link>
        </div>
      </header>

      <main id="main">
        {/*
          Hero — composition typographique sur fond pétrole, avec le motif
          zellige en filigrane et la figure du planning. Pas d'animation
          d'entrée : c'est le contenu du premier écran.
        */}
        <section className="relative overflow-hidden bg-[var(--ink)] text-white">
          <ZelligeField
            id="am-zellige-hero"
            className="pointer-events-none absolute inset-0 text-[#7fd3da]"
            opacity={0.09}
          />

          <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5 text-[13px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7fd3da]" />
                {rdvUi.heroKicker[locale]}
              </p>

              <h1 className="text-[clamp(2rem,5.2vw,3.2rem)] font-semibold leading-[1.08]">
                {rdvUi.heroTitle[locale]}
              </h1>

              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-white/75">
                {rdvUi.heroText[locale]}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#reserver" className="am-btn">
                  {rdvUi.heroCta[locale]}
                </a>
                <a
                  href={`tel:${cabinet.phoneDisplay.replace(/\s/g, '')}`}
                  className="am-btn-ghost border-white/30 bg-transparent text-white hover:border-white"
                >
                  {rdvUi.heroCall[locale]}
                </a>
              </div>
            </div>

            <PlanningFigure className="mx-auto w-full max-w-[280px] text-white/35 lg:max-w-none" />
          </div>
        </section>

        {/* Le module de réservation */}
        <section id="reserver" className="scroll-mt-4 bg-[var(--wash)] py-14 lg:py-20">
          <div className="mx-auto w-full max-w-3xl px-5">
            <BookingFlow locale={locale} />
          </div>
        </section>

        {/* Ce que ça change pour le cabinet */}
        <section className="py-14 lg:py-20">
          <div className="mx-auto w-full max-w-5xl px-5">
            <h2 className="mb-8 text-[clamp(1.5rem,3.4vw,2.1rem)] font-semibold">
              {rdvUi.whyTitle[locale]}
            </h2>

            <ul className="grid gap-5 md:grid-cols-3">
              {rdvUi.why.map((item, index) => (
                <li key={item.title.fr} className="relative">
                  <span
                    aria-hidden="true"
                    className="numerals mb-3 block text-[40px] font-semibold leading-none text-[var(--mint-2)]"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mb-1.5 text-[18px] font-semibold">
                    {item.title[locale]}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[var(--ink-2)]">
                    {item.text[locale]}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] bg-[var(--wash)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="flex items-center gap-2 font-semibold">
              <AmelMark className="h-6 w-8 text-[var(--teal)]" />
              {cabinet.name[locale]}
            </p>
            <p className="text-[14px] text-[var(--ink-2)]">
              {cabinet.address[locale]}
            </p>
            <p className="numerals text-[14px] text-[var(--ink-2)]">
              {cabinet.phoneDisplay}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-[14px] text-[var(--ink-2)]">
            <p className="font-semibold text-[var(--ink)]">
              {rdvUi.hoursTitle[locale]}
            </p>
            <p>
              {rdvUi.hoursWeek[locale]} ·{' '}
              <span className="numerals">9:00 – 17:00</span>
            </p>
            <p>
              {rdvUi.hoursSat[locale]} ·{' '}
              <span className="numerals">9:00 – 13:00</span>
            </p>
            <p>{rdvUi.hoursClosed[locale]}</p>

            {/* Sortie de secours : la bande masque son lien sur mobile. */}
            <Link
              href={`/${locale}/realisations`}
              className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-[var(--teal-ink)] underline underline-offset-4 sm:hidden"
            >
              {locale === 'ar' ? 'العودة إلى MADDEV' : 'Retour à MADDEV'}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
