import Link from 'next/link';
import type { ReactNode } from 'react';

import { DemoBanner } from '@/components/demo/DemoBanner';
import { CompteurPanier } from '@/components/demo/boutique/Compteurs';
import { lienWhatsApp, marque } from '@/content/demos/boutique';

/**
 * Le cadre commun des pages Nadâ : bande de démonstration, en-tête, pied.
 *
 * L'en-tête ne colle pas en haut de l'écran : sur téléphone, une barre
 * collante mangeait la hauteur dont la fiche produit a besoin, et le
 * seul élément collant de la démo est le bouton « Commander » de la fiche.
 */
export function Cadre({ children }: { children: ReactNode }) {
  return (
    <div className="nd-papier flex min-h-dvh flex-col">
      <DemoBanner />
      <Entete />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Pied />
    </div>
  );
}

const MENU = [
  { href: '/demo/boutique', label: 'Le carnet' },
  { href: '/demo/boutique/parfums', label: 'Tous les parfums' },
  { href: '/demo/boutique/p/coffret-decouverte', label: 'Coffret' },
  { href: '/demo/boutique/livraison', label: 'Livraison & échanges' },
];

function Entete() {
  return (
    <header className="border-b border-[var(--ligne)]">
      <div className="nd-wrap flex h-16 items-center justify-between gap-4">
        <Link href="/demo/boutique" className="leading-none" aria-label="Nadâ, retour au carnet">
          <span className="nd-serif block text-[30px] font-semibold">{marque.nom}</span>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.3em] text-[var(--gris-texte)]">
            {marque.signature}
          </span>
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {MENU.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 hover:underline hover:underline-offset-4">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-1.5">
          <a
            href={lienWhatsApp('Bonjour Nadâ, j’ai une question sur un parfum.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Poser une question sur WhatsApp"
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ligne)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[19px] w-[19px]" aria-hidden="true">
              <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" />
            </svg>
          </a>
          <Link
            href="/demo/boutique/panier"
            aria-label="Panier"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-[var(--ligne)]"
          >
            <CompteurPanier />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[19px] w-[19px]" aria-hidden="true">
              <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Les trois promesses de la marque, sur une ligne. Conditions fictives. */
export function Reassurance() {
  return (
    <ul className="grid grid-cols-3 border-y border-[var(--ligne)] bg-[var(--creme)] text-center text-[12px] font-semibold sm:text-[13.5px]">
      {marque.reassurance.map((r, i) => (
        <li key={r} className={`px-2 py-3 ${i > 0 ? 'border-s border-[var(--ligne)]' : ''}`}>
          {r}
        </li>
      ))}
    </ul>
  );
}

function Pied() {
  return (
    <footer className="mt-16 bg-[var(--encre)] py-11 text-[var(--creme)]">
      <div className="nd-wrap grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="nd-serif text-[30px] font-semibold leading-none">{marque.nom}</p>
          <p className="mt-3 max-w-xs text-sm text-[#d9cfc1]">
            Parfumerie en ligne. Livraison dans toutes les wilayas, paiement à la livraison.
          </p>
        </div>
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[.2em] text-[#d6a56c]">Le carnet</p>
          <ul className="space-y-1.5 text-sm text-[#d9cfc1]">
            <li><Link href="/demo/boutique/parfums" className="hover:underline">Tous les parfums</Link></li>
            <li><Link href="/demo/boutique/p/coffret-decouverte" className="hover:underline">Le coffret</Link></li>
            <li><Link href="/demo/boutique/livraison" className="hover:underline">Livraison &amp; échanges</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[.2em] text-[#d6a56c]">Service client</p>
          <p className="text-sm text-[#d9cfc1]">
            Sur WhatsApp, {marque.horaires}.
          </p>
        </div>
      </div>
      <p className="nd-wrap mt-8 border-t border-[rgba(247,242,234,.14)] pt-5 text-[12.5px] text-[#b8ad9f]">
        Nadâ est une marque fictive : produits, tarifs et conditions de démonstration. Boutique conçue par MADDEV.
      </p>
    </footer>
  );
}
