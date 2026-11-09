"use client";

import { MotionConfig } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { soinParId, type SoinId } from "@/content/demos/rendezvous/soins";
import { amorce, reference } from "@/lib/demos/rendezvous/amorce";
import { creneauxDuJour } from "@/lib/demos/rendezvous/creneaux";
import { instantCabinet } from "@/lib/demos/rendezvous/temps";
import type { Attente, Liberation, Patient, RendezVous } from "@/lib/demos/rendezvous/types";
import { useMaintenant } from "@/components/demo/rendezvous/Horloge";

/**
 * État de la démonstration, en mémoire dans le navigateur.
 * Rien n’est envoyé à un serveur ; tout repart de zéro au rechargement.
 */
export interface Selection {
  readonly soinId: SoinId | null;
  readonly jour: string | null;
  readonly debut: number | null;
}

interface Etat {
  readonly rendezVous: readonly RendezVous[];
  readonly attentes: readonly Attente[];
  readonly liberations: readonly Liberation[];
  readonly selection: Selection;
  /** Identifiant du rendez-vous qui vient d’être confirmé, affiché dans le récapitulatif. */
  readonly confirmation: string | null;
}

type Action =
  | { readonly type: "selection"; readonly selection: Selection }
  | { readonly type: "soin"; readonly soinId: SoinId; readonly jour?: string | null }
  | { readonly type: "jour"; readonly jour: string }
  | { readonly type: "heure"; readonly debut: number }
  | { readonly type: "confirmer"; readonly rendezVous: RendezVous }
  | { readonly type: "nouvelle" }
  | { readonly type: "attente"; readonly attente: Attente }
  | { readonly type: "annuler"; readonly id: string; readonly liberation: Liberation };

function reducteur(etat: Etat, action: Action): Etat {
  switch (action.type) {
    case "selection":
      return { ...etat, selection: action.selection, confirmation: null };
    case "soin":
      return {
        ...etat,
        confirmation: null,
        selection: {
          soinId: action.soinId,
          jour: action.jour === undefined ? etat.selection.jour : action.jour,
          debut: null,
        },
      };
    case "jour":
      return { ...etat, confirmation: null, selection: { ...etat.selection, jour: action.jour, debut: null } };
    case "heure":
      return { ...etat, confirmation: null, selection: { ...etat.selection, debut: action.debut } };
    case "confirmer":
      return {
        ...etat,
        rendezVous: [...etat.rendezVous, action.rendezVous],
        selection: { ...etat.selection, debut: null },
        confirmation: action.rendezVous.id,
      };
    case "nouvelle":
      return { ...etat, confirmation: null, selection: { ...etat.selection, debut: null } };
    case "attente":
      return { ...etat, attentes: [...etat.attentes, action.attente] };
    case "annuler": {
      const prevenu = action.liberation.prevenu;
      return {
        ...etat,
        // La personne en attente est prévenue d’abord, puis le créneau est rendu.
        attentes: prevenu ? etat.attentes.filter((a) => a.id !== prevenu.id) : etat.attentes,
        rendezVous: etat.rendezVous.map((r) =>
          r.id === action.id ? { ...r, statut: "annule" as const } : r,
        ),
        liberations: [...etat.liberations, action.liberation],
      };
    }
  }
}

interface Contexte extends Etat {
  /** Règle le soin ; garde le jour choisi sauf indication contraire. */
  choisirSoin: (soinId: SoinId, jour?: string | null) => void;
  choisirJour: (jour: string) => void;
  choisirHeure: (debut: number) => void;
  choisirCreneau: (soinId: SoinId, jour: string, debut: number) => void;
  /** Confirme la sélection en cours. Renvoie null si le créneau n’est plus libre. */
  confirmer: (patient: Patient) => RendezVous | null;
  nouvelleReservation: () => void;
  inscrireAttente: (jour: string, soinId: SoinId, telephone: string) => Attente;
  annuler: (id: string) => Liberation | null;
}

const ContexteReservation = createContext<Contexte | null>(null);

let compteur = 0;
function identifiant(prefixe: string): string {
  compteur += 1;
  return `${prefixe}-${Date.now().toString(36)}-${compteur}`;
}

