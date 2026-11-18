import { notFound } from 'next/navigation';

/**
 * Toute adresse inconnue sous /demo/boutique mène à la 404 de Nadâ
 * (app/demo/boutique/not-found.tsx) plutôt qu'à celle du site MADDEV, qui
 * s'affichait en arabe au milieu d'une démo en français.
 *
 * Pas de loading.tsx dans cette branche : le statut reste bien 404.
 */
export default function Introuvable() {
  notFound();
}
