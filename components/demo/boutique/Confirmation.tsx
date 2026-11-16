'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { trouverCommande, type Commande } from '@/components/demo/boutique/commandes';
import { formaterTelephone } from '@/components/demo/boutique/telephone';
import { de } from '@/content/demos/boutique-livraison';
import { formatDA, lienWhatsApp, produit } from '@/content/demos/boutique';

/**
 * La confirmation : une page de carnet, avec la commande écrite dessus.
 *
 * La commande est relue depuis le navigateur où elle a été passée. Ouverte
 * ailleurs (lien partagé, autre téléphone), la page le dit simplement plutôt
 * que d'afficher une commande vide.
 */
export function Confirmation({ id }: { id: string }) {
  const [commande, setCommande] = useState<Commande | null | undefined>(undefined);

  useEffect(() => {
    setCommande(trouverCommande(id) ?? null);
  }, [id]);

  if (commande === undefined) {
    return <div className="min-h-[60vh]" aria-busy="true" />;
  }

  if (commande === null) {
    return (
      <div className="nd-wrap py-20 text-center">
        <p className="nd-italique text-[20px] text-[var(--ambre-texte)]">Commande {id}</p>
        <h1 className="mt-2 text-[40px]">Cette commande n’est pas dans ce navigateur</h1>
        <p className="mx-auto mt-4 max-w-[30em] text-[var(--gris-texte)]">
          Dans la démonstration, les commandes restent dans le navigateur où elles ont été passées. Ouvrez ce lien
          depuis le même téléphone, ou passez une nouvelle commande.
        </p>
        <Link href="/demo/boutique" className="nd-bouton mt-8">Revenir au carnet</Link>
      </div>
    );
  }

  const prenom = commande.client.nom.split(/\s+/)[0];
  const premier = produit(commande.lignes[0].slug);
  const l = commande.livraison;
  const lieu = l.mode === 'domicile' ? `${l.adresse}, ${l.commune} (${l.wilaya})` : `Bureau du livreur ${de(l.lieuBureau ?? '')}, ${l.wilaya}`;
  const resume = commande.lignes.map((x) => `${x.nom} ${x.contenance} × ${x.quantite}`).join(', ');
  const message = `Bonjour Nadâ, je confirme ma commande ${commande.id} : ${resume}. Total ${formatDA(commande.total)}, livraison ${l.mode === 'domicile' ? `à ${l.commune}` : `au bureau ${de(l.lieuBureau ?? '')}`} (${l.wilaya}).`;
  const date = new Date(commande.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="nd-wrap nd-marge pb-10 pt-8 sm:ps-[110px] lg:pt-14" style={{ ['--accent' as string]: premier?.accent ?? 'var(--ambre)' }}>
      <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">
        Carnet de Nadâ — commande {commande.id}, {date}
      </p>
      <h1 className="mt-2 text-[46px] sm:text-[64px]">
        Merci, <span className="nd-italique">{prenom}.</span>
      </h1>
      <p className="mt-3 max-w-[32em] text-[17px]">
        Votre commande est notée. <b>Nous vous appelons au {formaterTelephone(commande.client.telephone)} pour la
        confirmer avant l’envoi.</b> Rien ne part sans votre accord.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
        {/* La commande, écrite sur la page — fond plein, pas de lignes derrière les prix */}
        <section aria-labelledby="ecrit" className="rounded-[18px] border border-[var(--ligne)] bg-[#fffdf9] p-5 shadow-[0_18px_40px_-26px_rgba(29,26,23,.45)] sm:p-7">
          <h2 id="ecrit" className="text-[28px]">Ce que vous avez commandé</h2>
          <hr className="my-4 w-14 border-0 border-t-2 border-[var(--accent)]" />
          <ul className="space-y-2.5 text-[15px]">
            {commande.lignes.map((x) => (
              <li key={x.slug} className="flex justify-between gap-4">
                <span>
                  <span className="nd-serif text-[20px] font-semibold">{x.nom}</span>
                  <span className="block text-[13px] text-[var(--gris-texte)]">
                    {x.contenance} × {x.quantite}
                    {x.remise ? ` · −${x.remise} %` : ''}
                  </span>
                </span>
                <span className="nd-prix whitespace-nowrap">
                  {formatDA(Math.round(x.prixUnitaire * x.quantite * (1 - (x.remise ?? 0) / 100)))}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-[var(--ligne)] pt-3 text-[14px]">
            {commande.codePromo ? (
              <div className="flex justify-between"><dt>Code {commande.codePromo}</dt><dd className="nd-prix font-normal">appliqué</dd></div>
            ) : null}
            <div className="flex justify-between"><dt>Livraison</dt><dd className="nd-prix font-normal">{l.frais === 0 ? 'offerte' : formatDA(l.frais)}</dd></div>
            <div className="flex items-baseline justify-between border-t border-[var(--ligne)] pt-2.5">
              <dt className="text-[20px] font-extrabold">À payer au livreur</dt>
              <dd className="nd-prix text-[26px] font-extrabold">{formatDA(commande.total)}</dd>
            </div>
          </dl>
          <dl className="mt-5 space-y-3 text-[14.5px]">
            <div><dt className="text-[11px] font-bold uppercase tracking-[.2em] text-[var(--ambre-texte)]">Livraison</dt><dd className="mt-0.5">{lieu}</dd></div>
            <div><dt className="text-[11px] font-bold uppercase tracking-[.2em] text-[var(--ambre-texte)]">Quand</dt><dd className="mt-0.5">{l.mode === 'domicile' ? 'Livrée' : 'Disponible au bureau'} {l.delai}, après notre appel.</dd></div>
            <div><dt className="text-[11px] font-bold uppercase tracking-[.2em] text-[var(--ambre-texte)]">Paiement</dt><dd className="mt-0.5">En espèces, au livreur. Vous pouvez ouvrir le colis devant lui avant de payer.</dd></div>
          </dl>
        </section>

        <div>
          <h2 className="text-[30px]">Et maintenant&nbsp;?</h2>
          <ol className="mt-4 space-y-3 text-[15px]">
            {['Nous vous appelons dans la journée pour confirmer la commande et l’adresse.', 'Le colis part ; le livreur vous appelle avant de passer.', 'Vous ouvrez le colis, vous payez au livreur.'].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-[28px] w-[28px] flex-none place-items-center rounded-full bg-[var(--creme-2)] text-[13px] font-extrabold">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[14.5px]">Vous préférez confirmer tout de suite ?</p>
          <a href={lienWhatsApp(message)} target="_blank" rel="noopener noreferrer" className="nd-bouton mt-3 w-full whitespace-normal text-center sm:w-auto">
            Confirmer sur WhatsApp
          </a>
          <p className="mt-2 text-[12.5px] text-[var(--gris-texte)]">
            Le message est déjà écrit, avec le numéro de commande et le total. Démonstration : WhatsApp s’ouvre sans
            destinataire ; en production, il écrit directement à la boutique.
          </p>
          <Link href="/demo/boutique" className="mt-8 inline-flex min-h-[44px] items-center text-[14.5px] font-bold underline underline-offset-4">
            Revenir au carnet
          </Link>
        </div>
      </div>

      {/* Pour qui visite la démo : l'autre côté de la commande. */}
      <aside aria-labelledby="cote-marchand" className="mt-12 rounded-[18px] border border-dashed border-[var(--gris)] bg-[var(--creme-2)] p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[var(--gris-texte)]">Démonstration — côté marchand</p>
          <h2 id="cote-marchand" className="mt-1 text-[28px]">Cette commande vient d’arriver dans le registre</h2>
          <p className="mt-1 max-w-[38em] text-[14.5px]">
            Voyez ce que reçoit la boutique : la commande {commande.id} à confirmer, le script d’appel, l’expédition et les
            chiffres.
          </p>
        </div>
        <Link href={`/demo/boutique/admin/commande/${commande.id}`} className="nd-bouton mt-4 w-full flex-none sm:mt-0 sm:w-auto">
          Ouvrir le registre
        </Link>
      </aside>
    </div>
  );
}
