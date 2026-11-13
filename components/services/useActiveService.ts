'use client';

import { useEffect, useState } from 'react';

/**
 * Le service que le visiteur est en train de lire.
 *
 * On ne marque pas « le bloc visible » — à mi-défilement il y en a deux —
 * mais celui qui occupe la bande centrale de l'écran.
 *
 * Partagé par le sommaire du haut de page et la barre collante : deux
 * observateurs réglés séparément finissaient par désigner des blocs
 * différents au même moment.
 */
export function useActiveService(slugs: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = slugs
      .map((slug) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-42% 0px -50% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
    // Les identifiants sont stables : on compare leur contenu, pas la
    // référence du tableau, qui change à chaque rendu du parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs.join(',')]);

  return active;
}
