import type { DishArtName } from '@/components/demo/menu/DishArt';
import type { photos } from './menu-photos';
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

/**
 * Allergènes.
 *
 * Réels et vérifiables plat par plat : c'est une information de sécurité, pas
 * un ornement. Une liste vide se dit « aucun allergène déclaré » et non « — ».
 */
export type Allergen = 'gluten' | 'lait' | 'oeuf' | 'fruits-a-coque';

export type Dish = {
  slug: string;
  name: string;
  /** Une ligne, lisible dans la liste. */
  description: string;
  /** Le texte du panneau : ce qu'un serveur répondrait si on demandait. */
  detail: string;
  /** En dinars. Rond, illustratif. */
  price: number;
  markers: Marker[];
  allergens: Allergen[];
  /**
   * L'illustration du plat. Facultative : sans elle, le plat reprend celle de
   * sa catégorie. Jamais d'initiale dans un carré — sur une carte de café,
   * c'est le pire endroit où économiser, personne ne commande un plat qu'il
   * ne voit pas.
   */
  art?: DishArtName;
  /**
   * Photo du plat, si un jour le client en fournit. Déposer le fichier dans
   * public/demo/menu/ puis renseigner ce champ : elle remplacera le dessin.
   */
  image?: string;
};

export type MenuCategory = {
  slug: string;
  name: string;
  /** L'illustration de repli des plats de la catégorie. */
  art: DishArtName;
  /**
   * Le bandeau photographique de la section, au-dessus de la liste.
   *
   * UN bandeau par catégorie — jamais la même photo répétée en vignette sur
   * chaque plat : cinq fois la même image dans un écran se voit
   * immédiatement et fait bâclé.
   */
  banner?: keyof typeof photos;
  dishes: Dish[];
};

export const markerLabels: Record<Marker, string> = {
  vegetarien: 'Végétarien',
  epice: 'Épicé',
  nouveau: 'Nouveau',
};

export const allergenLabels: Record<Allergen, string> = {
  gluten: 'Gluten',
  lait: 'Lait',
  oeuf: 'Œuf',
  'fruits-a-coque': 'Fruits à coque',
};

