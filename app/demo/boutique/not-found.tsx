import Link from 'next/link';

import { Cadre } from '@/components/demo/boutique/Cadre';

/**
 * La 404 de la boutique Nadâ (ajout 43) : une page de carnet restée
 * blanche, et les deux chemins pour repartir. Même cadre que la vitrine,
 * bande de démonstration comprise.
 */
export default function BoutiqueIntrouvable() {
  return (
    <Cadre>
      <title>Page introuvable — Nadâ</title>
      <div className="nd-wrap nd-marge py-16 sm:ps-[110px] lg:py-24">
        <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Carnet de Nadâ — page blanche</p>
        <h1 className="mt-2 text-[44px] sm:text-[60px]">
          Cette page n’est pas <span className="nd-italique">dans le carnet</span>
        </h1>
        <p className="mt-4 max-w-[32em] text-[16px] text-[var(--gris-texte)]">
          Le lien est peut-être incomplet, ou le parfum n’est plus présenté. Les autres pages vous attendent.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/demo/boutique/parfums" className="nd-bouton">Voir tous les parfums</Link>
          <Link href="/demo/boutique" className="inline-flex min-h-[44px] items-center text-[15px] font-bold underline underline-offset-4">
            Revenir au carnet
          </Link>
        </div>
      </div>
    </Cadre>
  );
}
