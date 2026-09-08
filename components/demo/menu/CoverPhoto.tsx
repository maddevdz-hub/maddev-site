'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { Photo } from '@/content/demos/menu-photos';

/**
 * La photographie d'ambiance de l'en-tête, et son voile.
 *
 * Elle est traitée comme une TEXTURE, pas comme un décor : le sujet de cet
 * en-tête reste le nom du café. D'où le voile crème, léger en haut où
 * l'image respire, dense en bas où se trouve le texte — les paliers sont
 * dimensionnés pour tenir le contraste AA sur le pixel le plus sombre de la
 * photo, pas pour faire joli.
 *
 * `priority` : c'est l'image du premier écran, elle ne doit pas être
 * différée. `fill` + `sizes` laissent Next produire l'AVIF et les tailles
 * utiles. La hauteur du bandeau est fixée par son contenu, donc la place est
 * réservée avant que l'image n'arrive — décalage de mise en page nul.
 *
 * La parallaxe est délibérément minuscule. Un en-tête de cent vingt pixels a
 * disparu au bout d'un demi-écran : au-delà de quelques pixels, l'effet ne
 * serait plus discret, il serait voyant. Il est coupé sous
 * `prefers-reduced-motion`, et l'on ne touche qu'à une variable CSS lue par
 * une transformation — jamais à une propriété qui recalculerait la mise en
 * page à chaque image.
 */
export function CoverPhoto({ photo }: { photo: Photo }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const place = () => {
      ticking = false;
      // Un quart de la course : l'image monte moins vite que la page.
      el.style.setProperty('--zt-parallaxe', `${window.scrollY * 0.25}px`);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(place);
    };

    place();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <Image
        src={photo.src}
        // Décorative : elle ne porte aucune information que le texte ne dise.
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={photo.blur}
        className="zt-parallaxe object-cover object-center"
      />
      <div className="zt-voile absolute inset-0" />
    </div>
  );
}
