'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  LIBELLE_STATUT,
  alertesDe,
  quand,
  reinitialiserDemo,
  telephoneAffiche,
  useRegistre,
  type Alerte,
} from '@/components/demo/boutique/admin/registre';
import type { Commande, Statut } from '@/components/demo/boutique/commandes';
import { de } from '@/content/demos/boutique-livraison';
import { formatDA, produit } from '@/content/demos/boutique';

/**
 * La liste des commandes : le registre du marchand.
 *
 * Vue par défaut « À traiter » : ce qui attend une action aujourd'hui,
 * rangé en trois sections — à confirmer, à rappeler, à expédier — avec les
 * commandes suspectes signalées dans la ligne même. Les autres vues sont
 * dans l'adresse (?vue=…), pour qu'un lien depuis « Chiffres » y mène.
 */

type Vue = 'a-traiter' | 'toutes' | 'alertes' | Statut;

const SECTIONS: { statut: Statut; titre: string; aide: string }[] = [
  { statut: 'nouvelle', titre: 'À confirmer', aide: 'Appeler le client avant d’envoyer quoi que ce soit.' },
  { statut: 'a-rappeler', titre: 'À rappeler', aide: 'Pas joint au premier appel, ou rappel demandé.' },
  { statut: 'confirmee', titre: 'À expédier', aide: 'Confirmées par téléphone, à remettre au livreur.' },
];

const ONGLETS: { vue: Vue; label: string }[] = [
  { vue: 'a-traiter', label: 'À traiter' },
  { vue: 'toutes', label: 'Toutes' },
  { vue: 'expediee', label: 'Expédiées' },
  { vue: 'livree', label: 'Livrées' },
  { vue: 'retournee', label: 'Retournées' },
  { vue: 'annulee', label: 'Annulées' },
];

const VUES: Vue[] = ['a-traiter', 'toutes', 'alertes', 'nouvelle', 'a-rappeler', 'confirmee', 'expediee', 'livree', 'retournee', 'annulee'];

