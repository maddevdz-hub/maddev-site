import type { ReactNode } from 'react';

import { CadreAdmin } from '@/components/demo/boutique/admin/CadreAdmin';

/**
 * Le registre du marchand Nadâ (démonstration).
 * Le <html> vient du layout de la boutique ; ce layout ajoute le cadre de
 * l'outil (onglets, bandeau d'accès libre).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <CadreAdmin>{children}</CadreAdmin>;
}
