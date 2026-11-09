import type { ReactNode } from "react";
import { EnteteFixe } from "@/components/demo/rendezvous/EnteteFixe";
import { HorlogeProvider } from "@/components/demo/rendezvous/Horloge";
import { PiedDePage } from "@/components/demo/rendezvous/PiedDePage";
import { ReservationProvider } from "@/components/demo/rendezvous/reservation/ReservationProvider";
import { Accueil } from "@/components/demo/rendezvous/sections/Accueil";
import { EspaceCabinet } from "@/components/demo/rendezvous/sections/EspaceCabinet";
import { Parcours } from "@/components/demo/rendezvous/sections/Parcours";
import { Questions } from "@/components/demo/rendezvous/sections/Questions";
import { Reservation } from "@/components/demo/rendezvous/sections/Reservation";
import { Soins } from "@/components/demo/rendezvous/sections/Soins";

/**
 * Le site complet. La page d’accueil l’affiche seul ; la page /presentation
 * l’affiche à l’identique et y ajoute la visite guidée (`children`).
 */
export function Site({ maintenant, children }: { maintenant: number; children?: ReactNode }) {
  return (
    <HorlogeProvider initial={maintenant}>
      <ReservationProvider>
        <EnteteFixe />
        <main id="contenu" tabIndex={-1} className="focus:outline-none">
          <Accueil />
          <Soins />
          <Parcours />
          <Reservation />
          <EspaceCabinet />
          <Questions />
        </main>
        <PiedDePage />
        {children}
      </ReservationProvider>
    </HorlogeProvider>
  );
}
