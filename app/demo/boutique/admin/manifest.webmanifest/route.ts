/**
 * Manifeste du registre Nadâ : seule partie de la démo installable comme
 * application. Sa portée (`scope`) s'arrête à /demo/boutique/admin — la
 * vitrine reste un site, le registre devient une icône sur le téléphone du
 * marchand. Icônes : `npm run icones:registre`.
 */
export const dynamic = 'force-static';

const ICONES = '/demo/boutique/registre';

export function GET() {
  return Response.json(
    {
      id: '/demo/boutique/admin',
      name: 'Nadâ — registre des commandes',
      short_name: 'Registre Nadâ',
      description: 'Le registre des commandes de la boutique Nadâ (démonstration conçue par MADDEV).',
      lang: 'fr',
      dir: 'ltr',
      start_url: '/demo/boutique/admin',
      scope: '/demo/boutique/admin',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#f7f2ea',
      theme_color: '#f7f2ea',
      icons: [
        { src: `${ICONES}/icone-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: `${ICONES}/icone-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: `${ICONES}/icone-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      shortcuts: [
        { name: 'À traiter', url: '/demo/boutique/admin', icons: [{ src: `${ICONES}/icone-192.png`, sizes: '192x192' }] },
        { name: 'Chiffres', url: '/demo/boutique/admin/chiffres', icons: [{ src: `${ICONES}/icone-192.png`, sizes: '192x192' }] },
      ],
    },
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
}
