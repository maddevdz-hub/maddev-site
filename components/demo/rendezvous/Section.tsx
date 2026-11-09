import type { ReactNode } from "react";
import { typo } from "@/lib/demos/rendezvous/format";

interface Props {
  id: string;
  numero: string;
  nom: string;
  titre: string;
  chapo?: string;
  children: ReactNode;
  className?: string;
}

/** Section de la page : étiquette numérotée, titre en serif, chapô. */
export function Section({ id, numero, nom, titre, chapo, children, className = "" }: Props) {
  const titreId = `${id}-titre`;
  return (
    <section id={id} aria-labelledby={titreId} className={`border-t border-line ${className}`}>
      <div className="conteneur py-20 sm:py-28 lg:py-32">
        <header className="max-w-[40rem]">
          <p className="etiquette">
            <span className="chiffre text-accent">{numero}</span>
            <span aria-hidden="true"> — </span>
            {nom}
          </p>
          <h2
            id={titreId}
            className="mt-4 font-serif text-[2rem] leading-[1.08] tracking-[-0.015em] text-ink sm:text-[2.75rem]"
          >
            {typo(titre)}
          </h2>
          {chapo ? <p className="mt-4 text-lg leading-relaxed text-ink-2">{typo(chapo)}</p> : null}
        </header>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
