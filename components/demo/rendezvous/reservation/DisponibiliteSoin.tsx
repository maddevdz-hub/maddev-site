"use client";

import { soinParId, type SoinId } from "@/content/demos/rendezvous/soins";
import { useMaintenant } from "@/components/demo/rendezvous/Horloge";
import { joursDeLaSemaine, libresCetteSemaine, premierJourLibre } from "@/lib/demos/rendezvous/creneaux";
import { instantCabinet } from "@/lib/demos/rendezvous/temps";
import { allerA, useReservation } from "./ReservationProvider";

/**
 * Pied d’une carte de soin : créneaux libres cette semaine, calculés sur
 * l’agenda réel, et accès direct au calendrier.
 */
export function DisponibiliteSoin({ soinId }: { soinId: SoinId }) {
  const { rendezVous, choisirSoin } = useReservation();
  const maintenant = instantCabinet(useMaintenant());
  const soin = soinParId(soinId);
  const libres = libresCetteSemaine(soin, rendezVous, maintenant);

  function choisir() {
    const jour =
      premierJourLibre(soin, rendezVous, maintenant, joursDeLaSemaine(maintenant, 0)) ??
      premierJourLibre(soin, rendezVous, maintenant);
    choisirSoin(soin.id, jour);
    allerA("reservation-jour");
  }

  return (
    <div
      data-visite="soin-dispo"
      className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-4"
    >
      {libres > 0 ? (
        <p className="text-sm leading-tight text-ink-2">
          <span className="chiffre block text-2xl leading-none text-ink">{libres}</span>
          {libres > 1 ? "libres" : "libre"} cette semaine
        </p>
      ) : (
        <p className="text-sm font-medium leading-tight text-alerte">Complet cette semaine</p>
      )}
      <button
        type="button"
        onClick={choisir}
        aria-label={`Choisir ce soin : ${soin.nom}`}
        className="bouton-secondaire min-h-11 px-4 text-sm"
      >
        Choisir ce soin
      </button>
    </div>
  );
}
