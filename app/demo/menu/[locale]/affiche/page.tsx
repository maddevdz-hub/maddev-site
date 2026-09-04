import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DemoBanner } from '@/components/demo/DemoBanner';
import { PrintButton } from '@/components/demo/menu/PrintButton';
import { cafe } from '@/content/demos/menu';
import { qrSvg } from '@/lib/qr';
import { site } from '@/content/site';
import { isLocale, type Locale } from '@/i18n/config';

/**
 * L'affiche à poser sur les tables : le QR code, prêt à imprimer.
 *
 * C'est la moitié invisible de l'argument commercial. Un QR menu se vend mal
 * tant que le client ne voit pas l'objet qu'il posera sur ses tables ; on le
 * lui montre donc, à l'échelle, imprimable tel quel sur une feuille A4 pliée
 * en deux ou collé sur un support.
 *
 * Le code pointe vers /demo/menu, sans langue : le visiteur est redirigé
 * vers la sienne. Sur un vrai déploiement, ce serait l'adresse du café.
 */

const copy = {
  scan: {
    fr: 'Scannez pour voir la carte',
    ar: 'امسح الرمز لعرض القائمة',
  },
  hint: {
    fr: 'Ouvrez l’appareil photo de votre téléphone et visez le code.',
    ar: 'افتح كاميرا هاتفك ووجّهها نحو الرمز.',
  },
  print: { fr: 'Imprimer', ar: 'طباعة' },
  back: { fr: 'Revenir à la carte', ar: 'العودة إلى القائمة' },
  note: {
    fr: 'Le code pointe vers la carte en ligne. La modifier ne change rien à cette affiche : on ne réimprime jamais.',
    ar: 'يوجّه الرمز إلى القائمة على الإنترنت. عند تعديلها يبقى هذا الملصق كما هو: لا إعادة طباعة.',
  },
} satisfies Record<string, Record<Locale, string>>;

export default async function MenuPosterPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const target = `${site.url}/demo/menu`;
  const svg = await qrSvg(target);

  return (
    <>
      <div className="no-print">
        <DemoBanner
          locale={locale}
          backHref={`/demo/menu/${locale}`}
          backLabel={copy.back[locale]}
        />
      </div>

      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        {/* L'affiche elle-même : c'est cette carte que l'on imprime. */}
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-3xl border-[3px] border-[var(--clay)] bg-white px-8 py-10 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[.2em] text-[var(--clay-ink)]">
            {cafe.name[locale]}
          </p>

          <h1 className="text-[28px] font-bold leading-tight">
            {copy.scan[locale]}
          </h1>

          <div
            className="w-full max-w-[240px] [&>svg]:h-auto [&>svg]:w-full"
            // Le SVG vient de la bibliothèque qrcode, à partir d'une URL que
            // nous construisons : aucune donnée extérieure n'entre ici.
            dangerouslySetInnerHTML={{ __html: svg }}
          />

          <p className="text-[15px] text-[var(--ink-2)]">{copy.hint[locale]}</p>

          <p className="text-[13px] text-[var(--ink-2)]" dir="ltr">
            {target.replace(/^https?:\/\//, '')}
          </p>
        </div>

        <div className="no-print mx-auto mt-8 flex max-w-md flex-col gap-3">
          <PrintButton label={copy.print[locale]} />
          <p className="text-center text-[14px] leading-relaxed text-[var(--ink-2)]">
            {copy.note[locale]}
          </p>
          <Link
            href={`/demo/menu/${locale}`}
            className="mx-auto inline-flex min-h-[44px] items-center font-bold text-[var(--clay-ink)] underline underline-offset-4"
          >
            {copy.back[locale]}
          </Link>
        </div>
      </main>
    </>
  );
}
