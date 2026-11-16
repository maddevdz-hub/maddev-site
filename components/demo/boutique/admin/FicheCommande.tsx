'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import {
  LIBELLE_APPEL,
  MOTIFS_ANNULATION,
  MOTIFS_RETOUR,
  ajouterListeNoire,
  annuler,
  confirmer,
  expedier,
  marquerLivree,
  marquerRetournee,
  noterAppel,
  retirerListeNoire,
} from '@/components/demo/boutique/admin/actions';
import { Alertes, Exemple, PastilleStatut } from '@/components/demo/boutique/admin/elements';
import {
  LIBELLE_STATUT,
  alertesDe,
  montantLigne,
  quand,
  remiseCode,
  telephoneAffiche,
  useRegistre,
} from '@/components/demo/boutique/admin/registre';
import type { Commande, IssueAppel } from '@/components/demo/boutique/commandes';
import { de, delaiEstime } from '@/content/demos/boutique-livraison';
import { formatDA, lienWhatsApp, produit } from '@/content/demos/boutique';

/**
 * La fiche d'une commande : tout ce qu'il faut pour la traiter sans quitter
 * l'écran. Les actions proposées dépendent du statut — on ne propose jamais
 * d'expédier une commande qui n'a pas été confirmée.
 */
export function FicheCommande({ id }: { id: string }) {
  const registre = useRegistre();
  if (!registre) return <div className="min-h-[70vh]" aria-busy="true" />;

  const c = registre.commandes.find((x) => x.id === id);
  if (!c) {
    return (
      <div className="nd-wrap py-20 text-center">
        <p className="nd-italique text-[20px] text-[var(--ambre-texte)]">Commande {id}</p>
        <h1 className="mt-2 text-[40px]">Cette commande n’est pas dans ce navigateur</h1>
        <p className="mx-auto mt-4 max-w-[32em] text-[var(--gris-texte)]">
          Dans la démonstration, le registre lit les commandes passées dans ce même navigateur. Elle a peut-être été
          effacée par « Réinitialiser la démo ».
        </p>
        <Link href="/demo/boutique/admin" className="nd-bouton mt-8">Revenir aux commandes</Link>
      </div>
    );
  }

  const alertes = alertesDe(c, registre.commandes, registre.listeNoire);
  // Lu dans la liste elle-même : une commande close n'a plus d'alertes, mais
  // son numéro peut rester sur la liste.
  const cleTel = c.client.telephone.replace(/[^\d•]/g, '');
  const enListeNoire = registre.listeNoire.some((e) => e.telephone.replace(/[^\d•]/g, '') === cleTel);
  const premier = produit(c.lignes[0].slug);

  return (
    <div className="nd-wrap pb-12 pt-6 lg:pt-8" style={{ ['--accent' as string]: premier?.accent ?? 'var(--ambre)' }}>
      <Link href="/demo/boutique/admin" className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-[var(--gris-texte)] hover:text-[var(--encre)]">
        <span aria-hidden="true">←</span> Commandes
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-[40px] tracking-[.01em] [font-variant-numeric:lining-nums] sm:text-[52px]">{c.id}</h1>
        <PastilleStatut statut={c.statut} />
        {c.exemple ? <Exemple /> : null}
      </div>
      <p className="mt-1 text-[14.5px] text-[var(--gris-texte)]">
        Reçue {quand(c.date)} ·{' '}
        {new Date(c.date).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
      </p>
      <Alertes liste={alertes} grand />

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-10">
        <div className="space-y-6">
          <Actions c={c} />
          <Client c={c} enListeNoire={enListeNoire} />
        </div>
        <div className="space-y-6">
          <Contenu c={c} />
          <Historique c={c} />
        </div>
      </div>
    </div>
  );
}

// ── Blocs ─────────────────────────────────────────────────────────────────

function Bloc({ titre, children, id }: { titre: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="rounded-[16px] border border-[var(--ligne)] bg-[#fffdf9] p-4 sm:p-6">
      <h2 id={id} className="text-[26px]">{titre}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

const boutonPlein = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--vert)] px-5 text-[15px] font-bold text-[var(--creme)] hover:bg-[var(--vert-2)]';
const boutonCreux = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--encre)] px-5 text-[15px] font-bold hover:bg-[var(--creme-2)]';
const boutonDiscret = 'inline-flex min-h-[44px] items-center px-1 text-[14px] font-semibold underline decoration-[var(--ligne)] underline-offset-4 hover:decoration-[var(--encre)]';

