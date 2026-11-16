'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import {
  ajouterCommande,
  CLE_FORMULAIRE,
  nouveauJeton,
  nouveauNumero,
  type Commande,
} from '@/components/demo/boutique/commandes';
import { badgeStock, useStocks } from '@/components/demo/boutique/stocks';
import { analyserTelephone } from '@/components/demo/boutique/telephone';
import { photosBoutique } from '@/content/demos/boutique-photos';
import {
  ARTICLES_LIVRAISON_OFFERTE,
  CODES_PROMO,
  delaiEstime,
  domicileDisponible,
  fraisLivraison,
  OFFRE_JOINTE,
  type Commune,
  type Mode,
} from '@/content/demos/boutique-livraison';
import { formatDA, libelleContenance, marque, produit as trouver, type Produit } from '@/content/demos/boutique';
import { wilayas } from '@/content/demos/wilayas';

type Champ = 'nom' | 'telephone' | 'wilaya' | 'commune' | 'adresse';

type Sauvegarde = {
  nom?: string;
  telephone?: string;
  wilaya?: number;
  commune?: string;
  mode?: Mode;
  adresse?: string;
};

/** « de Blida », mais « d’Aougrout » : l'élision devant une voyelle. */
function de(nom: string): string {
  return /^[aeiouyâàéèêëîïôöûüh]/i.test(nom) ? `d’${nom}` : `de ${nom}`;
}

function lireSauvegarde(): Sauvegarde {
  try {
    return JSON.parse(window.localStorage.getItem(CLE_FORMULAIRE) ?? '{}') as Sauvegarde;
  } catch {
    return {};
  }
}

/**
 * Le bloc d'achat de la fiche : prix, contenance, formulaire, total, bouton.
 *
 * C'est la page qui vend, pour un visiteur qui arrive d'une publicité sur son
 * téléphone. Règle : rien ne passe entre lui et « Commander ». Le formulaire
 * est sur la page même, sans panier obligatoire ; le total se recalcule à
 * chaque choix et s'affiche en gros juste au-dessus du bouton.
 *
 * Tout ce que le visiteur tape est gardé dans le navigateur : s'il quitte la
 * page pour répondre à un message, il retrouve son formulaire rempli.
 */