export const menu: MenuCategory[] = [
  {
    slug: 'cafes',
    name: 'Cafés et thés',
    art: 'tasse',
    banner: 'bandeau-cafes.webp',
    dishes: [
      {
        slug: 'qahwa-arbia',
        name: 'Café arabe',
        description: 'Serré, à la cardamome, servi avec un verre d’eau.',
        detail:
          'Grains torréfiés foncé, moulus à la minute, cardamome pilée dans la mouture. Servi en tasse épaisse avec un verre d’eau fraîche, comme il se doit.',
        price: 120,
        markers: [],
        allergens: [],
        art: 'tasse',
      },
      {
        slug: 'qahwa-halib',
        name: 'Café au lait',
        description: 'Lait entier chauffé à la vapeur, mousse légère.',
        detail:
          'Un expresso allongé de lait entier monté à la vapeur. Mousse fine, pas de crème. Demandez-le plus serré si vous le préférez ainsi.',
        price: 150,
        markers: [],
        allergens: ['lait'],
        art: 'tasse-mousse',
      },
      {
        slug: 'atay-nanaa',
        name: 'Thé à la menthe',
        description: 'Menthe fraîche, servi en théière pour deux verres.',
        detail:
          'Thé vert gunpowder, menthe fraîche coupée le matin, sucre à part. La théière fait deux verres — on la remplit une seconde fois sans supplément.',
        price: 120,
        markers: ['vegetarien'],
        allergens: [],
        art: 'theiere',
      },
      {
        slug: 'qahwa-bayda',
        name: 'Café blanc à la fleur d’oranger',
        description: 'Sans caféine, eau de fleur d’oranger distillée à la maison.',
        detail:
          'Ce n’est pas du café : de l’eau chaude et quelques gouttes d’eau de fleur d’oranger que l’on distille nous-mêmes au printemps. Sans caféine, on en boit le soir.',
        price: 150,
        markers: ['vegetarien', 'nouveau'],
        allergens: [],
        art: 'tasse',
      },
      {
        slug: 'chocolat',
        name: 'Chocolat chaud',
        description: 'Chocolat noir fondu, crème fouettée en option.',
        detail:
          'Chocolat noir fondu dans du lait chaud, jamais de poudre. La crème fouettée se demande au moment de commander — elle est faite ici.',
        price: 250,
        markers: ['vegetarien'],
        allergens: ['lait'],
        art: 'tasse-mousse',
      },
    ],
  },
  {
    slug: 'jus',
    name: 'Jus et boissons fraîches',
    art: 'verre-agrume',
    dishes: [
      {
        slug: 'jus-orange',
        name: 'Jus d’orange pressé',
        description: 'Pressé à la commande, rien d’ajouté.',
        detail:
          'Quatre oranges par verre, pressées devant vous. Ni sucre, ni eau, ni glaçon sauf si vous en demandez.',
        price: 250,
        markers: ['vegetarien'],
        allergens: [],
        art: 'verre-agrume',
      },
      {
        slug: 'cherbet',
        name: 'Cherbet aux amandes',
        description: 'Amandes mixées, lait, une pointe d’eau de rose.',
        detail:
          'Amandes trempées la veille puis mixées avec du lait froid et une pointe d’eau de rose. Épais, se boit lentement.',
        price: 200,
        markers: ['vegetarien'],
        allergens: ['fruits-a-coque', 'lait'],
        art: 'verre-lait',
      },
      {
        slug: 'avocat',
        name: 'Avocat au lait',
        description: 'Avocat frais, lait, miel. Servi bien froid.',
        detail:
          'Un avocat entier, du lait, une cuillère de miel. Rien d’autre. On le prépare à la commande, il ne tient pas.',
        price: 350,
        markers: ['vegetarien'],
        allergens: ['lait'],
        art: 'verre-avocat',
      },
      {
        slug: 'limonade',
        name: 'Limonade à la menthe',
        description: 'Citron pressé, menthe pilée, eau gazeuse.',
        detail:
          'Citrons pressés, menthe pilée au mortier, eau gazeuse ajoutée au dernier moment pour garder les bulles. Peu sucrée.',
        price: 200,
        markers: ['vegetarien', 'nouveau'],
        allergens: [],
        art: 'verre-menthe',
      },
    ],
  },
  {
    slug: 'ftour',
    name: 'Petit-déjeuner',
    art: 'galette',
    dishes: [
      {
        slug: 'msemen',
        name: 'Msemen au miel',
        description: 'Deux crêpes feuilletées, miel de jujubier.',
        detail:
          'Pâte pliée et repliée à la main, cuite sur la plaque à la commande. Deux pièces, miel de jujubier servi à côté pour que le feuilleté reste croustillant.',
        price: 250,
        markers: ['vegetarien'],
        allergens: ['gluten'],
        art: 'galette-miel',
      },
      {
        slug: 'baghrir',
        name: 'Baghrir beurre et miel',
        description: 'La crêpe mille trous, beurre fondu par-dessus.',
        detail:
          'La crêpe aux mille trous, faite avec de la semoule fine et de la levure. Beurre fondu versé dessus au dernier moment, miel à part.',
        price: 300,
        markers: ['vegetarien'],
        allergens: ['gluten', 'lait'],
        art: 'galette',
      },
      {
        slug: 'harcha',
        name: 'Harcha au fromage',
        description: 'Semoule dorée à la poêle, fromage frais.',
        detail:
          'Galette de semoule dorée à la poêle, ouverte en deux et garnie de fromage frais. Se mange chaude, sinon elle durcit.',
        price: 250,
        markers: ['vegetarien'],
        allergens: ['gluten', 'lait'],
        art: 'galette',
      },
      {
        slug: 'khobz-dar',
        name: 'Pain maison, beurre et confiture',
        description: 'Cuit le matin même. Confiture de figues.',
        detail:
          'Pain de semoule cuit le matin même au four du quartier. Beurre doux et confiture de figues que l’on fait à la fin de l’été.',
        price: 200,
        markers: ['vegetarien'],
        allergens: ['gluten', 'lait'],
        art: 'pain',
      },
    ],
  },
  {
    slug: 'sale',
    name: 'Salé',
    art: 'feuillete',
    dishes: [
      {
        slug: 'karantika',
        name: 'Karantika',
        description: 'Flan de pois chiches cuit au four, cumin et harissa à part.',
        detail:
          'Farine de pois chiches, eau, huile, cuite au four jusqu’à ce que le dessus dore. Servie tiède, cumin et harissa apportés à part — c’est vous qui dosez.',
        price: 150,
        markers: ['vegetarien'],
        allergens: ['oeuf'],
        art: 'plat-dore',
      },
      {
        slug: 'bourek-viande',
        name: 'Bourek à la viande',
        description: 'Viande hachée, oignon, persil. Quatre pièces.',
        detail:
          'Feuille de brick roulée à la main, viande hachée revenue avec oignon et persil, frite à la commande. Quatre pièces, servies avec un quartier de citron.',
        price: 300,
        markers: [],
        allergens: ['gluten', 'oeuf'],
        art: 'bourek',
      },
      {
        slug: 'mhadjeb',
        name: 'M’hadjeb au piment',
        description: 'Farce tomate-oignon relevée, galette pliée à la main.',
        detail:
          'Galette de semoule étirée à la main jusqu’à la transparence, garnie d’une farce tomate-oignon relevée au piment, puis pliée en carré et cuite sur la plaque.',
        price: 250,
        markers: ['vegetarien', 'epice'],
        allergens: ['gluten'],
        art: 'feuillete',
      },
      {
        slug: 'chakhchoukha',
        name: 'Chakhchoukha',
        description: 'Galette émiettée, sauce rouge, pois chiches et agneau.',
        detail:
          'Galette rougag émiettée à la main, arrosée d’une sauce tomate longuement mijotée avec pois chiches et morceaux d’agneau. Le plat du dimanche, servi tous les jours ici.',
        price: 600,
        markers: [],
        allergens: ['gluten'],
        art: 'plat-rouge',
      },
      {
        slug: 'tadjine-zitoun',
        name: 'Tadjine zitoun',
        description: 'Poulet, olives vertes dessalées, citron confit.',
        detail:
          'Poulet mijoté avec des olives vertes dessalées la veille et du citron confit maison. Sauce blanche, servie avec du pain pour saucer.',
        price: 700,
        markers: [],
        allergens: [],
        art: 'plat-olive',
      },
    ],
  },
  {
    slug: 'douceurs',
    name: 'Douceurs',
    art: 'losange',
    dishes: [
      {
        slug: 'qalb-louz',
        name: 'Qalb el louz',
        description: 'Semoule et amandes, sirop parfumé à la fleur d’oranger.',
        detail:
          'Semoule grossière et amandes, cuite au four puis imbibée d’un sirop à la fleur d’oranger pendant qu’elle est encore chaude. Coupée en losanges.',
        price: 150,
        markers: ['vegetarien'],
        allergens: ['fruits-a-coque'],
        art: 'losange',
      },
      {
        slug: 'zlabia',
        name: 'Zlabia',
        description: 'Croustillante, trempée au miel. Servie tiède.',
        detail:
          'Pâte coulée en spirale dans l’huile chaude, puis trempée dans le miel encore brûlante. Croustillante dehors, sirupeuse dedans.',
        price: 120,
        markers: ['vegetarien'],
        allergens: ['gluten'],
        art: 'spirale',
      },
      {
        slug: 'makrout',
        name: 'Makrout aux dattes',
        description: 'Dattes de Biskra, semoule, frit puis trempé.',
        detail:
          'Pâte de semoule garnie de dattes de Biskra écrasées à la cannelle, découpée en losanges, frite puis trempée dans le miel.',
        price: 150,
        markers: ['vegetarien'],
        allergens: ['gluten'],
        art: 'losange',
      },
      {
        slug: 'baklawa',
        name: 'Baklawa',
        description: 'Feuilles fines, amandes, miel. Deux pièces.',
        detail:
          'Feuilles de pâte superposées avec des amandes concassées, cuites lentement puis nappées de miel. Deux pièces par portion.',
        price: 200,
        markers: ['vegetarien', 'nouveau'],
        allergens: ['fruits-a-coque', 'gluten'],
        art: 'losange',
      },
    ],
  },
];

