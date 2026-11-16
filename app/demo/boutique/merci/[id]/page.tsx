import type { Metadata } from 'next';

import { Cadre } from '@/components/demo/boutique/Cadre';
import { Confirmation } from '@/components/demo/boutique/Confirmation';

export const metadata: Metadata = {
  title: 'Commande reçue',
  // Une page de commande n'a rien à faire dans un aperçu de partage.
  openGraph: null,
};

/** La confirmation de commande : une page de carnet, la commande écrite dessus. */
export default function Merci({ params }: { params: { id: string } }) {
  return (
    <Cadre>
      <Confirmation id={decodeURIComponent(params.id)} />
    </Cadre>
  );
}
