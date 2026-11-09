"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { soinParId } from "@/content/demos/rendezvous/soins";
import { dureeEtapeMs, etapesVisite, saisieDemonstration, textesVisite } from "@/content/demos/rendezvous/visite";
import { useMaintenant } from "@/components/demo/rendezvous/Horloge";
import { useReservation } from "@/components/demo/rendezvous/reservation/ReservationProvider";
import { joursDeLaSemaine, joursReservables, journeeCabinet, libresDuJour } from "@/lib/demos/rendezvous/creneaux";
import { typo } from "@/lib/demos/rendezvous/format";
import { instantCabinet } from "@/lib/demos/rendezvous/temps";

/**
 * Visite guidée de /presentation.
 *
 * Elle manipule le vrai site : elle clique sur les vrais boutons, saisit dans
 * les vrais champs, et laisse le site réagir comme pour un patient. Chaque
 * étape défile jusqu’à sa zone, marque une pause, parle, agit, puis passe à
 * la suivante au bout de sept secondes. Un clic sur la page rend la main.
 */

type Mode = "attente" | "lecture" | "pause" | "libre" | "fin";
/** Un sélecteur, ou les premiers éléments d’une liste réunis dans un même halo. */
type Cible = string | { readonly selecteur: string; readonly premiers: number };

class Interruption extends Error {}

interface Zone {
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
}

function elementsDe(c: Cible): HTMLElement[] {
  if (typeof c === "string") {
    const e = document.querySelector<HTMLElement>(c);
    return e ? [e] : [];
  }
  return Array.from(document.querySelectorAll<HTMLElement>(c.selecteur)).slice(0, c.premiers);
}

function reunion(elements: HTMLElement[]): Zone | null {
  const rects = elements.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
  if (rects.length === 0) return null;
  const top = Math.min(...rects.map((r) => r.top));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return {
    top,
    bottom,
    left: Math.min(...rects.map((r) => r.left)),
    right: Math.max(...rects.map((r) => r.right)),
    height: bottom - top,
  };
}

function visible(b: HTMLElement): boolean {
  return b.offsetParent !== null && getComputedStyle(b).visibility !== "hidden";
}

const STYLE = `
.halo-visite {
  position: absolute; left: 0; top: 0; z-index: 30; pointer-events: none;
  border-radius: 22px; opacity: 0; transition: opacity 280ms ease;
  box-shadow:
    0 0 0 2px var(--accent),
    0 0 0 9px color-mix(in srgb, var(--accent) 16%, transparent),
    0 24px 60px -18px color-mix(in srgb, var(--accent) 50%, transparent);
}
.halo-visite[data-visible="oui"] { opacity: 1; }
.halo-visite[data-visible="non"] { transition: none; }
@keyframes remplissage-etape { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.jauge-etape { transform-origin: left center; transform: scaleX(0); }
.jauge-etape[data-etat="faite"] { transform: scaleX(1); }
.jauge-etape[data-etat="en-cours"], .jauge-etape[data-etat="pause"] {
  animation: remplissage-etape var(--duree) linear forwards;
}
.jauge-etape[data-etat="pause"] { animation-play-state: paused; }
`;

