import Image from 'next/image';

import type { ServiceVisualSpec } from '@/content/services';

/**
 * Les visuels de la page /services : une capture RÉELLE de la démonstration,
 * cadrée dans un téléphone ou un écran, produite par
 * `node scripts/captures.mjs` — donc toujours conforme à la démo en ligne.
 *
 * Règle : **jamais un cadre vide avec une icône au milieu**, et jamais une
 * interface dessinée qui imite une capture. Les services sans démonstration
 * montrent leur mécanisme en trois étapes (ServiceJourney), pas un faux
 * écran : un visiteur qui croit voir un produit livré, puis découvre qu'il
 * n'existe pas, ne revient pas.
 */
export function ShowcaseFigure({
  visual,
  alt,
}: {
  visual: ServiceVisualSpec;
  alt: string;
}) {
  const image = (
    <Image
      src={visual.src}
      alt={alt}
      width={visual.width}
      height={visual.height}
      sizes="(min-width: 768px) 640px, 92vw"
      className="h-auto w-full"
    />
  );

  return visual.frame === 'phone' ? (
    <PhoneFrame>{image}</PhoneFrame>
  ) : (
    <ScreenFrame>{image}</ScreenFrame>
  );
}

/* ------------------------------------------------------------------ cadres */

/**
 * Cadre de téléphone.
 *
 * Dessiné en CSS et non en image : il se teinte avec la charte, reste net à
 * toutes les densités, et pèse zéro octet de plus.
 */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[280px]">
      {/*
        Pas d'encoche : posée sur la capture, elle recouvrait le nom du café.
        Le biseau arrondi et l'ombre portée suffisent à faire lire
        « téléphone » — un détail de mockup ne doit jamais manger le contenu
        qu'il est censé mettre en valeur.
      */}
      <div className="rounded-[2.2rem] border border-line2 bg-ink3 p-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,.75)]">
        <div className="overflow-hidden rounded-[1.7rem]">{children}</div>
      </div>
    </div>
  );
}

/** Cadre d'écran : une barre de navigateur sobre, sans URL inventée. */
function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line2 bg-ink3 shadow-[0_30px_60px_-28px_rgba(0,0,0,.8)]">
      <div className="flex items-center gap-1.5 border-b border-line px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
      </div>
      {children}
    </div>
  );
}
