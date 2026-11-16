'use client';

import { useEffect, useRef, useState } from 'react';

import { CLE_FORMULAIRE, type Commande } from '@/components/demo/boutique/commandes';
import { analyserTelephone } from '@/components/demo/boutique/telephone';
import {
  de,
  delaiEstime,
  domicileDisponible,
  fraisLivraison,
  type Commune,
  type Mode,
} from '@/content/demos/boutique-livraison';
import { formatDA } from '@/content/demos/boutique';
import { wilayas } from '@/content/demos/wilayas';

/**
 * Les coordonnées et la livraison d'une commande, partagées par la fiche
 * produit et le panier : un seul formulaire, une seule validation, un seul
 * endroit où corriger.
 *
 * Tout ce que le visiteur tape est gardé dans le navigateur (clé
 * nada-demo-formulaire) : s'il quitte la page pour répondre à un message, ou
 * passe de la fiche au panier, il retrouve son formulaire rempli.
 */

export type Champ = 'nom' | 'telephone' | 'wilaya' | 'commune' | 'adresse';

type Sauvegarde = {
  nom?: string;
  telephone?: string;
  wilaya?: number;
  commune?: string;
  mode?: Mode;
  adresse?: string;
};

function lireSauvegarde(): Sauvegarde {
  try {
    return JSON.parse(window.localStorage.getItem(CLE_FORMULAIRE) ?? '{}') as Sauvegarde;
  } catch {
    return {};
  }
}

export function useCoordonnees() {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [codeWilaya, setCodeWilaya] = useState<number | null>(null);
  const [communes, setCommunes] = useState<Commune[] | null>(null);
  const [chargement, setChargement] = useState(false);
  const [communeNom, setCommuneNom] = useState('');
  const [mode, setMode] = useState<Mode>('domicile');
  const [adresse, setAdresse] = useState('');
  const [erreurs, setErreurs] = useState<Partial<Record<Champ, string>>>({});
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const restaure = useRef(false);
  const bureauImpose = useRef(false);

  const commune = communes?.find((x) => x.nom === communeNom) ?? null;
  const domicileOk = codeWilaya && commune ? domicileDisponible(codeWilaya, commune) : true;
  const nomWilaya = wilayas.find((w) => w.code === codeWilaya)?.nom ?? '';
  const delai = codeWilaya ? delaiEstime(codeWilaya) : null;

  // Restauration, puis sauvegarde à chaque frappe.
  useEffect(() => {
    const s = lireSauvegarde();
    if (s.nom) setNom(s.nom);
    if (s.telephone) setTelephone(s.telephone);
    if (s.mode) setMode(s.mode);
    if (s.adresse) setAdresse(s.adresse);
    if (s.wilaya) {
      setCodeWilaya(s.wilaya);
      if (s.commune) setCommuneNom(s.commune);
    }
    restaure.current = true;
  }, []);

  useEffect(() => {
    if (!restaure.current) return;
    const s: Sauvegarde = { nom, telephone, wilaya: codeWilaya ?? undefined, commune: communeNom, mode, adresse };
    try {
      window.localStorage.setItem(CLE_FORMULAIRE, JSON.stringify(s));
    } catch {
      /* stockage indisponible : pas de sauvegarde, rien d'autre ne change */
    }
  }, [nom, telephone, codeWilaya, communeNom, mode, adresse]);

  // Les communes de la wilaya, chargées à la demande.
  useEffect(() => {
    if (!codeWilaya) {
      setCommunes(null);
      return;
    }
    let annule = false;
    setChargement(true);
    fetch(`/demo/boutique-communes/${String(codeWilaya).padStart(2, '0')}.json`)
      .then((r) => r.json() as Promise<Commune[]>)
      .then((liste) => {
        if (annule) return;
        setCommunes(liste);
        setCommuneNom((actuelle) => (liste.some((x) => x.nom === actuelle) ? actuelle : ''));
      })
      .catch(() => !annule && setCommunes([]))
      .finally(() => !annule && setChargement(false));
    return () => {
      annule = true;
    };
  }, [codeWilaya]);

  // Commune sans livraison à domicile : on bascule vers le bureau, et on le
  // dit. Si le visiteur change ensuite pour une commune desservie, on rend le
  // domicile — c'est nous qui l'avions retiré, pas lui.
  useEffect(() => {
    if (!domicileOk && mode === 'domicile') {
      bureauImpose.current = true;
      setMode('bureau');
    } else if (domicileOk && bureauImpose.current && mode === 'bureau') {
      bureauImpose.current = false;
      setMode('domicile');
    }
  }, [domicileOk, mode]);

  function valider(): Partial<Record<Champ, string>> {
    const e: Partial<Record<Champ, string>> = {};
    if (nom.trim().length < 3) e.nom = 'Indiquez votre prénom et votre nom.';
    const t = analyserTelephone(telephone);
    if (!t.ok) e.telephone = t.erreur;
    if (!codeWilaya) e.wilaya = 'Choisissez votre wilaya.';
    else if (!commune) e.commune = 'Choisissez votre commune.';
    if (mode === 'domicile' && adresse.trim().length < 6) e.adresse = 'Indiquez la rue et un repère pour le livreur.';
    setErreurs(e);
    return e;
  }

  /** Le client et la livraison, prêts à écrire dans la commande. */
  function pourCommande(frais: number): Pick<Commande, 'client' | 'livraison'> {
    const t = analyserTelephone(telephone);
    return {
      client: { nom: nom.trim(), telephone: t.ok ? t.normalise : telephone },
      livraison: {
        codeWilaya: codeWilaya!,
        wilaya: nomWilaya,
        commune: commune!.nom,
        mode,
        adresse: mode === 'domicile' ? adresse.trim() : undefined,
        lieuBureau: mode === 'bureau' ? commune!.daira : undefined,
        frais,
        delai: delai ?? '',
      },
    };
  }

  return {
    nom, setNom, telephone, setTelephone, codeWilaya, setCodeWilaya, communes, setCommunes,
    chargement, communeNom, setCommuneNom, mode, setMode, adresse, setAdresse,
    erreurs, setErreurs, suggestion, setSuggestion, bureauImpose,
    commune, domicileOk, nomWilaya, delai, valider, pourCommande,
  };
}

