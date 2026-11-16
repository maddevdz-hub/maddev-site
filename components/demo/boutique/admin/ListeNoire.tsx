'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { ajouterListeNoire, retirerListeNoire } from '@/components/demo/boutique/admin/actions';
import { quand, useRegistre } from '@/components/demo/boutique/admin/registre';
import { analyserTelephone, formaterTelephone } from '@/components/demo/boutique/telephone';

const MOTIFS = ['Colis refusé sans raison', 'Commandes fantaisistes répétées', 'Propos insultants', 'Autre'];

/**
 * La liste noire : les numéros dont les commandes sont signalées dès leur
 * arrivée. Rien n'est bloqué automatiquement — le marchand décide, la liste
 * l'avertit. Un numéro s'y ajoute d'ici ou depuis la fiche d'une commande.
 */
export function ListeNoire() {
  const registre = useRegistre();
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [motif, setMotif] = useState(MOTIFS[0]);
  const [erreur, setErreur] = useState<string | null>(null);
  if (!registre) return <div className="min-h-[70vh]" aria-busy="true" />;

  const affiche = (t: string) => (/^\d{10}$/.test(t) ? formaterTelephone(t) : t);
  const commandesDe = (t: string) => {
    const k = t.replace(/[^\d•]/g, '');
    return registre.commandes.filter((c) => c.client.telephone.replace(/[^\d•]/g, '') === k);
  };

  function envoyer(e: FormEvent) {
    e.preventDefault();
    const t = analyserTelephone(tel);
    if (!t.ok) {
      setErreur(t.erreur);
      return;
    }
    if (registre!.listeNoire.some((x) => x.telephone === t.normalise)) {
      setErreur('Ce numéro est déjà sur la liste.');
      return;
    }
    ajouterListeNoire(t.normalise, nom.trim() || 'Sans nom', motif);
    setNom('');
    setTel('');
    setErreur(null);
  }

  const champ = 'h-[48px] w-full rounded-[12px] border-[1.5px] border-[var(--ligne)] bg-[var(--creme)] px-3.5 text-[16px] focus:border-[var(--encre)] focus:outline-none';

  return (
    <div className="nd-wrap pb-12 pt-7 lg:pt-10">
      <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Registre — à surveiller</p>
      <h1 className="mt-1 text-[40px] sm:text-[52px]">Liste noire</h1>
      <p className="mt-2 max-w-[44em] text-[15px] text-[var(--gris-texte)]">
        Une commande passée avec un de ces numéros arrive signalée dans le registre. Rien n’est bloqué automatiquement :
        c’est vous qui décidez de l’appeler ou de l’annuler.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_.7fr] lg:gap-8">
        <section aria-labelledby="t-liste" className="rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9] p-4 sm:p-6">
          <h2 id="t-liste" className="text-[28px]">
            Numéros <span className="nd-italique text-[var(--gris-texte)]">{registre.listeNoire.length}</span>
          </h2>
          {registre.listeNoire.length ? (
            <ul className="mt-3 divide-y divide-[var(--ligne)]">
              {registre.listeNoire.map((e) => {
                const cs = commandesDe(e.telephone);
                return (
                  <li key={e.telephone} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{e.nom}</p>
                      <p className="text-[14px] tabular-nums text-[var(--gris-texte)]">{affiche(e.telephone)}</p>
                      <p className="mt-0.5 text-[13.5px]">
                        {e.motif} · <span className="text-[var(--gris-texte)]">ajouté {quand(e.date)}</span>
                      </p>
                      {cs.length ? (
                        <p className="mt-0.5 text-[13px] text-[var(--gris-texte)]">
                          Commandes :{' '}
                          {cs.map((c, i) => (
                            <span key={c.id}>
                              {i ? ', ' : ''}
                              <Link href={`/demo/boutique/admin/commande/${c.id}`} className="font-semibold text-[var(--encre)] underline underline-offset-4">{c.id}</Link>
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                    <button type="button" onClick={() => retirerListeNoire(e.telephone)} className="min-h-[44px] px-1 text-[14px] font-semibold underline decoration-[var(--ligne)] underline-offset-4 hover:decoration-[var(--encre)]">
                      Retirer
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-[15px] text-[var(--gris-texte)]">
              La liste est vide. Ajoutez un numéro ici, ou depuis la fiche d’une commande (« Ajouter à la liste noire »).
            </p>
          )}
        </section>

        <section aria-labelledby="t-ajout" className="rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9] p-4 sm:p-6">
          <h2 id="t-ajout" className="text-[28px]">Ajouter un numéro</h2>
          <form onSubmit={envoyer} noValidate className="mt-3 space-y-3">
            <label className="block">
              <span className="text-[14px] font-semibold">Mobile</span>
              <input
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                inputMode="tel"
                autoComplete="off"
                placeholder="0555 12 34 56"
                aria-invalid={!!erreur}
                aria-describedby={erreur ? 'e-tel' : undefined}
                className={`${champ} mt-1 ${erreur ? 'border-[var(--erreur)]' : ''}`}
              />
              {erreur ? <span id="e-tel" className="mt-1 block text-[13.5px] font-semibold text-[var(--erreur)]">{erreur}</span> : null}
            </label>
            <label className="block">
              <span className="text-[14px] font-semibold">Nom <span className="font-normal text-[var(--gris-texte)]">(facultatif)</span></span>
              <input value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="off" className={`${champ} mt-1`} />
            </label>
            <label className="block">
              <span className="text-[14px] font-semibold">Motif</span>
              <select value={motif} onChange={(e) => setMotif(e.target.value)} className={`${champ} mt-1`}>
                {MOTIFS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--vert)] px-5 text-[15px] font-bold text-[var(--creme)] hover:bg-[var(--vert-2)]">
              Ajouter à la liste noire
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
