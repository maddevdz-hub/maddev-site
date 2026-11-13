'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Démonstration essayable dans la page /services.
 *
 * À partir de 768 px : la vraie démo, dans un cadre de téléphone, en
 * `<iframe>`. Le visiteur touche, filtre, réserve, sans quitter la page.
 * La démo y garde sa propre bande « Démonstration — projet fictif ».
 *
 * Sous 768 px : la capture et un lien. Un cadre défilant dans une page
 * défilante est pénible au doigt — on ne sait jamais lequel des deux bouge.
 *
 * L'iframe n'est montée qu'après vérification de la largeur, côté client :
 * un iframe simplement masqué en CSS se chargerait quand même sur mobile et
 * plomberait la page. Le cadre réserve sa hauteur dès le rendu serveur, donc
 * rien ne bouge quand la démo arrive.
 */
export function DemoEmbed({
  src,
  title,
  fallback,
  tryLabel,
  openLabel,
}: {
  src: string;
  /** Titre explicite de l'iframe, lu par les lecteurs d'écran. */
  title: string;
  /** La capture, affichée sous 768 px. */
  fallback: ReactNode;
  tryLabel: string;
  openLabel: string;
}) {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const lien = (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[44px] items-center text-[14px] font-semibold text-txt2 underline underline-offset-4 transition-colors hover:text-txt"
    >
      {openLabel}
    </a>
  );

  return (
    <>
      {/* Mobile : la capture, puis le lien. */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        {fallback}
        {lien}
      </div>

      {/* Desktop : la démo elle-même. */}
      <div className="hidden flex-col items-center gap-3 md:flex">
        <div className="flex w-full max-w-[340px] items-center justify-between gap-4">
          <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-coral2">
            {tryLabel}
          </p>
          {lien}
        </div>

        <div className="w-full max-w-[340px] rounded-[2.2rem] border border-line2 bg-ink3 p-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,.75)]">
          <div className="h-[640px] overflow-hidden rounded-[1.7rem] bg-ink2">
            {desktop ? (
              <iframe
                src={src}
                title={title}
                loading="lazy"
                className="h-full w-full border-0"
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
