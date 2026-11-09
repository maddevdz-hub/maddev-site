"use client";

import { Fragment, useEffect, useId, useReducer, useRef, type ReactNode } from "react";
import {
  avertissement,
  confidentialite,
  issues,
  premiereQuestion,
  questions,
  type IssueId,
  type QuestionId,
  type ReponseGuide,
  type Suite,
} from "@/content/demos/rendezvous/orientation";
import { soinParId } from "@/content/demos/rendezvous/soins";
import { useMaintenant } from "@/components/demo/rendezvous/Horloge";
import { premierCreneauLibre } from "@/lib/demos/rendezvous/creneaux";
import { formatDuree, formatHeure, typo } from "@/lib/demos/rendezvous/format";
import { instantCabinet, libelleJour } from "@/lib/demos/rendezvous/temps";
import { allerA, useReservation } from "./ReservationProvider";

/**
 * Guide d’orientation : trois questions au plus pour trouver le type de
 * rendez-vous. Il ne pose aucune question clinique et ne conclut à rien
 * d’autre qu’un rendez-vous. Tout reste dans le navigateur.
 */

type Ecran = Suite;

interface EtatGuide {
  readonly ouvert: boolean;
  /** Écrans parcourus ; le dernier est l’écran affiché. */
  readonly chemin: readonly Ecran[];
  /** Réponses données, conservées quand on revient en arrière. */
  readonly reponses: Readonly<Partial<Record<QuestionId, string>>>;
}

type ActionGuide =
  | { readonly type: "basculer" }
  | { readonly type: "repondre"; readonly question: QuestionId; readonly reponse: ReponseGuide }
  | { readonly type: "retour" }
  | { readonly type: "recommencer" };

const DEPART: Ecran = { question: premiereQuestion };

function reducteur(etat: EtatGuide, action: ActionGuide): EtatGuide {
  switch (action.type) {
    case "basculer":
      return { ...etat, ouvert: !etat.ouvert };
    case "repondre":
      return {
        ...etat,
        reponses: { ...etat.reponses, [action.question]: action.reponse.id },
        chemin: [...etat.chemin, action.reponse.suite],
      };
    case "retour":
      return etat.chemin.length > 1 ? { ...etat, chemin: etat.chemin.slice(0, -1) } : etat;
    case "recommencer":
      return { ...etat, chemin: [DEPART], reponses: {} };
  }
}

function idEcran(e: Ecran): string {
  return "question" in e ? `guide-question-${e.question}` : `guide-resultat-${e.issue}`;
}

/** Rang dans la barre de progression : besoin, précision, résultat. */
function rangDe(e: Ecran): 1 | 2 | 3 {
  if ("issue" in e) return 3;
  return e.question === premiereQuestion ? 1 : 2;
}

const NOMS_ETAPES = ["votre besoin", "précision", "résultat"] as const;

/** Tous les écrans possibles, empilés dans la même case de grille. */
const ECRANS: readonly Ecran[] = [
  ...(Object.keys(questions) as QuestionId[]).map((question) => ({ question })),
  ...(Object.keys(issues) as IssueId[]).map((issue) => ({ issue })),
];

