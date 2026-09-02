import type { Bilingual } from './services';

export type ProjectStat = {
  /** Valeur brute, affichée telle quelle (toujours en chiffres latins). */
  value: string;
  label: Bilingual;
};

export type Project = {
  slug: string;
  /** Intitulé du projet. Aucun nom de client n'est publié sans accord. */
  title: Bilingual;
  /** Type de prestation. */
  kind: Bilingual;
  /** Résultat concret, en une phrase. */
  result: Bilingual;
  /** Points saillants affichés sous le résultat. */
  highlights: Record<'fr' | 'ar', string[]>;
  /** Site en ligne — le bouton « Voir le site » n'apparaît que s'il est défini. */
  demoUrl?: string;
  /**
   * Chiffres vérifiables uniquement. Aucune estimation, aucune projection :
   * si la valeur n'a pas été mesurée, elle n'a rien à faire ici.
   */
  stats: ProjectStat[];
  /**
   * Capture réelle : déposer le fichier dans /public/projects/ puis
   * renseigner le chemin ici (ex. '/projects/showroom-meubles-bba.png').
   * Tant que c'est vide, un cadre navigateur neutre est affiché — jamais
   * une reconstitution d'interface.
   */
  image?: string;
};

/**
 * Une seule réalisation, réelle et vérifiable.
 *
 * Les projets non livrés ou internes n'ont pas leur place ici : un prospect
 * qui pose une question précise sur un projet fantôme ne revient pas.
 */
export const projects: Project[] = [
  {
    slug: 'showroom-meubles-bba',
    title: {
      fr: 'Showroom de meubles — Bordj Bou Arréridj',
      ar: 'معرض أثاث — برج بوعريريج',
    },
    kind: {
      fr: 'Site e-commerce complet',
      ar: 'متجر إلكتروني متكامل',
    },
    result: {
      fr: 'Un catalogue complet en ligne, où chaque produit part en commande WhatsApp d’un seul geste — référence et options comprises.',
      ar: 'كتالوج كامل على الإنترنت، كل منتج يتبعث كطلب واتساب بضغطة وحدة — بالمرجع والخيارات.',
    },
    highlights: {
      fr: [
        'Catalogue complet, consultable depuis le téléphone',
        'Commande WhatsApp pré-remplie avec la référence',
        'Sélecteur de tissus sur les fiches produit',
      ],
      ar: [
        'كتالوج كامل، يُتصفَّح من التيليفون',
        'طلب عبر واتساب مُعبَّأ مسبقًا بمرجع المنتج',
        'اختيار الأقمشة في صفحات المنتجات',
      ],
    },
    demoUrl: 'https://henna-meubles-2026.vercel.app',
    stats: [
      {
        value: '67',
        label: { fr: 'pages en ligne', ar: 'صفحة منشورة' },
      },
      {
        value: '94–99',
        label: { fr: 'score Lighthouse', ar: 'نتيجة Lighthouse' },
      },
    ],
  },
];
