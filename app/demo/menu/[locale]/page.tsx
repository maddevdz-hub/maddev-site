import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DemoBanner } from '@/components/demo/DemoBanner';
import { MenuBoard } from '@/components/demo/menu/MenuBoard';
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

      {/* En-tête du café — visible au chargement, donc jamais animé */}
      <header className="border-b border-[var(--line)] bg-[var(--cream-2)]">
        <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-4 px-4 py-6">
          <div className="min-w-0">
            <p className="mb-1 text-[13px] font-bold uppercase tracking-[.14em] text-[var(--clay-ink)]">
              {cafe.sector[locale]}
            </p>
            <h1 className="text-[30px] font-bold leading-[1.15] sm:text-[36px]">
              {cafe.name[locale]}
            </h1>
            <p className="mt-1 text-[15px] text-[var(--ink-2)]">
              {cafe.tagline[locale]}
            </p>
            <p className="mt-2 text-[14px] text-[var(--ink-2)]">
              {cafe.hours[locale]}
            </p>
          </div>

          {/*
            Bascule de langue : sur une carte de café, elle doit être le
            premier réflexe possible, pas un réglage caché.
          */}
          <Link
            href={`/demo/menu/${other}`}
            hrefLang={other}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-[var(--line)] bg-white px-4 text-[15px] font-bold text-[var(--ink)]"
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

          <Link
            href={`/demo/menu/${locale}/affiche`}
            className="mt-2 inline-flex min-h-[44px] w-fit items-center rounded-full border border-[var(--line)] bg-white px-4 font-bold text-[var(--clay-ink)]"
          >
            {menuUi.poster[locale]}
          </Link>
        </div>
      </footer>
    </>
  );
}
