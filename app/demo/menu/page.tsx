import Link from 'next/link';

import { CoverPhoto } from '@/components/demo/menu/CoverPhoto';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { MenuBoard } from '@/components/demo/menu/MenuBoard';
import { OpenNow } from '@/components/demo/menu/OpenNow';
import { ZitounaMark } from '@/components/demo/menu/ZitounaMark';
import { cafe, menu, menuUi } from '@/content/demos/menu';
import { photos } from '@/content/demos/menu-photos';

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
        <CoverPhoto photo={photos['entete.webp']} />

        <ZitounaMark className="pointer-events-none absolute -top-8 end-[-30px] h-[150px] w-[150px] text-[var(--clay)] opacity-[.07] sm:end-8 sm:h-[170px] sm:w-[170px]" />

        {/*
          En-tête volontairement court.
          Il occupait la moitié du premier écran d'un téléphone avec le nom, le
          secteur, une accroche et les horaires — le client scanne un QR pour
          voir des plats, pas pour lire une présentation. Il ne reste que le
          nom, l'état d'ouverture et l'horaire ; l'accroche est descendue au
          pied de page, où on la lit quand on a fini de choisir.

          Le haut du bandeau est laissé vide : c'est la bande où la photo
          respire, celle où le voile est le plus léger. Le texte, lui, se tient
          dans le bas, là où le voile est dense — la seule zone où le contraste
          est garanti.
        */}
        <div className="relative mx-auto flex w-full max-w-3xl items-center gap-3.5 px-4 pb-4 pt-12 sm:pt-16">
          <ZitounaMark className="h-9 w-9 shrink-0 text-[var(--olive)]" />

          <div className="min-w-0 flex-1">
            <h1 className="text-[24px] font-bold leading-[1.15] sm:text-[30px]">
              {cafe.name}
            </h1>

            {/*
              Empilée sur téléphone, alignée dès la tablette — et jamais
              `flex-wrap`.

              Mesuré : avec le repli automatique, la ligne tenait sur 308 px
              tant que la police de repli était affichée, puis passait à
              313 px une fois Karla chargée. Elle basculait alors sur deux
              lignes, l'en-tête gagnait 26 px, et TOUTE la carte descendait
              d'autant — 0,157 de décalage cumulé, sur le seul changement de
              police. Un repli qui dépend de la largeur d'un glyphe est une
              mise en page qui tient par chance.
            */}
            <p className="mt-1.5 flex flex-col items-start gap-1.5 text-[13.5px] text-[var(--ink-2)] sm:flex-row sm:items-center sm:gap-x-2.5">
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
              className="inline-flex min-h-[44px] w-fit items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 font-bold text-[var(--clay-ink)]"
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