export default function VisiteGuidee() {
  const reservation = useReservation();
  const resa = useRef(reservation);
  resa.current = reservation;
  const ms = useMaintenant();
  const horloge = useRef(ms);
  horloge.current = ms;

  const [index, setIndex] = useState(0);
  const [mode, setModeAffiche] = useState<Mode>("attente");
  const modeRef = useRef<Mode>("attente");
  const [parle, setParle] = useState(false);
  const [depart, setDepart] = useState(0);
  const barre = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const cibleHalo = useRef<Cible | null>(null);
  const jeton = useRef(0);
  const debutParole = useRef(0);
  const reduit = useRef(false);

  const changerMode = useCallback((m: Mode) => {
    modeRef.current = m;
    setModeAffiche(m);
  }, []);

  // ——— Outils d’une étape ———————————————————————————————————————————

  /** Le halo s’éteint net : il ne traîne jamais à l’ancienne place pendant que la page bouge. */
  function eteindreHalo() {
    cibleHalo.current = null;
    if (halo.current) halo.current.dataset.visible = "non";
  }

  function verifier(j: number) {
    if (jeton.current !== j) throw new Interruption();
  }

  async function attendre(duree: number, j: number) {
    await new Promise((r) => window.setTimeout(r, duree));
    verifier(j);
  }

  async function image(j: number) {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    verifier(j);
  }

  /**
   * Attend que la page ne défile plus : le site peut lancer son propre
   * défilement (focus déplacé, ancre), qu’il faut laisser finir avant de mesurer.
   */
  async function stabilite(j: number, max = 1500) {
    const debut = performance.now();
    let precedent = window.scrollY;
    let immobile = 0;
    while (performance.now() - debut < max) {
      await image(j);
      const s = window.scrollY;
      immobile = Math.abs(s - precedent) < 0.5 ? immobile + 1 : 0;
      precedent = s;
      if (immobile >= 8) return;
    }
  }

  /** Zone de la fenêtre que ni l’en-tête fixe ni le bandeau de la visite ne recouvrent. */
  function zoneLibre() {
    const fixe = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hauteur-fixe")) || 0;
    const bas = window.innerHeight - (barre.current?.offsetHeight ?? 0);
    return { haut: fixe + 14, bas: bas - 14 };
  }

  async function defiler(y: number, j: number, fondu: boolean) {
    if (fondu && !reduit.current) {
      const contenu = document.getElementById("contenu");
      try {
        if (contenu) {
          contenu.style.transition = "opacity 160ms ease";
          contenu.style.opacity = "0";
        }
        await attendre(170, j);
        window.scrollTo({ top: y, behavior: "instant" });
      } finally {
        if (contenu) {
          contenu.style.opacity = "1";
          window.setTimeout(() => (contenu.style.transition = ""), 200);
        }
      }
      await attendre(170, j);
      return;
    }
    window.scrollTo({ top: y, behavior: reduit.current ? "instant" : "smooth" });
    const debut = performance.now();
    let precedent = window.scrollY;
    let immobile = 0;
    while (performance.now() - debut < 2200) {
      await image(j);
      const s = window.scrollY;
      if (Math.abs(s - y) < 2) return;
      immobile = Math.abs(s - precedent) < 0.5 ? immobile + 1 : 0;
      precedent = s;
      if (immobile > 12) return;
    }
  }

  /**
   * Amène la première cible qui tient entièrement entre l’en-tête et le
   * bandeau, vérifie après le défilement qu’elle est bien dégagée (un bloc
   * collant peut ne pas suivre), sinon essaie la suivante, plus serrée.
   * Pose ensuite le halo et marque une pause avant de parler.
   */
  async function montrer(cibles: readonly Cible[], j: number, options: { pause?: number; fondu?: boolean } = {}) {
    const { pause = 600, fondu = false } = options;
    await stabilite(j);
    const zone = zoneLibre();
    const dispo = zone.bas - zone.haut;
    const degagee = (u: Zone) => u.top >= zone.haut - 1 && u.bottom <= zone.bas + 1;
    let derniere: Cible | null = null;
    let premierDefilement = true;

    for (const c of cibles) {
      const u = reunion(elementsDe(c));
      if (!u) continue;
      derniere = c;
      if (u.height > dispo) continue;
      if (!degagee(u)) {
        eteindreHalo();
        const haut = u.top + window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const y = haut - zone.haut - (dispo - u.height) / 2;
        await defiler(Math.round(Math.max(0, Math.min(max, y))), j, fondu && premierDefilement);
        premierDefilement = false;
        await stabilite(j, 800);
      }
      const apres = reunion(elementsDe(c));
      if (apres && degagee(apres)) {
        cibleHalo.current = c;
        if (pause > 0) await attendre(reduit.current ? 150 : pause, j);
        return;
      }
    }

    // Rien ne tient : on aligne la plus petite cible sous l’en-tête.
    if (!derniere) return;
    const u = reunion(elementsDe(derniere));
    if (u && !degagee(u)) {
      eteindreHalo();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      await defiler(Math.round(Math.max(0, Math.min(max, u.top + window.scrollY - zone.haut))), j, fondu && premierDefilement);
    }
    cibleHalo.current = derniere;
    if (pause > 0) await attendre(reduit.current ? 150 : pause, j);
  }

  /** La cible tient-elle entière dans la zone libre ? */
  function tient(c: Cible): boolean {
    const u = reunion(elementsDe(c));
    const zone = zoneLibre();
    return !!u && u.height <= zone.bas - zone.haut;
  }

  function parler() {
    debutParole.current = performance.now();
    setParle(true);
    setDepart((d) => d + 1);
  }

  async function cliquer(selecteur: string, j: number, apres = 150) {
    const el = document.querySelector<HTMLElement>(selecteur);
    if (!el || (el instanceof HTMLButtonElement && el.disabled)) return false;
    el.click();
    await attendre(apres, j);
    return true;
  }

  async function cliquerTexte(texte: string, j: number, apres = 150) {
    const bouton = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
      (b) => b.textContent?.trim().startsWith(texte) && visible(b),
    );
    if (!bouton) return false;
    bouton.click();
    await attendre(apres, j);
    return true;
  }

  async function saisir(selecteur: string, texte: string, j: number) {
    const champ = document.querySelector<HTMLInputElement>(selecteur);
    if (!champ) return;
    const ecrire = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    let valeur = "";
    for (const lettre of texte) {
      valeur += lettre;
      ecrire?.call(champ, valeur);
      champ.dispatchEvent(new Event("input", { bubbles: true }));
      await attendre(reduit.current ? 0 : 32, j);
    }
  }

  /** Un jour de la semaine où la pose d’appareil tient, et où le contrôle a nettement plus de choix. */
  function jourDemonstration(): string | null {
    const m = instantCabinet(horloge.current);
    const { rendezVous } = resa.current;
    const pose = soinParId("pose-appareil");
    const controle = soinParId("controle-orthodontique");
    let meilleur: string | null = null;
    let ecart = -1;
    for (const jour of joursDeLaSemaine(m, 0)) {
      const p = libresDuJour(pose, jour, rendezVous, m);
      if (p < 1) continue;
      const c = libresDuJour(controle, jour, rendezVous, m);
      if (c - p > ecart) {
        ecart = c - p;
        meilleur = jour;
      }
    }
    return meilleur ?? joursReservables(m).find((jour) => libresDuJour(pose, jour, rendezVous, m) > 0) ?? null;
  }

  // ——— Les six étapes ——————————————————————————————————————————————

  const etapes: readonly ((j: number) => Promise<void>)[] = [
    // 1 · L’accueil, tel qu’un patient le découvre
    async (j) => {
      await montrer(["[data-visite=accueil-texte]", "[data-visite=accueil-chiffres]"], j);
      parler();
    },

    // 2 · La grille des soins
    async (j) => {
      await montrer(
        [
          "[data-visite=soins]",
          { selecteur: "[data-visite=soin]", premiers: 3 },
          { selecteur: "[data-visite=soin]", premiers: 2 },
          { selecteur: "[data-visite=soin]", premiers: 1 },
          "[data-visite=soin-resume]",
          "[data-visite=soin-dispo]",
        ],
        j,
      );
      parler();
    },

    // 3 · Pose d’appareil : les créneaux se recalculent sous les yeux
    async (j) => {
      if (resa.current.confirmation) resa.current.nouvelleReservation();
      resa.current.choisirSoin("controle-orthodontique", jourDemonstration());
      await attendre(250, j);
      await montrer(
        [
          "[data-visite=calendrier]",
          "[data-visite=horaires]",
          { selecteur: "[data-visite=horaires] [data-groupe]", premiers: 1 },
          { selecteur: "[data-visite=horaires] [data-groupe] li", premiers: 9 },
          { selecteur: "[data-visite=horaires] [data-groupe] li", premiers: 6 },
        ],
        j,
      );
      parler();
      await attendre(1500, j);
      // Pendant que les créneaux se recalculent, le halo s’efface puis se repose sur ce qui reste.
      eteindreHalo();
      await cliquer('[data-soin="pose-appareil"]', j, 400);
      // Sur petit écran, on suit le groupe où reste un horaire possible.
      const groupe = document
        .querySelector("[data-visite=horaires] [data-debut]")
        ?.closest("[data-groupe]")
        ?.getAttribute("data-groupe");
      if (groupe) {
        await montrer(
          [
            "[data-visite=horaires]",
            `[data-visite=horaires] [data-groupe="${groupe}"]`,
            "[data-visite=horaires] [data-debut]",
          ],
          j,
          { pause: 0 },
        );
      }
    },

    // 4 · Le guide d’orientation
    async (j) => {
      const bascule = document.querySelector("[data-visite=guide] button[aria-expanded]");
      if (bascule?.getAttribute("aria-expanded") === "true") await cliquerTexte("Recommencer", j, 250);
      else await cliquerTexte("Me laisser guider", j, 250);
      // Sur un écran court, le halo suit le doigt : réponse, question suivante, créneau trouvé.
      const ecranActif = "[data-visite=guide-ecrans] .visible > div";
      const suivreLeDoigt = !tient("[data-visite=guide-ecrans]");
      await montrer(
        [
          "[data-visite=guide]",
          "[data-visite=guide-ecrans]",
          ecranActif,
          "[data-visite=guide-ecrans] .visible [data-reponse=indecis]",
        ],
        j,
      );
      parler();
      await attendre(1500, j);
      // Le halo s’éteint le temps que l’écran change : il ne s’étire jamais sur l’écran suivant.
      if (suivreLeDoigt) eteindreHalo();
      await cliquer("[data-visite=guide-ecrans] .visible [data-reponse=indecis]", j, 350);
      if (suivreLeDoigt) await montrer([ecranActif], j, { pause: 0 });
      await attendre(900, j);
      if (suivreLeDoigt) eteindreHalo();
      await cliquer("[data-visite=guide-ecrans] .visible [data-reponse=oui]", j, 350);
      if (suivreLeDoigt) {
        await montrer([ecranActif, "[data-visite=guide-ecrans] .visible [data-visite=guide-creneau]"], j, {
          pause: 0,
        });
      }
    },

    // 5 · Réserver, confirmer, montrer le rappel de la veille
    async (j) => {
      if (resa.current.confirmation) resa.current.nouvelleReservation();
      const pose = soinParId("pose-appareil");
      const s = resa.current.selection;
      const m = instantCabinet(horloge.current);
      if (s.soinId !== pose.id || !s.jour || libresDuJour(pose, s.jour, resa.current.rendezVous, m) === 0) {
        resa.current.choisirSoin(pose.id, jourDemonstration());
      }
      await attendre(250, j);
      await cliquer("[data-visite=horaires] [data-debut]", j, 300);
      await montrer(
        ["[data-visite=recapitulatif]", "[data-visite=recapitulatif] form", "[data-visite=confirmer]"],
        j,
      );
      parler();
      await saisir("[data-visite=recapitulatif] input[name=prenom]", saisieDemonstration.prenom, j);
      await saisir("[data-visite=recapitulatif] input[name=telephone]", saisieDemonstration.telephone, j);
      await attendre(250, j);
      // Le récapitulatif se déplie en confirmation : le halo attend la fin du dépliement.
      eteindreHalo();
      await cliquer("[data-visite=confirmer]", j, 650);
      await montrer(
        [
          "[data-visite=recapitulatif]",
          "[data-visite=rappel-whatsapp]",
          "[data-visite=bulle-whatsapp]",
          "[data-visite=texte-rappel]",
        ],
        j,
        { pause: 0 },
      );
    },

    // 6 · Côté cabinet : une annulation, la personne en attente prévenue, le créneau rendu
    async (j) => {
      const m = instantCabinet(horloge.current);
      const jour = journeeCabinet(m);
      const { rendezVous, attentes } = resa.current;
      const aVenir = rendezVous
        .filter((r) => r.jour === jour && r.statut === "confirme" && (jour !== m.jour || r.debut > m.minutes))
        .sort((a, b) => a.debut - b.debut || a.fauteuil - b.fauteuil);
      const choisi =
        aVenir.find((r) => attentes.some((a) => a.jour === jour && a.fauteuil === r.fauteuil)) ?? aVenir[0];

      if (!choisi) {
        await montrer(["[data-visite=cabinet-tete]", "[data-visite=cabinet-message]"], j, { fondu: true });
        parler();
        return;
      }
      // Changer de côté est un fondu, jamais un long glissement de page.
      await montrer([`[data-rdv="${choisi.id}"]`], j, { fondu: true, pause: 500 });
      parler();
      await attendre(1300, j);
      await cliquer(`[data-annuler="${choisi.id}"]`, j, 450);
      await montrer(["[data-visite=cabinet-tete]", "[data-visite=cabinet-message]"], j, { pause: 1500 });
      // Le site bascule seul vers le côté patient : le halo s’éteint pendant le fondu.
      eteindreHalo();
      await cliquer("[data-visite=voir-cote-patient]", j, 500);
      const groupe = document.querySelector(".creneau-libere")?.closest("[data-groupe]")?.getAttribute("data-groupe");
      await montrer(
        [
          ...(groupe ? [`[data-visite=horaires] [data-groupe="${groupe}"]`] : []),
          ".creneau-libere",
          "[data-visite=horaires]",
        ],
        j,
        { pause: 0 },
      );
    },
  ];

  // ——— Déroulé ——————————————————————————————————————————————————————

  const lancer = useRef<(i: number) => Promise<void>>(async () => {});
  lancer.current = async (i: number) => {
    const j = ++jeton.current;
    setIndex(i);
    setParle(false);
    eteindreHalo();
    try {
      debutParole.current = performance.now();
      await etapes[i](j);
      if (modeRef.current !== "lecture") return;
      const reste = dureeEtapeMs - (performance.now() - debutParole.current);
      if (reste > 0) await attendre(reste, j);
      if (modeRef.current !== "lecture") return;
      if (i < etapesVisite.length - 1) void lancer.current(i + 1);
      else {
        changerMode("fin");
        setParle(false);
        eteindreHalo();
      }
    } catch (e) {
      if (!(e instanceof Interruption)) throw e;
    }
  };

  const arreter = useCallback(() => {
    jeton.current += 1;
    const contenu = document.getElementById("contenu");
    if (contenu) contenu.style.opacity = "1";
  }, []);

  function aller(i: number) {
    if (i < 0 || i >= etapesVisite.length) return;
    if (modeRef.current !== "pause") changerMode("lecture");
    void lancer.current(i);
  }

  function actionCentrale() {
    switch (modeRef.current) {
      case "lecture":
        arreter();
        changerMode("pause");
        break;
      case "fin":
        changerMode("lecture");
        void lancer.current(0);
        break;
      default:
        changerMode("lecture");
        void lancer.current(index);
    }
  }

  // Démarrage : seul, sauf si le visiteur préfère moins de mouvement.
  useEffect(() => {
    reduit.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduit.current) return;
    let annule = false;
    void document.fonts.ready.then(() =>
      window.setTimeout(() => {
        if (annule || modeRef.current !== "attente") return;
        changerMode("lecture");
        void lancer.current(0);
      }, 900),
    );
    return () => {
      annule = true;
      jeton.current += 1;
    };
  }, [changerMode]);

  // Un clic, une touche ou un toucher sur la page rend la main au visiteur.
  useEffect(() => {
    function reprendreLaMain(e: Event) {
      if (!e.isTrusted) return;
      if (barre.current?.contains(e.target as Node)) return;
      if (e instanceof KeyboardEvent && ["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      if (modeRef.current !== "lecture" && modeRef.current !== "pause") return;
      arreter();
      eteindreHalo();
      setParle(false);
      changerMode("libre");
    }
    document.addEventListener("pointerdown", reprendreLaMain, true);
    document.addEventListener("keydown", reprendreLaMain, true);
    return () => {
      document.removeEventListener("pointerdown", reprendreLaMain, true);
      document.removeEventListener("keydown", reprendreLaMain, true);
    };
  }, [arreter, changerMode]);

  // Le bas de page reste accessible au-dessus du bandeau.
  useEffect(() => {
    const b = barre.current;
    if (!b) return;
    const ajuster = () => (document.body.style.paddingBottom = `${b.offsetHeight}px`);
    ajuster();
    const obs = new ResizeObserver(ajuster);
    obs.observe(b);
    return () => {
      obs.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, []);

  // Le halo suit sa cible à chaque image : défilement, recalcul, repli.
  useEffect(() => {
    let raf = 0;
    const suivre = () => {
      const h = halo.current;
      const c = cibleHalo.current;
      const r = c ? reunion(elementsDe(c)) : null;
      if (h) {
        if (r) {
          const marge = 10;
          const largeur = document.documentElement.clientWidth;
          const gauche = Math.max(4, r.left - marge);
          const droite = Math.min(largeur - 4, r.right + marge);
          h.style.transform = `translate(${gauche + window.scrollX}px, ${r.top - marge + window.scrollY}px)`;
          h.style.width = `${droite - gauche}px`;
          h.style.height = `${r.height + 2 * marge}px`;
          h.dataset.visible = "oui";
          h.dataset.cible = typeof c === "string" ? c : `${c?.selecteur} × ${c?.premiers}`;
        } else {
          h.dataset.visible = "non";
        }
      }
      raf = requestAnimationFrame(suivre);
    };
    raf = requestAnimationFrame(suivre);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ——— Affichage ———————————————————————————————————————————————————

  const texteActif =
    mode === "attente"
      ? textesVisite.depart
      : mode === "libre"
        ? textesVisite.libre
        : mode === "fin"
          ? textesVisite.fin
          : parle
            ? etapesVisite[index]
            : null;
  const tousLesTextes = [...etapesVisite, textesVisite.depart, textesVisite.libre, textesVisite.fin];

  const libelleCentral =
    mode === "attente"
      ? "Commencer la visite"
      : mode === "lecture"
        ? "Pause"
        : mode === "pause"
          ? "Lecture"
          : mode === "libre"
            ? "Reprendre la visite"
            : "Revoir la visite";
  const centralPrincipal = mode === "attente" || mode === "libre" || mode === "fin";

  return (
    <>
      <style>{STYLE}</style>
      <div ref={halo} aria-hidden="true" data-visible="non" className="halo-visite" />

      <div
        ref={barre}
        role="region"
        aria-label="Visite guidée"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface shadow-[0_-18px_40px_-28px_rgba(19,33,58,0.45)]"
      >
        <div className="conteneur pb-3 pt-1.5 sm:pb-4 [@media(max-height:720px)]:pb-2 [@media(max-height:720px)]:pt-0.5">
          <div className="flex items-center gap-3 sm:gap-5">
            <p className="etiquette shrink-0">
              <span className="chiffre text-accent">{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true"> / 06</span>
              <span className="sr-only"> sur 6</span>
              <span className="hidden sm:inline"> · Visite guidée</span>
            </p>
            <div className="flex flex-1 items-center gap-1" aria-hidden="true">
              {etapesVisite.map((_, i) => (
                <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    key={i === index ? depart : "fixe"}
                    className="jauge-etape block h-full rounded-full bg-accent"
                    data-etat={
                      i < index || (i === index && mode === "fin")
                        ? "faite"
                        : i === index && parle && mode === "lecture"
                          ? "en-cours"
                          : i === index && parle && mode === "pause"
                            ? "pause"
                            : "vide"
                    }
                    style={{ "--duree": `${dureeEtapeMs}ms` } as CSSProperties}
                  />
                </span>
              ))}
            </div>
            <a
              href="/demo/rendezvous"
              className="inline-flex min-h-11 shrink-0 items-center text-sm text-ink-2 underline decoration-line-2 underline-offset-4 hover:text-ink hover:decoration-current"
            >
              Ignorer la visite
            </a>
          </div>

          <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8 [@media(max-height:720px)]:mt-0 [@media(max-height:720px)]:gap-2">
            {/* Tous les textes occupent la même case : le bandeau garde sa hauteur. */}
            <div className="grid flex-1" aria-hidden="true">
              {tousLesTextes.map((t) => (
                <p
                  key={t}
                  className={`col-start-1 row-start-1 font-serif text-[1.05rem] leading-snug text-ink transition-opacity duration-300 sm:text-[1.15rem] [@media(max-height:720px)]:text-[0.95rem] ${
                    t === texteActif ? "opacity-100" : "invisible opacity-0"
                  }`}
                >
                  {typo(t)}
                </p>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              {texteActif ?? ""}
            </p>

            <div className="grid shrink-0 grid-cols-[auto_1fr_auto] gap-2 lg:flex">
              <button
                type="button"
                onClick={() => aller(index - 1)}
                disabled={index === 0 || mode === "attente"}
                aria-label="Étape précédente"
                className="bouton-secondaire min-h-11 px-3 disabled:opacity-40 sm:px-4"
              >
                <Fleche sens="gauche" />
                <span className="hidden text-sm sm:inline">Précédent</span>
              </button>
              <button
                type="button"
                onClick={actionCentrale}
                className={`${centralPrincipal ? "bouton-primaire" : "bouton-secondaire"} min-h-11 px-5 text-sm lg:min-w-[12rem]`}
              >
                {mode === "lecture" ? <IconePause /> : mode === "pause" ? <IconeLecture /> : null}
                {libelleCentral}
              </button>
              <button
                type="button"
                onClick={() => aller(index + 1)}
                disabled={index === etapesVisite.length - 1 || mode === "attente"}
                aria-label="Étape suivante"
                className="bouton-secondaire min-h-11 px-3 disabled:opacity-40 sm:px-4"
              >
                <span className="hidden text-sm sm:inline">Suivant</span>
                <Fleche sens="droite" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Fleche({ sens }: { sens: "gauche" | "droite" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {sens === "gauche" ? <path d="M11 4.5L6.5 9l4.5 4.5" /> : <path d="M7 4.5L11.5 9 7 13.5" />}
    </svg>
  );
}

function IconePause() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="3" y="2.5" width="2.5" height="9" rx="0.8" />
      <rect x="8.5" y="2.5" width="2.5" height="9" rx="0.8" />
    </svg>
  );
}

function IconeLecture() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M4 2.8v8.4a.6.6 0 0 0 .9.5l6.6-4.2a.6.6 0 0 0 0-1L4.9 2.3a.6.6 0 0 0-.9.5Z" />
    </svg>
  );
}