export function GuideOrientation() {
  const [etat, dispatch] = useReducer(reducteur, { ouvert: false, chemin: [DEPART], reponses: {} });
  const corpsId = useId();
  const aFocaliser = useRef<string | null>(null);
  const actuel = etat.chemin[etat.chemin.length - 1];

  // Après chaque changement d’écran, le focus va au titre du nouvel écran.
  useEffect(() => {
    const id = aFocaliser.current;
    if (!id) return;
    aFocaliser.current = null;
    document.getElementById(id)?.focus();
  }, [etat.chemin, etat.ouvert]);

  function agir(action: ActionGuide, suivant: Ecran | null) {
    aFocaliser.current = suivant ? `${idEcran(suivant)}-titre` : null;
    dispatch(action);
  }

  return (
    <div data-visite="guide" className="carte p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-serif text-xl leading-snug text-ink sm:text-[1.4rem]">
            {typo("Vous ne savez pas quel rendez-vous prendre ?")}
          </h3>
          <p className="mt-1 text-[15px] text-ink-2">
            Trois questions au plus, pour trouver le rendez-vous qui correspond.
          </p>
        </div>
        <button
          type="button"
          className="bouton-secondaire shrink-0 sm:min-w-[11.5rem]"
          aria-expanded={etat.ouvert}
          aria-controls={corpsId}
          onClick={() => agir({ type: "basculer" }, etat.ouvert ? null : actuel)}
        >
          {etat.ouvert ? "Fermer le guide" : "Me laisser guider"}
        </button>
      </div>

      <div id={corpsId} hidden={!etat.ouvert}>
        {etat.ouvert ? (
          <>
            {/* Sous 640 px, la progression passe sur sa propre ligne, sous Retour et Recommencer. */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-2 gap-y-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => agir({ type: "retour" }, etat.chemin[etat.chemin.length - 2] ?? null)}
                className={`bouton-discret order-1 -ml-3 gap-1.5 px-3 text-[15px] ${
                  etat.chemin.length > 1 ? "" : "invisible"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 3.5L5.5 8l4.5 4.5" />
                </svg>
                Retour
              </button>
              <div className="order-3 w-full sm:order-2 sm:w-auto">
                <Progression rang={rangDe(actuel)} />
              </div>
              <button
                type="button"
                onClick={() => agir({ type: "recommencer" }, DEPART)}
                className="bouton-discret order-2 -mr-3 px-3 text-[15px] underline decoration-line-2 underline-offset-4 hover:decoration-current sm:order-3"
              >
                Recommencer
              </button>
            </div>

            {/* Tous les écrans occupent la même case : la hauteur réservée est celle du plus haut. */}
            <div data-visite="guide-ecrans" className="mt-5 grid">
              {ECRANS.map((e) => (
                <EcranGuide key={idEcran(e)} actif={idEcran(e) === idEcran(actuel)}>
                  {"question" in e ? (
                    <EcranQuestion
                      id={idEcran(e)}
                      question={e.question}
                      choisie={etat.reponses[e.question]}
                      repondre={(reponse) =>
                        agir({ type: "repondre", question: e.question, reponse }, reponse.suite)
                      }
                    />
                  ) : (
                    <EcranResultat id={idEcran(e)} issue={e.issue} />
                  )}
                </EcranGuide>
              ))}
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
              >
                <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
                <path d="M5.5 7V5.25a2.5 2.5 0 0 1 5 0V7" />
              </svg>
              {typo(confidentialite)}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Fondu croisé de 200 ms. L’écran masqué reste dans la grille pour que la
 * hauteur ne saute pas ; `invisible` le retire du clavier et des lecteurs
 * d’écran une fois le fondu terminé. L’écran entrant devient visible dès la
 * première image, seule son opacité est animée : le focus peut s’y poser
 * immédiatement. L’écran sortant ne capte plus aucun clic et passe dessous.
 */
function EcranGuide({ actif, children }: { actif: boolean; children: ReactNode }) {
  return (
    <div
      className={`col-start-1 row-start-1 ease-calme ${
        actif
          ? "visible z-[1] opacity-100 transition-opacity duration-200"
          : "pointer-events-none invisible opacity-0 transition-[opacity,visibility] [transition-delay:0ms,200ms] [transition-duration:200ms,0ms]"
      }`}
    >
      {children}
    </div>
  );
}

function Progression({ rang }: { rang: 1 | 2 | 3 }) {
  return (
    <div
      role="progressbar"
      aria-label="Progression du guide"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={rang}
      aria-valuetext={`Étape ${rang} sur 3, ${NOMS_ETAPES[rang - 1]}`}
      className="flex items-center gap-1.5"
    >
      <span aria-hidden="true" className="chiffre mr-2 text-sm text-ink-2 sm:hidden">
        {rang}/3
      </span>
      {[1, 2, 3].map((i) => (
        <Fragment key={i}>
          {i > 1 ? (
            <span
              aria-hidden="true"
              className={`h-px w-5 transition-colors duration-200 sm:w-8 ${
                i <= rang ? "bg-accent" : "bg-line-2"
              }`}
            />
          ) : null}
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full transition-colors duration-200 ${
              i < rang
                ? "bg-accent"
                : i === rang
                  ? "bg-accent ring-4 ring-accent-soft"
                  : "border border-trait"
            }`}
          />
        </Fragment>
      ))}
    </div>
  );
}

