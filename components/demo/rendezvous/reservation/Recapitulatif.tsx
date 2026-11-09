"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { reglages } from "@/content/demos/rendezvous/reglages";
import { soinParId } from "@/content/demos/rendezvous/soins";
import { useMaintenant } from "@/components/demo/rendezvous/Horloge";
import { formatDuree, formatHeure, typo } from "@/lib/demos/rendezvous/format";
import { normaliserTelephone } from "@/lib/demos/rendezvous/telephone";
import { ajouterJours, instantCabinet, jourDansPhrase, libelleJour, type InstantCabinet } from "@/lib/demos/rendezvous/temps";
import type { RendezVous } from "@/lib/demos/rendezvous/types";
import { useReservation } from "./ReservationProvider";

const DEPLIEMENT = { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] as const };

/**
 * Récapitulatif de la sélection, formulaire de confirmation, puis carte de
 * confirmation avec l’aperçu du rappel WhatsApp. Le passage de l’un à l’autre
 * se déplie en 450 ms.
 */
export function Recapitulatif() {
  const { confirmation, rendezVous } = useReservation();
  const confirme = confirmation ? (rendezVous.find((r) => r.id === confirmation) ?? null) : null;

  return (
    <div
      id="recapitulatif"
      tabIndex={-1}
      data-visite="recapitulatif"
      aria-label="Récapitulatif de la réservation"
      className={`carte overflow-hidden p-6 shadow-carte focus:outline-none ${
        // Collant seulement s’il tient dans la hauteur de l’écran.
        confirme
          ? ""
          : "lg:[@media(min-height:800px)]:sticky lg:[@media(min-height:800px)]:top-[calc(var(--hauteur-fixe,5rem)+1.5rem)]"
      }`}
    >
      <AnimatePresence initial={false}>
        {confirme ? (
          <motion.div
            key="confirmation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={DEPLIEMENT}
          >
            <Confirmation rdv={confirme} />
          </motion.div>
        ) : (
          <motion.div
            key="selection"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ...DEPLIEMENT, duration: 0.3 }}
          >
            <SelectionEnCours />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectionEnCours() {
  const { selection } = useReservation();
  const aujourdhui = instantCabinet(useMaintenant()).jour;
  const soin = selection.soinId ? soinParId(selection.soinId) : null;
  const jour = selection.jour ? libelleJour(selection.jour, aujourdhui) : null;
  const heure = selection.debut !== null ? formatHeure(selection.debut) : null;

  const lignes: readonly { libelle: string; valeur: string | null; chiffre: boolean }[] = [
    { libelle: "Soin", valeur: soin?.nom ?? null, chiffre: false },
    { libelle: "Durée", valeur: soin ? formatDuree(soin.duree) : null, chiffre: true },
    { libelle: "Jour", valeur: jour, chiffre: false },
    { libelle: "Horaire", valeur: heure, chiffre: true },
  ];

  const annonce = soin
    ? `Sélection : ${soin.nom}${jour ? `, ${jour}` : ""}${heure ? ` à ${heure}` : ""}.`
    : "";

  return (
    <div>
      <h3 className="etiquette">Récapitulatif</h3>
      <dl className="mt-4 divide-y divide-line">
        {lignes.map((l) => (
          <div key={l.libelle} className="flex min-h-12 items-center justify-between gap-4 py-2">
            <dt className="text-ink-2">{l.libelle}</dt>
            <dd
              className={`text-right first-letter:uppercase ${l.chiffre ? "chiffre text-lg" : ""} ${
                l.valeur ? "text-ink" : "text-ink-2"
              }`}
            >
              {l.valeur ?? "—"}
            </dd>
          </div>
        ))}
      </dl>
      <p aria-live="polite" className="sr-only">
        {annonce}
      </p>

      {selection.debut !== null ? (
        <Formulaire />
      ) : (
        <p className="mt-6 text-sm leading-relaxed text-ink-2">
          Un rappel {reglages.rappel.canal} vous sera envoyé la veille du rendez-vous.
        </p>
      )}
    </div>
  );
}

function Formulaire() {
  const { confirmer } = useReservation();
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const id = useId();

  function envoyer(e: FormEvent) {
    e.preventDefault();
    const numero = normaliserTelephone(telephone);
    if (!numero) {
      setErreur("Numéro non reconnu : dix chiffres commençant par 05, 06 ou 07.");
      return;
    }
    const nom = prenom.trim();
    const rdv = confirmer({ telephone: numero, ...(nom ? { prenom: nom } : {}) });
    if (!rdv) {
      setErreur("Ce créneau vient d’être pris. Choisissez un autre horaire.");
      return;
    }
    setErreur(null);
  }

  return (
    <form onSubmit={envoyer} noValidate className="mt-5 space-y-4 border-t border-line pt-5">
      <div>
        <label htmlFor={`${id}-prenom`} className="text-sm font-medium text-ink">
          Prénom <span className="font-normal text-ink-2">(facultatif)</span>
        </label>
        <input
          id={`${id}-prenom`}
          name="prenom"
          autoComplete="given-name"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="champ mt-1.5"
        />
      </div>
      <div>
        <label htmlFor={`${id}-telephone`} className="text-sm font-medium text-ink">
          Numéro WhatsApp
        </label>
        <input
          id={`${id}-telephone`}
          name="telephone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0555 12 34 56"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={`${id}-aide${erreur ? ` ${id}-erreur` : ""}`}
          className="champ mt-1.5"
        />
        <p id={`${id}-aide`} className="mt-1.5 text-sm text-ink-2">
          {typo("Pour le rappel de la veille. Démonstration : rien n’est envoyé.")}
        </p>
        {erreur ? (
          <p id={`${id}-erreur`} role="alert" className="mt-1.5 text-sm text-alerte">
            {typo(erreur)}
          </p>
        ) : null}
      </div>
      <button type="submit" data-visite="confirmer" className="bouton-primaire w-full">
        Confirmer le rendez-vous
      </button>
    </form>
  );
}

/** Heure d’envoi du rappel : 24 h avant, ou tout de suite si le rendez-vous est plus proche. */
function envoiDuRappel(rdv: RendezVous, maintenant: InstantCabinet) {
  const veille = ajouterJours(rdv.jour, -Math.round(reglages.rappel.delaiHeures / 24));
  const dejaPasse =
    veille < maintenant.jour || (veille === maintenant.jour && rdv.debut <= maintenant.minutes);
  return dejaPasse
    ? { immediat: true as const, jour: maintenant.jour, minutes: maintenant.minutes }
    : { immediat: false as const, jour: veille, minutes: rdv.debut };
}

function Confirmation({ rdv }: { rdv: RendezVous }) {
  const { nouvelleReservation } = useReservation();
  const maintenant = instantCabinet(useMaintenant());
  const soin = soinParId(rdv.soinId);
  const titre = useRef<HTMLHeadingElement>(null);
  const envoi = envoiDuRappel(rdv, maintenant);
  const jourRdv = jourDansPhrase(rdv.jour, envoi.jour);

  useEffect(() => {
    titre.current?.focus({ preventScroll: true });
  }, []);

  const message = [
    rdv.patient.prenom ? `Bonjour ${rdv.patient.prenom},` : "Bonjour,",
    typo(
      `nous vous rappelons votre rendez-vous ${jourRdv} à ${formatHeure(rdv.debut)} : ${soin.nom.toLowerCase()} (${formatDuree(soin.duree)}).`,
    ),
    typo(`Adresse : ${reglages.cabinet.adresse}.`),
    typo(`Référence : ${rdv.reference}.`),
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9.5l3.2 3L14 5.5" />
          </svg>
        </span>
        <h3 ref={titre} tabIndex={-1} className="font-serif text-2xl text-ink focus:outline-none">
          Rendez-vous confirmé
        </h3>
      </div>

      <p className="mt-5 text-sm text-ink-2">Référence</p>
      <p className="chiffre text-3xl tracking-wide text-ink">{rdv.reference}</p>
      <p className="mt-3 text-ink">
        {soin.nom} · <span className="chiffre">{formatDuree(soin.duree)}</span>
      </p>
      <p className="text-ink first-letter:uppercase">
        {libelleJour(rdv.jour, maintenant.jour)} · <span className="chiffre">{formatHeure(rdv.debut)}</span>
      </p>

      <div data-visite="rappel-whatsapp" className="mt-6 rounded-2xl bg-surface-2 p-4">
        <p className="flex items-center gap-2 text-sm text-ink-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
            <path d="M3 12.5l.8-2.4A5.5 5.5 0 1 1 6 12.2L3 12.5Z" />
          </svg>
          <span>
            {envoi.immediat
              ? "Rappel WhatsApp · rendez-vous dans moins de 24 h, envoi immédiat"
              : `Rappel WhatsApp · envoi prévu ${jourDansPhrase(envoi.jour, maintenant.jour)} à ${formatHeure(envoi.minutes)}`}
          </span>
        </p>
        <div
          data-visite="bulle-whatsapp"
          className="mt-3 max-w-[22rem] rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink shadow-sm"
        >
          <p className="text-sm font-medium text-accent">{reglages.cabinet.nom}</p>
          <div data-visite="texte-rappel">
            {message.map((ligne) => (
              <p key={ligne} className="mt-1">
                {ligne}
              </p>
            ))}
          </div>
          <p className="chiffre mt-1 text-right text-xs text-ink-2">{formatHeure(envoi.minutes)}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink-2">
        {typo("Démonstration : cette réservation disparaît au rechargement de la page.")}
      </p>

      <button type="button" onClick={nouvelleReservation} className="bouton-secondaire mt-4 w-full">
        Prendre un autre rendez-vous
      </button>
    </div>
  );
}
