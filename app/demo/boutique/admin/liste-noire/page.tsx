import type { Metadata } from 'next';

import { ListeNoire } from '@/components/demo/boutique/admin/ListeNoire';

export const metadata: Metadata = { title: 'Liste noire' };

export default function PageListeNoire() {
  return <ListeNoire />;
}
