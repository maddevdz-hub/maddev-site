import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Achat } from '@/components/demo/boutique/Achat';
import { AjoutRapide } from '@/components/demo/boutique/Compteurs';
import { Cadre, Reassurance } from '@/components/demo/boutique/Cadre';
import { Galerie } from '@/components/demo/boutique/Galerie';
import { photosBoutique } from '@/content/demos/boutique-photos';
import { formatDA, prixDepart, produit as trouver, produits, sommaire, type Produit } from '@/content/demos/boutique';

export function generateStaticParams() {
  return produits.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = trouver(params.slug);
  if (!p) return {};
  const photo = photosBoutique[p.photos[0]];
  const description = p.carnet
    ? `${p.carnet.premiereImpression} ${p.nature}, dès ${formatDA(prixDepart(p))}. Paiement à la livraison.`
    : `${p.description ?? p.nom} Paiement à la livraison.`;
  return {
    title: p.nom,
    description,
    // La fiche se partage sur WhatsApp : l'aperçu doit montrer le flacon.
    openGraph: {
      title: `${p.nom} — Nadâ`,
      description,
      images: [{ url: photo.src, width: photo.width, height: photo.height, alt: p.nom }],
    },
  };
}

/** Deux suggestions : les deux pages suivantes du carnet, ou un parfum pour un soin. */
function souventPrisAvec(p: Produit): Produit[] {
  const parfums = sommaire.map((s) => trouver(s)!).filter((x) => x.slug !== p.slug);
  if (!p.famille) return parfums.slice(0, 2);
  const i = sommaire.indexOf(p.slug);
  return [parfums[i % parfums.length], trouver('brume-cheveux')!];
}

/**
 * La fiche produit. Ordre imposé : galerie, prix, contenance, formulaire de
 * commande. La page de carnet — l'histoire du parfum, sa pyramide — vient
 * DESSOUS : elle accompagne la vente, elle ne passe jamais devant.
 */