function EcranQuestion({
  id,
  question,
  choisie,
  repondre,
}: {
  id: string;
  question: QuestionId;
  choisie: string | undefined;
  repondre: (r: ReponseGuide) => void;
}) {
  const q = questions[question];
  return (
    <div>
      <h4
        id={`${id}-titre`}
        tabIndex={-1}
        className="font-serif text-2xl leading-tight text-ink focus:outline-none sm:text-[1.75rem]"
      >
        {typo(q.titre)}
      </h4>
      <ul className="mt-5 grid gap-2.5">
        {q.reponses.map((r) => {
          const pressee = choisie === r.id;
          return (
            <li key={r.id}>
              <button
                type="button"
                data-reponse={r.id}
                aria-pressed={pressee}
                onClick={() => repondre(r)}
                className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border px-5 py-3 text-left text-base leading-snug transition-colors duration-150 ${
                  pressee
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-trait bg-surface text-ink hover:bg-surface-2"
                }`}
              >
                <span>{typo(r.libelle)}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`shrink-0 ${pressee ? "text-accent" : "text-ink-2"}`}
                >
                  {pressee ? <path d="M4 9.5l3.2 3L14 5.5" /> : <path d="M7 4.5L11.5 9 7 13.5" />}
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EcranResultat({ id, issue }: { id: string; issue: IssueId }) {
  const { rendezVous, choisirCreneau, choisirSoin } = useReservation();
  const maintenant = instantCabinet(useMaintenant());
  const resultat = issues[issue];
  const soin = soinParId(resultat.soin);
  const premier = premierCreneauLibre(soin, rendezVous, maintenant);

  return (
    <div>
      {resultat.accueil ? (
        <p className="mb-3 font-serif text-xl text-accent">{typo(resultat.accueil)}</p>
      ) : null}
      {resultat.urgence ? (
        <p className="inline-flex items-center gap-2 rounded-full bg-alerte-soft px-3 py-1 text-sm font-medium text-alerte">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-alerte-vif" />
          Urgence · créneau le plus proche
        </p>
      ) : (
        <p className="etiquette">Le rendez-vous qui correspond</p>
      )}
      <h4
        id={`${id}-titre`}
        tabIndex={-1}
        className="mt-3 font-serif text-[1.6rem] leading-tight text-ink focus:outline-none sm:text-[1.75rem]"
      >
        {soin.nom}
      </h4>
      <p className="mt-2 leading-relaxed text-ink-2">{typo(resultat.raison)}</p>

      <div
        data-visite="guide-creneau"
        className={`mt-5 rounded-xl px-4 py-3 ${resultat.urgence ? "bg-alerte-soft" : "bg-surface-2"}`}
      >
        <p className="flex items-baseline justify-between gap-4 text-sm text-ink-2">
          <span>Premier créneau disponible</span>
          <span className="chiffre text-base text-ink">
            <span className="sr-only">Durée : </span>
            {formatDuree(soin.duree)}
          </span>
        </p>
        <p className="chiffre mt-1 text-xl text-ink first-letter:uppercase">
          {premier
            ? `${libelleJour(premier.jour, maintenant.jour)} · ${formatHeure(premier.debut)}`
            : "Aucun créneau en ligne pour le moment"}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!premier}
          onClick={() => {
            if (!premier) return;
            choisirCreneau(soin.id, premier.jour, premier.debut);
            allerA("recapitulatif");
          }}
          className="bouton-primaire disabled:cursor-not-allowed disabled:opacity-60"
        >
          Réserver ce créneau
        </button>
        <button
          type="button"
          onClick={() => {
            choisirSoin(soin.id);
            allerA("reservation-jour");
          }}
          className="bouton-secondaire"
        >
          Choisir un autre horaire
        </button>
      </div>

      <p className="mt-4 text-sm text-ink-2">{typo(avertissement)}</p>
    </div>
  );
}
