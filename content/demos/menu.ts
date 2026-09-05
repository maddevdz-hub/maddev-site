import type { DemoBrand } from './types';

/**
 * Démonstration « Café Zitouna » — carte à QR code.
 *
 * Établissement FICTIF. La bande d'avertissement en haut de la démo n'est
 * pas décorative : elle est la condition qui rend cette page acceptable.
 * Ne jamais la retirer, ne jamais la rendre discrète au point d'être ratée.
 *
 * Le contenu est crédible et cohérent — des plats réellement servis dans un
 * café algérien, avec leur nom d'usage. Un menu peuplé de « Plat 1 » se voit
 * immédiatement et ruine la démonstration.
 *
 * Les prix sont ronds et illustratifs : ils situent l'ordre de grandeur sans
 * prétendre être la carte d'un établissement réel.
 */

export const cafe: DemoBrand & {
  tagline: string;
  address: string;
  hours: string;
  opensAt: number;
  closesAt: number;
  /** Le numéro affiché sur l'affiche du QR — fictif, jamais attribué. */
  phoneDisplay: string;
  /**
   * Photo d'ambiance de l'en-tête. Déposer le fichier puis renseigner ici :
   * `cover: '/demo/menu/cafe-interieur.jpg'`. Voir README pour le cadrage
   * attendu. Tant qu'elle manque, l'en-tête garde son fond crème et sa
   * branche d'olivier — une composition qui tient debout seule.
   */
  cover?: string;
} = {
  slug: 'menu',
  name: 'Café Zitouna',
  sector: 'Café — carte à QR code',
  solves: 'La carte change en trente secondes, sans rien réimprimer.',
  tagline: 'Café de quartier, ouvert depuis le matin',
  address: '12 rue des Oliviers, Alger',
  hours: 'Tous les jours, 7h – 23h',
  /** Bornes réelles, en heures locales : l'indicateur d'ouverture les lit. */
  opensAt: 7,
  closesAt: 23,
  phoneDisplay: '+213 21 00 00 00',
};

/** Marqueurs affichés sur les plats. */
export type Marker = 'vegetarien' | 'epice' | 'nouveau';

export type Dish = {
  slug: string;
  name: string;
  description: string;
  /** En dinars. Rond, illustratif. */
  price: number;
  markers: Marker[];
  /**
   * Photo du plat. Déposer le fichier dans public/demo/menu/ sous le nom
   * `<slug>.jpg`, puis renseigner ce champ : `image: '/demo/menu/msemen.jpg'`.
   * Tant qu'il est vide, une tuile de la couleur du café prend la place —
   * jamais un rectangle gris, jamais une image d'illustration générique.
   */
  image?: string;
};

export type MenuCategory = {
  slug: string;
  name: string;
  dishes: Dish[];
};

export const markerLabels: Record<Marker, string> = {
  vegetarien: 'Végétarien',
  epice: 'Épicé',
  nouveau: 'Nouveau',
};

