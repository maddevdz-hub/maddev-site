import type { Metadata } from 'next';

import { Cadre } from '@/components/demo/boutique/Cadre';
import { Panier } from '@/components/demo/boutique/ContenuPanier';

export const metadata: Metadata = { title: 'Votre panier' };

export default function PagePanier() {
  return (
    <Cadre>
      <Panier />
    </Cadre>
  );
}
