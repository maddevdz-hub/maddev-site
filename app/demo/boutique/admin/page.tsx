import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ListeCommandes } from '@/components/demo/boutique/admin/ListeCommandes';

export const metadata: Metadata = { title: 'Commandes' };

export default function PageCommandes() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
      <ListeCommandes />
    </Suspense>
  );
}
