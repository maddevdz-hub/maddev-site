'use client';

import {
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';

/**
 * Révélation au défilement — en CSS, pilotée par un IntersectionObserver.
 *
 * Le piège que ce composant évite : un bloc rendu côté serveur avec
 * `opacity: 0` reste invisible tant que React n'a pas hydraté la page. Quand
 * ce bloc est dans le premier écran, c'est LUI que le navigateur retient
 * comme élément LCP, et le score s'effondre alors que la page était prête.
 * Le site en livrait vingt-six sur la seule page d'accueil.
 *
 * Donc : le serveur rend toujours le contenu visible, sans aucun attribut.
 * Juste après le montage, on mesure — et seuls les blocs situés SOUS la
 * ligne de flottaison reçoivent `data-reveal="armed"`, qui les cache. Ils
 * passent à `"in"` en entrant dans le champ. Un bloc déjà à l'écran ne porte
 * jamais l'attribut : il ne peut donc ni disparaître ni clignoter.
 *
 * L'animation elle-même est en CSS (globals.css, jetons --duration/--ease) :
 * pas de JavaScript d'animation, et la même courbe que les transitions
 * d'états écrites ailleurs dans les composants.
 */

/** Arme un élément, puis le révèle quand il entre dans le champ. */
function arm(el: HTMLElement, threshold = 0.2): (() => void) | undefined {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Page ouverte dans un onglet d'arrière-plan : le navigateur suspend
  // l'IntersectionObserver tant que le document est masqué. On n'arme donc
  // rien — mieux vaut une page sans animation qu'une page restée vide.
  if (document.visibilityState !== 'visible') return;
  // 90 % de la hauteur d'écran : la marge évite d'armer un bloc à cheval sur
  // le pli, qui s'animerait sous les yeux du visiteur sans qu'il ait défilé.
  if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return;

  el.dataset.reveal = 'armed';
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = 'in';
        observer.unobserve(entry.target);
      }
    },
    // Un bloc plus haut que l'écran n'atteindrait jamais un seuil élevé.
    { threshold: el.offsetHeight > window.innerHeight * 0.8 ? 0 : threshold },
  );
  observer.observe(el);
  return () => observer.disconnect();
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Décalage en secondes, pour échelonner deux blocs voisins. */
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    return el ? arm(el) : undefined;
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={
        delay
          ? ({ '--reveal-delay': `${Math.round(delay * 1000)}ms` } as never)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}

/**
 * Grille dont les enfants apparaissent l'un après l'autre.
 *
 * Le décalage est posé sur chaque enfant au moment de l'armement : il ne
 * coûte rien tant que la grille n'est pas armée, et il disparaît avec elle
 * si le visiteur a demandé moins d'animations.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Décalage entre deux enfants, en secondes. */
  stagger?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(
      el.querySelectorAll<HTMLElement>('[data-reveal-item]'),
    );
    const cleanups = items.map((item, index) => {
      item.style.setProperty(
        '--reveal-delay',
        `${Math.round(index * stagger * 1000)}ms`,
      );
      return arm(item);
    });

    return () => cleanups.forEach((stop) => stop?.());
  }, [stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Enfant d'un RevealGroup — c'est le groupe qui l'arme et le décale. */
export function RevealItem({
  children,
  className,
  as: Tag = 'div',
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Permet d'ancrer l'élément pour un lien #slug. */
  id?: string;
}) {
  return (
    <Tag id={id} className={className} data-reveal-item="">
      {children}
    </Tag>
  );
}
