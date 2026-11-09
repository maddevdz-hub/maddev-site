import Image from "next/image";
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
        // Les dessins vectoriels arrivent à l'étape 2.
        <div aria-hidden="true" className="reserve absolute inset-3 text-xs">
          Dessin « {visuel.dessin} »
        </div>
      )}
    </div>
  );
}