export default function FicheProduit({ params }: { params: { slug: string } }) {
  const p = trouver(params.slug);
  if (!p) notFound();
  const page = sommaire.indexOf(p.slug) + 1;
  const suggestions = souventPrisAvec(p);

  return (
    <Cadre>
      <Reassurance />
      <div className="nd-wrap pb-24 lg:pb-10">
        <nav aria-label="Fil d’Ariane" className="hidden py-1 text-[12.5px] text-[var(--gris-texte)] sm:block">
          <Link href="/demo/boutique" className="inline-flex min-h-[44px] items-center hover:underline">Le carnet</Link>
          <span aria-hidden="true"> › </span>
          <Link href="/demo/boutique/parfums" className="inline-flex min-h-[44px] items-center hover:underline">Tous les parfums</Link>
          <span aria-hidden="true"> › </span>
          <span aria-current="page">{p.nom}</span>
        </nav>

        {/* grid-cols-1 = minmax(0, 1fr) : sans cela, la colonne unique du téléphone
            prend la largeur minimale de son contenu le plus large et déborde. */}
        <div className="grid grid-cols-1 gap-6 pt-5 sm:pt-0 lg:grid-cols-[1.08fr_.92fr] lg:items-start lg:gap-14">
          <Galerie produit={p} />
          <Achat produit={p} />
        </div>

        {/* ── La page de carnet : sous la commande, jamais avant ── */}
        <section
          className="mt-14 border-t border-[var(--ligne)] pt-10 lg:mt-20 lg:pt-14"
          style={{ ['--accent' as string]: p.accent }}
          aria-labelledby="page-carnet"
        >
          {p.carnet ? (
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">
                  Carnet de Nadâ{page > 0 ? ` — page ${String(page).padStart(2, '0')}` : ''} · {p.carnet.lieu}
                </p>
                <h2 id="page-carnet" className="mt-1 text-[44px] lg:text-[64px]">{p.nom}</h2>
                <p className="nd-italique text-[22px] text-[var(--gris-texte)]">
                  où l’on raconte ce que devient ce parfum sur la peau.
                </p>
                <hr className="my-5 w-16 border-0 border-t-2 border-[var(--accent)]" />
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[var(--ambre-texte)]">Ce qu’on sent d’abord</p>
                <p className="nd-italique mt-1 max-w-[30em] text-[22px] leading-snug">« {p.carnet.premiereImpression} »</p>
                <p className="mt-4 max-w-[34em] text-[15.5px]">{p.carnet.recit}</p>
              </div>
              {/* La pyramide, dessinée : chaque étage dit quand on le sent. */}
              <div className="grid max-w-[560px] justify-items-center gap-1.5 self-center" aria-label="Pyramide olfactive">
                {([
                  ['Tête', 'les premières minutes', p.carnet.notes.tete, 'w-[48%]'],
                  ['Cœur', 'les premières heures', p.carnet.notes.coeur, 'w-[72%]'],
                  ['Fond', 'ce qui reste le soir', p.carnet.notes.fond, 'w-[96%]'],
                ] as const).map(([etage, quand, notes, largeur], i) => (
                  <div key={etage}
                    className={`${largeur} border border-[var(--encre)] bg-[#fffdf9] px-2.5 py-2 text-center ${i === 0 ? 'border-t-[3px] border-t-[var(--accent)]' : ''}`}>
                    <span className="block text-[9.5px] font-bold uppercase tracking-[.22em] text-[var(--ambre-texte)]">
                      {etage} · {quand}
                    </span>
                    <span className="nd-italique text-[18px]">{notes}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-[40em]">
              <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">{p.nature}</p>
              <h2 id="page-carnet" className="mt-1 text-[44px]">{p.nom}</h2>
              <hr className="my-5 w-16 border-0 border-t-2 border-[var(--accent)]" />
              <p className="text-[15.5px]">{p.description}</p>
            </div>
          )}
        </section>

        {/* ── Souvent pris avec ── */}
        <section className="mt-14" aria-labelledby="avec">
          <h2 id="avec" className="text-[32px]">Souvent pris <span className="nd-italique">avec</span></h2>
          <ul className="mt-5 grid max-w-[640px] grid-cols-2 gap-4">
            {suggestions.map((s) => (
              <li key={s.slug} style={{ ['--accent' as string]: s.accent }}>
                <Link href={`/demo/boutique/p/${s.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[4px] bg-[var(--accent)]" />
                    <Image src={photosBoutique[s.photos[0]].src} alt={s.nom} fill sizes="(min-width: 640px) 300px, 45vw" className="object-cover" />
                  </div>
                  <p className="nd-serif mt-2 text-[21px] font-semibold group-hover:underline">{s.nom}</p>
                  <p className="nd-prix inline-block bg-[var(--creme)] pe-1 text-[14px] text-[var(--ambre-texte)]">
                    {s.contenances.length > 1 ? 'dès ' : ''}{formatDA(prixDepart(s))}
                  </p>
                </Link>
                <AjoutRapide slug={s.slug} nom={s.nom} />
              </li>
            ))}
          </ul>
        </section>

        {/* ── Trois questions ── */}
        <section className="mt-14 max-w-[720px]" aria-labelledby="faq">
          <h2 id="faq" className="text-[32px]">Questions fréquentes</h2>
          {[
            ['Combien de temps pour être livré ?', 'De 1 à 6 jours ouvrés selon la wilaya. Le délai de votre commune s’affiche dans le formulaire, avant de commander.'],
            ['Et si le parfum ne me plaît pas ?', 'Vous pouvez l’échanger sous 7 jours, flacon non entamé. Vous pouvez aussi ouvrir le colis devant le livreur avant de payer.'],
            ['Puis-je payer par carte ?', 'Pas pour l’instant : le paiement se fait en espèces, au livreur, à la livraison.'],
          ].map(([q, r], i) => (
            <details key={q} open={i === 0} className="border-b border-[var(--ligne)] py-4">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold">
                {q}
                <span aria-hidden="true" className="text-[22px] leading-none text-[var(--ambre-texte)]">+</span>
              </summary>
              <p className="mt-2 text-[14.5px] text-[var(--gris-texte)]">{r}</p>
            </details>
          ))}
        </section>
      </div>
    </Cadre>
  );
}
