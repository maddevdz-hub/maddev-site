/**
 * Emplacements visuels.
 *
 * Aujourd'hui, chaque emplacement affiche un dessin vectoriel.
 * Pour le remplacer par une photo du cabinet, il suffit de changer
 * l'entrée correspondante dans content/ :
 *
 *   visuel: { type: "photo", src: "/photos/fauteuil.jpg", alt: "Le fauteuil 1" }
 *
 * et de déposer le fichier dans public/photos/. Le cadre garde ses
 * proportions : la mise en page ne bouge pas.
 */
export type DessinId =
  | "arcade"
  | "premiere-consultation"
  | "controle-orthodontique"
  | "pose-appareil"
  | "detartrage"
  | "eclaircissement"
  | "urgence";

export type Visuel =
  | { readonly type: "dessin"; readonly dessin: DessinId }
  | {
      readonly type: "photo";
      /** Chemin sous public/, par exemple "/photos/accueil.jpg". */
      readonly src: string;
      /** Description de la photo pour les lecteurs d'écran. */
      readonly alt: string;
      /** Point de cadrage CSS, par exemple "50% 30%". */
      readonly cadrage?: string;
    };
