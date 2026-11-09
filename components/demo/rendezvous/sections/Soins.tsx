import { CadreVisuel } from "@/components/demo/rendezvous/CadreVisuel";
import { Section } from "@/components/demo/rendezvous/Section";
import { DisponibiliteSoin } from "@/components/demo/rendezvous/reservation/DisponibiliteSoin";
import { soins } from "@/content/demos/rendezvous/soins";
import { formatDuree, typo } from "@/lib/demos/rendezvous/format";

export function Soins() {
  return (
    <Section
      id="soins"
      numero="01"
      nom="Les soins"
      titre="Six soins, chacun sa durée."
      chapo="La durée de chaque soin détermine les horaires proposés : vous ne réservez jamais un créneau trop court."
    >
      <ul data-visite="soins" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {soins.map((s) => (
          <li key={s.id} data-visite="soin" className="carte flex flex-col p-5 sm:p-6">
            <CadreVisuel
              visuel={s.visuel}
              className="aspect-[5/2]"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            />
            <div data-visite="soin-resume" className="flex flex-1 flex-col">
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-[1.4rem] leading-tight text-ink">{s.nom}</h3>
                <p className="chiffre shrink-0 text-lg text-ink">{formatDuree(s.duree)}</p>
              </div>
              <p className="mb-5 mt-2 text-[15px] leading-relaxed text-ink-2">{typo(s.description)}</p>
              <DisponibiliteSoin soinId={s.id} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
