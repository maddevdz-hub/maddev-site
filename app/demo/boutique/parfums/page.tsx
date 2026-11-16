import type { Metadata } from 'next';

import { Cadre, Reassurance } from '@/components/demo/boutique/Cadre';
import { Catalogue } from '@/components/demo/boutique/Catalogue';

export const metadata: Metadata = {
  title: 'Tous les parfums',
  description: 'Le catalogue Nadâ : parfums, huile, soins et coffret. Livraison dans toutes les wilayas, paiement à la livraison.',
};

/** Le catalogue de Nadâ : sobre, au service du choix. */
export default function CatalogueBoutique() {
  return (
    <Cadre>
      <Reassurance />
      <div className="nd-wrap pb-6 pt-8 lg:pt-12">
        <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Le carnet, en entier</p>
        <h1 className="mt-1 text-[44px] sm:text-[60px]">
          Tous les <span className="nd-italique">parfums</span>
        </h1>
        <p className="mt-3 max-w-[34em] text-[16px] text-[var(--gris-texte)]">
          Cinq parfums, deux soins et un coffret. Choisissez une famille, ou triez par prix.
        </p>
        <Catalogue />
        <p className="mt-10 text-[12px] text-[var(--gris-texte)]">Tarifs de démonstration.</p>
      </div>
    </Cadre>
  );
}