function prenom(c: Commande) {
  return c.client.nom.split(/\s+/)[0];
}

function lieuComplet(c: Commande) {
  const l = c.livraison;
  return l.mode === 'domicile' ? `${l.adresse}, ${l.commune} (${l.wilaya})` : `bureau du livreur ${de(l.lieuBureau ?? l.commune)} (${l.wilaya})`;
}

function articles(c: Commande) {
  return c.lignes.map((l) => `${l.nom} ${l.contenance}${l.quantite > 1 ? ` × ${l.quantite}` : ''}`).join(' et ');
}

/** Les actions possibles, selon le statut. */
function Actions({ c }: { c: Commande }) {
  const [annulation, setAnnulation] = useState(false);
  const [retour, setRetour] = useState(false);

  if (c.statut === 'nouvelle' || c.statut === 'a-rappeler') {
    return (
      <Bloc titre={`Appeler ${prenom(c)}`} id="b-actions">
        <div className="flex flex-wrap gap-2">
          <BoutonAppeler c={c} />
          <a href={lienWhatsApp(messageConfirmation(c))} target="_blank" rel="noopener noreferrer" className={boutonCreux}>
            WhatsApp
          </a>
        </div>
        <p className="mt-2 text-[12.5px] text-[var(--gris-texte)]">
          WhatsApp s’ouvre avec le message de confirmation déjà écrit — sans destinataire dans la démonstration.
        </p>

        <Script c={c} />

        <h3 className="nd-sans mt-6 text-[13px] font-bold uppercase tracking-[.16em] text-[var(--gris-texte)]">Résultat de l’appel</h3>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <button
            type="button"
            className={boutonPlein}
            onClick={() => {
              noterAppel(c.id, 'joint');
              confirmer(c.id);
            }}
          >
            Joint, commande confirmée
          </button>
          {(['pas-de-reponse', 'occupe', 'eteint', 'rappeler'] as IssueAppel[]).map((i) => (
            <button key={i} type="button" className={boutonCreux} onClick={() => noterAppel(c.id, i)}>
              {LIBELLE_APPEL[i]}
            </button>
          ))}
        </div>
        <Appels c={c} />

        <div className="mt-5 border-t border-[var(--ligne)] pt-3">
          {annulation ? (
            <ChoixMotif titre="Pourquoi annuler ?" motifs={MOTIFS_ANNULATION} valider="Annuler la commande" onValider={(m) => annuler(c.id, m)} onFermer={() => setAnnulation(false)} />
          ) : (
            <button type="button" className={boutonDiscret} onClick={() => setAnnulation(true)}>
              Annuler la commande…
            </button>
          )}
        </div>
      </Bloc>
    );
  }

  if (c.statut === 'confirmee') {
    return (
      <Bloc titre="À expédier" id="b-actions">
        <p className="text-[15px]">
          Confirmée par téléphone. Préparez le colis : {articles(c)}, à livrer {c.livraison.mode === 'domicile' ? 'à domicile' : 'au bureau'} —{' '}
          {lieuComplet(c)}.
        </p>
        <button type="button" className={`${boutonPlein} mt-4`} onClick={() => expedier(c.id)}>
          Remettre au livreur
        </button>
        <p className="mt-2 text-[12.5px] text-[var(--gris-texte)]">
          Envoi simulé — en production, via le compte transporteur du marchand.
        </p>
        <Appels c={c} />
        <div className="mt-5 border-t border-[var(--ligne)] pt-3">
          {annulation ? (
            <ChoixMotif titre="Pourquoi annuler ?" motifs={MOTIFS_ANNULATION} valider="Annuler la commande" onValider={(m) => annuler(c.id, m)} onFermer={() => setAnnulation(false)} />
          ) : (
            <button type="button" className={boutonDiscret} onClick={() => setAnnulation(true)}>
              Annuler la commande… <span className="font-normal text-[var(--gris-texte)]">(le stock est remis)</span>
            </button>
          )}
        </div>
      </Bloc>
    );
  }

  if (c.statut === 'expediee') {
    return (
      <Bloc titre="Chez le livreur" id="b-actions">
        {c.envoi ? (
          <p className="text-[15px]">
            Suivi <b className="tabular-nums">{c.envoi.numero}</b>, remis {quand(c.envoi.date)}.
          </p>
        ) : (
          <p className="text-[15px]">Remis au livreur.</p>
        )}
        <p className="mt-1 text-[12.5px] text-[var(--gris-texte)]">Envoi simulé — en production, via le compte transporteur du marchand.</p>
        {retour ? (
          <div className="mt-4">
            <ChoixMotif titre="Pourquoi le colis revient-il ?" motifs={MOTIFS_RETOUR} valider="Marquer retournée" onValider={(m) => marquerRetournee(c.id, m)} onFermer={() => setRetour(false)} />
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={boutonPlein} onClick={() => marquerLivree(c.id)}>
              Livrée et payée
            </button>
            <button type="button" className={boutonCreux} onClick={() => setRetour(true)}>
              Colis retourné…
            </button>
          </div>
        )}
      </Bloc>
    );
  }

  const fin: Record<string, string> = {
    livree: `Livrée et payée${c.historique.length ? `, ${quand(c.historique[c.historique.length - 1].date)}` : ''}.`,
    retournee: `Colis revenu${c.motif ? ` — ${c.motif.toLowerCase()}` : ''}. Le stock a été remis.`,
    annulee: `Annulée${c.motif ? ` — ${c.motif.toLowerCase()}` : ''}.`,
  };
  return (
    <Bloc titre={LIBELLE_STATUT[c.statut]} id="b-actions">
      <p className="text-[15px]">{fin[c.statut]}</p>
      <Appels c={c} />
    </Bloc>
  );
}

