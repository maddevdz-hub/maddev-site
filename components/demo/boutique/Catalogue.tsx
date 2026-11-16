'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { badgeStock, useStocks } from '@/components/demo/boutique/stocks';
import { photosBoutique } from '@/content/demos/boutique-photos';
import {
  familles,
  formatDA,
  libelleContenance,
  prixDepart,
  produits,
  type Famille,
} from '@/content/demos/boutique';

type Filtre = 'tout' | Famille | 'soins';
type Tri = 'carnet' | 'prix-croissant' | 'prix-decroissant';

const FILTRES: { valeur: Filtre; libelle: string }[] = [
  { valeur: 'tout', libelle: 'Tout' },
  { valeur: 'floral', libelle: familles.floral },
  { valeur: 'ambre', libelle: familles.ambre },
  { valeur: 'boise', libelle: familles.boise },
  { valeur: 'frais', libelle: familles.frais },
  { valeur: 'soins', libelle: 'Soins et coffret' },
];

/**
 * Le catalogue : sobre. Une grille, des filtres par famille, un tri par prix.
 * La couleur de chaque parfum n'apparaît que sur sa carte (filet, pastille).
 *
 * Filtre et tri vivent dans l'adresse (?famille=floral&tri=prix-croissant) :
 * un lien partagé sur WhatsApp ouvre la même sélection.
 */
export function Catalogue() {
  const stocks = useStocks();
  const [filtre, setFiltre] = useState<Filtre>('tout');
  const [tri, setTri] = useState<Tri>('carnet');

  // Lecture de l'adresse au montage seulement : pas de Suspense à prévoir.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const f = q.get('famille') as Filtre | null;
    const t = q.get('tri') as Tri | null;
    if (f && FILTRES.some((x) => x.valeur === f)) setFiltre(f);
    if (t === 'prix-croissant' || t === 'prix-decroissant') setTri(t);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();
    if (filtre !== 'tout') q.set('famille', filtre);
    if (tri !== 'carnet') q.set('tri', tri);
    const s = q.toString();
    window.history.replaceState(null, '', s ? `?${s}` : window.location.pathname);
  }, [filtre, tri]);

  const liste = useMemo(() => {
    const filtres = produits.filter((p) => {
      if (filtre === 'tout') return true;
      if (filtre === 'soins') return !p.famille;
      return p.famille === filtre;
    });
    if (tri === 'carnet') return filtres;
    const signe = tri === 'prix-croissant' ? 1 : -1;
    return [...filtres].sort((a, b) => signe * (prixDepart(a) - prixDepart(b)));
  }, [filtre, tri]);

  return (
    <>
      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filtrer par famille" className="flex flex-wrap gap-2">
          {FILTRES.map((f) => {
            const actif = filtre === f.valeur;
            return (
              <button
                key={f.valeur}
                type="button"
                aria-pressed={actif}
                onClick={() => setFiltre(f.valeur)}
                className={`min-h-[44px] rounded-full border px-4 text-[14px] font-semibold transition-colors ${
                  actif
                    ? 'border-[var(--encre)] bg-[var(--encre)] text-[var(--creme)]'
                    : 'border-[var(--ligne)] bg-[var(--creme)] hover:border-[var(--encre)]'
                }`}
              >
                {f.libelle}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-3 text-[14px] font-semibold">
          Trier
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as Tri)}
            className="min-h-[44px] rounded-full border border-[var(--ligne)] bg-[var(--creme)] px-4 font-medium"
          >
            <option value="carnet">Ordre du carnet</option>
            <option value="prix-croissant">Prix croissant</option>
            <option value="prix-decroissant">Prix décroissant</option>
          </select>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {liste.length} produit{liste.length > 1 ? 's' : ''} affiché{liste.length > 1 ? 's' : ''}.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {liste.map((p, i) => {
          const photo = photosBoutique[p.photos[0]];
          const badge = badgeStock(stocks[p.slug] ?? p.stock);
          const ml = p.contenances.map(libelleContenance).join(' · ');
          return (
            <li key={p.slug} style={{ ['--accent' as string]: p.accent }}>
              <Link href={`/demo/boutique/p/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[var(--creme-2)]">
                  {/* Le filet de couleur du parfum, en haut de sa carte */}
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[4px] bg-[var(--accent)]" />
                  <Image
                    src={photo.src}
                    alt={p.nom}
                    fill
                    sizes="(min-width: 1024px) 290px, 46vw"
                    placeholder="blur"
                    blurDataURL={photo.blur}
                    priority={i < 2}
                    className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none ${
                      badge?.ton === 'rupture' ? 'opacity-55 grayscale' : ''
                    }`}
                  />
                  <div className="absolute start-2.5 top-3 z-10 flex flex-col items-start gap-1.5">
                    {p.nouveau ? (
                      <span className="rounded-full bg-[var(--creme)] px-2.5 py-1 text-[11px] font-bold">Nouveau</span>
                    ) : null}
                    {badge ? (
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          badge.ton === 'rupture'
                            ? 'bg-[var(--creme)] text-[var(--erreur)]'
                            : 'bg-[var(--encre)] text-[var(--creme)]'
                        }`}
                      >
                        {badge.texte}
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-2 text-[11.5px] text-[var(--gris-texte)]">
                  <span className="nd-pastille" aria-hidden="true" />
                  <span className="nd-italique truncate text-[15px]">
                    {p.carnet ? p.carnet.lieu : p.nature}
                  </span>
                </p>
                <h2 className="mt-0.5 text-[22px] group-hover:underline group-hover:underline-offset-4 sm:text-[25px]">
                  {p.nom}
                </h2>
                <p className="text-[12.5px] text-[var(--gris-texte)]">
                  {p.famille ? `${familles[p.famille]} · ` : ''}
                  {ml}
                </p>
                {/* Fond plein : les lignes du papier ne passent jamais derrière un prix. */}
                <p className="nd-prix mt-1.5 inline-block bg-[var(--creme)] pe-1 text-[15px] text-[var(--ambre-texte)]">
                  {p.contenances.length > 1 ? 'dès ' : ''}
                  {formatDA(prixDepart(p))}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
