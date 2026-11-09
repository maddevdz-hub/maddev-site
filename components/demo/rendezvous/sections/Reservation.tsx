import { Section } from "@/components/demo/rendezvous/Section";
import { Calendrier } from "@/components/demo/rendezvous/reservation/Calendrier";
import { GuideOrientation } from "@/components/demo/rendezvous/reservation/GuideOrientation";
import { Recapitulatif } from "@/components/demo/rendezvous/reservation/Recapitulatif";

export function Reservation() {
  return (
    <Section
      id="reservation"
      numero="03"
      nom="Réservation"
      titre="Choisissez votre horaire."
      chapo="Les créneaux sont calculés à l’instant pour le soin choisi, à l’heure d’Alger."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 space-y-12 lg:col-span-8">
          {/* Facultatif : replié par défaut, il ne ralentit pas qui sait déjà choisir. */}
          <GuideOrientation />
          <Calendrier />
        </div>

        <aside className="min-w-0 lg:col-span-4" aria-label="Récapitulatif de la réservation">
          <Recapitulatif />
        </aside>
      </div>
    </Section>
  );
}
