import Image from 'next/image';
import Link from 'next/link';

import { DemoBanner } from '@/components/demo/DemoBanner';
import { MenuBoard } from '@/components/demo/menu/MenuBoard';
import { OpenNow } from '@/components/demo/menu/OpenNow';
import { ZitounaMark } from '@/components/demo/menu/ZitounaMark';
import { cafe, menu, menuUi } from '@/content/demos/menu';

/**
 * Démonstration « Café Zitouna » — la carte que l'on ouvre en scannant le
 * QR posé sur la table.
 *
 * Ce que la démonstration doit prouver au visiteur en dix secondes : sa
 * carte tient dans son téléphone, elle se lit d'une main, et il peut la
 * changer lui-même en trente secondes — sans réimprimer quoi que ce soit.
 */

export default function MenuDemoPage() {
  return (
    <>
      <DemoBanner
       
        backHref="/fr/services"
        backLabel={'Retour à MADDEV'}
      />

      {/*
        En-tête du café — visible au chargement, donc jamais animé.
        La branche d'olivier dit « Zitouna » sans le répéter ; elle déborde
        volontairement du cadre, coupée par le bord, pour donner de l'échelle
        à un bandeau qui serait sinon plat.
      */}
      <header className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--cream-2)]">
        {cafe.cover ? (
          <>
            {/*
              Photo d'ambiance. `fill` + `sizes` laissent Next produire les
              tailles et servir de l'AVIF ou du WebP ; la hauteur du bandeau
              est fixée par son contenu, donc la place est réservée avant même
              que l'image n'arrive — décalage de mise en page nul.
              `priority` : c'est l'image du premier écran, elle ne doit pas
              être différée.
            */}
            <Image
              src={cafe.cover}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[var(--cream-2)]/88"
            />
          </>
        ) : null}

        <ZitounaMark
          className="pointer-events-none absolute -top-8 end-[-30px] h-[150px] w-[150px] text-[var(--clay)] opacity-[.07] sm:end-8 sm:h-[170px] sm:w-[170px]"
        />

        {/*
          En-tête volontairement court.
          Il occupait la moitié du premier écran d'un téléphone avec le nom, le
          secteur, une accroche et les horaires — le client scanne un QR pour
          voir des plats, pas pour lire une présentation. Il ne reste que le
          nom, l'état d'ouverture et l'horaire ; l'accroche est descendue au
          pied de page, où on la lit quand on a fini de choisir.
        */}
        <div className="relative mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-4">
          <ZitounaMark className="h-7 w-7 shrink-0 text-[var(--olive)]" />

          <div className="min-w-0 flex-1">
            <h1 className="text-[24px] font-bold leading-[1.15] sm:text-[30px]">
              {cafe.name}
            </h1>

            <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px] text-[var(--ink-2)]">
              <OpenNow />
              <span className="numerals">{cafe.hours}</span>
            </p>
          </div>
        </div>
      </header>

      <main id="main">
        <MenuBoard categories={menu} />
      </main>

      <footer className="border-t border-[var(--line)] bg-[var(--cream-2)] px-4 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 text-[14px] text-[var(--ink-2)]">
          <p className="font-bold text-[var(--ink)]">{cafe.name}</p>
          {/* L'accroche, descendue de l'en-tête : on la lit une fois choisi. */}
          <p>{cafe.tagline}</p>
          <p>{cafe.address}</p>
          <p className="numerals">{cafe.phoneDisplay}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={'/demo/menu/affiche'}
              className="inline-flex min-h-[44px] w-fit items-center rounded-full border border-[var(--line)] bg-white px-4 font-bold text-[var(--clay-ink)]"
            >
              {menuUi.poster}
            </Link>

            {/* Sortie de secours : la bande masque son lien sur mobile. */}
            <Link
              href="/fr/services"
              className="inline-flex min-h-[44px] w-fit items-center rounded-full px-4 font-bold text-[var(--ink-2)] underline underline-offset-4 sm:hidden"
            >
              {'Retour à MADDEV'}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