export function ReservationProvider({ children }: { children: ReactNode }) {
  const maintenant = useMaintenant();
  // L’agenda illustratif part de l’heure fournie par le serveur : même rendu des deux côtés.
  const [etat, dispatch] = useReducer(reducteur, maintenant, (ms: number): Etat => {
    const depart = amorce(instantCabinet(ms));
    return {
      rendezVous: depart.rendezVous,
      attentes: depart.attentes,
      liberations: [],
      selection: { soinId: null, jour: null, debut: null },
      confirmation: null,
    };
  });

  // Dernier état connu, pour que les actions décident sans attendre un rendu.
  const courant = useRef(etat);
  courant.current = etat;
  const heure = useRef(maintenant);
  heure.current = maintenant;

  const choisirSoin = useCallback((soinId: SoinId, jour?: string | null) => {
    dispatch({ type: "soin", soinId, jour });
  }, []);

  const choisirJour = useCallback((jour: string) => dispatch({ type: "jour", jour }), []);

  const choisirHeure = useCallback((debut: number) => dispatch({ type: "heure", debut }), []);

  const choisirCreneau = useCallback((soinId: SoinId, jour: string, debut: number) => {
    dispatch({ type: "selection", selection: { soinId, jour, debut } });
  }, []);

  const confirmer = useCallback((patient: Patient): RendezVous | null => {
    const { selection, rendezVous } = courant.current;
    if (!selection.soinId || !selection.jour || selection.debut === null) return null;
    const soin = soinParId(selection.soinId);
    const libre = creneauxDuJour(soin, selection.jour, rendezVous, instantCabinet(heure.current)).some(
      (c) => c.debut === selection.debut && c.etat === "libre",
    );
    if (!libre) return null;
    const rdv: RendezVous = {
      id: identifiant("rdv"),
      reference: reference(),
      soinId: soin.id,
      fauteuil: soin.fauteuil,
      jour: selection.jour,
      debut: selection.debut,
      duree: soin.duree,
      statut: "confirme",
      patient,
      origine: "en-ligne",
    };
    dispatch({ type: "confirmer", rendezVous: rdv });
    return rdv;
  }, []);

  const nouvelleReservation = useCallback(() => dispatch({ type: "nouvelle" }), []);

  const inscrireAttente = useCallback((jour: string, soinId: SoinId, telephone: string) => {
    const attente: Attente = {
      id: identifiant("attente"),
      jour,
      fauteuil: soinParId(soinId).fauteuil,
      soinId,
      telephone,
      origine: "en-ligne",
    };
    dispatch({ type: "attente", attente });
    return attente;
  }, []);

  const annuler = useCallback((id: string): Liberation | null => {
    const rdv = courant.current.rendezVous.find((r) => r.id === id && r.statut === "confirme");
    if (!rdv) return null;
    const prevenu =
      courant.current.attentes.find((a) => a.jour === rdv.jour && a.fauteuil === rdv.fauteuil) ?? null;
    const liberation: Liberation = {
      id: identifiant("liberation"),
      jour: rdv.jour,
      fauteuil: rdv.fauteuil,
      soinId: rdv.soinId,
      debut: rdv.debut,
      duree: rdv.duree,
      instant: Date.now(),
      prevenu,
    };
    dispatch({ type: "annuler", id, liberation });
    return liberation;
  }, []);

  const valeur = useMemo<Contexte>(
    () => ({
      ...etat,
      choisirSoin,
      choisirJour,
      choisirHeure,
      choisirCreneau,
      confirmer,
      nouvelleReservation,
      inscrireAttente,
      annuler,
    }),
    [etat, choisirSoin, choisirJour, choisirHeure, choisirCreneau, confirmer, nouvelleReservation, inscrireAttente, annuler],
  );

  return (
    <ContexteReservation.Provider value={valeur}>
      {/* Les animations Framer Motion suivent la préférence « mouvement réduit » du système. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ContexteReservation.Provider>
  );
}

export function useReservation(): Contexte {
  const ctx = useContext(ContexteReservation);
  if (!ctx) throw new Error("useReservation doit être appelé sous ReservationProvider.");
  return ctx;
}

function attendre(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms));
}

function mouvementReduit(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fait défiler jusqu’à une ancre et y place le focus clavier. */
export function allerA(id: string) {
  const cible = document.getElementById(id);
  if (!cible) return;
  cible.scrollIntoView({ block: "start", behavior: mouvementReduit() ? "instant" : "smooth" });
  cible.focus({ preventScroll: true });
}

/**
 * Bascule entre la vue patient et la vue cabinet : un fondu, jamais un long
 * glissement de page. Le contenu s’efface, la page saute, le contenu revient.
 */
export async function basculerVers(cible: string | HTMLElement, bloc: ScrollLogicalPosition = "start") {
  const element = typeof cible === "string" ? document.getElementById(cible) : cible;
  const contenu = document.getElementById("contenu");
  if (!element) return;
  if (!contenu || mouvementReduit()) {
    element.scrollIntoView({ block: bloc, behavior: "instant" });
    element.focus({ preventScroll: true });
    return;
  }
  contenu.style.transition = "opacity 160ms ease";
  contenu.style.opacity = "0";
  await attendre(170);
  element.scrollIntoView({ block: bloc, behavior: "instant" });
  element.focus({ preventScroll: true });
  contenu.style.opacity = "1";
  await attendre(170);
  contenu.style.transition = "";
}