export type Coordonnees = ReturnType<typeof useCoordonnees>;

/**
 * Les champs : nom, mobile, wilaya, commune, domicile ou bureau, adresse.
 * `articles` sert à afficher les frais de livraison de chaque mode (offerts
 * à partir de deux articles).
 */
export function ChampsCoordonnees({ co, id, articles }: { co: Coordonnees; id: string; articles: number }) {
  const { erreurs } = co;

  const classeChamp = (champ: Champ) =>
    `h-[50px] w-full rounded-[12px] border-[1.5px] bg-[var(--creme)] px-3.5 text-[16px] text-[var(--encre)] ${
      erreurs[champ] ? 'border-[var(--erreur)]' : 'border-[var(--ligne)] focus:border-[var(--encre)]'
    }`;
  const decrire = (champ: Champ) => (erreurs[champ] ? `${id}-${champ}-erreur` : undefined);
  const erreur = (champ: Champ) =>
    erreurs[champ] ? (
      <p id={`${id}-${champ}-erreur`} className="mt-1.5 text-[13px] font-semibold text-[var(--erreur)]">
        {erreurs[champ]}
      </p>
    ) : null;

  function verifierTelephone() {
    if (!co.telephone) return;
    const t = analyserTelephone(co.telephone);
    co.setErreurs((e) => ({ ...e, telephone: t.ok ? undefined : t.erreur }));
    co.setSuggestion(!t.ok && t.suggestion ? t.suggestion : null);
    if (t.ok) co.setTelephone(t.affiche);
  }

  return (
    <>
      <div>
        <label htmlFor={`${id}-nom`} className="mb-1.5 block text-[13px] font-bold">Prénom et nom</label>
        <input id={`${id}-nom`} value={co.nom} onChange={(e) => co.setNom(e.target.value)} autoComplete="name"
          aria-invalid={!!erreurs.nom} aria-describedby={decrire('nom')} className={classeChamp('nom')} />
        {erreur('nom')}
      </div>

      <div>
        <label htmlFor={`${id}-telephone`} className="mb-1.5 block text-[13px] font-bold">Téléphone mobile</label>
        <input id={`${id}-telephone`} type="tel" inputMode="tel" autoComplete="tel-national" value={co.telephone}
          onChange={(e) => { co.setTelephone(e.target.value); co.setSuggestion(null); }}
          onBlur={verifierTelephone} placeholder="05, 06 ou 07…"
          aria-invalid={!!erreurs.telephone} aria-describedby={decrire('telephone')} className={classeChamp('telephone')} />
        {erreur('telephone')}
        {co.suggestion ? (
          <button type="button" className="mt-1.5 min-h-[44px] text-[13.5px] font-bold underline underline-offset-4"
            onClick={() => { co.setTelephone(co.suggestion!); co.setSuggestion(null); co.setErreurs((e) => ({ ...e, telephone: undefined })); }}>
            Vouliez-vous dire {co.suggestion} ?
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <label htmlFor={`${id}-wilaya`} className="mb-1.5 block text-[13px] font-bold">Wilaya</label>
          <select id={`${id}-wilaya`} value={co.codeWilaya ?? ''}
            onChange={(e) => {
              // La commune et sa liste se vident aussitôt : sinon les communes de
              // l'ancienne wilaya restent affichées le temps du chargement.
              co.setCommunes(null);
              co.setCommuneNom('');
              co.setCodeWilaya(e.target.value ? Number(e.target.value) : null);
              co.setErreurs((x) => ({ ...x, wilaya: undefined }));
            }}
            aria-invalid={!!erreurs.wilaya} aria-describedby={decrire('wilaya')} className={classeChamp('wilaya')}>
            <option value="">Choisir…</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.code}>{String(w.code).padStart(2, '0')} — {w.nom}</option>
            ))}
          </select>
          {erreur('wilaya')}
        </div>
        <div>
          <label htmlFor={`${id}-commune`} className="mb-1.5 block text-[13px] font-bold">Commune</label>
          <select id={`${id}-commune`} value={co.communeNom} disabled={!co.communes || co.chargement}
            onChange={(e) => { co.setCommuneNom(e.target.value); co.setErreurs((x) => ({ ...x, commune: undefined })); }}
            aria-invalid={!!erreurs.commune} aria-describedby={decrire('commune')}
            className={`${classeChamp('commune')} disabled:opacity-60`}>
            <option value="">{co.chargement ? 'Chargement…' : co.codeWilaya ? 'Choisir…' : 'D’abord la wilaya'}</option>
            {co.communes?.map((x) => <option key={x.nom} value={x.nom}>{x.nom}</option>)}
          </select>
          {erreur('commune')}
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-[13px] font-bold">Livraison</legend>
        <div className="space-y-2">
          {(['domicile', 'bureau'] as Mode[]).map((m) => {
            const indispo = m === 'domicile' && !co.domicileOk;
            const frais = co.codeWilaya ? fraisLivraison(co.codeWilaya, m, articles) : null;
            return (
              <label key={m} onClick={() => { if (!indispo) co.bureauImpose.current = false; }}
                className={`flex items-center justify-between gap-3 rounded-[12px] border-[1.5px] bg-[var(--creme)] px-3.5 py-3 ${
                  indispo ? 'cursor-not-allowed opacity-55' : 'cursor-pointer'
                } ${co.mode === m ? 'border-[var(--vert)] shadow-[inset_0_0_0_1px_var(--vert)]' : 'border-[var(--ligne)]'}`}>
                <input type="radio" name={`${id}-mode`} className="sr-only" checked={co.mode === m} disabled={indispo} onChange={() => co.setMode(m)} />
                <span>
                  <span className="block text-[14.5px] font-bold">{m === 'domicile' ? 'À domicile' : 'Au bureau du livreur'}</span>
                  <span className="block text-[12.5px] text-[var(--gris-texte)]">
                    {indispo
                      ? `Pas de livraison à domicile à ${co.commune?.nom}`
                      : m === 'bureau' && co.commune
                        ? `À ${co.commune.daira}${co.delai ? `, ${co.delai}` : ''}`
                        : co.delai ? `Livré ${co.delai}` : 'Délai affiché après la wilaya'}
                  </span>
                </span>
                <span className="nd-prix whitespace-nowrap text-[14px]">
                  {frais === null ? '' : frais === 0 ? 'Offerte' : formatDA(frais)}
                </span>
              </label>
            );
          })}
        </div>
        {!co.domicileOk && co.commune ? (
          <p className="mt-2 text-[13px] text-[var(--gris-texte)]">
            Le livreur ne dessert pas {co.commune.nom} à domicile : votre colis vous attend au bureau {de(co.commune.daira)}.
          </p>
        ) : null}
      </fieldset>

      {co.mode === 'domicile' ? (
        <div>
          <label htmlFor={`${id}-adresse`} className="mb-1.5 block text-[13px] font-bold">Adresse</label>
          <input id={`${id}-adresse`} value={co.adresse} onChange={(e) => co.setAdresse(e.target.value)} autoComplete="street-address"
            placeholder="Rue, numéro, repère (près de…)"
            aria-invalid={!!erreurs.adresse} aria-describedby={decrire('adresse')} className={classeChamp('adresse')} />
          {erreur('adresse')}
        </div>
      ) : null}
    </>
  );
}

/** Après un envoi refusé : annonce le nombre d'erreurs et place le curseur sur la première. */
export function signalerErreurs(e: Partial<Record<Champ, string>>, id: string, annoncer: (t: string) => void): boolean {
  const champs = Object.keys(e) as Champ[];
  if (!champs.length) return false;
  annoncer(`${champs.length} champ${champs.length > 1 ? 's' : ''} à corriger : ${Object.values(e)[0]}`);
  document.getElementById(`${id}-${champs[0]}`)?.focus();
  return true;
}
