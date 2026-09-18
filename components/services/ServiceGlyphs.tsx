import type { ServiceGlyphName } from '@/content/services';

/**
 * Les pictogrammes des services.
 *
 * Un seul jeu pour tout le site : sommaire de /services, cartes de
 * l'accueil, résultat du configurateur. Il en existait deux, dessinés
 * séparément pour les mêmes services — ils avaient déjà divergé.
 *
 * Dessinés au trait fin, jamais pleins : ils accompagnent un nom de service,
 * ils ne le remplacent pas. Un pictogramme trop épais attire l'œil plus que
 * l'étiquette qu'il désigne, et une rangée de six devient un tableau de
 * symboles qu'il faut déchiffrer.
 *
 * Ils partagent tous la même grille de 24, la même graisse et les mêmes
 * terminaisons arrondies — des dessins d'origines différentes se remarquent
 * immédiatement, même sans qu'on sache dire pourquoi.
 */

const COMMON = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function ServiceGlyph({
  name,
  className,
}: {
  name: ServiceGlyphName;
  className?: string;
}) {
  switch (name) {
    /* Un QR code : trois repères d'angle et quelques modules. */
    case 'qr':
      return (
        <svg {...COMMON} className={className}>
          <rect x="3" y="3" width="7" height="7" rx="1.4" />
          <rect x="14" y="3" width="7" height="7" rx="1.4" />
          <rect x="3" y="14" width="7" height="7" rx="1.4" />
          <path d="M14 14h3v3h-3zM20 14v1M14 20h3M20 19v2" />
        </svg>
      );

    /* Un agenda : la grille du mois, un jour marqué. */
    case 'agenda':
      return (
        <svg {...COMMON} className={className}>
          <rect x="3" y="5" width="18" height="16" rx="2.4" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <path d="M8.5 14.5h2M13.5 14.5h2M8.5 17.5h2" />
        </svg>
      );

    /* Un panier de commande. */
    case 'panier':
      return (
        <svg {...COMMON} className={className}>
          <path d="M5 8h14l-1.1 11.1a2 2 0 0 1-2 1.9H8.1a2 2 0 0 1-2-1.9Z" />
          <path d="M9 11V6.5a3 3 0 0 1 6 0V11" />
        </svg>
      );

    /* Une devanture : le store et la porte d'un commerce. */
    case 'vitrine':
      return (
        <svg {...COMMON} className={className}>
          <path d="M3.4 9h17.2l-1.2-4.2A1.6 1.6 0 0 0 17.9 3.6H6.1A1.6 1.6 0 0 0 4.6 4.8Z" />
          <path d="M5 9v10.4A1.6 1.6 0 0 0 6.6 21h10.8a1.6 1.6 0 0 0 1.6-1.6V9" />
          <path d="M10 21v-5.4h4V21" />
        </svg>
      );

    /* Une recherche dans une liste d'annonces. */
    case 'recherche':
      return (
        <svg {...COMMON} className={className}>
          <path d="M4 5h9M4 9.5h6M4 14h5" />
          <circle cx="15.5" cy="14.5" r="4.5" />
          <path d="m19 18 2.2 2.2" />
        </svg>
      );

    /* Un porte-voix : la campagne qui va chercher les clients. */
    case 'megaphone':
      return (
        <svg {...COMMON} className={className}>
          <path d="M4 10.5v3a2 2 0 0 0 2 2h2l8 4.2V4.3L8 8.5H6a2 2 0 0 0-2 2Z" />
          <path d="M8 15.5V8.5" />
          <path d="M19.2 9.4a4 4 0 0 1 0 5.2" />
        </svg>
      );
    /*
     * Un engrenage : l'outil construit pour un métier précis.
     *
     * Les dents sortent du cercle au lieu d'en partir : des rayons tracés
     * depuis le centre donnaient un soleil, pas une roue dentée — c'est
     * exactement ce qu'on lisait à 24 pixels.
     */
    case 'engrenage':
      return (
        <svg {...COMMON} className={className}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2.7" />
          <path d="M12 2.6v2.4M12 19v2.4M21.4 12H19M5 12H2.6M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7M18.6 18.6l-1.7-1.7M7.1 7.1 5.4 5.4" />
        </svg>
      );

    /* Deux anneaux entrelacés : l'invitation de mariage. */
    case 'anneaux':
      return (
        <svg {...COMMON} className={className}>
          <circle cx="9" cy="14.5" r="5.5" />
          <circle cx="15" cy="9.5" r="5.5" />
        </svg>
      );
  }
}
