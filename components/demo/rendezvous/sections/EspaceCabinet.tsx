"use client";

import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { Section } from "@/components/demo/rendezvous/Section";
import { useMaintenant } from "@/components/demo/rendezvous/Horloge";
import { basculerVers, useReservation } from "@/components/demo/rendezvous/reservation/ReservationProvider";
import { reglages } from "@/content/demos/rendezvous/reglages";
import { soinParId } from "@/content/demos/rendezvous/soins";
import { journeeCabinet } from "@/lib/demos/rendezvous/creneaux";
import { FINE, formatDuree, formatHeure, formatNombre, typo } from "@/lib/demos/rendezvous/format";
import { masquerTelephone } from "@/lib/demos/rendezvous/telephone";
import { formatJourLong, instantCabinet } from "@/lib/demos/rendezvous/temps";
import type { Liberation, RendezVous } from "@/lib/demos/rendezvous/types";

type Etat = "termine" | "en-cours" | "a-venir";

function etatDe(r: RendezVous, jour: string, aujourdhui: string, minutes: number): Etat {
  if (jour !== aujourdhui) return "a-venir";
  if (r.debut + r.duree <= minutes) return "termine";
  if (r.debut <= minutes) return "en-cours";
  return "a-venir";
}

function texteMessage(l: Liberation): string {
  const heure = formatHeure(l.debut);
  return l.prevenu
    ? `Rendez-vous de ${heure} annulé. Le créneau est de nouveau réservable, et la personne en attente (${masquerTelephone(l.prevenu.telephone)}) vient d’être prévenue par WhatsApp.`
    : `Rendez-vous de ${heure} annulé. Le créneau est de nouveau réservable en ligne.`;
}

/** Sert seulement à réserver la hauteur du message le plus long. */
const MESSAGE_LE_PLUS_LONG: Liberation = {
  id: "fantome",
  jour: "2000-01-01",
  fauteuil: 1,
  soinId: "pose-appareil",
  debut: 10 * 60 + 40,
  duree: 60,
  instant: 0,
  prevenu: {
    id: "fantome",
    jour: "2000-01-01",
    fauteuil: 1,
    soinId: "pose-appareil",
    telephone: "0555000000",
    origine: "amorce",
  },
};

function MessageAnnulation({
  liberation,
  voirCotePatient,
}: {
  liberation: Liberation;
  voirCotePatient: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <span aria-hidden="true" className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9.5l3.2 3L14 5.5" />
        </svg>
      </span>
      <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="max-w-[42rem] text-[15px] leading-relaxed text-ink">{typo(texteMessage(liberation))}</p>
        <button
          type="button"
          data-visite={liberation.id === "fantome" ? undefined : "voir-cote-patient"}
          tabIndex={liberation.id === "fantome" ? -1 : undefined}
          onClick={voirCotePatient}
          className="bouton-secondaire min-h-11 shrink-0 px-4 text-sm"
        >
          Voir côté patient
        </button>
      </div>
    </div>
  );
}

