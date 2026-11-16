'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { ajouterCommande, nouveauJeton, nouveauNumero } from '@/components/demo/boutique/commandes';
import { ChampsCoordonnees, signalerErreurs, useCoordonnees } from '@/components/demo/boutique/Coordonnees';
import { changerQuantite, lireCode, usePanier, viderPanier } from '@/components/demo/boutique/panier-stockage';
import { photosBoutique } from '@/content/demos/boutique-photos';
import { ARTICLES_LIVRAISON_OFFERTE, CODES_PROMO, fraisLivraison } from '@/content/demos/boutique-livraison';
import { formatDA, libelleContenance } from '@/content/demos/boutique';

/**
 * Le panier : les produits, puis le même formulaire que la fiche (composant
 * partagé), le total et « Commander ». Une seule commande pour tout.
 */
export function Panier() {
  const router = useRouter();
  const id = useId();
  const lignes = usePanier();
  const co = useCoordonnees();
  const [codePromo, setCodePromo] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [annonce, setAnnonce] = useState('');
  const jeton = useRef(nouveauJeton());

  useEffect(() => {
    const code = lireCode();
    if (code && CODES_PROMO[code]) setCodePromo(code);
  }, []);

  const calcul = useMemo(() => {
    const liste = lignes ?? [];
    const sousTotal = liste.reduce((s, l) => s + l.produit.contenances[l.contenance].prix * l.quantite, 0);
    const articles = liste.reduce((s, l) => s + l.quantite, 0);
    const remise = codePromo ? Math.round((sousTotal * CODES_PROMO[codePromo]) / 100) : 0;
    const frais = co.codeWilaya ? fraisLivraison(co.codeWilaya, co.mode, articles) : null;
    return { sousTotal, articles, remise, frais, total: sousTotal - remise + (frais ?? 0) };
  }, [lignes, codePromo, co.codeWilaya, co.mode]);

  if (lignes === null) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (lignes.length === 0) {
    return (
      <div className="nd-wrap py-20 text-center">
        <p className="nd-italique text-[20px] text-[var(--ambre-texte)]">Votre panier</p>
        <h1 className="mt-2 text-[44px]">Il est encore vide</h1>
        <p className="mx-auto mt-3 max-w-[28em] text-[var(--gris-texte)]">
          Chaque parfum se commande directement depuis sa page. Le panier sert à en réunir plusieurs.
        </p>
        <Link href="/demo/boutique/parfums" className="nd-bouton mt-8">Voir tous les parfums</Link>
      </div>
    );
  }

  function envoyer(ev: React.FormEvent) {
    ev.preventDefault();
    if (envoi || !lignes?.length) return;
    if (signalerErreurs(co.valider(), id, setAnnonce)) return;
    setEnvoi(true);
    const maintenant = new Date().toISOString();
    const cmd = ajouterCommande({
      id: nouveauNumero(),
      jeton: jeton.current,
      date: maintenant,
      ...co.pourCommande(calcul.frais ?? 0),
      lignes: lignes.map((l) => ({
        slug: l.slug,
        nom: l.produit.nom,
        contenance: libelleContenance(l.produit.contenances[l.contenance]),
        prixUnitaire: l.produit.contenances[l.contenance].prix,
        quantite: l.quantite,
      })),
      codePromo: codePromo ?? undefined,
      sousTotal: calcul.sousTotal,
      remise: calcul.remise,
      total: calcul.total,
      statut: 'nouvelle',
      historique: [{ statut: 'nouvelle', date: maintenant }],
    });
    viderPanier();
    router.push(`/demo/boutique/merci/${cmd.id}`);
  }

  return (
    <div className="nd-wrap pb-10 pt-8 lg:pt-12">
      <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Votre panier</p>
      <h1 className="mt-1 text-[44px] sm:text-[58px]">
        {calcul.articles} article{calcul.articles > 1 ? 's' : ''}, <span className="nd-italique">une commande</span>
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_.95fr] lg:items-start lg:gap-14">
        <ul className="divide-y divide-[var(--ligne)] rounded-[18px] border border-[var(--ligne)] bg-[#fffdf9] px-4 sm:px-6">
          {lignes.map((l) => {
            const c = l.produit.contenances[l.contenance];
            const photo = photosBoutique[l.produit.photos[0]];
            return (
              <li key={`${l.slug}-${l.contenance}`} className="flex gap-4 py-4" style={{ ['--accent' as string]: l.produit.accent }}>
                <Link href={`/demo/boutique/p/${l.slug}`} className="relative h-[100px] w-[80px] flex-none overflow-hidden rounded-[10px]">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[var(--accent)]" />
                  <Image src={photo.src} alt={l.produit.nom} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <p className="nd-serif text-[21px] font-semibold leading-tight">{l.produit.nom}</p>
                    <p className="nd-prix whitespace-nowrap text-[15px]">{formatDA(c.prix * l.quantite)}</p>
                  </div>
                  <p className="text-[13px] text-[var(--gris-texte)]">{libelleContenance(c)} · {formatDA(c.prix)} l’unité</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="inline-flex h-[44px] items-center overflow-hidden rounded-[12px] border-[1.5px] border-[var(--ligne)] bg-[var(--creme)]" role="group" aria-label={`Quantité de ${l.produit.nom}`}>
                      <button type="button" className="h-full w-11 text-[18px] font-bold" aria-label="Retirer un"
                        onClick={() => changerQuantite(l.slug, l.contenance, l.quantite - 1)}>−</button>
                      <span className="w-8 text-center font-bold" aria-live="polite">{l.quantite}</span>
                      <button type="button" className="h-full w-11 text-[18px] font-bold disabled:opacity-35" aria-label="Ajouter un"
                        disabled={l.quantite >= 5} onClick={() => changerQuantite(l.slug, l.contenance, l.quantite + 1)}>+</button>
                    </div>
                    <button type="button" className="min-h-[44px] text-[13.5px] font-semibold underline underline-offset-4"
                      onClick={() => changerQuantite(l.slug, l.contenance, 0)}>
                      Retirer
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <form onSubmit={envoyer} noValidate
          className="rounded-[20px] border border-[var(--ligne)] bg-[#fffdf9] p-5 shadow-[0_18px_40px_-24px_rgba(29,26,23,.45)] sm:p-6">
          <h2 className="text-[30px]">Commander</h2>
          <p className="mt-1 text-[13.5px] text-[var(--gris-texte)]">
            Paiement à la livraison. On vous appelle pour confirmer avant l’envoi.
          </p>
          <div className="mt-4 space-y-3.5">
            <ChampsCoordonnees co={co} id={id} articles={calcul.articles} />
          </div>

          <dl className="mt-4 border-t border-[var(--ligne)] pt-3 text-[14px]">
            <div className="flex justify-between py-0.5"><dt>Produits ({calcul.articles})</dt><dd className="nd-prix font-normal">{formatDA(calcul.sousTotal)}</dd></div>
            {calcul.remise ? <div className="flex justify-between py-0.5"><dt>Code {codePromo}</dt><dd className="nd-prix font-normal">−{formatDA(calcul.remise)}</dd></div> : null}
            <div className="flex justify-between py-0.5">
              <dt>Livraison{co.codeWilaya ? `, ${co.nomWilaya}` : ''}</dt>
              <dd className="nd-prix font-normal">
                {calcul.frais === null ? (calcul.articles >= ARTICLES_LIVRAISON_OFFERTE ? 'offerte' : 'selon la wilaya') : calcul.frais === 0 ? 'offerte' : formatDA(calcul.frais)}
              </dd>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between border-t border-[var(--ligne)] pt-2.5">
              <dt className="text-[22px] font-extrabold">Total</dt>
              <dd className="nd-prix text-[26px] font-extrabold" aria-live="polite">{formatDA(calcul.total)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-[12px] text-[var(--gris-texte)]">Tarifs de démonstration.</p>

          <p className="sr-only" role="alert">{annonce}</p>
          <button type="submit" disabled={envoi}
            className="nd-bouton mt-4 w-full whitespace-normal px-5 text-center text-[16px] leading-tight disabled:cursor-not-allowed disabled:opacity-60">
            {envoi ? 'Envoi de la commande…' : 'Commander — paiement à la livraison'}
          </button>
          <p className="mt-4 rounded-[12px] bg-[var(--creme-2)] px-3.5 py-3 text-[13.5px]">
            Vous pouvez <b>ouvrir le colis devant le livreur</b> avant de payer. Échange sous 7 jours —{' '}
            <Link href="/demo/boutique/livraison" className="underline underline-offset-4">livraison et échanges</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
