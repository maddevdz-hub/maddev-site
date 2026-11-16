import Image from 'next/image';
import Link from 'next/link';

import { Cadre, Reassurance } from '@/components/demo/boutique/Cadre';
import { photosBoutique } from '@/content/demos/boutique-photos';
import {
  contenuCoffret,
  familles,
  formatDA,
  prixDepart,
  produit,
  sommaire,
  type Produit,
} from '@/content/demos/boutique';

/**
 * Accueil de Nadâ : la couverture du carnet.
 *
 * Concept unique de la démo : le carnet d'un parfumeur. L'accueil en est la
 * couverture, puis le sommaire — où les prix prennent la place des numéros
 * de page —, le coffret, et la façon de commander.
 *
 * Volontairement sans animation d'entrée : le titre est l'élément le plus
 * grand du premier écran, il doit s'afficher tout de suite.
 */
export default function AccueilBoutique() {
  const pages = sommaire.map((s) => produit(s)).filter((p): p is Produit => !!p);
  const rose = produit('rose-de-blida')!;
  const coffret = produit('coffret-decouverte')!;

  return (
    <Cadre>
      <Reassurance />

      <div className="nd-wrap nd-marge">
        {/* ── La couverture ── */}
        <section className="grid items-center gap-10 pb-14 pt-10 sm:ps-[110px] lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <p className="nd-italique text-[20px] text-[var(--ambre-texte)]">Carnet de parfumeur</p>
            <h1 className="mt-2 text-[56px] leading-[.92] sm:text-[88px] lg:text-[120px]">
              Nadâ
            </h1>
            <p className="nd-italique mt-5 max-w-[22em] text-[24px] leading-snug text-[var(--gris-texte)] sm:text-[30px]">
              Six pages, et ce qu’elles racontent.
            </p>
            <p className="mt-5 max-w-[30em] text-[16px] text-[var(--gris-texte)] sm:text-[17px]">
              Une page par parfum : d’où il vient, ce qu’on sent d’abord, ce qui reste le soir. On vous livre dans
              toutes les wilayas, et vous payez à la livraison.
            </p>
            <a href="#sommaire" className="nd-bouton mt-8">
              Ouvrir le carnet <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Le tirage de la première page, posé sur la couverture */}
          <Link
            href={`/demo/boutique/p/${rose.slug}`}
            className="mx-auto block w-[78%] max-w-[420px]"
            style={{ ['--accent' as string]: rose.accent }}
            aria-label={`${rose.nom} — ouvrir sa page`}
          >
            <div className="nd-tirage">
              <span className="nd-ruban" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={photosBoutique['rose-de-blida'].src}
                  alt={`${rose.nom}, flacon rond au liquide rosé`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 78vw"
                  placeholder="blur"
                  blurDataURL={photosBoutique['rose-de-blida'].blur}
                  className="object-cover"
                />
              </div>
              <p className="nd-italique absolute bottom-2 start-3 text-[16px]">{rose.nom}, page 01</p>
            </div>
          </Link>
        </section>

        {/* ── Le sommaire : les prix à la place des numéros de page ── */}
        <section id="sommaire" className="scroll-mt-6 pb-16 sm:ps-[110px]">
          <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Sommaire</p>
          <h2 className="mt-1 text-[40px] sm:text-[56px]">
            Le carnet, <span className="nd-italique">six pages</span>
          </h2>
          <ol className="mt-5">
            {pages.map((p, i) => (
              <li key={p.slug} style={{ ['--accent' as string]: p.accent }}>
                <Link
                  href={`/demo/boutique/p/${p.slug}`}
                  className="group flex min-h-[64px] items-center gap-3 border-b border-[var(--ligne)] py-3 sm:gap-4"
                >
                  <span className="nd-italique w-7 flex-none text-[18px] text-[var(--ambre-texte)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="nd-pastille" aria-hidden="true" />
                  <span className="nd-serif min-w-0 text-[22px] font-semibold leading-tight group-hover:underline group-hover:underline-offset-4 sm:whitespace-nowrap sm:text-[27px]">
                    {p.nom}
                  </span>
                  <span className="hidden whitespace-nowrap text-[12.5px] text-[var(--gris-texte)] md:inline">
                    {p.carnet ? p.carnet.lieu : 'quatre flacons de 10 ml'}
                    {p.famille ? ` · ${familles[p.famille].toLowerCase()}` : ''}
                  </span>
                  <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-5px] border-b-[1.5px] border-dotted border-[rgba(29,26,23,.35)]" />
                  <span className="nd-prix whitespace-nowrap bg-[var(--creme)] ps-1 text-[15px]">
                    {p.contenances.length > 1 ? 'dès ' : ''}
                    {formatDA(prixDepart(p))}
                  </span>
                  <span className="relative hidden h-[58px] w-[46px] flex-none overflow-hidden rounded-[4px] sm:block">
                    <Image
                      src={photosBoutique[p.photos[0]].src}
                      alt=""
                      fill
                      sizes="46px"
                      className="object-cover"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12px] text-[var(--gris-texte)]">Tarifs de démonstration.</p>
        </section>

        {/* ── Le coffret ── */}
        <section className="pb-16 sm:ps-[110px]">
          <div className="grid overflow-hidden rounded-[22px] bg-[var(--encre)] text-[var(--creme)] lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px]">
              <Image
                src={photosBoutique.coffret.src}
                alt="Le coffret découverte, boîte kraft à ruban noir"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                placeholder="blur"
                blurDataURL={photosBoutique.coffret.blur}
                className="object-cover"
              />
            </div>
            <div className="p-7 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-[.26em] text-[#d6a56c]">Pour hésiter, ou pour offrir</p>
              <h2 className="mt-2 text-[38px] lg:text-[52px]">{coffret.nom}</h2>
              <p className="mt-3 text-[#d9cfc1]">
                Quatre pages du carnet en flacons de 10 ml : de quoi choisir le sien avant le grand flacon.
              </p>
              <ul className="mt-5 text-[14.5px]">
                {contenuCoffret.map((s) => {
                  const p = produit(s)!;
                  return (
                    <li key={s} className="flex items-center gap-3 border-b border-[rgba(247,242,234,.14)] py-2">
                      <span className="nd-pastille" style={{ ['--accent' as string]: p.accent }} aria-hidden="true" />
                      <span className="flex-1">{p.nom}</span>
                      <span className="text-[#d9cfc1]">10 ml</span>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/demo/boutique/p/${coffret.slug}`}
                className="nd-bouton mt-6 bg-[var(--creme)] text-[var(--encre)] hover:bg-[var(--creme-2)]"
              >
                Voir le coffret — <span className="nd-prix">{formatDA(prixDepart(coffret))}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Commander, simplement ── */}
        <section className="pb-10 sm:ps-[110px]">
          <h2 className="text-[36px] sm:text-[46px]">
            Commander, <span className="nd-italique">simplement</span>
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-5">
            {[
              ['Choisissez votre parfum', 'Sur sa page : la contenance, la quantité, votre wilaya. Le total s’affiche, livraison comprise.'],
              ['On vous appelle', 'Pour confirmer la commande et l’adresse avant l’envoi. Rien ne part sans votre accord.'],
              ['Vous payez au livreur', 'En espèces, à la livraison. Vous pouvez ouvrir le colis devant lui.'],
            ].map(([titre, texte], i) => (
              <li key={titre} className="rounded-2xl bg-[var(--creme-2)] p-5">
                <span className="nd-serif block text-[42px] font-semibold leading-none text-[var(--ambre-texte)]">
                  {i + 1}
                </span>
                <h3 className="mt-2 font-[inherit] text-[16px] font-bold" style={{ fontFamily: 'var(--font-manrope)' }}>
                  {titre}
                </h3>
                <p className="mt-1 text-[14.5px] text-[var(--gris-texte)]">{texte}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Cadre>
  );
}