export function EspaceCabinet() {
  const { rendezVous, attentes, annuler, choisirSoin } = useReservation();
  const maintenant = instantCabinet(useMaintenant());
  const jour = journeeCabinet(maintenant);
  const aujourdhui = jour === maintenant.jour;
  const [message, setMessage] = useState<Liberation | null>(null);

  const agenda = rendezVous
    .filter((r) => r.jour === jour && r.statut === "confirme")
    .sort((a, b) => a.debut - b.debut || a.fauteuil - b.fauteuil);
  const { ouverture, fermeture } = reglages.horaires;
  const capacite = (fermeture - ouverture) * reglages.fauteuils.length;
  const remplissage = Math.round((agenda.reduce((t, r) => t + r.duree, 0) / capacite) * 100);
  const enAttente = attentes.filter((a) => a.jour === jour).length;

  function annulerRendezVous(r: RendezVous) {
    const liberation = annuler(r.id);
    if (liberation) setMessage(liberation);
  }

  function voirCotePatient() {
    if (!message) return;
    choisirSoin(message.soinId, message.jour);
    // Deux images : le calendrier a le temps d’afficher les créneaux recalculés.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const libere = document.querySelector<HTMLElement>(".creneau-libere");
        void (libere ? basculerVers(libere, "center") : basculerVers("reservation-horaire"));
      }),
    );
  }

  return (
    <Section
      id="cabinet"
      numero="04"
      nom="Espace cabinet"
      titre="La journée du cabinet, en un coup d’œil."
      chapo="L’écran de l’accueil : rendez-vous du jour, remplissage et liste d’attente. Une annulation libère le créneau aussitôt, côté patient."
    >
      <div data-visite="cabinet" className="carte overflow-hidden shadow-carte">
        <div data-visite="cabinet-tete">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line bg-surface-2 px-5 py-4 sm:px-6">
          <div>
            <p className="etiquette">{aujourdhui ? "Aujourd’hui" : "Prochaine journée"}</p>
            <p className="mt-1 font-serif text-2xl text-ink first-letter:uppercase">{formatJourLong(jour)}</p>
          </div>
          <p className="text-sm text-ink-2">
            Heure d’Alger ·{" "}
            <span className="chiffre text-base text-ink">{formatHeure(maintenant.minutes)}</span>
          </p>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-line border-b border-line">
          <div className="flex min-w-0 flex-col px-3 py-5 sm:px-6">
            <dt className="order-2 mt-1 whitespace-nowrap text-xs text-ink-2 sm:text-sm">Rendez-vous</dt>
            <dd className="order-1 chiffre text-3xl leading-none text-ink">{agenda.length}</dd>
          </div>
          <div className="flex min-w-0 flex-col px-3 py-5 sm:px-6">
            <dt className="order-2 mt-1 whitespace-nowrap text-xs text-ink-2 sm:text-sm">Remplissage</dt>
            <dd className="order-1 chiffre text-3xl leading-none text-ink">
              {formatNombre(remplissage)}
              <span className="text-xl text-ink-2">{FINE}%</span>
            </dd>
            <dd aria-hidden="true" className="order-3 mt-3 h-1 overflow-hidden rounded-full bg-line">
              <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.min(100, remplissage)}%` }} />
            </dd>
          </div>
          <div className="flex min-w-0 flex-col px-3 py-5 sm:px-6">
            <dt className="order-2 mt-1 whitespace-nowrap text-xs text-ink-2 sm:text-sm">En attente</dt>
            <dd className="order-1 chiffre text-3xl leading-none text-ink">{enAttente}</dd>
          </div>
        </dl>

        {/*
          Hauteur réservée : le message le plus long possible occupe la même case,
          invisible. Le vrai message remplace l’aide sans rien décaler, à toute largeur.
        */}
        <div data-visite="cabinet-message" className="grid items-center border-b border-line px-5 py-4 sm:px-6">
          <div aria-live="polite" className="col-start-1 row-start-1">
            {message ? (
              <MessageAnnulation liberation={message} voirCotePatient={voirCotePatient} />
            ) : (
              <p className="text-sm leading-relaxed text-ink-2">
                {typo(
                  "Annuler un rendez-vous rend son créneau réservable à l’instant côté patient et prévient la première personne en attente.",
                )}
              </p>
            )}
          </div>
          <div aria-hidden="true" className="invisible col-start-1 row-start-1">
            <MessageAnnulation liberation={MESSAGE_LE_PLUS_LONG} voirCotePatient={() => {}} />
          </div>
        </div>
        </div>

        {agenda.length === 0 ? (
          <p className="px-5 py-10 text-center text-ink-2 sm:px-6">Aucun rendez-vous ce jour-là.</p>
        ) : (
          <ol aria-label="Agenda de la journée" className="relative divide-y divide-line">
            <AnimatePresence initial={false} mode="popLayout">
              {agenda.map((r) => (
                <LigneAgenda
                  key={r.id}
                  rdv={r}
                  etat={etatDe(r, jour, maintenant.jour, maintenant.minutes)}
                  annuler={() => annulerRendezVous(r)}
                />
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>
    </Section>
  );
}

interface ProprietesLigne {
  rdv: RendezVous;
  etat: Etat;
  annuler: () => void;
}

// La référence DOM est transmise : AnimatePresence en a besoin pour faire sortir la ligne.
const LigneAgenda = forwardRef<HTMLLIElement, ProprietesLigne>(function LigneAgenda({ rdv, etat, annuler }, ref) {
  const soin = soinParId(rdv.soinId);
  const passe = etat === "termine";
  const patient = [
    rdv.patient.prenom,
    masquerTelephone(rdv.patient.telephone),
    rdv.origine === "en-ligne" ? "réservé en ligne" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <motion.li
      ref={ref}
      layout
      data-rdv={rdv.id}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
      transition={{ layout: { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] } }}
      className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-3 bg-surface px-5 py-3.5 sm:grid-cols-[5.5rem_minmax(0,1fr)_7rem_auto] sm:gap-x-5 sm:px-6"
    >
      <div>
        <p className={`chiffre text-lg leading-tight ${passe ? "text-ink-2" : "text-ink"}`}>{formatHeure(rdv.debut)}</p>
        <p className="chiffre text-sm text-ink-2">{formatDuree(rdv.duree)}</p>
      </div>
      <div className="min-w-0">
        <p className={`font-medium leading-snug sm:truncate ${passe ? "text-ink-2" : "text-ink"}`}>{soin.nom}</p>
        <p className="text-sm leading-snug text-ink-2 sm:truncate">
          <span className="sm:hidden">Fauteuil {rdv.fauteuil} · </span>
          {rdv.reference} · {patient}
        </p>
      </div>
      <p className="hidden text-sm text-ink-2 sm:block">Fauteuil {rdv.fauteuil}</p>
      <div className="flex justify-end">
        {etat === "a-venir" ? (
          <button
            type="button"
            data-annuler={rdv.id}
            onClick={annuler}
            aria-label={`Annuler le rendez-vous de ${formatHeure(rdv.debut)}, ${soin.nom}`}
            className="inline-flex min-h-11 items-center rounded-xl border border-trait px-3.5 text-sm font-medium text-ink transition-colors duration-150 hover:border-alerte hover:text-alerte"
          >
            Annuler
          </button>
        ) : etat === "en-cours" ? (
          <span className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent">En cours</span>
        ) : (
          <span className="text-sm text-ink-2">Terminé</span>
        )}
      </div>
    </motion.li>
  );
});
