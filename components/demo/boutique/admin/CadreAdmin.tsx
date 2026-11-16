'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { DemoBanner } from '@/components/demo/DemoBanner';

/**
 * Le cadre du registre du marchand.
 *
 * Même identité que la vitrine (crème, encre, Cormorant pour les titres),
 * mais sans le papier ligné ni les effets : c'est un outil de travail, on
 * l'ouvre dix fois par jour. Sur téléphone, la navigation est en bas de
 * l'écran, à portée du pouce, comme dans une application installée.
 */
const ONGLETS = [
  { href: '/demo/boutique/admin', label: 'Commandes', icone: 'M5 5h14M5 12h14M5 19h9' },
  { href: '/demo/boutique/admin/chiffres', label: 'Chiffres', icone: 'M5 19V11M12 19V5M19 19v-6' },
  { href: '/demo/boutique/admin/produits', label: 'Produits', icone: 'M9 4h6v3l2 2v11H7V9l2-2z' },
  { href: '/demo/boutique/admin/liste-noire', label: 'Liste noire', icone: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM6.5 6.5l11 11' },
];

export function CadreAdmin({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  const actif = (href: string) =>
    href === '/demo/boutique/admin' ? chemin === href || chemin.startsWith('/demo/boutique/admin/commande') : chemin.startsWith(href);

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--creme)] pb-[calc(var(--barre-onglets)+1px+env(safe-area-inset-bottom))] [--barre-onglets:60px] lg:pb-0">
      <DemoBanner />
      <p className="border-b border-[var(--ligne)] bg-[var(--creme-2)] px-4 py-2 text-center text-[12.5px] text-[var(--gris-texte)]">
        Accès libre pour la démonstration — en production : comptes et droits par membre de l’équipe.
      </p>

      <header className="border-b border-[var(--ligne)]">
        <div className="nd-wrap flex h-16 items-center justify-between gap-6">
          <Link href="/demo/boutique/admin" className="flex items-baseline gap-2.5 leading-none">
            <span className="nd-serif text-[28px] font-semibold">Nadâ</span>
            <span className="nd-italique text-[19px] text-[var(--ambre-texte)]">registre</span>
          </Link>

          <nav aria-label="Registre" className="hidden h-full items-stretch gap-1 lg:flex">
            {ONGLETS.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                aria-current={actif(o.href) ? 'page' : undefined}
                className={`flex items-center border-b-2 px-3.5 text-[14px] font-semibold ${
                  actif(o.href) ? 'border-[var(--encre)]' : 'border-transparent text-[var(--gris-texte)] hover:text-[var(--encre)]'
                }`}
              >
                {o.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/demo/boutique"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[13.5px] font-semibold underline decoration-[var(--ligne)] underline-offset-4 hover:decoration-[var(--encre)]"
          >
            Voir la boutique
          </Link>
        </div>
      </header>

      <main id="contenu" className="flex-1">
        {children}
      </main>

      {/* Téléphone : les onglets en bas, à portée du pouce. */}
      <nav
        aria-label="Registre"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[var(--ligne)] bg-[var(--creme)] pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {ONGLETS.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            aria-current={actif(o.href) ? 'page' : undefined}
            className={`flex h-[var(--barre-onglets)] flex-col items-center justify-center gap-1 text-[11.5px] font-semibold ${
              actif(o.href) ? 'text-[var(--encre)]' : 'text-[var(--gris-texte)]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={actif(o.href) ? 2 : 1.6} strokeLinecap="round" className="h-[21px] w-[21px]" aria-hidden="true">
              <path d={o.icone} />
            </svg>
            {o.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
