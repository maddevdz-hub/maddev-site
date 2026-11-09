import Image from "next/image";
import { Dessin } from "@/components/demo/rendezvous/Dessins";
import type { Visuel } from "@/content/demos/rendezvous/visuels";

interface Props {
  visuel: Visuel;
  /** Classes de proportion et de taille, par exemple "aspect-[4/3]". */
  className?: string;
  /** Tailles pour le chargement des photos (attribut sizes). */
  sizes?: string;
  prioritaire?: boolean;
}

/**
 * Cadre à proportions fixes : dessin aujourd'hui, photo demain.
 * Changer le contenu ne change jamais la place occupée.
 */
export function CadreVisuel({ visuel, className = "", sizes = "100vw", prioritaire = false }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface-2 ${className}`}>
      {visuel.type === "photo" ? (
        <Image
          src={visuel.src}
          alt={visuel.alt}
          fill
          sizes={sizes}
          priority={prioritaire}
          className="object-cover"
          style={visuel.cadrage ? { objectPosition: visuel.cadrage } : undefined}
        />
      ) : (
        /*
         * Le dessin, centré sur une trame de points — celle de l'image de
         * partage. La trame remplit tout le cadre, quelle que soit sa
         * proportion ; le dessin, lui, garde la sienne.
         */
        <div aria-hidden="true" className="dessin-trame absolute inset-0 flex items-center justify-center p-[5%]">
          <Dessin id={visuel.dessin} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
