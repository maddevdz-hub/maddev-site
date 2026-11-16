import type { NomPhotoBoutique } from './boutique-photos';

/**
 * Données de la démonstration « Nadâ — parfums & soins ».
 *
 * TOUT EST FICTIF : la marque, les produits, les prix, les stocks, les
 * conditions. Les prix sont des ordres de grandeur réalistes pour le marché
 * algérien, pas les tarifs d'une vraie boutique — la vitrine l'écrit une
 * fois, discrètement, près des prix (« Tarifs de démonstration »).
 *
 * Aucun numéro de téléphone n'apparaît dans la démo : WhatsApp s'ouvre sans
 * destinataire, avec le message pré-rempli.
 */

export type Famille = 'floral' | 'ambre' | 'boise' | 'frais';

export const familles: Record<Famille, string> = {
  floral: 'Floral',
  ambre: 'Ambré',
  boise: 'Boisé',
  frais: 'Frais',
};

export type Contenance = {
  /** Libellé affiché : « 50 ml ». */
  ml: number;
  prix: number;
};

export type Produit = {
  slug: string;
  nom: string;
  /** Eau de parfum, huile, soin… */
  nature: string;
  /** Le parfum comme une page de carnet. */
  carnet?: {
    /** En-tête de la page : son lieu, comme une note de carnet. */
    lieu: string;
    /** Le premier mot du carnet — ce qu'on sent d'abord. */
    premiereImpression: string;
    /** L'histoire du parfum, en deux ou trois phrases. */
    recit: string;
    notes: { tete: string; coeur: string; fond: string };
  };
  famille?: Famille;
  /**
   * Couleur du parfum : son ruban adhésif, sa pastille, ses filets. Jamais
   * un fond de page — le papier reste crème partout. Aplats seulement : ces
   * teintes ne portent pas de texte.
   */
  accent: string;
  contenances: Contenance[];
  photos: NomPhotoBoutique[];
  /** Stock de départ de la démo ; l'admin le modifie ensuite. */
  stock: number;
  nouveau?: boolean;
};

