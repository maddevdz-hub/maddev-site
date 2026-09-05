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

  if (open === null) {
    // Réserve la place pour éviter que la ligne ne saute à l'hydratation.
    return <span className="inline-block h-[26px]" aria-hidden="true" />;
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-bold"
      style={{
        background: open ? '#e8eddc' : 'var(--cream-3)',
        color: open ? '#3f4a2b' : 'var(--ink-2)',
      }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: open ? '#5c6b3f' : '#9a8875' }}
      />
      {open ? menuUi.open : menuUi.closed}
    </span>
  );
}
