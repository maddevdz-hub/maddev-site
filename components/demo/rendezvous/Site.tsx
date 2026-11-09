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
 * Le site complet de la clinique.
 *
 * Il a existé une page /presentation qui l’affichait avec une visite guidée
 * par-dessus. Retirée : elle s’adressait à un cabinet précis (« Voici votre
 * cabinet »), alors que cette démonstration parle à des prospects.
 */
export function Site({ maintenant }: { maintenant: number }) {
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
      </ReservationProvider>
    </HorlogeProvider>
  );
}
