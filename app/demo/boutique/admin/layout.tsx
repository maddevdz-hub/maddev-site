import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { CadreAdmin } from '@/components/demo/boutique/admin/CadreAdmin';

/**
 * Le registre du marchand Nadâ (démonstration).
 * Le <html> vient du layout de la boutique ; ce layout ajoute le cadre de
 * l'outil (onglets, bandeau d'accès libre) et le rend installable : son
 * propre manifeste et ses propres icônes remplacent ceux du site.
 */
export const metadata: Metadata = {
  manifest: '/demo/boutique/admin/manifest.webmanifest',
  icons: {
    icon: [{ url: '/demo/boutique/registre/icone-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/demo/boutique/registre/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: { capable: true, title: 'Registre Nadâ', statusBarStyle: 'default' },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <CadreAdmin>{children}</CadreAdmin>;
}
