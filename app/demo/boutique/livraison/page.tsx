import type { Metadata } from 'next';
import Link from 'next/link';

import { Cadre, Reassurance } from '@/components/demo/boutique/Cadre';
import { ARTICLES_LIVRAISON_OFFERTE, TARIFS, type Zone } from '@/content/demos/boutique-livraison';
import { formatDA, marque } from '@/content/demos/boutique';

export const metadata: Metadata = {
  title: 'Livraison & échanges',
  description: 'Livraison dans toutes les wilayas, à domicile ou au bureau du livreur. Paiement à la livraison, échange sous 7 jours.',
};

const ZONES: { zone: Zone; nom: string; exemples: string }[] = [
  { zone: 'centre', nom: 'Centre', exemples: 'Alger, Blida, Boumerdès, Tipaza' },
  { zone: 'nord', nom: 'Nord', exemples: 'Oran, Constantine, Sétif, Tizi Ouzou, Béjaïa…' },
  { zone: 'hauts-plateaux', nom: 'Hauts Plateaux', exemples: 'Batna, Djelfa, Tiaret, M’Sila, Saïda…' },
  { zone: 'sud', nom: 'Sud', exemples: 'Biskra, Ghardaïa, Ouargla, Béchar, Tamanrasset…' },
];

const jours = ([a, b]: [number, number]) => `${a} à ${b} jours`;

/**
 * Livraison et échanges : les conditions, lisibles AVANT de commander.
 * Tarifs et délais lus depuis content/demos/boutique-livraison.ts — la même
 * source que le formulaire de commande : ils ne peuvent pas se contredire.
 * Conditions fictives de la marque Nadâ, et la page le dit.
 */
export default function LivraisonEchanges() {
  return (
    <Cadre>
      <Reassurance />
      <div className="nd-wrap nd-marge pb-6 pt-8 sm:ps-[110px] lg:pt-12">
        <p className="nd-italique text-[18px] text-[var(--ambre-texte)]">Carnet de Nadâ — les conditions</p>
        <h1 className="mt-1 text-[44px] sm:text-[60px]">
          Livraison <span className="nd-italique">&amp; échanges</span>
        </h1>
        <p className="mt-3 max-w-[34em] text-[16px] text-[var(--gris-texte)]">
          Tout ce qu’il faut savoir avant de commander : où l’on livre, combien de temps, ce que ça coûte, et ce qui se
          passe si le parfum ne vous plaît pas.
        </p>

        <section className="mt-10" aria-labelledby="livraison">
          <h2 id="livraison" className="text-[32px]">Livraison dans toutes les wilayas</h2>
          <p className="mt-2 max-w-[38em] text-[15.5px]">
            À domicile, ou au bureau du livreur — au chef-lieu de daïra de votre commune. Dans le Sud, la livraison à
            domicile dessert les chefs-lieux de daïra ; ailleurs, le colis vous attend au bureau. Le formulaire vous
            le dit dès que vous choisissez votre commune.
          </p>

          {/* Fond plein : les lignes du papier ne passent jamais derrière un prix. */}
          <div className="mt-5 overflow-hidden rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9]">
            <table className="w-full text-start text-[14.5px]">
              <caption className="sr-only">Tarifs et délais de livraison par zone</caption>
              <thead className="bg-[var(--creme-2)] text-[12px] uppercase tracking-[.14em]">
                <tr>
                  <th scope="col" className="px-4 py-3 text-start font-bold">Zone</th>
                  <th scope="col" className="px-3 py-3 text-end font-bold">Domicile</th>
                  <th scope="col" className="px-3 py-3 text-end font-bold">Bureau</th>
                  <th scope="col" className="hidden px-4 py-3 text-end font-bold sm:table-cell">Délai</th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map(({ zone, nom, exemples }) => (
                  <tr key={zone} className="border-t border-[var(--ligne)]">
                    <th scope="row" className="px-4 py-3 text-start align-top font-normal">
                      <span className="block font-bold">{nom}</span>
                      <span className="block text-[12.5px] text-[var(--gris-texte)]">{exemples}</span>
                      <span className="block text-[12.5px] text-[var(--gris-texte)] sm:hidden">{jours(TARIFS[zone].jours)}</span>
                    </th>
                    <td className="nd-prix px-3 py-3 text-end align-top font-normal">{formatDA(TARIFS[zone].domicile)}</td>
                    <td className="nd-prix px-3 py-3 text-end align-top font-normal">{formatDA(TARIFS[zone].bureau)}</td>
                    <td className="hidden px-4 py-3 text-end align-top sm:table-cell">{jours(TARIFS[zone].jours)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12.5px] text-[var(--gris-texte)]">
            Délais en jours ouvrés, le vendredi ne compte pas. Tarifs de démonstration.
          </p>
          <p className="mt-4 inline-block rounded-full bg-[var(--vert)] px-4 py-2 text-[14px] font-bold text-[var(--creme)]">
            Livraison offerte dès {ARTICLES_LIVRAISON_OFFERTE} articles
          </p>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-14" aria-label="Paiement et échanges">
          <div>
            <h2 className="text-[32px]">Le paiement</h2>
            <ul className="mt-3 space-y-2.5 text-[15.5px]">
              <li><b>En espèces, au livreur</b>, à la livraison. Rien à payer en ligne.</li>
              <li>Avant l’envoi, <b>on vous appelle</b> pour confirmer la commande et l’adresse. Rien ne part sans votre accord.</li>
              <li>Vous pouvez <b>ouvrir le colis devant le livreur</b> avant de payer, et refuser s’il ne correspond pas.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-[32px]">Les échanges</h2>
            <ul className="mt-3 space-y-2.5 text-[15.5px]">
              <li><b>Sous 7 jours</b> après la livraison, flacon non entamé et dans sa boîte.</li>
              <li>Écrivez-nous sur WhatsApp avec votre numéro de commande : on organise l’échange.</li>
              <li>Un flacon arrivé abîmé est remplacé, sans frais.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-[16px] bg-[var(--creme-2)] p-5 sm:p-6" aria-labelledby="contact">
          <h2 id="contact" className="text-[26px]">Une question ?</h2>
          <p className="mt-2 text-[15px]">
            Le service client répond sur WhatsApp, {marque.horaires}.
          </p>
          <Link href="/demo/boutique/parfums" className="nd-bouton mt-5">Voir tous les parfums</Link>
        </section>

        <p className="mt-8 text-[12.5px] text-[var(--gris-texte)]">
          Nadâ est une marque fictive : ces conditions sont celles de la démonstration, pas celles d’un transporteur.
        </p>
      </div>
    </Cadre>
  );
}
