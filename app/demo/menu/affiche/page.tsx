import Link from 'next/link';

import { DemoBanner } from '@/components/demo/DemoBanner';
import { PrintButton } from '@/components/demo/menu/PrintButton';
import { cafe } from '@/content/demos/menu';
import { qrSvg } from '@/lib/qr';
import { site } from '@/content/site';

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
  scan: 'Scannez pour voir la carte',
  hint: 'Ouvrez l’appareil photo de votre téléphone et visez le code.',
  print: 'Imprimer',
  back: 'Revenir à la carte',
  note: 'Le code pointe vers la carte en ligne. La modifier ne change rien à cette affiche : on ne réimprime jamais.',
};

export default async function MenuPosterPage() {
  const target = `${site.url}/demo/menu`;
  const svg = await qrSvg(target);

  return (
    <>
      <div className="no-print">
        <DemoBanner
          backHref={'/demo/menu'}
          backLabel={copy.back}
        />
      </div>

      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        {/* L'affiche elle-même : c'est cette carte que l'on imprime. */}
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-3xl border-[3px] border-[var(--clay)] bg-white px-8 py-10 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[.2em] text-[var(--clay-ink)]">
            {cafe.name}
          </p>

          <h1 className="text-[28px] font-bold leading-tight">
            {copy.scan}
          </h1>

          <div
            className="w-full max-w-[240px] [&>svg]:h-auto [&>svg]:w-full"
            // Le SVG vient de la bibliothèque qrcode, à partir d'une URL que
            // nous construisons : aucune donnée extérieure n'entre ici.
            dangerouslySetInnerHTML={{ __html: svg }}
          />

          <p className="text-[15px] text-[var(--ink-2)]">{copy.hint}</p>

          <p className="text-[13px] text-[var(--ink-2)]" dir="ltr">
            {target.replace(/^https?:\/\//, '')}
          </p>
        </div>

        <div className="no-print mx-auto mt-8 flex max-w-md flex-col gap-3">
          <PrintButton label={copy.print} />
          <p className="text-center text-[14px] leading-relaxed text-[var(--ink-2)]">
            {copy.note}
          </p>
          <Link
            href={'/demo/menu'}
            className="mx-auto inline-flex min-h-[44px] items-center font-bold text-[var(--clay-ink)] underline underline-offset-4"
          >
            {copy.back}
          </Link>
        </div>
      </main>
    </>
  );
}
