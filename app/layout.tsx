import type { ReactNode } from 'react';

/**
 * Layout racine volontairement transparent : c'est app/[locale]/layout.tsx
 * qui rend <html> et <body>, car les attributs lang et dir dépendent de la
 * langue et doivent être posés côté serveur (jamais corrigés après coup).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
