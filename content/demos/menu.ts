import type { Bilingual, DemoBrand } from './types';

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
  tagline: Bilingual;
  address: Bilingual;
  hours: Bilingual;
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
  name: { fr: 'Café Zitouna', ar: 'مقهى الزيتونة' },
  sector: { fr: 'Café — carte à QR code', ar: 'مقهى — قائمة بكود QR' },
  solves: {
    fr: 'La carte change en trente secondes, sans rien réimprimer.',
    ar: 'تتغيّر القائمة في ثلاثين ثانية، دون إعادة طباعة.',
  },
  tagline: {
    fr: 'Café de quartier, ouvert depuis le matin',
    ar: 'مقهى الحي، مفتوح منذ الصباح',
  },
  address: { fr: '12 rue des Oliviers, Alger', ar: '12 شارع الزيتون، الجزائر' },
  hours: { fr: 'Tous les jours, 7h – 23h', ar: 'كل يوم، من 7:00 إلى 23:00' },
  /** Bornes réelles, en heures locales : l'indicateur d'ouverture les lit. */
  opensAt: 7,
  closesAt: 23,
  phoneDisplay: '+213 21 00 00 00',
};

/** Marqueurs affichés sur les plats. */
export type Marker = 'vegetarien' | 'epice' | 'nouveau';

export type Dish = {
  slug: string;
  name: Bilingual;
  description: Bilingual;
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
  name: Bilingual;
  dishes: Dish[];
};

export const markerLabels: Record<Marker, Bilingual> = {
  vegetarien: { fr: 'Végétarien', ar: 'نباتي' },
  epice: { fr: 'Épicé', ar: 'حار' },
  nouveau: { fr: 'Nouveau', ar: 'جديد' },
};

