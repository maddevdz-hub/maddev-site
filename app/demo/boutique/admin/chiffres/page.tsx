import type { Metadata } from 'next';

import { Chiffres } from '@/components/demo/boutique/admin/Chiffres';

export const metadata: Metadata = { title: 'Chiffres' };

export default function PageChiffres() {
  return <Chiffres />;
}
