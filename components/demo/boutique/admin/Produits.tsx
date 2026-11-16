'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useRegistre } from '@/components/demo/boutique/admin/registre';
import { badgeStock, ecrireStocks, lireStocks, stocksInitiaux, useStocks } from '@/components/demo/boutique/stocks';
import { photosBoutique } from '@/content/demos/boutique-photos';
import { formatDA, libelleContenance, produits } from '@/content/demos/boutique';

/**
 * Produits et stock. Le stock affiché ici est celui que lit la vitrine :
 * le passer à 0 affiche « Rupture » sur la fiche, à 5 ou moins « Plus que N ».
 * Il baisse tout seul quand une commande est confirmée.
 */
export function Produits() {
  const registre = useRegistre();
  const stocks = useStocks();
  const [raz, setRaz] = useState(false);
  if (!registre) return <div className="min-h-[70vh]" aria-busy="true" />;

  const quantite = (slug: string, statuts: string[]) =>
    registre.commandes
      .filter((c) => statuts.includes(c.statut))
      .reduce((s, c) => s + c.lignes.filter((l) => l.slug === slug).reduce((t, l) => t + l.quantite, 0), 0);

  const regler = (slug: string, valeur: number) => {
    const s = lireStocks();
    s[slug] = Math.max(0, Math.min(999, Math.round(valeur) || 0));
    ecrireStocks(s);
  };

  return (
    <div className="nd-wrap pb-12 pt-7 lg:pt-10">
      <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Registre — l’étagère</p>
      <h1 className="mt-1 text-[40px] sm:text-[52px]">Produits</h1>
      <p className="mt-2 max-w-[44em] text-[15px] text-[var(--gris-texte)]">
        Le stock baisse à la confirmation d’une commande, pas à sa réception : une commande qu’on n’arrive pas à
        confirmer ne bloque pas un flacon. Il remonte si une commande confirmée est annulée ou revient.
      </p>

      <ul className="mt-6 divide-y divide-[var(--ligne)] rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9]">
        {produits.map((p) => {
          const stock = stocks[p.slug] ?? 0;
          const badge = badgeStock(stock);
          const attente = quantite(p.slug, ['nouvelle', 'a-rappeler']);
          const vendus = quantite(p.slug, ['confirmee', 'expediee', 'livree']);
          const photo = photosBoutique[p.photos[0]];
          return (
            <li key={p.slug} className="grid grid-cols-[56px_1fr] gap-x-3.5 gap-y-3 p-3.5 sm:p-4 lg:grid-cols-[64px_1.4fr_1fr_1fr_auto] lg:items-center lg:gap-x-6">
              <span className="relative block h-[70px] w-[56px] overflow-hidden rounded-[8px] bg-[var(--creme-2)] lg:h-[80px] lg:w-[64px]">
                <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" placeholder="blur" blurDataURL={photo.blur} />
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2">
                  <span className="nd-pastille" style={{ ['--accent' as string]: p.accent }} />
                  <span className="nd-serif text-[21px] font-semibold leading-tight">{p.nom}</span>
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--gris-texte)]">
                  {p.contenances.map((c) => `${libelleContenance(c)} · ${formatDA(c.prix)}`).join(' — ')}
                </p>
                <Link href={`/demo/boutique/p/${p.slug}`} className="text-[13px] font-semibold underline decoration-[var(--ligne)] underline-offset-4">
                  Voir la fiche en boutique
                </Link>
              </div>

              <dl className="col-span-2 grid grid-cols-2 gap-3 text-[14px] lg:col-span-2">
                <div>
                  <dt className="text-[12px] text-[var(--gris-texte)]">Vendus (confirmés)</dt>
                  <dd className="text-[18px] font-bold tabular-nums">{vendus}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-[var(--gris-texte)]">En attente d’appel</dt>
                  <dd className="text-[18px] font-bold tabular-nums">{attente}</dd>
                  {attente > stock ? <dd className="text-[12.5px] font-bold text-[var(--erreur)]">Pas assez de stock pour tout confirmer</dd> : null}
                </div>
              </dl>

              <div className="col-span-2 flex items-center justify-between gap-3 lg:col-span-1 lg:justify-end">
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold ${
                    !badge ? 'bg-[#dbe6dd] text-[#22352c]' : badge.ton === 'rupture' ? 'bg-[#f1d9d4] text-[#7f2418]' : 'bg-[#f3e3cf] text-[#6e4317]'
                  }`}
                >
                  {badge ? badge.texte : 'En stock'}
                </span>
                <div className="flex items-center rounded-full border border-[var(--ligne)] bg-[var(--creme)]">
                  <button type="button" onClick={() => regler(p.slug, stock - 1)} disabled={stock <= 0} aria-label={`Retirer un ${p.nom} du stock`} className="grid h-[44px] w-[44px] place-items-center text-[20px] disabled:opacity-30">
                    −
                  </button>
                  <label>
                    <span className="sr-only">Stock de {p.nom}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={999}
                      value={stock}
                      onChange={(e) => regler(p.slug, Number(e.target.value))}
                      className="h-[44px] w-[52px] bg-transparent text-center text-[17px] font-bold tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </label>
                  <button type="button" onClick={() => regler(p.slug, stock + 1)} aria-label={`Ajouter un ${p.nom} au stock`} className="grid h-[44px] w-[44px] place-items-center text-[20px]">
                    +
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-[13.5px] text-[var(--gris-texte)]">
        {raz ? (
          <>
            Remettre tous les stocks à leur valeur de départ ?
            <button
              type="button"
              onClick={() => {
                ecrireStocks(stocksInitiaux());
                setRaz(false);
              }}
              className="min-h-[44px] rounded-full bg-[var(--encre)] px-4 font-semibold text-[var(--creme)]"
            >
              Remettre
            </button>
            <button type="button" onClick={() => setRaz(false)} className="min-h-[44px] px-2 font-semibold text-[var(--encre)] underline underline-offset-4">
              Annuler
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setRaz(true)} className="min-h-[44px] rounded-full border border-[var(--ligne)] px-4 font-semibold text-[var(--encre)]">
            Remettre les stocks de départ
          </button>
        )}
      </div>
    </div>
  );
}
