import { LIBELLE_STATUT, type Alerte } from '@/components/demo/boutique/admin/registre';
import type { Statut } from '@/components/demo/boutique/commandes';

/** Petits éléments communs aux écrans du registre. */

export function Exemple() {
  return (
    <span className="rounded-[5px] border border-[var(--ligne)] px-1.5 py-px text-[10.5px] font-bold uppercase tracking-[.12em] text-[var(--gris-texte)]">
      exemple
    </span>
  );
}

export const TON_STATUT: Record<Statut, string> = {
  nouvelle: 'bg-[#f3e3cf] text-[#6e4317]',
  'a-rappeler': 'bg-[#f6dccb] text-[#7a3a14]',
  confirmee: 'bg-[#dbe6dd] text-[#22352c]',
  expediee: 'bg-[#22352c] text-[#f7f2ea]',
  livree: 'bg-transparent text-[#22352c] ring-1 ring-inset ring-[#22352c]',
  retournee: 'bg-[#f1d9d4] text-[#7f2418]',
  annulee: 'bg-transparent text-[var(--gris-texte)] ring-1 ring-inset ring-[var(--ligne)]',
};

export function PastilleStatut({ statut }: { statut: Statut }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold ${TON_STATUT[statut]}`}>
      {statut === 'livree' ? '✓ ' : ''}
      {LIBELLE_STATUT[statut]}
    </span>
  );
}

export function Alertes({ liste, grand }: { liste: Alerte[]; grand?: boolean }) {
  if (!liste.length) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${grand ? 'mt-3' : 'mt-1.5'}`}>
      {liste.map((a) => (
        <li key={a.type} className={`inline-flex items-center gap-1 rounded-[6px] bg-[#f6e3df] font-bold text-[var(--erreur)] ${grand ? 'px-2.5 py-1 text-[14px]' : 'px-2 py-0.5 text-[12px]'}`}>
          <span aria-hidden="true">!</span> {a.texte}
        </li>
      ))}
    </ul>
  );
}
