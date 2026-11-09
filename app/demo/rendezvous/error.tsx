"use client";

import { PageSimple } from "@/components/demo/rendezvous/PageSimple";

/** Incident pendant l’affichage d’une page : message en français, sans détail technique. */
export default function Incident({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageSimple
      surtitre="Incident"
      titre="La page n’a pas pu s’afficher."
      actions={
        <>
          <button type="button" onClick={reset} className="bouton-primaire">
            Réessayer
          </button>
          <a href="/demo/rendezvous" className="bouton-secondaire">
            Revenir à l’accueil
          </a>
        </>
      }
    >
      <p>Un rechargement suffit le plus souvent. Les réservations de ce test ne sont pas conservées.</p>
    </PageSimple>
  );
}