/**
 * Les suggestions du jour.
 *
 * Toute carte pensée pour vendre met deux ou trois plats en avant : sans
 * cela, le regard se pose au hasard et le client reprend ce qu'il connaît.
 * On désigne des plats EXISTANTS de la carte — pas une offre parallèle qu'il
 * faudrait tenir à jour deux fois.
 */
export const suggestions: { slug: string; note: string }[] = [
  // Notes courtes, tenant sur UNE ligne : sur deux, les trois cartes
  // prennent des hauteurs différentes et la rangée se déforme.
  { slug: 'tadjine-zitoun', note: 'Plat du jour' },
  { slug: 'msemen', note: 'Feuilleté ce matin' },
  { slug: 'qalb-louz', note: 'Sorti du four' },
];

/** Textes d'interface de la démonstration. */
export const menuUi = {
  filtersLabel: 'Filtrer la carte',
  filtersClear: 'Tout afficher',
  empty: 'Aucun plat ne correspond à ce filtre.',
  currency: 'DA',
  suggestionsTitle: 'Suggestions du jour',
  dish: 'plat',
  dishes: 'plats',
  allergensTitle: 'Allergènes',
  allergensNone: 'Aucun allergène déclaré.',
  add: 'Ajouter à ma commande',
  added: 'Ajouté',
  close: 'Fermer',
  order: 'Ma commande',
  orderEmpty: 'Votre commande est vide.',
  orderTotal: 'Total',
  orderRemove: 'Retirer',
  call: 'Appeler le serveur',
  callTitle: 'Appeler le serveur',
  callTable: 'Numéro de table',
  callSend: 'Envoyer l’appel',
  callCancel: 'Annuler',
  callDone: 'C’est noté — un serveur arrive à votre table.',
  callDemo: 'Démonstration : aucun message n’est réellement envoyé.',
  poster: 'Affiche à imprimer',
  open: 'Ouvert maintenant',
  closed: 'Fermé',
} satisfies Record<string, string>;
