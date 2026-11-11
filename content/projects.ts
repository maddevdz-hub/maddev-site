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
      fr: 'Site vitrine',
      ar: 'موقع تعريفي',
    },
    result: {
      fr: 'Toute la collection présentée en ligne, et sur chaque meuble un bouton WhatsApp qui transmet la référence et les options choisies.',
      ar: 'المجموعة كاملة معروضة على الإنترنت، وعلى كل قطعة زر واتساب ينقل المرجع والخيارات المختارة.',
    },
    highlights: {
      fr: [
        'La collection présentée pièce par pièce, lisible sur téléphone',
        'Message WhatsApp pré-rempli avec la référence',
        'Sélecteur de tissus sur les fiches produit',
      ],
      ar: [
        'المجموعة معروضة قطعة قطعة، وتُقرأ بسهولة على الهاتف',
        'رسالة واتساب معبّأة مسبقًا بمرجع المنتج',
        'اختيار الأقمشة في صفحات المنتجات',
      ],
    },
    demoUrl: 'https://henna-meubles-2026.vercel.app',
    // Capture réelle du site livré (même fichier que /services).
    image: '/services/capture-showroom.jpg',
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
