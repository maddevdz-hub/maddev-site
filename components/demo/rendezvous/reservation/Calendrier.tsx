"use client";

import { useEffect, useId, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { reglages } from "@/content/demos/rendezvous/reglages";
import { soinParId, soins, type Soin } from "@/content/demos/rendezvous/soins";
import { useMaintenant } from "@/components/demo/rendezvous/Horloge";
import {
  creneauxDuJour,
  joursDeLaSemaine,
  nombreSemaines,
  premierJourLibre,
  semaineDuJour,
  statutDuJour,
  type Creneau,
} from "@/lib/demos/rendezvous/creneaux";
import { formatDuree, formatHeure, typo } from "@/lib/demos/rendezvous/format";
import { normaliserTelephone } from "@/lib/demos/rendezvous/telephone";
import { formatJourLong, instantCabinet, jourDansPhrase, jourSemaineDe, type InstantCabinet } from "@/lib/demos/rendezvous/temps";
import { allerA, useReservation } from "./ReservationProvider";

const JOURS_COURTS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const NOMS_SEMAINES = ["Cette semaine", "Semaine suivante", "Dans deux semaines", "Dans trois semaines"];
/** Durée pendant laquelle un créneau libéré est signalé côté patient. */
const SIGNAL_LIBERATION_MS = 15_000;

function Etape({
  id,
  numero,
  titre,
  aside,
  children,
}: {
  id: string;
  numero: string;
  titre: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 id={id} tabIndex={-1} className="flex items-baseline gap-3 focus:outline-none">
          <span className="chiffre text-sm text-accent">{numero}</span>
          <span className="font-serif text-2xl text-ink">{titre}</span>
        </h3>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function Calendrier() {
  const { selection, rendezVous, choisirSoin, choisirJour } = useReservation();
  const maintenant = instantCabinet(useMaintenant());
  const soin = selection.soinId ? soinParId(selection.soinId) : null;
  const [semaine, setSemaine] = useState(0);
  const total = nombreSemaines(maintenant);
  const jours = joursDeLaSemaine(maintenant, semaine);
  const aujourdhui = maintenant.jour;

  // Un jour choisi ailleurs (guide, carte de soin) amène la bonne semaine.
  useEffect(() => {
    if (selection.jour) setSemaine(semaineDuJour(instantCabinet(Date.now()), selection.jour));
  }, [selection.jour]);

  return (
    <div data-visite="calendrier" className="space-y-12">
      <Etape id="reservation-soin" numero="01" titre="Soin">
        <div role="group" aria-label="Soin" className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-3">
          {soins.map((s) => {
            const actif = selection.soinId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                data-soin={s.id}
                aria-pressed={actif}
                onClick={() =>
                  choisirSoin(
                    s.id,
                    selection.jour ?? premierJourLibre(s, rendezVous, maintenant, jours) ?? null,
                  )
                }
                className={`flex min-h-16 flex-col items-start justify-center gap-0.5 rounded-xl border px-4 py-2.5 text-left transition-colors duration-150 ${
                  actif ? "border-accent bg-accent-soft" : "border-trait bg-surface hover:bg-surface-2"
                }`}
              >
                <span className="text-[15px] font-medium leading-snug text-ink">{s.nom}</span>
                <span className="chiffre text-sm text-ink-2">{formatDuree(s.duree)}</span>
              </button>
            );
          })}
        </div>
      </Etape>

      <Etape
        id="reservation-jour"
        numero="02"
        titre="Jour"
        aside={
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="bouton-discret disabled:opacity-40"
              disabled={semaine === 0}
              onClick={() => setSemaine((n) => Math.max(0, n - 1))}
              aria-label="Semaine précédente"
            >
              <Chevron sens="gauche" />
            </button>
            <p className="min-w-[9.5rem] text-center text-sm text-ink-2" aria-live="polite">
              {NOMS_SEMAINES[semaine] ?? `Semaine ${semaine + 1}`}
            </p>
            <button
              type="button"
              className="bouton-discret disabled:opacity-40"
              disabled={semaine >= total - 1}
              onClick={() => setSemaine((n) => Math.min(total - 1, n + 1))}
              aria-label="Semaine suivante"
            >
              <Chevron sens="droite" />
            </button>
          </div>
        }
      >
        <div role="group" aria-label="Jour" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {jours.map((jour) => {
            const { statut, libres } = statutDuJour(soin, jour, rendezVous, maintenant);
            const inactif = statut === "ferme" || statut === "termine";
            const actif = selection.jour === jour;
            const numero = Number(jour.slice(8, 10));
            const etiquette =
              statut === "ferme"
                ? "Fermé"
                : statut === "termine"
                  ? "Terminé"
                  : !soin
                    ? " "
                    : statut === "complet"
                      ? "Complet"
                      : `${libres} ${libres > 1 ? "libres" : "libre"}`;
            return (
              <button
                key={jour}
                type="button"
                data-jour={jour}
                disabled={inactif}
                aria-pressed={actif}
                aria-describedby={statut === "ferme" ? "explication-fermeture" : undefined}
                aria-label={`${formatJourLong(jour)}${etiquette.trim() ? `, ${etiquette.toLowerCase()}` : ""}`}
                onClick={() => choisirJour(jour)}
                className={`flex min-h-[4.75rem] flex-col items-center justify-center rounded-xl border px-1 py-2 text-center transition-colors duration-150 ${
                  inactif
                    ? "cursor-not-allowed border-dashed border-line-2 bg-transparent"
                    : actif
                      ? "border-accent bg-accent-soft"
                      : "border-trait bg-surface hover:bg-surface-2"
                }`}
              >
                <span className="text-xs uppercase tracking-wider text-ink-2">
                  {jour === aujourdhui ? "auj." : JOURS_COURTS[jourSemaineDe(jour)]}
                </span>
                <span className={`chiffre mt-0.5 text-[1.35rem] leading-none ${inactif ? "text-ink-2" : "text-ink"}`}>
                  {numero}
                </span>
                <span
                  className={`mt-1 min-h-4 text-xs leading-4 ${
                    statut === "complet" ? "font-medium text-alerte" : "text-ink-2"
                  }`}
                >
                  {etiquette}
                </span>
              </button>
            );
          })}
        </div>
        <p id="explication-fermeture" className="mt-3 text-sm text-ink-2">
          {typo(reglages.horaires.messageFermeture)}
        </p>
      </Etape>

      <Etape id="reservation-horaire" numero="03" titre="Horaire">
        <div data-visite="horaires">
          {!soin ? (
            <Invite>Choisissez un soin : les horaires se calculent selon sa durée.</Invite>
          ) : !selection.jour ? (
            <Invite>Choisissez un jour.</Invite>
          ) : (
            <Horaires soin={soin} jour={selection.jour} maintenant={maintenant} />
          )}
        </div>
      </Etape>
    </div>
  );
}

function Invite({ children }: { children: ReactNode }) {
  return (
    <p className="flex min-h-24 items-center rounded-2xl border border-dashed border-line-2 px-5 text-ink-2">
      {typo(String(children))}
    </p>
  );
}

function Chevron({ sens }: { sens: "gauche" | "droite" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {sens === "gauche" ? <path d="M11 4.5L6.5 9l4.5 4.5" /> : <path d="M7 4.5L11.5 9 7 13.5" />}
    </svg>
  );
}

function Horaires({ soin, jour, maintenant }: { soin: Soin; jour: string; maintenant: InstantCabinet }) {
  const { rendezVous, liberations, selection, choisirHeure } = useReservation();
  const creneaux = creneauxDuJour(soin, jour, rendezVous, maintenant);
  const libres = creneaux.filter((c) => c.etat === "libre").length;
  const { midi } = reglages.horaires;
  const groupes: readonly { nom: string; creneaux: Creneau[] }[] = [
    { nom: "Matin", creneaux: creneaux.filter((c) => c.debut < midi) },
    { nom: "Après-midi", creneaux: creneaux.filter((c) => c.debut >= midi) },
  ];
  const recentes = liberations.filter(
    (l) => l.jour === jour && l.fauteuil === soin.fauteuil && Date.now() - l.instant < SIGNAL_LIBERATION_MS,
  );
  const libere = (c: Creneau) =>
    c.etat === "libre" && recentes.some((l) => l.debut < c.debut + soin.duree && l.debut + l.duree > c.debut);
  const jourTexte = jourDansPhrase(jour, maintenant.jour);

  if (creneaux.length === 0) {
    return <Invite>Plus aucun horaire ce jour-là. Choisissez un autre jour.</Invite>;
  }

  let rang = 0;
  return (
    <div>
      <p className="text-[15px] text-ink-2" aria-live="polite">
        {libres > 0
          ? `${libres} ${libres > 1 ? "horaires libres" : "horaire libre"} ${jourTexte} pour ${soin.nom.toLowerCase()}, ${formatDuree(soin.duree)}.`
          : `Journée complète ${jourTexte} pour ${soin.nom.toLowerCase()}.`}
      </p>

      {/* La clé change avec le soin et le jour : les créneaux sont recalculés et rejouent leur cascade. */}
      <div key={`${soin.id}-${jour}`} className="mt-5 space-y-6">
        {groupes.map((g) =>
          g.creneaux.length === 0 ? null : (
            <div key={g.nom} data-groupe={g.nom}>
              <h4 className="etiquette">{g.nom}</h4>
              <ul className="mt-3 grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 sm:grid-cols-5">
                {g.creneaux.map((c) => {
                  const style = { "--rang": rang++ } as CSSProperties;
                  const heure = formatHeure(c.debut);
                  if (c.etat === "pris") {
                    return (
                      <li key={c.debut}>
                        <button
                          type="button"
                          disabled
                          aria-label={`${heure}, déjà pris`}
                          style={style}
                          className="creneau-cascade chiffre flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-lg border border-dashed border-line-2 text-[17px] text-ink-2 line-through decoration-1"
                        >
                          {heure}
                        </button>
                      </li>
                    );
                  }
                  const actif = selection.debut === c.debut;
                  return (
                    <li key={c.debut}>
                      <button
                        type="button"
                        data-debut={c.debut}
                        aria-pressed={actif}
                        style={style}
                        onClick={() => {
                          choisirHeure(c.debut);
                          if (window.matchMedia("(max-width: 1023px)").matches) allerA("recapitulatif");
                        }}
                        className={`${libere(c) ? "creneau-libere" : "creneau-cascade"} chiffre flex min-h-11 w-full items-center justify-center rounded-lg border text-[17px] transition-colors duration-150 ${
                          actif
                            ? "border-accent bg-accent text-accent-ink"
                            : "border-trait bg-surface text-ink hover:border-accent hover:bg-accent-soft"
                        }`}
                      >
                        {heure}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
        )}
      </div>

      <p className="mt-5 text-sm text-ink-2">
        Barré : déjà pris. Les horaires trop courts pour ce soin ne sont pas proposés.
      </p>

      {libres === 0 ? <ListeAttente soin={soin} jour={jour} jourTexte={jourTexte} /> : null}
    </div>
  );
}

function ListeAttente({ soin, jour, jourTexte }: { soin: Soin; jour: string; jourTexte: string }) {
  const { attentes, inscrireAttente } = useReservation();
  const [saisie, setSaisie] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [inscrit, setInscrit] = useState<number | null>(null);
  const champId = useId();

  function envoyer(e: FormEvent) {
    e.preventDefault();
    const numero = normaliserTelephone(saisie);
    if (!numero) {
      setErreur("Numéro non reconnu : dix chiffres commençant par 05, 06 ou 07.");
      return;
    }
    setErreur(null);
    inscrireAttente(jour, soin.id, numero);
    setInscrit(attentes.filter((a) => a.jour === jour && a.fauteuil === soin.fauteuil).length + 1);
  }

  return (
    <div data-visite="liste-attente" className="mt-6 rounded-2xl border border-alerte-vif bg-alerte-soft p-5 sm:p-6">
      <p className="font-medium text-alerte">Journée complète pour ce soin</p>
      {inscrit === null ? (
        <>
          <p className="mt-1 leading-relaxed text-ink">
            {typo(
              `Laissez votre numéro WhatsApp : si un créneau se libère ${jourTexte}, vous êtes prévenu avant qu’il ne reparaisse en ligne.`,
            )}
          </p>
          <form onSubmit={envoyer} noValidate className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex-1">
              <label htmlFor={champId} className="sr-only">
                Numéro WhatsApp
              </label>
              <input
                id={champId}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0555 12 34 56"
                value={saisie}
                onChange={(e) => setSaisie(e.target.value)}
                aria-invalid={erreur ? true : undefined}
                aria-describedby={erreur ? `${champId}-erreur` : undefined}
                className="champ"
              />
              {erreur ? (
                <p id={`${champId}-erreur`} role="alert" className="mt-2 text-sm text-alerte">
                  {erreur}
                </p>
              ) : null}
            </div>
            <button type="submit" className="bouton-primaire shrink-0">
              M’inscrire sur la liste d’attente
            </button>
          </form>
        </>
      ) : (
        <p role="status" className="mt-1 leading-relaxed text-ink">
          {typo(
            `C’est noté : vous êtes ${inscrit === 1 ? "1re" : `${inscrit}e`} sur la liste d’attente pour ${jourTexte}. Nous vous prévenons par WhatsApp dès qu’un créneau se libère.`,
          )}
        </p>
      )}
    </div>
  );
}