export const produits: Produit[] = [
  {
    slug: 'rose-de-blida',
    nom: 'Rose de Blida',
    nature: 'Eau de parfum',
    famille: 'floral',
    accent: '#b4566a',
    carnet: {
      lieu: 'Blida, la Mitidja',
      premiereImpression: 'Une rose qu’on vient de couper, et du poivre rose qui pique un peu le nez.',
      recit:
        'Elle s’ouvre vive, presque verte, puis la rose prend toute la place. Le soir, il ne reste qu’un musc doux sur la peau. Le parfum qu’on porte pour sortir.',
      notes: {
        tete: 'bergamote, poivre rose',
        coeur: 'rose de Damas, pivoine',
        fond: 'musc, bois de santal',
      },
    },
    contenances: [
      { ml: 50, prix: 4500 },
      { ml: 100, prix: 6900 },
    ],
    photos: ['rose-de-blida', 'rose-de-blida-2', 'rose-de-blida-3'],
    stock: 3,
    nouveau: true,
  },
  {
    slug: 'ambre-du-sahara',
    nom: 'Ambre du Sahara',
    nature: 'Eau de parfum',
    famille: 'ambre',
    accent: '#c69456',
    carnet: {
      lieu: 'Timimoun, le Grand Erg',
      premiereImpression: 'Du sable encore chaud à la tombée du jour.',
      recit:
        'Un ambre rond, épicé au départ, qui finit sur la vanille. Il tient la journée entière et laisse un sillage qu’on remarque.',
      notes: {
        tete: 'safran, cardamome',
        coeur: 'ambre, ciste',
        fond: 'vanille, benjoin',
      },
    },
    contenances: [
      { ml: 50, prix: 4800 },
      { ml: 100, prix: 7400 },
    ],
    photos: ['ambre-du-sahara', 'ambre-du-sahara-2'],
    stock: 12,
  },
  {
    slug: 'neroli-de-tipaza',
    nom: 'Néroli de Tipaza',
    nature: 'Eau de parfum',
    famille: 'frais',
    accent: '#3f7a8c',
    carnet: {
      lieu: 'Tipaza, la côte',
      premiereImpression: 'Des fleurs d’oranger, et l’air de la mer juste derrière.',
      recit:
        'Frais, léger, lumineux. Les agrumes partent vite, la fleur d’oranger reste. Pour l’été, ou pour le bureau.',
      notes: {
        tete: 'bergamote, citron',
        coeur: 'néroli, fleur d’oranger',
        fond: 'musc blanc, ambrette',
      },
    },
    contenances: [
      { ml: 50, prix: 4300 },
      { ml: 100, prix: 6500 },
    ],
    photos: ['neroli-de-tipaza'],
    stock: 20,
    nouveau: true,
  },
  {
    slug: 'musc-blanc',
    nom: 'Musc blanc',
    nature: 'Eau de parfum',
    famille: 'floral',
    accent: '#a39d95',
    carnet: {
      lieu: 'Venu de plus loin',
      premiereImpression: 'Du linge propre qui sèche au soleil.',
      recit:
        'Un musc poudré, discret, qui reste près de la peau. Celui qu’on met tous les jours sans y penser.',
      notes: {
        tete: 'poire, bergamote',
        coeur: 'fleur de coton, iris',
        fond: 'musc blanc, ambrette',
      },
    },
    contenances: [
      { ml: 50, prix: 4200 },
      { ml: 100, prix: 6400 },
    ],
    // La seconde vue est grise, hors palette : toujours en dernier.
    photos: ['musc-blanc', 'musc-blanc-2'],
    stock: 15,
  },
  {
    slug: 'huile-d-oud',
    nom: 'Huile d’oud',
    nature: 'Huile parfumée',
    famille: 'boise',
    accent: '#5a3a28',
    carnet: {
      lieu: 'Venue de plus loin',
      premiereImpression: 'Du bois, de la fumée, une pointe de cuir.',
      recit:
        'Une huile concentrée, à poser en quelques gouttes au creux du poignet. Elle tient du matin au soir. Flacon d’apothicaire de 12 ml.',
      notes: {
        tete: 'safran',
        coeur: 'bois d’oud, rose',
        fond: 'cuir, encens',
      },
    },
    contenances: [{ ml: 12, prix: 3900 }],
    photos: ['huile-d-oud'],
    stock: 6,
  },
  {
    slug: 'coffret-decouverte',
    nom: 'Le coffret découverte',
    nature: 'Coffret',
    accent: '#a4672b',
    contenances: [{ ml: 40, prix: 9500 }],
    photos: ['coffret', 'coffret-2'],
    stock: 8,
  },
  {
    slug: 'creme-mains',
    nom: 'Crème mains',
    nature: 'Soin',
    accent: '#a4672b',
    contenances: [{ ml: 50, prix: 1600 }],
    photos: ['creme-mains'],
    stock: 25,
  },
  {
    slug: 'brume-cheveux',
    nom: 'Brume cheveux',
    nature: 'Soin',
    accent: '#a4672b',
    contenances: [{ ml: 100, prix: 2200 }],
    photos: ['brume-cheveux'],
    stock: 18,
  },
];

/** Le contenu du coffret : quatre parfums en 10 ml. L'huile d'oud n'y est pas, elle n'existe qu'en 12 ml. */
export const contenuCoffret = ['rose-de-blida', 'ambre-du-sahara', 'neroli-de-tipaza', 'musc-blanc'];

/** Le sommaire de l'accueil : « Six parfums, six pages ». */
export const sommaire = [
  'rose-de-blida',
  'ambre-du-sahara',
  'neroli-de-tipaza',
  'musc-blanc',
  'huile-d-oud',
  'coffret-decouverte',
];

export function produit(slug: string): Produit | undefined {
  return produits.find((p) => p.slug === slug);
}

/** Prix le plus bas d'un produit : « dès 4 500 DA ». */
export function prixDepart(p: Produit): number {
  return Math.min(...p.contenances.map((c) => c.prix));
}

/** 4500 → « 4 500 DA », espace fine insécable comme séparateur de milliers. */
export function formatDA(montant: number): string {
  return `${montant.toLocaleString('fr-FR').replace(/\s/g, ' ')} DA`;
}

/**
 * WhatsApp sans destinataire : l'application s'ouvre et le visiteur choisit
 * le contact. La démo n'affiche aucun numéro de téléphone.
 */
export function lienWhatsApp(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export const marque = {
  nom: 'Nadâ',
  signature: 'parfums & soins',
  horaires: 'du samedi au jeudi, de 9 h à 18 h',
  reassurance: ['Paiement à la livraison', 'Livraison dans toutes les wilayas', 'Échange sous 7 jours'],
};
