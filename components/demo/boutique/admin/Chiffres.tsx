'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useRegistre } from '@/components/demo/boutique/admin/registre';
import type { Commande } from '@/components/demo/boutique/commandes';
import { TARIFS, zoneDe } from '@/content/demos/boutique-livraison';
import { formatDA } from '@/content/demos/boutique';

/**
 * Les chiffres du marchand, calculés à chaque affichage à partir des
 * commandes stockées dans ce navigateur. Aucun nombre n'est écrit en dur :
 * passer une commande sur la boutique, ou en confirmer une, les fait bouger.
 * Chaque chiffre dit comment il est calculé.
 */

type Periode = '7' | '30' | 'tout';
const PERIODES: { v: Periode; label: string }[] = [
  { v: '7', label: '7 jours' },
  { v: '30', label: '30 jours' },
  { v: 'tout', label: 'Tout' },
];

const ENVOYEE = ['expediee', 'livree', 'retournee'];
const DECIDEE = ['confirmee', 'expediee', 'livree', 'retournee', 'annulee'];

function pourcent(n: number, sur: number): string {
  return sur ? `${Math.round((n / sur) * 100)} %` : '—';
}

/** Frais de transport perdus sur un retour : aller et retour au tarif de la zone. */
function fraisRetour(c: Commande): number {
  return TARIFS[zoneDe(c.livraison.codeWilaya)][c.livraison.mode] * 2;
}

