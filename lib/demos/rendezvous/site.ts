import { site } from "@/content/site";

/**
 * Adresse publique, pour les liens absolus de l’aperçu de partage.
 *
 * La démonstration vit sous /demo/rendezvous du site MADDEV : son adresse est
 * celle du site, jamais un domaine à elle. Un domaine propre ferait passer la
 * démo pour le site d’une vraie clinique.
 */
export function adresseDuSite(): URL {
  return new URL(site.url);
}
