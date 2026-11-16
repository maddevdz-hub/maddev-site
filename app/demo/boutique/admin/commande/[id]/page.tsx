import type { Metadata } from 'next';

import { FicheCommande } from '@/components/demo/boutique/admin/FicheCommande';

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { title: `Commande ${decodeURIComponent(params.id)}` };
}

/** La fiche d'une commande. Lue dans le navigateur : rien n'est rendu côté serveur. */
export default function PageCommande({ params }: { params: { id: string } }) {
  return <FicheCommande id={decodeURIComponent(params.id)} />;
}