export function Achat({ produit }: { produit: Produit }) {
  const router = useRouter();
  const id = useId();
  const stocks = useStocks();
  const stock = stocks[produit.slug] ?? produit.stock;
  const badge = badgeStock(stock);
  const enRupture = stock <= 0;

  const [contenance, setContenance] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [codeWilaya, setCodeWilaya] = useState<number | null>(null);
  const [communes, setCommunes] = useState<Commune[] | null>(null);
  const [chargement, setChargement] = useState(false);
  const [communeNom, setCommuneNom] = useState('');
  const [mode, setMode] = useState<Mode>('domicile');
  const [adresse, setAdresse] = useState('');
  const [offre, setOffre] = useState(false);
  const [codePromo, setCodePromo] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Partial<Record<Champ, string>>>({});
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [annonce, setAnnonce] = useState('');
  const [boutonVisible, setBoutonVisible] = useState(true);
  const [aDefile, setADefile] = useState(false);
  const restaure = useRef(false);
  const jeton = useRef(nouveauJeton());
  const formulaire = useRef<HTMLFormElement>(null);

  const c = produit.contenances[contenance];
  const avecOffre = produit.slug !== OFFRE_JOINTE.slug && produit.famille !== undefined;
  const creme = trouver(OFFRE_JOINTE.slug)!;
  const prixCreme = Math.round(creme.contenances[0].prix * (1 - OFFRE_JOINTE.remise / 100));
  const commune = communes?.find((x) => x.nom === communeNom) ?? null;
  const domicileOk = codeWilaya && commune ? domicileDisponible(codeWilaya, commune) : true;

  // ── Restauration du formulaire, puis code promo venu de la publicité ──
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
    const code = new URLSearchParams(window.location.search).get('code')?.toUpperCase();
    if (code && CODES_PROMO[code]) setCodePromo(code);
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

  // ── Les communes de la wilaya, chargées à la demande ──
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
  const bureauImpose = useRef(false);
  useEffect(() => {
    if (!domicileOk && mode === 'domicile') {
      bureauImpose.current = true;
      setMode('bureau');
    } else if (domicileOk && bureauImpose.current && mode === 'bureau') {
      bureauImpose.current = false;
      setMode('domicile');
    }
  }, [domicileOk, mode]);

  // ── Le bouton collant du téléphone : visible tant que le vrai bouton ne l'est pas ──
  useEffect(() => {
    const f = formulaire.current;
    if (!f) return;
    const io = new IntersectionObserver(([e]) => setBoutonVisible(e.isIntersecting), { threshold: 0 });
    io.observe(f);
    // Au premier écran, le nom, la photo et le prix passent avant le bouton :
    // il n'apparaît qu'une fois que le visiteur a commencé à descendre.
    const surDefilement = () => setADefile(window.scrollY > 120);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', surDefilement);
    };
  }, []);

  // ── Le total ──
  const calcul = useMemo(() => {
    const sousTotalProduit = c.prix * quantite;
    const remisePromo = codePromo ? Math.round((sousTotalProduit * CODES_PROMO[codePromo]) / 100) : 0;
    const articles = quantite + (offre && avecOffre ? 1 : 0);
    const prixOffre = offre && avecOffre ? prixCreme : 0;
    const frais = codeWilaya ? fraisLivraison(codeWilaya, mode, articles) : null;
    return {
      sousTotalProduit,
      remisePromo,
      articles,
      prixOffre,
      frais,
      total: sousTotalProduit - remisePromo + prixOffre + (frais ?? 0),
    };
  }, [c.prix, quantite, codePromo, offre, avecOffre, prixCreme, codeWilaya, mode]);

  const nomWilaya = wilayas.find((w) => w.code === codeWilaya)?.nom ?? '';
  const delai = codeWilaya ? delaiEstime(codeWilaya) : null;

  // ── Validation ──
  function valider(): Partial<Record<Champ, string>> {
    const e: Partial<Record<Champ, string>> = {};
    if (nom.trim().length < 3) e.nom = 'Indiquez votre prénom et votre nom.';
    const t = analyserTelephone(telephone);
    if (!t.ok) e.telephone = t.erreur;
    if (!codeWilaya) e.wilaya = 'Choisissez votre wilaya.';
    else if (!commune) e.commune = 'Choisissez votre commune.';
    if (mode === 'domicile' && adresse.trim().length < 6) e.adresse = 'Indiquez la rue et un repère pour le livreur.';
    return e;
  }

  function verifierTelephone() {
    if (!telephone) return;
    const t = analyserTelephone(telephone);
    setErreurs((e) => ({ ...e, telephone: t.ok ? undefined : t.erreur }));
    setSuggestion(!t.ok && t.suggestion ? t.suggestion : null);
    if (t.ok) setTelephone(t.affiche);
  }

  function envoyer(ev: React.FormEvent) {
    ev.preventDefault();
    if (envoi || enRupture) return; // anti double-clic
    const e = valider();
    setErreurs(e);
    const champs = Object.keys(e) as Champ[];
    if (champs.length) {
      setAnnonce(`${champs.length} champ${champs.length > 1 ? 's' : ''} à corriger : ${Object.values(e)[0]}`);
      document.getElementById(`${id}-${champs[0]}`)?.focus();
      return;
    }
    setEnvoi(true);
    const t = analyserTelephone(telephone);
    const maintenant = new Date().toISOString();
    const lignes: Commande['lignes'] = [
      { slug: produit.slug, nom: produit.nom, contenance: libelleContenance(c), prixUnitaire: c.prix, quantite },
    ];
    if (offre && avecOffre) {
      lignes.push({
        slug: creme.slug,
        nom: creme.nom,
        contenance: libelleContenance(creme.contenances[0]),
        prixUnitaire: creme.contenances[0].prix,
        quantite: 1,
        remise: OFFRE_JOINTE.remise,
      });
    }
    const cmd = ajouterCommande({
      id: nouveauNumero(),
      jeton: jeton.current,
      date: maintenant,
      client: { nom: nom.trim(), telephone: t.ok ? t.normalise : telephone },
      livraison: {
        codeWilaya: codeWilaya!,
        wilaya: nomWilaya,
        commune: commune!.nom,
        mode,
        adresse: mode === 'domicile' ? adresse.trim() : undefined,
        lieuBureau: mode === 'bureau' ? commune!.daira : undefined,
        frais: calcul.frais ?? 0,
        delai: delai ?? '',
      },
      lignes,
      codePromo: codePromo ?? undefined,
      sousTotal: calcul.sousTotalProduit + calcul.prixOffre,
      remise: calcul.remisePromo + (offre && avecOffre ? creme.contenances[0].prix - prixCreme : 0),
      total: calcul.total,
      statut: 'nouvelle',
      historique: [{ statut: 'nouvelle', date: maintenant }],
    });
    router.push(`/demo/boutique/merci/${cmd.id}`);
  }

  const classeChamp = (champ: Champ) =>
    `h-[50px] w-full rounded-[12px] border-[1.5px] bg-[var(--creme)] px-3.5 text-[16px] text-[var(--encre)] ${
      erreurs[champ] ? 'border-[var(--erreur)]' : 'border-[var(--ligne)] focus:border-[var(--encre)]'
    }`;
  const decrire = (champ: Champ) => (erreurs[champ] ? `${id}-${champ}-erreur` : undefined);
  const Erreur = ({ champ }: { champ: Champ }) =>
    erreurs[champ] ? (
      <p id={`${id}-${champ}-erreur`} className="mt-1.5 text-[13px] font-semibold text-[var(--erreur)]">
        {erreurs[champ]}
      </p>
    ) : null;

  const prixMl = (i: number) => Math.round(produit.contenances[i].prix / produit.contenances[i].ml);
  const meilleurMl =
    produit.contenances.length > 1
      ? produit.contenances.reduce((m, _, i) => (prixMl(i) < prixMl(m) ? i : m), 0)
      : -1;

  return (
    <div style={{ ['--accent' as string]: produit.accent }}>
      {produit.carnet ? (
        <p className="nd-italique flex items-center gap-2 text-[18px] text-[var(--ambre-texte)]">
          <span className="nd-pastille" aria-hidden="true" />
          {produit.carnet.lieu}
        </p>
      ) : null}
      <h1 className="mt-1 text-[40px] sm:text-[58px]">{produit.nom}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[13.5px] text-[var(--gris-texte)]">
        {badge ? (
          <span
            className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
              badge.ton === 'rupture' ? 'border border-[var(--erreur)] text-[var(--erreur)]' : 'bg-[var(--encre)] text-[var(--creme)]'
            }`}
          >
            {badge.texte}
          </span>
        ) : null}
        <span>
          {produit.nature}
          {produit.famille ? ` · ${produit.famille === 'ambre' ? 'ambré' : produit.famille === 'boise' ? 'boisé' : produit.famille}` : ''}
        </span>
      </div>

      <p className="nd-prix mt-4 inline-block bg-[var(--creme)] pe-2 text-[32px] text-[var(--ambre-texte)]">{formatDA(c.prix)}</p>
      <p className="text-[12px] text-[var(--gris-texte)]">Tarifs de démonstration.</p>
      {codePromo ? (
        <p className="mt-2 inline-block rounded-full bg-[var(--vert)] px-3 py-1 text-[12.5px] font-bold text-[var(--creme)]">
          Code {codePromo} : −{CODES_PROMO[codePromo]} % appliqué
        </p>
      ) : null}

      {produit.contenances.length > 1 ? (
        <fieldset className="mt-5">
          <legend className="text-[13.5px] font-bold">Contenance</legend>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            {produit.contenances.map((x, i) => (
              <label
                key={x.ml}
                className={`cursor-pointer rounded-[14px] border-[1.5px] bg-[var(--creme)] px-3.5 py-3 ${
                  contenance === i ? 'border-[var(--encre)] shadow-[inset_0_0_0_1px_var(--encre)]' : 'border-[var(--ligne)]'
                }`}
              >
                <input type="radio" name={`${id}-contenance`} className="sr-only" checked={contenance === i} onChange={() => setContenance(i)} />
                <span className="block text-[15px] font-bold">
                  {libelleContenance(x)} · <span className="nd-prix">{formatDA(x.prix)}</span>
                </span>
                <span className="block text-[12.5px] text-[var(--gris-texte)]">
                  {prixMl(i)} DA le ml{i === meilleurMl ? ' — le plus avantageux' : ''}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="mt-4 text-[14px] text-[var(--gris-texte)]">{libelleContenance(c)}</p>
      )}

      {/* ── Le formulaire de commande, fond plein : jamais de lignes derrière ── */}
      <form
        ref={formulaire}
        id="commande"
        onSubmit={envoyer}
        noValidate
        className="mt-6 scroll-mt-4 rounded-[20px] border border-[var(--ligne)] bg-[#fffdf9] p-5 shadow-[0_18px_40px_-24px_rgba(29,26,23,.45)] sm:p-6"
      >
        <h2 className="text-[30px]">Commander</h2>
        <p className="mt-1 text-[13.5px] text-[var(--gris-texte)]">
          Paiement à la livraison. On vous appelle pour confirmer avant l’envoi.
        </p>

        <div className="mt-4 space-y-3.5">
          <div>
            <label htmlFor={`${id}-nom`} className="mb-1.5 block text-[13px] font-bold">Prénom et nom</label>
            <input id={`${id}-nom`} value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="name"
              aria-invalid={!!erreurs.nom} aria-describedby={decrire('nom')} className={classeChamp('nom')} />
            <Erreur champ="nom" />
          </div>

          <div>
            <label htmlFor={`${id}-telephone`} className="mb-1.5 block text-[13px] font-bold">Téléphone mobile</label>
            <input id={`${id}-telephone`} type="tel" inputMode="tel" autoComplete="tel-national" value={telephone}
              onChange={(e) => { setTelephone(e.target.value); setSuggestion(null); }}
              onBlur={verifierTelephone} placeholder="05, 06 ou 07…"
              aria-invalid={!!erreurs.telephone} aria-describedby={decrire('telephone')} className={classeChamp('telephone')} />
            <Erreur champ="telephone" />
            {suggestion ? (
              <button type="button" className="mt-1.5 min-h-[44px] text-[13.5px] font-bold underline underline-offset-4"
                onClick={() => { setTelephone(suggestion); setSuggestion(null); setErreurs((e) => ({ ...e, telephone: undefined })); }}>
                Vouliez-vous dire {suggestion} ?
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
            <div>
              <label htmlFor={`${id}-wilaya`} className="mb-1.5 block text-[13px] font-bold">Wilaya</label>
              <select id={`${id}-wilaya`} value={codeWilaya ?? ''}
                onChange={(e) => {
                  // La commune et sa liste se vident aussitôt : sinon les communes de
                  // l'ancienne wilaya restent affichées le temps du chargement.
                  setCommunes(null);
                  setCommuneNom('');
                  setCodeWilaya(e.target.value ? Number(e.target.value) : null);
                  setErreurs((x) => ({ ...x, wilaya: undefined }));
                }}
                aria-invalid={!!erreurs.wilaya} aria-describedby={decrire('wilaya')} className={classeChamp('wilaya')}>
                <option value="">Choisir…</option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.code}>{String(w.code).padStart(2, '0')} — {w.nom}</option>
                ))}
              </select>
              <Erreur champ="wilaya" />
            </div>
            <div>
              <label htmlFor={`${id}-commune`} className="mb-1.5 block text-[13px] font-bold">Commune</label>
              <select id={`${id}-commune`} value={communeNom} disabled={!communes || chargement}
                onChange={(e) => { setCommuneNom(e.target.value); setErreurs((x) => ({ ...x, commune: undefined })); }}
                aria-invalid={!!erreurs.commune} aria-describedby={decrire('commune')}
                className={`${classeChamp('commune')} disabled:opacity-60`}>
                <option value="">{chargement ? 'Chargement…' : codeWilaya ? 'Choisir…' : 'D’abord la wilaya'}</option>
                {communes?.map((x) => <option key={x.nom} value={x.nom}>{x.nom}</option>)}
              </select>
              <Erreur champ="commune" />
            </div>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-bold">Livraison</legend>
            <div className="space-y-2">
              {(['domicile', 'bureau'] as Mode[]).map((m) => {
                const indispo = m === 'domicile' && !domicileOk;
                const frais = codeWilaya ? fraisLivraison(codeWilaya, m, calcul.articles) : null;
                return (
                  <label key={m} onClick={() => { if (!indispo) bureauImpose.current = false; }}
                    className={`flex items-center justify-between gap-3 rounded-[12px] border-[1.5px] bg-[var(--creme)] px-3.5 py-3 ${
                      indispo ? 'cursor-not-allowed opacity-55' : 'cursor-pointer'
                    } ${mode === m ? 'border-[var(--vert)] shadow-[inset_0_0_0_1px_var(--vert)]' : 'border-[var(--ligne)]'}`}>
                    <input type="radio" name={`${id}-mode`} className="sr-only" checked={mode === m} disabled={indispo} onChange={() => setMode(m)} />
                    <span>
                      <span className="block text-[14.5px] font-bold">{m === 'domicile' ? 'À domicile' : 'Au bureau du livreur'}</span>
                      <span className="block text-[12.5px] text-[var(--gris-texte)]">
                        {indispo
                          ? `Pas de livraison à domicile à ${commune?.nom}`
                          : m === 'bureau' && commune
                            ? `À ${commune.daira}${delai ? `, ${delai}` : ''}`
                            : delai ? `Livré ${delai}` : 'Délai affiché après la wilaya'}
                      </span>
                    </span>
                    <span className="nd-prix whitespace-nowrap text-[14px]">
                      {frais === null ? '' : frais === 0 ? 'Offerte' : formatDA(frais)}
                    </span>
                  </label>
                );
              })}
            </div>
            {!domicileOk && commune ? (
              <p className="mt-2 text-[13px] text-[var(--gris-texte)]">
                Le livreur ne dessert pas {commune.nom} à domicile : votre colis vous attend au bureau {de(commune.daira)}.
              </p>
            ) : null}
          </fieldset>

          {mode === 'domicile' ? (
            <div>
              <label htmlFor={`${id}-adresse`} className="mb-1.5 block text-[13px] font-bold">Adresse</label>
              <input id={`${id}-adresse`} value={adresse} onChange={(e) => setAdresse(e.target.value)} autoComplete="street-address"
                placeholder="Rue, numéro, repère (près de…)"
                aria-invalid={!!erreurs.adresse} aria-describedby={decrire('adresse')} className={classeChamp('adresse')} />
              <Erreur champ="adresse" />
            </div>
          ) : null}

          <div>
            <p className="mb-1.5 text-[13px] font-bold" id={`${id}-qte`}>Quantité</p>
            <div className="inline-flex h-[48px] items-center overflow-hidden rounded-[12px] border-[1.5px] border-[var(--ligne)] bg-[var(--creme)]" role="group" aria-labelledby={`${id}-qte`}>
              <button type="button" className="h-full w-12 text-[20px] font-bold disabled:opacity-35" aria-label="Retirer un"
                disabled={quantite <= 1} onClick={() => setQuantite((q) => Math.max(1, q - 1))}>−</button>
              <span className="w-10 text-center font-bold" aria-live="polite">{quantite}</span>
              <button type="button" className="h-full w-12 text-[20px] font-bold disabled:opacity-35" aria-label="Ajouter un"
                disabled={quantite >= Math.min(5, Math.max(stock, 1))} onClick={() => setQuantite((q) => q + 1)}>+</button>
            </div>
            {calcul.articles < ARTICLES_LIVRAISON_OFFERTE ? (
              <p className="mt-1.5 text-[12.5px] text-[var(--gris-texte)]">Livraison offerte dès {ARTICLES_LIVRAISON_OFFERTE} articles.</p>
            ) : (
              <p className="mt-1.5 text-[12.5px] font-bold text-[var(--vert)]">Livraison offerte.</p>
            )}
          </div>

          {avecOffre ? (
            <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] border-dashed border-[var(--ambre)] bg-[#fbf4ea] px-3 py-2.5">
              <input type="checkbox" checked={offre} onChange={(e) => setOffre(e.target.checked)} className="h-[22px] w-[22px] flex-none accent-[var(--vert)]" />
              <span className="relative h-[66px] w-[54px] flex-none overflow-hidden rounded-[9px]">
                <Image src={photosBoutique['creme-mains'].src} alt="" fill sizes="54px" className="object-cover" />
              </span>
              <span className="text-[13.5px] leading-snug">
                Ajoutez la <b className="text-[var(--ambre-texte)]">crème mains</b> : <b className="text-[var(--ambre-texte)]">−{OFFRE_JOINTE.remise}&nbsp;%</b> avec cette commande
                <span className="nd-prix mt-0.5 block text-[12px] font-normal text-[var(--gris-texte)]">
                  {formatDA(creme.contenances[0].prix)} → {formatDA(prixCreme)}
                </span>
              </span>
            </label>
          ) : null}
        </div>

        {/* ── Le récapitulatif, juste au-dessus du bouton ── */}
        <dl className="mt-4 border-t border-[var(--ligne)] pt-3 text-[14px]">
          <div className="flex justify-between py-0.5"><dt>{produit.nom}, {libelleContenance(c)} × {quantite}</dt><dd className="nd-prix font-normal">{formatDA(calcul.sousTotalProduit)}</dd></div>
          {calcul.remisePromo ? <div className="flex justify-between py-0.5"><dt>Code {codePromo}</dt><dd className="nd-prix font-normal">−{formatDA(calcul.remisePromo)}</dd></div> : null}
          {offre && avecOffre ? <div className="flex justify-between py-0.5"><dt>Crème mains (−{OFFRE_JOINTE.remise} %)</dt><dd className="nd-prix font-normal">{formatDA(prixCreme)}</dd></div> : null}
          <div className="flex justify-between py-0.5">
            <dt>Livraison{codeWilaya ? `, ${nomWilaya}` : ''}</dt>
            <dd className="nd-prix font-normal">{calcul.frais === null ? 'selon la wilaya' : calcul.frais === 0 ? 'offerte' : formatDA(calcul.frais)}</dd>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between border-t border-[var(--ligne)] pt-2.5">
            <dt className="text-[22px] font-extrabold">Total</dt>
            <dd className="nd-prix text-[26px] font-extrabold" aria-live="polite">{formatDA(calcul.total)}</dd>
          </div>
        </dl>

        <p className="sr-only" role="alert">{annonce}</p>

        <button type="submit" disabled={envoi || enRupture}
          className="nd-bouton mt-4 w-full text-[16px] disabled:cursor-not-allowed disabled:opacity-60">
          {enRupture ? 'En rupture de stock' : envoi ? 'Envoi de la commande…' : 'Commander — paiement à la livraison'}
        </button>

        <ol className="mt-4 space-y-2.5 text-[14px]">
          {['On vous appelle dans la journée pour confirmer.', 'Le livreur vous contacte avant de passer.', 'Vous payez en espèces, à la livraison.'].map((t, i) => (
            <li key={t} className="flex items-start gap-3">
              <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-[var(--creme-2)] text-[12.5px] font-extrabold">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-[12px] bg-[var(--creme-2)] px-3.5 py-3 text-[13.5px]">
          Vous pouvez <b>ouvrir le colis devant le livreur</b> avant de payer. Échange sous 7 jours —{' '}
          <Link href="/demo/boutique/livraison" className="underline underline-offset-4">livraison et échanges</Link>.
        </p>
        <p className="mt-3 text-[12.5px] text-[var(--gris-texte)]">Une question ? Service client sur WhatsApp, {marque.horaires}.</p>
      </form>

      {/* ── Le bouton collant du téléphone, et lui seul ── */}
      {!boutonVisible && aDefile && !enRupture ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ligne)] bg-[rgba(247,242,234,.96)] px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur lg:hidden">
          <button type="button" className="nd-bouton w-full text-[15px]"
            onClick={() => {
              formulaire.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
              document.getElementById(`${id}-nom`)?.focus({ preventScroll: true });
            }}>
            Commander — paiement à la livraison
          </button>
        </div>
      ) : null}
    </div>
  );
}
