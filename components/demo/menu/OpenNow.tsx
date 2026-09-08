'use client';

import { useEffect, useState } from 'react';
import { cafe, menuUi } from '@/content/demos/menu';

/**
 * Indicateur « ouvert maintenant ».
 *
 * Calculé sur l'heure du visiteur, pas figé dans le HTML : c'est un détail
 * minuscule, mais c'est exactement ce qui sépare une page vivante d'une
 * plaquette. Un client qui scanne le QR à 23h30 doit lire « fermé ».
 *
 * Rendu vide au premier passage puis renseigné après le montage : le serveur
 * ne connaît pas le fuseau du visiteur, et afficher « ouvert » côté serveur
 * pour le corriger ensuite ferait clignoter une information de confiance.
 */
export function OpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const hour = new Date().getHours();
      setOpen(hour >= cafe.opensAt && hour < cafe.closesAt);
    };
    check();
    // Une minute suffit : personne ne regarde une carte à la seconde près.
    const timer = window.setInterval(check, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  /*
   * La place est réservée par une COPIE invisible du libellé le plus long,
   * empilée dans la même cellule de grille.
   *
   * Pourquoi pas une largeur fixe : il faudrait l'écrire en pixels, la
   * refaire à chaque changement de police et se tromper une fois sur deux.
   * Ici la réserve se mesure toute seule, dans la police réellement chargée.
   *
   * Ce que cela évite : le libellé n'existe qu'après le montage — le serveur
   * ignore le fuseau du visiteur, et afficher « ouvert » pour le corriger
   * ensuite ferait clignoter une information de confiance. Sans réserve, les
   * horaires qui suivent sautaient de quelques pixels à l'hydratation. C'est
   * peu ; c'est quand même du décalage, et il se mesure.
   */
  const puce =
    'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-bold';

  return (
    <span className="inline-grid">
      <span
        aria-hidden="true"
        className={`${puce} invisible col-start-1 row-start-1`}
      >
        <span className="inline-block h-2 w-2 rounded-full" />
        {menuUi.open.length >= menuUi.closed.length ? menuUi.open : menuUi.closed}
      </span>

      {open === null ? null : (
        <span
          className={`${puce} col-start-1 row-start-1 justify-self-start`}
          style={{
            background: open ? 'var(--tag-veg)' : 'var(--cream-3)',
            color: open ? 'var(--tag-veg-ink)' : 'var(--ink-2)',
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: open ? 'var(--olive)' : 'var(--ferme)' }}
          />
          {open ? menuUi.open : menuUi.closed}
        </span>
      )}
    </span>
  );
}
