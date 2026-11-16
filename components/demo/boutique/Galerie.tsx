'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { photosBoutique } from '@/content/demos/boutique-photos';
import type { Produit } from '@/content/demos/boutique';

/**
 * La galerie de la fiche.
 *
 * Téléphone : les vues défilent au doigt (scroll-snap natif, aucune
 * bibliothèque), des points disent où l'on est. Ordinateur : vignettes à
 * gauche, grande vue à droite. Partout, toucher la photo l'ouvre en plein
 * écran : le zoom au doigt est alors celui du téléphone, sans code à nous.
 *
 * La photo est collée comme un tirage, avec le ruban à la couleur du parfum.
 */
export function Galerie({ produit }: { produit: Produit }) {
  const vues = produit.photos.map((n) => ({ nom: n, ...photosBoutique[n] }));
  const [active, setActive] = useState(0);
  const [pleinEcran, setPleinEcran] = useState(false);
  const piste = useRef<HTMLDivElement>(null);
  const dialogue = useRef<HTMLDialogElement>(null);

  // Le point actif suit le défilement au doigt.
  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    const surDefilement = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setActive(Math.min(Math.max(i, 0), vues.length - 1));
    };
    el.addEventListener('scroll', surDefilement, { passive: true });
    return () => el.removeEventListener('scroll', surDefilement);
  }, [vues.length]);

  useEffect(() => {
    const d = dialogue.current;
    if (!d) return;
    if (pleinEcran && !d.open) d.showModal();
    if (!pleinEcran && d.open) d.close();
  }, [pleinEcran]);

  const aller = (i: number) => {
    setActive(i);
    const el = piste.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const alt = (i: number) => `${produit.nom}, vue ${i + 1} sur ${vues.length}`;

  return (
    <div className="lg:sticky lg:top-6 lg:grid lg:grid-cols-[84px_1fr] lg:gap-4" style={{ ['--accent' as string]: produit.accent }}>
      {vues.length > 1 ? (
        <div className="hidden flex-col gap-2.5 lg:flex">
          {vues.map((v, i) => (
            <button
              key={v.nom}
              type="button"
              onClick={() => aller(i)}
              aria-label={`Afficher la vue ${i + 1}`}
              aria-current={active === i}
              className={`relative aspect-[4/5] overflow-hidden rounded-[8px] border-2 ${
                active === i ? 'border-[var(--accent)]' : 'border-transparent'
              }`}
            >
              <Image src={v.src} alt="" fill sizes="84px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="nd-tirage relative lg:col-start-2" style={{ transform: 'rotate(-0.8deg)', paddingBottom: 10 }}>
        <span className="nd-ruban" aria-hidden="true" />
        <div
          ref={piste}
          className="flex aspect-[5/4] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:aspect-[4/5] [&::-webkit-scrollbar]:hidden"
        >
          {vues.map((v, i) => (
            <button
              key={v.nom}
              type="button"
              onClick={() => {
                setActive(i);
                setPleinEcran(true);
              }}
              aria-label={`${alt(i)} — agrandir`}
              className="relative h-full w-full flex-none snap-center cursor-zoom-in"
            >
              <Image
                src={v.src}
                alt={alt(i)}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 560px, 92vw"
                placeholder="blur"
                blurDataURL={v.blur}
                className="object-cover"
              />
            </button>
          ))}
        </div>
        {/* Les points, posés sur la photo : sur téléphone, chaque ligne
            gagnée remonte le prix dans le premier écran. */}
        {vues.length > 1 ? (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1 lg:hidden" role="tablist" aria-label="Vues du produit">
            {vues.map((v, i) => (
              <button
                key={v.nom}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Vue ${i + 1}`}
                onClick={() => aller(i)}
                className="grid h-11 w-6 place-items-center"
              >
                <span className={`block h-[7px] rounded-full transition-all ${active === i ? 'w-5 bg-[var(--accent)]' : 'w-[7px] bg-[var(--creme)] opacity-80'}`} />
              </button>
            ))}
          </div>
        ) : null}

      </div>

      <dialog
        ref={dialogue}
        onClose={() => setPleinEcran(false)}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-[var(--encre)] p-0 backdrop:bg-black/80"
        aria-label={`${produit.nom} en plein écran`}
      >
        <div className="relative h-full w-full">
          {pleinEcran ? (
            <Image
              src={vues[active].src}
              alt={alt(active)}
              fill
              sizes="100vw"
              className="object-contain"
            />
          ) : null}
          <button
            type="button"
            onClick={() => setPleinEcran(false)}
            className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-[var(--creme)] text-[var(--encre)]"
            aria-label="Fermer le plein écran"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </dialog>
    </div>
  );
}
