import type { MetadataRoute } from 'next';

/**
 * Manifeste d'application web.
 *
 * Sans lui, « Ajouter à l'écran d'accueil » sur Android produit une capture
 * de la page en guise d'icône, et le nom affiché est celui du <title>.
 *
 * Les icônes pointent vers /public/icons/. Le format `maskable` est
 * indispensable sur Android : le système y applique sa propre forme
 * (cercle, carré arrondi, goutte selon le constructeur) et rogne donc
 * l'image. Une icône `any` s'y retrouverait amputée sur les bords.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MADDEV',
    short_name: 'MADDEV',
    description:
      'Des sites qui rapportent des commandes — studio digital algérien.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e0f14',
    theme_color: '#14161c',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        // Prévoir ~20 % de marge autour du symbole : Android rogne.
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
