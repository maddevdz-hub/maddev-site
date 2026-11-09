import type { Metadata } from "next";
import { PageSimple } from "@/components/demo/rendezvous/PageSimple";
import { reglages } from "@/content/demos/rendezvous/reglages";

export const metadata: Metadata = {
  title: `Page introuvable — ${reglages.cabinet.nom}`,
};

export default function PageIntrouvable() {
  return (
    <PageSimple
      surtitre="Erreur 404"
      titre="Cette page n’existe pas."
      actions={
        <a href="/demo/rendezvous" className="bouton-primaire">
          Revenir à l’accueil
        </a>
      }
    >
      <p>L’adresse est peut-être incomplète. La réservation se fait depuis la page d’accueil.</p>
    </PageSimple>
  );
}
