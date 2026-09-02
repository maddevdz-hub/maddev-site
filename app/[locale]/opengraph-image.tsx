import { ImageResponse } from 'next/og';
import { locales } from '@/i18n/config';

/**
 * Image de partage 1200×630, servie pour les deux langues.
 *
 * C'est ce qui s'affiche quand un lien du site est collé sur WhatsApp,
 * Facebook ou LinkedIn — les canaux par lesquels passent nos prospects.
 *
 * ⚠️ La carte ne contient aucun texte arabe, et ce n'est pas un oubli.
 * Le moteur de rendu de next/og (satori) ne sait pas façonner l'écriture
 * arabe : il échoue sur les substitutions contextuelles du format GSUB
 * (« lookupType: 5 — substFormat: 3 is not yet supported »). Testé avec la
 * police par défaut puis avec Amiri : même échec, l'image n'était pas
 * générée du tout côté arabe. Une carte en écriture latine, lisible par
 * tous nos publics, vaut mieux qu'un lien sans aperçu.
 *
 * Pour une version arabe, il faudra une image fixe préparée dans un outil
 * graphique et déposée dans /public — le jour où elle existe, remplacer
 * cette route par un fichier opengraph-image.png suffit.
 *
 * Runtime edge : la variante Node de @vercel/og résout mal ses ressources
 * internes et casse la construction sous Windows.
 */
export const runtime = 'edge';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'MADDEV — studio digital algérien';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0e0f14',
          // Deux halos corail, comme les fonds du site.
          backgroundImage:
            'radial-gradient(circle at 12% 8%, rgba(255,90,95,.28) 0%, rgba(255,90,95,0) 45%), radial-gradient(circle at 92% 96%, rgba(255,138,95,.22) 0%, rgba(255,138,95,0) 48%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Monogramme DD — mêmes tracés que components/brand/DDMark.tsx */}
        <svg width="182" height="136" viewBox="0 0 134 100">
          <defs>
            <linearGradient id="og-dd" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff5a5f" />
              <stop offset="100%" stopColor="#ff8a5f" />
            </linearGradient>
          </defs>
          <path
            d="M18 12 H44 A38 38 0 0 1 44 88 H18 Z M32 26 H44 A24 24 0 0 1 44 74 H32 Z"
            fill="url(#og-dd)"
            fillRule="evenodd"
          />
          <path
            d="M52 12 H78 A38 38 0 0 1 78 88 H52 Z M66 26 H78 A24 24 0 0 1 78 74 H66 Z"
            fill="url(#og-dd)"
            fillRule="evenodd"
            opacity="0.72"
          />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/*
            La promesse seule. L'énumération des services qui figurait ici
            renvoyait un catalogue là où le lien doit porter un bénéfice —
            et elle contredisait le titre de la page.
          */}
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: '#f4f2ef',
              lineHeight: 1.15,
              letterSpacing: -1.5,
            }}
          >
            Des sites qui rapportent des commandes
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: 56,
                height: 6,
                borderRadius: 3,
                background: 'linear-gradient(120deg,#ff5a5f,#ff8a5f)',
              }}
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#ff8a5f',
                letterSpacing: 2,
              }}
            >
              MADDEV
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
