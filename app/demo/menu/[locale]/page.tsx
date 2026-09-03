import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DemoBanner } from '@/components/demo/DemoBanner';
import { MenuBoard } from '@/components/demo/menu/MenuBoard';
import { OpenNow } from '@/components/demo/menu/OpenNow';
import { ZitounaMark } from '@/components/demo/menu/ZitounaMark';
import { cafe, menu, menuUi } from '@/content/demos/menu';
import { isLocale, otherLocale, type Locale } from '@/i18n/config';

/**
 * Démonstration « Café Zitouna » — la carte que l'on ouvre en scannant le
 * QR posé sur la table.
 *
 * Ce que la démonstration doit prouver au visiteur en dix secondes : sa
 * carte tient dans son téléphone, elle se lit d'une main, et il peut la
 * changer lui-même en trente secondes — sans réimprimer quoi que ce soit.
 */

export default function MenuDemoPage({
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
        backLabel={locale === 'ar' ? 'ارجع لـ MADDEV' : 'Retour à MADDEV'}
      />

      {/*
        En-tête du café — visible au chargement, donc jamais animé.
        La branche d'olivier dit « Zitouna » sans le répéter ; elle déborde
        volontairement du cadre, coupée par le bord, pour donner de l'échelle
        à un bandeau qui serait sinon plat.
      */}
      <header className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--cream-2)]">
        <ZitounaMark
          className="pointer-events-none absolute -top-6 end-[-28px] h-[190px] w-[190px] text-[var(--clay)] opacity-[.07] sm:end-8 sm:h-[210px] sm:w-[210px]"
        />

        <div className="relative mx-auto flex w-full max-w-3xl items-start justify-between gap-4 px-4 py-7">
          <div className="min-w-0">
            <p className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[.18em] text-[var(--clay-ink)]">
              <ZitounaMark className="h-4 w-4 shrink-0 text-[var(--olive)]" />
              {cafe.sector[locale]}
            </p>

            <h1 className="text-[32px] font-bold leading-[1.1] sm:text-[40px]">
              {cafe.name[locale]}
            </h1>

            <p className="mt-1.5 text-[15px] text-[var(--ink-2)]">
              {cafe.tagline[locale]}
            </p>

            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-[var(--ink-2)]">
              <OpenNow locale={locale} />
              <span>{cafe.hours[locale]}</span>
            </p>
          </div>

          {/*
            Bascule de langue : sur une carte de café, elle doit être le
            premier réflexe possible, pas un réglage caché.
          */}
          <Link
            href={`/demo/menu/${other}`}
            hrefLang={other}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-[var(--line)] bg-white px-4 text-[15px] font-bold text-[var(--ink)] transition-colors hover:border-[var(--clay)]"
          >
            {other === 'ar' ? 'العربية' : 'Français'}
          </Link>
        </div>
      </header>

      <main id="main">
        <MenuBoard locale={locale} categories={menu} />
      </main>

      <footer className="border-t border-[var(--line)] bg-[var(--cream-2)] px-4 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 text-[14px] text-[var(--ink-2)]">
          <p className="font-bold text-[var(--ink)]">{cafe.name[locale]}</p>
          <p>{cafe.address[locale]}</p>
          <p className="numerals">{cafe.phoneDisplay}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={`/demo/menu/${locale}/affiche`}
              className="inline-flex min-h-[44px] w-fit items-center rounded-full border border-[var(--line)] bg-white px-4 font-bold text-[var(--clay-ink)]"
            >
              {menuUi.poster[locale]}
            </Link>

            {/* Sortie de secours : la bande masque son lien sur mobile. */}
            <Link
              href={`/${locale}/realisations`}
              className="inline-flex min-h-[44px] w-fit items-center rounded-full px-4 font-bold text-[var(--ink-2)] underline underline-offset-4 sm:hidden"
            >
              {locale === 'ar' ? 'ارجع لـ MADDEV' : 'Retour à MADDEV'}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
