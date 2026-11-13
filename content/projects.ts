import type { Bilingual } from './services';

/** Une vue réelle du site livré, avec sa légende. */
export type ProjectShot = { src: string; caption: Bilingual };

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
  /** Captures prises sur l'URL réelle par `npm run captures`. */
  shots?: ProjectShot[];
};

/**
 * Libellés de la section « Réalisation » de /services.
 *
 * Aucun chiffre de résultat et aucun témoignage : nous n'avons ni l'un ni
 * l'autre, et un client réel mal raconté vaut moins qu'un client réel
 * raconté sobrement.
 */
export const realisationUi = {
  eyebrow: { fr: 'Réalisation', ar: 'إنجاز' },
  title: { fr: 'Un client, un site en ligne', ar: 'زبون واحد، وموقع على الإنترنت' },
  deliveredLabel: { fr: 'Ce qui a été fait', ar: 'ما الذي أُنجز' },
  visit: { fr: 'Voir le site', ar: 'زيارة الموقع' },
} satisfies Record<string, Bilingual>;

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
    shots: [
      {
        src: '/services/realisation-showroom-accueil.jpg',
        caption: { fr: 'L’accueil du site', ar: 'الصفحة الرئيسية' },
      },
      {
        src: '/services/realisation-showroom-collection.jpg',
        caption: { fr: 'Le catalogue', ar: 'الكتالوج' },
      },
      {
        src: '/services/realisation-showroom-produit.jpg',
        caption: { fr: 'Une pièce, sur téléphone', ar: 'قطعة، على الهاتف' },
      },
    ],
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