export const menu: MenuCategory[] = [
  {
    slug: 'cafes',
    name: { fr: 'Cafés et thés', ar: 'قهوة وشاي' },
    dishes: [
      {
        slug: 'qahwa-arbia',
        name: { fr: 'Café arabe', ar: 'قهوة عربية' },
        description: {
          fr: 'Serré, à la cardamome, servi avec un verre d’eau.',
          ar: 'مركّزة، بالهيل، تُقدَّم مع كوب ماء.',
        },
        price: 120,
        markers: [],
      },
      {
        slug: 'qahwa-halib',
        name: { fr: 'Café au lait', ar: 'قهوة بالحليب' },
        description: {
          fr: 'Lait entier chauffé à la vapeur, mousse légère.',
          ar: 'حليب كامل مسخَّن بالبخار، ورغوة خفيفة.',
        },
        price: 150,
        markers: [],
      },
      {
        slug: 'atay-nanaa',
        name: { fr: 'Thé à la menthe', ar: 'شاي بالنعناع' },
        description: {
          fr: 'Menthe fraîche, servi en théière pour deux verres.',
          ar: 'نعناع طازج، يُقدَّم في إبريق يكفي كوبين.',
        },
        price: 120,
        markers: ['vegetarien'],
      },
      {
        slug: 'qahwa-bayda',
        name: {
          fr: 'Café blanc à la fleur d’oranger',
          ar: 'قهوة بيضاء بماء الزهر',
        },
        description: {
          fr: 'Sans caféine, eau de fleur d’oranger distillée à la maison.',
          ar: 'دون كافيين، بماء الزهر المقطَّر في البيت.',
        },
        price: 150,
        markers: ['vegetarien', 'nouveau'],
      },
      {
        slug: 'chocolat',
        name: { fr: 'Chocolat chaud', ar: 'شوكولاتة ساخنة' },
        description: {
          fr: 'Chocolat noir fondu, crème fouettée en option.',
          ar: 'شوكولاتة داكنة مذابة، مع كريمة مخفوقة عند الطلب.',
        },
        price: 250,
        markers: ['vegetarien'],
      },
    ],
  },
  {
    slug: 'jus',
    name: { fr: 'Jus et boissons fraîches', ar: 'عصائر ومشروبات باردة' },
    dishes: [
      {
        slug: 'jus-orange',
        name: { fr: 'Jus d’orange pressé', ar: 'عصير برتقال طازج' },
        description: {
          fr: 'Pressé à la commande, rien d’ajouté.',
          ar: 'يُعصَر عند الطلب، دون أي إضافة.',
        },
        price: 250,
        markers: ['vegetarien'],
      },
      {
        slug: 'cherbet',
        name: { fr: 'Cherbet aux amandes', ar: 'شربات باللوز' },
        description: {
          fr: 'Amandes mixées, lait, une pointe d’eau de rose.',
          ar: 'لوز مطحون، حليب، ولمسة من ماء الورد.',
        },
        price: 200,
        markers: ['vegetarien'],
      },
      {
        slug: 'avocat',
        name: { fr: 'Avocat au lait', ar: 'أفوكادو بالحليب' },
        description: {
          fr: 'Avocat frais, lait, miel. Servi bien froid.',
          ar: 'أفوكادو طازج، حليب، وعسل. يُقدَّم باردًا.',
        },
        price: 350,
        markers: ['vegetarien'],
      },
      {
        slug: 'limonade',
        name: { fr: 'Limonade à la menthe', ar: 'ليموناضة بالنعناع' },
        description: {
          fr: 'Citron pressé, menthe pilée, eau gazeuse.',
          ar: 'ليمون معصور، نعناع مهروس، وماء غازي.',
        },
        price: 200,
        markers: ['vegetarien', 'nouveau'],
      },
    ],
  },
  {
    slug: 'ftour',
    name: { fr: 'Petit-déjeuner', ar: 'فطور الصباح' },
    dishes: [
      {
        slug: 'msemen',
        name: { fr: 'Msemen au miel', ar: 'مسمّن بالعسل' },
        description: {
          fr: 'Deux crêpes feuilletées, miel de jujubier.',
          ar: 'قطعتان من المسمّن، مع عسل السدر.',
        },
        price: 250,
        markers: ['vegetarien'],
      },
      {
        slug: 'baghrir',
        name: { fr: 'Baghrir beurre et miel', ar: 'بغرير بالزبدة والعسل' },
        description: {
          fr: 'La crêpe mille trous, beurre fondu par-dessus.',
          ar: 'بغرير بألف ثقب، مع زبدة ذائبة فوقه.',
        },
        price: 300,
        markers: ['vegetarien'],
      },
      {
        slug: 'harcha',
        name: { fr: 'Harcha au fromage', ar: 'حرشة بالجبن' },
        description: {
          fr: 'Semoule dorée à la poêle, fromage frais.',
          ar: 'سميد مُحمَّص في المقلاة، مع جبن طازج.',
        },
        price: 250,
        markers: ['vegetarien'],
      },
      {
        slug: 'khobz-dar',
        name: {
          fr: 'Pain maison, beurre et confiture',
          ar: 'خبز الدار بالزبدة والمربى',
        },
        description: {
          fr: 'Cuit le matin même. Confiture de figues.',
          ar: 'مخبوز صباح اليوم نفسه، مع مربى التين.',
        },
        price: 200,
        markers: ['vegetarien'],
      },
    ],
  },
  {
    slug: 'sale',
    name: { fr: 'Salé', ar: 'مملّحات' },
    dishes: [
      {
        slug: 'karantika',
        name: { fr: 'Karantika', ar: 'كرنتيكا' },
        description: {
          fr: 'Flan de pois chiches cuit au four, cumin et harissa à part.',
          ar: 'عجينة حمّص مخبوزة في الفرن، الكمّون والهريسة جانبًا.',
        },
        price: 150,
        markers: ['vegetarien'],
      },
      {
        slug: 'bourek-viande',
        name: { fr: 'Bourek à la viande', ar: 'بوراك باللحم' },
        description: {
          fr: 'Viande hachée, oignon, persil. Quatre pièces.',
          ar: 'لحم مفروم، بصل، وبقدونس. أربع قطع.',
        },
        price: 300,
        markers: [],
      },
      {
        slug: 'mhadjeb',
        name: { fr: 'M’hadjeb au piment', ar: 'محاجب بالفلفل الحار' },
        description: {
          fr: 'Farce tomate-oignon relevée, galette pliée à la main.',
          ar: 'حشوة طماطم وبصل حارّة، والعجين مطوي يدويًا.',
        },
        price: 250,
        markers: ['vegetarien', 'epice'],
      },
      {
        slug: 'chakhchoukha',
        name: { fr: 'Chakhchoukha', ar: 'شخشوخة' },
        description: {
          fr: 'Galette émiettée, sauce rouge, pois chiches et agneau.',
          ar: 'رقاق مفتَّت، مرق أحمر، حمّص ولحم ضأن.',
        },
        price: 600,
        markers: [],
      },
      {
        slug: 'tadjine-zitoun',
        name: { fr: 'Tadjine zitoun', ar: 'طاجين زيتون' },
        description: {
          fr: 'Poulet, olives vertes dessalées, citron confit.',
          ar: 'دجاج، زيتون أخضر منزوع الملوحة، وليمون مصبَّر.',
        },
        price: 700,
        markers: [],
      },
    ],
  },
  {
    slug: 'douceurs',
    name: { fr: 'Douceurs', ar: 'حلويات' },
    dishes: [
      {
        slug: 'qalb-louz',
        name: { fr: 'Qalb el louz', ar: 'قلب اللوز' },
        description: {
          fr: 'Semoule et amandes, sirop parfumé à la fleur d’oranger.',
          ar: 'سميد ولوز، مع قطر معطَّر بماء الزهر.',
        },
        price: 150,
        markers: ['vegetarien'],
      },
      {
        slug: 'zlabia',
        name: { fr: 'Zlabia', ar: 'زلابية' },
        description: {
          fr: 'Croustillante, trempée au miel. Servie tiède.',
          ar: 'مقرمشة، مغموسة في العسل. تُقدَّم دافئة.',
        },
        price: 120,
        markers: ['vegetarien'],
      },
      {
        slug: 'makrout',
        name: { fr: 'Makrout aux dattes', ar: 'مقروط بالتمر' },
        description: {
          fr: 'Dattes de Biskra, semoule, frit puis trempé.',
          ar: 'تمر من بسكرة، سميد، يُقلى ثم يُغمس.',
        },
        price: 150,
        markers: ['vegetarien'],
      },
      {
        slug: 'baklawa',
        name: { fr: 'Baklawa', ar: 'بقلاوة' },
        description: {
          fr: 'Feuilles fines, amandes, miel. Deux pièces.',
          ar: 'رقائق رفيعة، لوز، وعسل. قطعتان.',
        },
        price: 200,
        markers: ['vegetarien', 'nouveau'],
      },
    ],
  },
];

