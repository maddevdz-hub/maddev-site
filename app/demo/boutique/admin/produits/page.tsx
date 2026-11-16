import type { Metadata } from 'next';

import { Produits } from '@/components/demo/boutique/admin/Produits';

export const metadata: Metadata = { title: 'Produits et stock' };

export default function PageProduits() {
  return <Produits />;
}