function messageConfirmation(c: Commande) {
  return `Bonjour ${prenom(c)}, ici Nadâ. Je vous confirme votre commande ${c.id} : ${articles(c)}. Total ${formatDA(c.total)}, à payer au livreur. Livraison : ${lieuComplet(c)}. Pouvez-vous me confirmer ? Merci !`;
}

/** « Appeler » n'appelle jamais : une petite fenêtre explique pourquoi. */
function BoutonAppeler({ c }: { c: Commande }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={boutonPlein} onClick={() => ref.current?.showModal()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
        Appeler
      </button>
      <dialog
        ref={ref}
        aria-labelledby={`d-${c.id}`}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="w-[min(92vw,420px)] rounded-[18px] bg-[var(--creme)] p-6 text-[var(--encre)] backdrop:bg-[rgba(29,26,23,.45)]"
      >
        <h2 id={`d-${c.id}`} className="text-[28px]">Démonstration</h2>
        <p className="mt-2 text-[15.5px]">
          En production, ce bouton appelle le client.{c.exemple ? ' Numéro masqué ici.' : ''}
        </p>
        <form method="dialog" className="mt-5 text-end">
          <button className={boutonPlein} autoFocus>Compris</button>
        </form>
      </dialog>
    </>
  );
}

/** Le script d'appel, rempli avec la commande. */
function Script({ c }: { c: Commande }) {
  const delai = c.livraison.delai || delaiEstime(c.livraison.codeWilaya);
  const etapes = [
    `« Bonjour, je suis bien avec ${prenom(c)} ? Ici Nadâ, parfums et soins. Je vous appelle pour votre commande. »`,
    `« Vous avez choisi ${articles(c)}. »`,
    `« Je vous confirme l’adresse : ${lieuComplet(c)}. »`,
    `« Le total est de ${formatDA(c.total)}, en espèces au livreur. Vous pourrez ouvrir le colis avant de payer. »`,
    `« Le colis arrive ${delai} ; le livreur vous appellera avant de passer. C’est bon pour vous ? »`,
  ];
  return (
    <details className="group mt-5 rounded-[12px] bg-[var(--creme-2)]">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 text-[14.5px] font-bold">
        Script d’appel
        <span aria-hidden="true" className="transition-transform group-open:rotate-45">+</span>
      </summary>
      <ol className="space-y-2 px-4 pb-4 text-[14.5px]">
        {etapes.map((e, i) => (
          <li key={i} className="flex gap-3">
            <span className="nd-italique w-4 flex-none text-[17px] text-[var(--ambre-texte)]">{i + 1}</span>
            <span>{e}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}

function Appels({ c }: { c: Commande }) {
  if (!c.appels?.length) return null;
  return (
    <div className="mt-4">
      <h3 className="nd-sans text-[13px] font-bold uppercase tracking-[.16em] text-[var(--gris-texte)]">
        Appels ({c.appels.length})
      </h3>
      <ol className="mt-1.5 space-y-1 text-[14px]">
        {c.appels.map((a, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span>{LIBELLE_APPEL[a.issue]}</span>
            <span className="text-[var(--gris-texte)]">{quand(a.date)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChoixMotif({
  titre,
  motifs,
  valider,
  onValider,
  onFermer,
}: {
  titre: string;
  motifs: string[];
  valider: string;
  onValider: (m: string) => void;
  onFermer: () => void;
}) {
  const [motif, setMotif] = useState('');
  const premier = useRef<HTMLInputElement>(null);
  useEffect(() => premier.current?.focus(), []);
  return (
    <fieldset>
      <legend className="text-[15px] font-bold">{titre}</legend>
      <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {motifs.map((m, i) => (
          <label key={m} className="flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-[10px] px-2 text-[14.5px] hover:bg-[var(--creme-2)]">
            <input ref={i === 0 ? premier : undefined} type="radio" name="motif" value={m} checked={motif === m} onChange={() => setMotif(m)} className="h-[18px] w-[18px] accent-[var(--vert)]" />
            {m}
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" disabled={!motif} onClick={() => onValider(motif)} className={`${boutonPlein} disabled:opacity-40`}>
          {valider}
        </button>
        <button type="button" onClick={onFermer} className={boutonDiscret}>
          Garder la commande
        </button>
      </div>
    </fieldset>
  );
}

const MOTIFS_LISTE_NOIRE = ['Colis refusé sans raison', 'Commandes fantaisistes répétées', 'Propos insultants', 'Autre'];

function Client({ c, enListeNoire }: { c: Commande; enListeNoire: boolean }) {
  const [ajout, setAjout] = useState(false);
  const l = c.livraison;
  return (
    <Bloc titre="Client" id="b-client">
      <dl className="grid grid-cols-1 gap-3 text-[15px] sm:grid-cols-2">
        <div><dt className="text-[12px] font-bold uppercase tracking-[.16em] text-[var(--gris-texte)]">Nom</dt><dd className="mt-0.5 font-semibold">{c.client.nom}</dd></div>
        <div><dt className="text-[12px] font-bold uppercase tracking-[.16em] text-[var(--gris-texte)]">Mobile</dt><dd className="mt-0.5 tabular-nums">{telephoneAffiche(c)}</dd></div>
        <div className="sm:col-span-2">
          <dt className="text-[12px] font-bold uppercase tracking-[.16em] text-[var(--gris-texte)]">{l.mode === 'domicile' ? 'Livraison à domicile' : 'Au bureau du livreur'}</dt>
          <dd className="mt-0.5">
            {l.mode === 'domicile' ? <>{l.adresse}<br /></> : <>Bureau {de(l.lieuBureau ?? l.commune)}<br /></>}
            {l.commune}, wilaya {de(l.wilaya)} ({String(l.codeWilaya).padStart(2, '0')})
          </dd>
        </div>
      </dl>
      <div className="mt-4 border-t border-[var(--ligne)] pt-3">
        {enListeNoire ? (
          <p className="flex flex-wrap items-center gap-x-3 text-[14px]">
            <b className="text-[var(--erreur)]">Sur la liste noire.</b>
            <button type="button" className={boutonDiscret} onClick={() => retirerListeNoire(c.client.telephone)}>
              Retirer de la liste noire
            </button>
          </p>
        ) : ajout ? (
          <ChoixMotif
            titre="Ajouter ce numéro à la liste noire"
            motifs={MOTIFS_LISTE_NOIRE}
            valider="Ajouter à la liste noire"
            onValider={(m) => {
              ajouterListeNoire(c.client.telephone, c.client.nom, m);
              setAjout(false);
            }}
            onFermer={() => setAjout(false)}
          />
        ) : (
          <button type="button" className={boutonDiscret} onClick={() => setAjout(true)}>
            Ajouter à la liste noire…
          </button>
        )}
      </div>
    </Bloc>
  );
}

function Contenu({ c }: { c: Commande }) {
  const code = c.codePromo ? remiseCode(c) : 0;
  return (
    <Bloc titre="La commande" id="b-contenu">
      <ul className="space-y-3">
        {c.lignes.map((l) => {
          const p = produit(l.slug);
          return (
            <li key={l.slug} className="flex justify-between gap-4 text-[15px]">
              <span className="flex gap-2.5">
                <span className="nd-pastille mt-[7px]" style={{ ['--accent' as string]: p?.accent }} />
                <span>
                  <span className="nd-serif text-[20px] font-semibold leading-tight">{l.nom}</span>
                  <span className="block text-[13px] text-[var(--gris-texte)]">
                    {l.contenance} × {l.quantite}
                    {l.remise ? ` · offre −${l.remise} %` : ''}
                  </span>
                </span>
              </span>
              <span className="nd-prix whitespace-nowrap">{formatDA(montantLigne(l))}</span>
            </li>
          );
        })}
      </ul>
      <dl className="mt-4 space-y-1 border-t border-[var(--ligne)] pt-3 text-[14.5px]">
        {code > 0 ? (
          <div className="flex justify-between"><dt>Code {c.codePromo}</dt><dd className="nd-prix font-normal">−{formatDA(code)}</dd></div>
        ) : null}
        <div className="flex justify-between"><dt>Livraison</dt><dd className="nd-prix font-normal">{c.livraison.frais === 0 ? 'offerte' : formatDA(c.livraison.frais)}</dd></div>
        <div className="flex items-baseline justify-between border-t border-[var(--ligne)] pt-2">
          <dt className="font-bold">À encaisser</dt>
          <dd className="nd-prix text-[22px]">{formatDA(c.total)}</dd>
        </div>
      </dl>
    </Bloc>
  );
}

function Historique({ c }: { c: Commande }) {
  return (
    <Bloc titre="Historique" id="b-historique">
      <ol className="relative space-y-3 border-s border-[var(--ligne)] ps-4">
        {[...c.historique].reverse().map((h, i) => (
          <li key={i} className="relative text-[14.5px]">
            <span className={`absolute -start-[21px] top-[7px] h-[9px] w-[9px] rounded-full ${i === 0 ? 'bg-[var(--encre)]' : 'bg-[var(--creme-3)]'}`} aria-hidden="true" />
            <span className="font-semibold">{h.statut === 'nouvelle' ? 'Commande reçue' : LIBELLE_STATUT[h.statut]}</span>
            {h.note ? <span className="text-[var(--gris-texte)]"> — {h.note}</span> : null}
            <span className="block text-[13px] text-[var(--gris-texte)]">{quand(h.date)}</span>
          </li>
        ))}
      </ol>
    </Bloc>
  );
}