export function ListeCommandes() {
  const registre = useRegistre();
  const params = useSearchParams();
  const router = useRouter();
  const chemin = usePathname();
  const [recherche, setRecherche] = useState('');
  const [confirmerRaz, setConfirmerRaz] = useState(false);

  const brute = params.get('vue') as Vue | null;
  const vue: Vue = brute && VUES.includes(brute) ? brute : 'a-traiter';
  const choisir = (v: Vue) => router.replace(v === 'a-traiter' ? chemin : `${chemin}?vue=${v}`, { scroll: false });

  const donnees = useMemo(() => {
    if (!registre) return null;
    const { commandes, listeNoire } = registre;
    const triees = [...commandes].sort((a, b) => b.date.localeCompare(a.date));
    const alertes = new Map(triees.map((c) => [c.id, alertesDe(c, commandes, listeNoire)]));
    const compte = (s: Statut) => triees.filter((c) => c.statut === s).length;
    return {
      triees,
      alertes,
      compte,
      suspectes: triees.filter((c) => alertes.get(c.id)!.length > 0).length,
    };
  }, [registre]);

  if (!donnees) return <div className="min-h-[70vh]" aria-busy="true" />;

  const { triees, alertes, compte, suspectes } = donnees;
  const q = recherche.trim().toLowerCase();
  const qChiffres = q.replace(/\D/g, '');
  const trouve = (c: Commande) =>
    !q ||
    c.id.toLowerCase().includes(q) ||
    c.client.nom.toLowerCase().includes(q) ||
    c.livraison.commune.toLowerCase().includes(q) ||
    c.livraison.wilaya.toLowerCase().includes(q) ||
    (qChiffres.length >= 2 && c.client.telephone.replace(/\D/g, '').includes(qChiffres));

  const filtre = (c: Commande) => {
    if (!trouve(c)) return false;
    if (vue === 'toutes') return true;
    if (vue === 'alertes') return alertes.get(c.id)!.length > 0;
    if (vue === 'a-traiter') return ['nouvelle', 'a-rappeler', 'confirmee'].includes(c.statut);
    return c.statut === vue;
  };
  const visibles = triees.filter(filtre);
  const aTraiter = compte('nouvelle') + compte('a-rappeler') + compte('confirmee');
  const jour = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const tuiles: { vue: Vue; n: number; label: string; alerte?: boolean }[] = [
    { vue: 'nouvelle', n: compte('nouvelle'), label: 'à confirmer' },
    { vue: 'a-rappeler', n: compte('a-rappeler'), label: 'à rappeler' },
    { vue: 'confirmee', n: compte('confirmee'), label: 'à expédier' },
    { vue: 'alertes', n: suspectes, label: suspectes > 1 ? 'suspectes' : 'suspecte', alerte: true },
  ];

  return (
    <div className="nd-wrap pb-12 pt-7 lg:pt-10">
      <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Registre des commandes — {jour}</p>
      <h1 className="mt-1 text-[40px] sm:text-[52px]">Commandes</h1>

      {/* Ce qui attend aujourd'hui : quatre chiffres, chacun ouvre sa liste. */}
      <ul className="mt-5 grid grid-cols-4 gap-2 sm:gap-3" aria-label="À traiter aujourd’hui">
        {tuiles.map((t) => (
          <li key={t.vue}>
            <button
              type="button"
              onClick={() => choisir(vue === t.vue ? 'a-traiter' : t.vue)}
              aria-pressed={vue === t.vue}
              className={`flex h-full w-full flex-col items-start rounded-[14px] border px-3 py-2.5 text-start sm:px-4 sm:py-3.5 ${
                vue === t.vue ? 'border-[var(--encre)] bg-[#fffdf9]' : 'border-[var(--ligne)] bg-[#fffdf9] hover:border-[var(--gris)]'
              }`}
            >
              <span className={`nd-serif text-[30px] font-semibold leading-none sm:text-[40px] ${t.alerte && t.n ? 'text-[var(--erreur)]' : ''}`}>
                {t.n}
              </span>
              <span className="mt-1 text-[12px] font-semibold leading-tight text-[var(--gris-texte)] sm:text-[13.5px]">{t.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-col gap-3 border-b border-[var(--ligne)] lg:flex-row lg:items-end lg:justify-between">
        <div className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0" role="tablist" aria-label="Vues">
          <div className="flex gap-1">
            {ONGLETS.map((o) => {
              const n = o.vue === 'a-traiter' ? aTraiter : o.vue === 'toutes' ? triees.length : compte(o.vue as Statut);
              const sel = vue === o.vue;
              return (
                <button
                  key={o.vue}
                  type="button"
                  role="tab"
                  aria-selected={sel}
                  onClick={() => choisir(o.vue)}
                  className={`min-h-[44px] whitespace-nowrap border-b-2 px-3 text-[14px] font-semibold ${
                    sel ? 'border-[var(--encre)]' : 'border-transparent text-[var(--gris-texte)] hover:text-[var(--encre)]'
                  }`}
                >
                  {o.label} <span className="font-normal text-[var(--gris-texte)]">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
        <label className="relative mb-3 block lg:w-[300px]">
          <span className="sr-only">Chercher une commande</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gris-texte)]" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4 4" />
          </svg>
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Nom, numéro, commune…"
            className="h-[44px] w-full rounded-full border border-[var(--ligne)] bg-[#fffdf9] pe-4 ps-10 text-[15px] placeholder:text-[var(--gris-texte)] focus:border-[var(--encre)] focus:outline-none"
          />
        </label>
      </div>

      {vue !== 'a-traiter' && !['toutes', 'expediee', 'livree', 'retournee', 'annulee'].includes(vue) ? (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
          Filtre : <b>{vue === 'alertes' ? 'commandes suspectes' : LIBELLE_STATUT[vue as Statut].toLowerCase()}</b>
          <button type="button" onClick={() => choisir('a-traiter')} className="min-h-[44px] px-1 font-semibold underline underline-offset-4">
            Retirer
          </button>
        </p>
      ) : null}

      {visibles.length === 0 ? (
        <p className="py-16 text-center text-[var(--gris-texte)]">
          {q ? <>Aucune commande ne correspond à « {recherche} ».</> : 'Rien ici pour l’instant.'}
        </p>
      ) : vue === 'a-traiter' ? (
        SECTIONS.map((s) => {
          const liste = visibles.filter((c) => c.statut === s.statut);
          if (!liste.length) return null;
          return (
            <section key={s.statut} className="mt-8" aria-labelledby={`s-${s.statut}`}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 id={`s-${s.statut}`} className="text-[28px]">
                  {s.titre} <span className="nd-italique text-[var(--gris-texte)]">{liste.length}</span>
                </h2>
                <p className="text-[13.5px] text-[var(--gris-texte)]">{s.aide}</p>
              </div>
              <Lignes commandes={liste} alertes={alertes} />
            </section>
          );
        })
      ) : (
        <div className="mt-4">
          <Lignes commandes={visibles} alertes={alertes} />
        </div>
      )}

      <div className="mt-12 flex flex-col gap-3 border-t border-[var(--ligne)] pt-5 text-[13.5px] text-[var(--gris-texte)] sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[46em]">
          Les commandes marquées <Exemple /> sont fictives, numéros masqués. Celles que vous passez sur la boutique, dans ce
          navigateur, arrivent ici en tête de liste.
        </p>
        {confirmerRaz ? (
          <span className="flex flex-wrap items-center gap-2">
            Tout effacer et remettre les exemples ?
            <button
              type="button"
              onClick={() => {
                reinitialiserDemo();
                setConfirmerRaz(false);
                choisir('a-traiter');
              }}
              className="min-h-[44px] rounded-full bg-[var(--encre)] px-4 font-semibold text-[var(--creme)]"
            >
              Réinitialiser
            </button>
            <button type="button" onClick={() => setConfirmerRaz(false)} className="min-h-[44px] px-2 font-semibold underline underline-offset-4">
              Annuler
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmerRaz(true)}
            className="min-h-[44px] self-start whitespace-nowrap rounded-full border border-[var(--ligne)] px-4 font-semibold text-[var(--encre)] sm:self-auto"
          >
            Réinitialiser la démo
          </button>
        )}
      </div>
    </div>
  );
}

function Exemple() {
  return (
    <span className="rounded-[5px] border border-[var(--ligne)] px-1.5 py-px text-[10.5px] font-bold uppercase tracking-[.12em] text-[var(--gris-texte)]">
      exemple
    </span>
  );
}

const TON_STATUT: Record<Statut, string> = {
  nouvelle: 'bg-[#f3e3cf] text-[#6e4317]',
  'a-rappeler': 'bg-[#f6dccb] text-[#7a3a14]',
  confirmee: 'bg-[#dbe6dd] text-[#22352c]',
  expediee: 'bg-[#22352c] text-[#f7f2ea]',
  livree: 'bg-transparent text-[#22352c] ring-1 ring-inset ring-[#22352c]',
  retournee: 'bg-[#f1d9d4] text-[#7f2418]',
  annulee: 'bg-transparent text-[var(--gris-texte)] ring-1 ring-inset ring-[var(--ligne)]',
};

function PastilleStatut({ statut }: { statut: Statut }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold ${TON_STATUT[statut]}`}>
      {statut === 'livree' ? '✓ ' : ''}
      {LIBELLE_STATUT[statut]}
    </span>
  );
}

function Alertes({ liste }: { liste: Alerte[] }) {
  if (!liste.length) return null;
  return (
    <ul className="mt-1.5 flex flex-wrap gap-1.5">
      {liste.map((a) => (
        <li key={a.type} className="inline-flex items-center gap-1 rounded-[6px] bg-[#f6e3df] px-2 py-0.5 text-[12px] font-bold text-[var(--erreur)]">
          <span aria-hidden="true">!</span> {a.texte}
        </li>
      ))}
    </ul>
  );
}

function resumeArticles(c: Commande): string {
  const n = c.lignes.reduce((s, l) => s + l.quantite, 0);
  const premier = `${c.lignes[0].nom} ${c.lignes[0].contenance}`;
  return c.lignes.length > 1 ? `${premier} + ${n - c.lignes[0].quantite}` : c.lignes[0].quantite > 1 ? `${premier} × ${c.lignes[0].quantite}` : premier;
}

function suivi(c: Commande): string | null {
  if (c.statut === 'a-rappeler') {
    const n = c.appels?.length ?? 0;
    const note = c.historique[c.historique.length - 1].note;
    return `${n} appel${n > 1 ? 's' : ''}${note ? ` · ${note.charAt(0).toLowerCase()}${note.slice(1)}` : ''}`;
  }
  if ((c.statut === 'annulee' || c.statut === 'retournee') && c.motif) return c.motif;
  return null;
}

function lieu(c: Commande): string {
  const l = c.livraison;
  return l.mode === 'domicile' ? `${l.commune}, ${l.wilaya}` : `Bureau ${de(l.lieuBureau ?? l.commune)}, ${l.wilaya}`;
}

function Lignes({ commandes, alertes }: { commandes: Commande[]; alertes: Map<string, Alerte[]> }) {
  const maintenant = Date.now();
  return (
    <>
      {/* Grand écran : un tableau, une commande par ligne. */}
      {/* Largeurs fixes : les trois sections de « À traiter » s'alignent colonne sur colonne. */}
      <table className="mt-3 hidden w-full table-fixed border-separate border-spacing-0 text-[14.5px] lg:table">
        <colgroup>
          <col className="w-[150px]" />
          <col className="w-[24%]" />
          <col className="w-[23%]" />
          <col />
          <col className="w-[110px]" />
          <col className="w-[180px]" />
        </colgroup>
        <thead>
          <tr className="text-[11.5px] uppercase tracking-[.14em] text-[var(--gris-texte)]">
            <th scope="col" className="border-b border-[var(--ligne)] pb-2 ps-2 text-start font-bold">Commande</th>
            <th scope="col" className="border-b border-[var(--ligne)] pb-2 text-start font-bold">Client</th>
            <th scope="col" className="border-b border-[var(--ligne)] pb-2 text-start font-bold">Livraison</th>
            <th scope="col" className="border-b border-[var(--ligne)] pb-2 text-start font-bold">Articles</th>
            <th scope="col" className="border-b border-[var(--ligne)] pb-2 text-end font-bold">Total</th>
            <th scope="col" className="border-b border-[var(--ligne)] pb-2 ps-6 text-start font-bold">Statut</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((c) => {
            const al = alertes.get(c.id) ?? [];
            const s = suivi(c);
            return (
              <tr key={c.id} className={`group align-top ${al.length ? 'bg-[#fbf1ee]' : 'hover:bg-[#fffdf9]'}`}>
                <td className="border-b border-[var(--ligne)] py-3.5 ps-2">
                  <Link
                    href={`/demo/boutique/admin/commande/${c.id}`}
                    className="font-bold tracking-[.02em] underline decoration-transparent underline-offset-4 group-hover:decoration-[var(--encre)]"
                  >
                    {c.id}
                  </Link>
                  <span className="mt-0.5 block text-[13px] text-[var(--gris-texte)]">{quand(c.date, maintenant)}</span>
                  {c.exemple ? <span className="mt-1 block"><Exemple /></span> : null}
                </td>
                <td className="border-b border-[var(--ligne)] py-3.5 pe-4">
                  <span className="block font-semibold">{c.client.nom}</span>
                  <span className="block text-[13.5px] tabular-nums text-[var(--gris-texte)]">{telephoneAffiche(c)}</span>
                  <Alertes liste={al} />
                </td>
                <td className="border-b border-[var(--ligne)] py-3.5 pe-4">
                  <span className="block">{lieu(c)}</span>
                  <span className="block text-[13px] text-[var(--gris-texte)]">{c.livraison.mode === 'domicile' ? 'À domicile' : 'Au bureau du livreur'}</span>
                </td>
                <td className="border-b border-[var(--ligne)] py-3.5 pe-4">
                  <span className="flex items-start gap-2">
                    <span className="nd-pastille mt-[6px]" style={{ ['--accent' as string]: produit(c.lignes[0].slug)?.accent }} />
                    {resumeArticles(c)}
                  </span>
                  {c.codePromo ? <span className="mt-0.5 block text-[13px] text-[var(--gris-texte)]">Code {c.codePromo}</span> : null}
                </td>
                <td className="nd-prix border-b border-[var(--ligne)] py-3.5 text-end">{formatDA(c.total)}</td>
                <td className="border-b border-[var(--ligne)] py-3.5 pe-2 ps-6">
                  <PastilleStatut statut={c.statut} />
                  {s ? <span className="mt-1.5 block text-[12.5px] leading-snug text-[var(--gris-texte)]">{s}</span> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Téléphone : une fiche par commande, toute la fiche est le lien. */}
      <ul className="mt-3 space-y-2.5 lg:hidden">
        {commandes.map((c) => {
          const al = alertes.get(c.id) ?? [];
          const s = suivi(c);
          return (
            <li key={c.id}>
              <Link
                href={`/demo/boutique/admin/commande/${c.id}`}
                className={`block rounded-[14px] border p-3.5 ${al.length ? 'border-[#e6c3bb] bg-[#fbf1ee]' : 'border-[var(--ligne)] bg-[#fffdf9]'}`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                    <b className="text-[14px] tracking-[.02em]">{c.id}</b>
                    <span className="text-[var(--gris-texte)]">{quand(c.date, maintenant)}</span>
                    {c.exemple ? <Exemple /> : null}
                  </span>
                  <PastilleStatut statut={c.statut} />
                </span>
                <span className="mt-2 flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-[16px] font-semibold">{c.client.nom}</span>
                  <span className="nd-prix text-[15px]">{formatDA(c.total)}</span>
                </span>
                <span className="mt-0.5 block text-[13.5px] text-[var(--gris-texte)]">
                  <span className="tabular-nums">{telephoneAffiche(c)}</span> · {lieu(c)}
                </span>
                <span className="mt-1.5 flex items-center gap-2 text-[13.5px]">
                  <span className="nd-pastille" style={{ ['--accent' as string]: produit(c.lignes[0].slug)?.accent }} />
                  <span className="min-w-0 truncate">{resumeArticles(c)}</span>
                </span>
                {s ? <span className="mt-1 block text-[12.5px] text-[var(--gris-texte)]">{s}</span> : null}
                <Alertes liste={al} />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