/** Textes d'interface de la démonstration. */
export const menuUi = {
  filtersLabel: { fr: 'Filtrer la carte', ar: 'تصفية القائمة' },
  filtersClear: { fr: 'Tout afficher', ar: 'عرض الكل' },
  empty: {
    fr: 'Aucun plat ne correspond à ce filtre.',
    ar: 'لا يوجد طبق يطابق هذا الاختيار.',
  },
  currency: { fr: 'DA', ar: 'دج' },
  call: { fr: 'Appeler le serveur', ar: 'نداء النادل' },
  callTitle: { fr: 'Appeler le serveur', ar: 'نداء النادل' },
  callTable: { fr: 'Numéro de table', ar: 'رقم الطاولة' },
  callSend: { fr: 'Envoyer l’appel', ar: 'إرسال النداء' },
  callCancel: { fr: 'Annuler', ar: 'إلغاء' },
  callDone: {
    fr: 'C’est noté — un serveur arrive à votre table.',
    ar: 'تم التسجيل — النادل في طريقه إلى طاولتك.',
  },
  callDemo: {
    fr: 'Démonstration : aucun message n’est réellement envoyé.',
    ar: 'نموذج توضيحي: لا تُرسَل أي رسالة فعليًا.',
  },
  photoSoon: { fr: 'Photo à venir', ar: 'الصورة قريبًا' },
  poster: { fr: 'Affiche à imprimer', ar: 'ملصق للطباعة' },
  open: { fr: 'Ouvert maintenant', ar: 'مفتوح الآن' },
  closed: { fr: 'Fermé', ar: 'مغلق' },
} satisfies Record<string, Bilingual>;