export function Chiffres() {
  const registre = useRegistre();
  const [periode, setPeriode] = useState<Periode>('30');
  if (!registre) return <div className="min-h-[70vh]" aria-busy="true" />;

  const depuis = periode === 'tout' ? 0 : Date.now() - Number(periode) * 24 * 3600e3;
  const cs = registre.commandes.filter((c) => new Date(c.date).getTime() >= depuis);
  const de = (s: string) => cs.filter((c) => c.statut === s);

  const decidees = cs.filter((c) => DECIDEE.includes(c.statut));
  const confirmees = decidees.filter((c) => c.statut !== 'annulee');
  const livrees = de('livree');
  const retournees = de('retournee');
  const enRoute = de('expediee');
  const somme = (l: Commande[]) => l.reduce((s, c) => s + c.total, 0);
  const ventesPerdues = somme(retournees);
  const transportPerdu = retournees.reduce((s, c) => s + fraisRetour(c), 0);
  const appels = confirmees.filter((c) => c.appels?.length);
  const moyenneAppels = appels.length ? appels.reduce((s, c) => s + c.appels!.length, 0) / appels.length : 0;

  // Retours par wilaya : seulement les wilayas où un colis est parti.
  const parWilaya = new Map<string, { envoyees: number; livrees: number; retournees: number; perdu: number }>();
  for (const c of cs.filter((x) => ENVOYEE.includes(x.statut))) {
    const w = parWilaya.get(c.livraison.wilaya) ?? { envoyees: 0, livrees: 0, retournees: 0, perdu: 0 };
    w.envoyees++;
    if (c.statut === 'livree') w.livrees++;
    if (c.statut === 'retournee') {
      w.retournees++;
      w.perdu += c.total + fraisRetour(c);
    }
    parWilaya.set(c.livraison.wilaya, w);
  }
  const wilayas = Array.from(parWilaya.entries()).sort((a, b) => b[1].retournees - a[1].retournees || b[1].envoyees - a[1].envoyees);

  const motifs = new Map<string, number>();
  for (const c of cs.filter((x) => (x.statut === 'annulee' || x.statut === 'retournee') && x.motif)) {
    const k = `${c.statut === 'annulee' ? 'Annulée' : 'Retournée'} — ${c.motif}`;
    motifs.set(k, (motifs.get(k) ?? 0) + 1);
  }

  const tuiles = [
    { titre: 'Commandes reçues', valeur: String(cs.length), detail: `${de('nouvelle').length + de('a-rappeler').length} encore à confirmer` },
    { titre: 'Taux de confirmation', valeur: pourcent(confirmees.length, decidees.length), detail: `${confirmees.length} confirmées sur ${decidees.length} traitées` },
    { titre: 'Taux de livraison', valeur: pourcent(livrees.length, livrees.length + retournees.length), detail: `${livrees.length} livrées, ${retournees.length} retournée${retournees.length > 1 ? 's' : ''}` },
    { titre: 'Encaissé', valeur: formatDA(somme(livrees)), detail: `Commandes livrées et payées ; ${formatDA(somme(enRoute))} chez le livreur` },
  ];

  return (
    <div className="nd-wrap pb-12 pt-7 lg:pt-10">
      <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Registre — les comptes</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[40px] sm:text-[52px]">Chiffres</h1>
        <div role="group" aria-label="Période" className="flex rounded-full border border-[var(--ligne)] bg-[#fffdf9] p-1">
          {PERIODES.map((p) => (
            <button
              key={p.v}
              type="button"
              aria-pressed={periode === p.v}
              onClick={() => setPeriode(p.v)}
              className={`min-h-[40px] rounded-full px-4 text-[14px] font-semibold ${periode === p.v ? 'bg-[var(--encre)] text-[var(--creme)]' : 'text-[var(--gris-texte)]'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {tuiles.map((t) => (
          <li key={t.titre} className="rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9] p-3.5 sm:p-5">
            <p className="text-[12px] font-bold uppercase tracking-[.14em] text-[var(--gris-texte)]">{t.titre}</p>
            <p className="nd-serif mt-1.5 text-[32px] font-semibold leading-none [font-variant-numeric:lining-nums] sm:text-[44px]">{t.valeur}</p>
            <p className="mt-2 text-[12.5px] leading-snug text-[var(--gris-texte)] sm:text-[13.5px]">{t.detail}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_.75fr] lg:gap-8">
        <section aria-labelledby="t-retours" className="rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9] p-4 sm:p-6">
          <h2 id="t-retours" className="text-[28px]">Manque à gagner des retours</h2>
          <p className="mt-1 text-[14px] text-[var(--gris-texte)]">
            Un colis refusé coûte la vente et deux trajets. C’est ce chiffre que la confirmation par téléphone fait baisser.
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-[13px] text-[var(--gris-texte)]">Ventes perdues</dt>
              <dd className="nd-prix mt-0.5 text-[22px]">{formatDA(ventesPerdues)}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-[var(--gris-texte)]">Transport payé pour rien</dt>
              <dd className="nd-prix mt-0.5 text-[22px]">{formatDA(transportPerdu)}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-bold">Total</dt>
              <dd className="nd-prix mt-0.5 text-[22px] text-[var(--erreur)]">{formatDA(ventesPerdues + transportPerdu)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[12.5px] text-[var(--gris-texte)]">
            Transport estimé : aller et retour au tarif de la zone, hypothèse de démonstration — en production, les frais
            réels du transporteur.
          </p>

          <h3 className="nd-sans mt-6 text-[13px] font-bold uppercase tracking-[.16em] text-[var(--gris-texte)]">Retours par wilaya</h3>
          {wilayas.length ? (
            <table className="mt-2 w-full text-[14.5px]">
              <thead>
                <tr className="text-[12px] text-[var(--gris-texte)]">
                  <th scope="col" className="py-1.5 text-start font-semibold">Wilaya</th>
                  <th scope="col" className="py-1.5 text-end font-semibold">Envoyés</th>
                  <th scope="col" className="py-1.5 text-end font-semibold">Retours</th>
                  <th scope="col" className="hidden py-1.5 text-end font-semibold sm:table-cell">Perdu</th>
                </tr>
              </thead>
              <tbody>
                {wilayas.map(([nom, w]) => (
                  <tr key={nom} className="border-t border-[var(--ligne)]">
                    <th scope="row" className="py-2 text-start font-normal">{nom}</th>
                    <td className="py-2 text-end tabular-nums">{w.envoyees}</td>
                    <td className={`py-2 text-end tabular-nums ${w.retournees ? 'font-bold text-[var(--erreur)]' : 'text-[var(--gris-texte)]'}`}>{w.retournees}</td>
                    <td className="hidden py-2 text-end tabular-nums sm:table-cell">{w.perdu ? formatDA(w.perdu) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-2 text-[14px] text-[var(--gris-texte)]">Aucun colis envoyé sur la période.</p>
          )}
          <Link href="/demo/boutique/admin?vue=retournee" className="mt-3 inline-flex min-h-[44px] items-center text-[14px] font-semibold underline underline-offset-4">
            Voir les commandes retournées
          </Link>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="t-appels" className="rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9] p-4 sm:p-6">
            <h2 id="t-appels" className="text-[28px]">Les appels</h2>
            <p className="nd-serif mt-2 text-[40px] font-semibold leading-none [font-variant-numeric:lining-nums]">
              {moyenneAppels ? moyenneAppels.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) : '—'}
            </p>
            <p className="mt-1.5 text-[13.5px] text-[var(--gris-texte)]">
              appel{moyenneAppels >= 2 ? 's' : ''} en moyenne pour confirmer une commande ({appels.length} commande{appels.length > 1 ? 's' : ''} confirmée{appels.length > 1 ? 's' : ''} avec appels notés).
            </p>
            <Link href="/demo/boutique/admin?vue=a-rappeler" className="mt-2 inline-flex min-h-[44px] items-center text-[14px] font-semibold underline underline-offset-4">
              {de('a-rappeler').length} à rappeler
            </Link>
          </section>

          <section aria-labelledby="t-motifs" className="rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9] p-4 sm:p-6">
            <h2 id="t-motifs" className="text-[28px]">Pourquoi ça n’aboutit pas</h2>
            {motifs.size ? (
              <ul className="mt-3 space-y-1.5 text-[14.5px]">
                {Array.from(motifs.entries()).sort((a, b) => b[1] - a[1]).map(([m, n]) => (
                  <li key={m} className="flex justify-between gap-3">
                    <span>{m}</span>
                    <b className="tabular-nums">{n}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[14px] text-[var(--gris-texte)]">Aucune annulation ni aucun retour sur la période.</p>
            )}
          </section>
        </div>
      </div>

      <p className="mt-8 text-[12.5px] text-[var(--gris-texte)]">
        Calculé à l’instant à partir des {registre.commandes.length} commandes de ce navigateur, exemples compris. Une commande
        compte dans la période de sa date de réception.
      </p>
    </div>
  );
}
