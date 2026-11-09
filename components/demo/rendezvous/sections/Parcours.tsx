import { Section } from "@/components/demo/rendezvous/Section";
import { parcours } from "@/content/demos/rendezvous/parcours";
import { typo } from "@/lib/demos/rendezvous/format";

export function Parcours() {
  return (
    <Section
      id="parcours"
      numero="02"
      nom="Le parcours"
      titre="De la réservation au suivi."
      chapo="Quatre étapes, et aucun appel téléphonique nécessaire."
    >
      <ol className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {parcours.map((e, i) => (
          <li key={e.titre} className="border-t border-trait pt-5">
            <p className="chiffre text-sm text-accent" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-serif text-[1.4rem] leading-tight text-ink">{e.titre}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{typo(e.texte)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
