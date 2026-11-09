import type { ReactNode } from "react";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { reglages } from "@/content/demos/rendezvous/reglages";

/**
 * Gabarit sobre des pages hors parcours (404, incident) :
 * bandeau de démonstration, nom du cabinet, message, actions.
 */
export function PageSimple({
  surtitre,
  titre,
  children,
  actions,
}: {
  surtitre: string;
  titre: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-40">
        <DemoBanner />
      </div>
      <header className="border-b border-line">
        <div className="conteneur flex h-16 items-center">
          <a href="/demo/rendezvous" className="-ml-2 flex min-h-11 flex-col justify-center rounded-lg px-2">
            <span className="font-serif text-[1.35rem] leading-none tracking-[-0.01em] text-ink">{reglages.cabinet.nomCourt}</span>
            <span className="mt-1 text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-ink-2">
              {reglages.cabinet.designation}
            </span>
          </a>
        </div>
      </header>
      <main id="contenu" className="conteneur flex flex-1 flex-col items-start justify-center py-20">
        <p className="etiquette">{surtitre}</p>
        <h1 className="mt-4 max-w-[36rem] font-serif text-4xl leading-tight text-ink sm:text-5xl">{titre}</h1>
        <div className="mt-4 max-w-[32rem] text-lg leading-relaxed text-ink-2">{children}</div>
        <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
      </main>
    </div>
  );
}
