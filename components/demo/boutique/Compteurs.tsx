'use client';

import { useState } from 'react';

import { ajouterAuPanier, usePanier } from '@/components/demo/boutique/panier-stockage';

/** Le nombre d'articles du panier, sur l'icône de l'en-tête. */
export function CompteurPanier() {
  const lignes = usePanier();
  const n = lignes?.reduce((s, l) => s + l.quantite, 0) ?? 0;
  if (!n) return null;
  return (
    <span className="absolute -end-0.5 -top-0.5 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-[var(--vert)] px-1 text-[10.5px] font-bold text-[var(--creme)]">
      {n}
      <span className="sr-only"> article{n > 1 ? 's' : ''} dans le panier</span>
    </span>
  );
}

/** « Souvent pris avec » : ajouter en un geste, sans quitter la fiche. */
export function AjoutRapide({ slug, nom }: { slug: string; nom: string }) {
  const [fait, setFait] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        ajouterAuPanier(slug);
        setFait(true);
      }}
      aria-label={fait ? `${nom} ajouté au panier` : `Ajouter ${nom} au panier`}
      className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--encre)] px-4 text-[13.5px] font-bold"
    >
      {fait ? '✓ Ajouté' : '+ Ajouter'}
    </button>
  );
}