export const menu: MenuCategory[] = [
  {
    slug: 'cafes',
    name: 'Cafés et thés',
    dishes: [
      {
        slug: 'qahwa-arbia',
        name: 'Café arabe',
        description: 'Serré, à la cardamome, servi avec un verre d’eau.',
        price: 120,
        markers: [],
      },
      {
        slug: 'qahwa-halib',
        name: 'Café au lait',
        description: 'Lait entier chauffé à la vapeur, mousse légère.',
        price: 150,
        markers: [],
      },
      {
        slug: 'atay-nanaa',
        name: 'Thé à la menthe',
        description: 'Menthe fraîche, servi en théière pour deux verres.',
        price: 120,
        markers: ['vegetarien'],
      },
      {
        slug: 'qahwa-bayda',
        name: 'Café blanc à la fleur d’oranger',
        description: 'Sans caféine, eau de fleur d’oranger distillée à la maison.',
        price: 150,
        markers: ['vegetarien', 'nouveau'],
      },
      {
        slug: 'chocolat',
        name: 'Chocolat chaud',
        description: 'Chocolat noir fondu, crème fouettée en option.',
        price: 250,
        markers: ['vegetarien'],
      },
    ],
  },
  {
    slug: 'jus',
    name: 'Jus et boissons fraîches',
    dishes: [
      {
        slug: 'jus-orange',
        name: 'Jus d’orange pressé',
        description: 'Pressé à la commande, rien d’ajouté.',
        price: 250,
        markers: ['vegetarien'],
      },
      {
        slug: 'cherbet',
        name: 'Cherbet aux amandes',
        description: 'Amandes mixées, lait, une pointe d’eau de rose.',
        price: 200,
        markers: ['vegetarien'],
      },
      {
        slug: 'avocat',
        name: 'Avocat au lait',
        description: 'Avocat frais, lait, miel. Servi bien froid.',
        price: 350,
        markers: ['vegetarien'],
      },
      {
        slug: 'limonade',
        name: 'Limonade à la menthe',
        description: 'Citron pressé, menthe pilée, eau gazeuse.',
        price: 200,
        markers: ['vegetarien', 'nouveau'],
      },
    ],
  },
  {
    slug: 'ftour',
    name: 'Petit-déjeuner',
    dishes: [
      {
        slug: 'msemen',
        name: 'Msemen au miel',
        description: 'Deux crêpes feuilletées, miel de jujubier.',
        price: 250,
        markers: ['vegetarien'],
      },
      {
        slug: 'baghrir',
        name: 'Baghrir beurre et miel',
        description: 'La crêpe mille trous, beurre fondu par-dessus.',
        price: 300,
        markers: ['vegetarien'],
      },
      {
        slug: 'harcha',
        name: 'Harcha au fromage',
        description: 'Semoule dorée à la poêle, fromage frais.',
        price: 250,
        markers: ['vegetarien'],
      },
      {
        slug: 'khobz-dar',
        name: 'Pain maison, beurre et confiture',
        description: 'Cuit le matin même. Confiture de figues.',
        price: 200,
        markers: ['vegetarien'],
      },
    ],
  },
  {
    slug: 'sale',
    name: 'Salé',
    dishes: [
      {
        slug: 'karantika',
        name: 'Karantika',
        description: 'Flan de pois chiches cuit au four, cumin et harissa à part.',
        price: 150,
        markers: ['vegetarien'],
      },
      {
        slug: 'bourek-viande',
        name: 'Bourek à la viande',
        description: 'Viande hachée, oignon, persil. Quatre pièces.',
        price: 300,
        markers: [],
      },
      {
        slug: 'mhadjeb',
        name: 'M’hadjeb au piment',
        description: 'Farce tomate-oignon relevée, galette pliée à la main.',
        price: 250,
        markers: ['vegetarien', 'epice'],
      },
      {
        slug: 'chakhchoukha',
        name: 'Chakhchoukha',
        description: 'Galette émiettée, sauce rouge, pois chiches et agneau.',
        price: 600,
        markers: [],
      },
      {
        slug: 'tadjine-zitoun',
        name: 'Tadjine zitoun',
        description: 'Poulet, olives vertes dessalées, citron confit.',
        price: 700,
        markers: [],
      },
    ],
  },
  {
    slug: 'douceurs',
    name: 'Douceurs',
    dishes: [
      {
        slug: 'qalb-louz',
        name: 'Qalb el louz',
        description: 'Semoule et amandes, sirop parfumé à la fleur d’oranger.',
        price: 150,
        markers: ['vegetarien'],
      },
      {
        slug: 'zlabia',
        name: 'Zlabia',
        description: 'Croustillante, trempée au miel. Servie tiède.',
        price: 120,
        markers: ['vegetarien'],
      },
      {
        slug: 'makrout',
        name: 'Makrout aux dattes',
        description: 'Dattes de Biskra, semoule, frit puis trempé.',
        price: 150,
        markers: ['vegetarien'],
      },
      {
        slug: 'baklawa',
        name: 'Baklawa',
        description: 'Feuilles fines, amandes, miel. Deux pièces.',
        price: 200,
        markers: ['vegetarien', 'nouveau'],
      },
    ],
  },
];

/** Textes d'interface de la démonstration. */
export const menuUi = {
  filtersLabel: 'Filtrer la carte',
  filtersClear: 'Tout afficher',
  empty: 'Aucun plat ne correspond à ce filtre.',
  currency: 'DA',
  call: 'Appeler le serveur',
  callTitle: 'Appeler le serveur',
  callTable: 'Numéro de table',
  callSend: 'Envoyer l’appel',
  callCancel: 'Annuler',
  callDone: 'C’est noté — un serveur arrive à votre table.',
  callDemo: 'Démonstration : aucun message n’est réellement envoyé.',
  photoSoon: 'Photo à venir',
  poster: 'Affiche à imprimer',
  open: 'Ouvert maintenant',
  closed: 'Fermé',
} satisfies Record<string, string>;
