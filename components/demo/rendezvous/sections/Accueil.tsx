import { CadreVisuel } from "@/components/demo/rendezvous/CadreVisuel";
import { reglages } from "@/content/demos/rendezvous/reglages";
import { soins } from "@/content/demos/rendezvous/soins";
import { FINE, formatHeure, formatPlageJours, NBSP } from "@/lib/demos/rendezvous/format";

export function Accueil() {
  const { horaires, rappel, cabinet } = reglages;
  const jours = horaires.joursOuverts.length;

  return (
    <section id="accueil" aria-labelledby="accueil-titre">
      <div className="conteneur grid grid-cols-1 gap-14 pb-20 pt-14 sm:pb-28 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-24">
        <div data-visite="accueil-texte" className="lg:col-span-7">
          <p className="etiquette">{cabinet.specialites.join(" · ")}</p>
          <h1
            id="accueil-titre"
            className="mt-5 font-serif text-[2.6rem] leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[3.75rem] xl:text-[4rem]"
          >
            Votre <span className="whitespace-nowrap">rendez-vous,</span> réservé en une minute.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-2">
            Le cabinet vous reçoit à {cabinet.quartier}, du {formatPlageJours(horaires.joursOuverts)}.
            Choisissez votre soin, votre jour et votre heure&nbsp;: le créneau est à vous
            aussitôt, et nous vous le rappelons la veille.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#reservation" className="bouton-primaire">
              Réserver un rendez-vous
            </a>
            <a href="#soins" className="bouton-secondaire">
              Découvrir les soins
            </a>
          </div>

          {/*
            Trois faits sur le système, tous lus dans les réglages et la liste
            des soins — aucun n'est écrit en dur.

            Cette rangée affichait la note et le nombre d'avis Google d'un
            cabinet réel. On ne transpose pas la réputation d'un autre, et on
            n'en invente pas : une clinique fictive n'a pas d'avis. Elle a en
            revanche des horaires, un rappel et des soins chronométrés, qui
            décrivent exactement ce que le système fait.
          */}
          <dl data-visite="accueil-chiffres" className="mt-14 grid max-w-[36rem] grid-cols-3 gap-4 border-t border-line pt-6 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-1 text-sm leading-snug text-ink-2">
                {formatPlageJours(horaires.joursOuverts)}, {formatHeure(horaires.ouverture)} à{" "}
                {formatHeure(horaires.fermeture)}
              </dt>
              <dd className="order-1 chiffre text-[1.75rem] leading-none text-ink sm:text-[2rem]">
                {horaires.joursOuverts.length}{NBSP}j<span className="text-ink-2">{FINE}/{FINE}7</span>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="order-2 mt-1 text-sm leading-snug text-ink-2">
                rappel avant le rendez-vous
              </dt>
              <dd className="order-1 chiffre text-[1.75rem] leading-none text-ink sm:text-[2rem]">
                {rappel.delaiHeures}{FINE}h
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="order-2 mt-1 text-sm leading-snug text-ink-2">
                chacun avec sa durée réelle
              </dt>
              <dd className="order-1 chiffre text-[1.75rem] leading-none text-ink sm:text-[2rem]">
                {soins.length}
                <span className="text-ink-2">{NBSP}soins</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-5">
          <CadreVisuel
            visuel={reglages.visuelAccueil}
            className="aspect-[4/3] lg:aspect-[4/5]"
            sizes="(min-width: 1024px) 40vw, 100vw"
            prioritaire
          />
        </div>
      </div>
    </section>
  );
}
