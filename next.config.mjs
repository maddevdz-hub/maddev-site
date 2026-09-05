/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * `/realisations` a été supprimée en septembre 2026 — voir i18n/config.ts.
   *
   * La redirection est permanente et non temporaire : l'adresse ne reviendra
   * pas sous cette forme, et un permanent transmet à Google le crédit
   * accumulé par l'ancienne page au lieu de le perdre. Les deux formes sont
   * couvertes — avec préfixe de langue et sans, le lien ayant pu être
   * partagé sous n'importe laquelle.
   *
   * `statusCode: 301` plutôt que `permanent: true`, qui produit un 308.
   * Les deux sont permanents et équivalents pour Google, mais le 301 est
   * compris par tout ce qui est ancien — proxies, robots tiers, signets.
   */
  async redirects() {
    return [
      {
        source: '/realisations',
        destination: '/services',
        statusCode: 301,
      },
      {
        source: '/:locale(ar|fr)/realisations',
        destination: '/:locale/services',
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
