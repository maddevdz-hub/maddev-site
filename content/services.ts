import type { Locale } from '@/i18n/config';

/**
 * L'offre du studio — LA source unique.
 *
 * ── Pourquoi ce fichier a été fusionné ─────────────────────────────────────
 * Il a existé deux listes de services en parallèle : celle-ci (quatre
 * entrées) et `content/showcase.ts` (six entrées, d'autres identifiants). La
 * page /services lisait la seconde, le formulaire de contact et le
 * configurateur lisaient la première. Conséquences observées :
 *
 *   - « Demander un devis » transmettait, depuis cinq blocs sur six, un
 *     identifiant que le formulaire ne connaissait pas ; l'email reçu
 *     affichait « Service : Non précisé ». La demande arrivait anonyme.
 *   - Le visiteur voyait six services sur la page et quatre dans le menu
 *     déroulant du formulaire.
 *   - La boutique annonçait « 4 à 6 semaines » ici et « 4 à 8 » là-bas.
 *   - Le quiz recommandait une « application web » qui n'existait sur aucune
 *     page : le visiteur repartait avec un nom qu'il ne retrouvait nulle part.
 *
 * Donc : un service se décrit ICI, et nulle part ailleurs. Un champ de délai,
 * un identifiant, un jeu de mots. Si une page a besoin d'un angle différent,
 * elle ajoute un champ à ce type — elle ne recopie pas la liste.
 *
 * ── L'ordre ────────────────────────────────────────────────────────────────
 * Il va du plus facile à décider au plus engageant. Un gérant de café dit oui
 * à un menu QR en trente secondes ; personne ne commande une campagne
 * publicitaire sur un premier écran. Le premier bloc détermine l'impression.
 *
 * ── Le registre ────────────────────────────────────────────────────────────
 * L'arabe est de l'arabe standard moderne — celui d'un journal économique
 * sérieux. Ni dialectal, ni littéraire. Le français dit ce que le client
 * obtient, jamais ce que nous fabriquons.
 */

export type Bilingual = Record<Locale, string>;
export type BilingualList = Record<Locale, string[]>;

/**
 * Le pictogramme du service. Un seul jeu pour tout le site — sommaire de
 * /services, cartes de l'accueil, résultat du configurateur : deux familles
 * de dessins pour la même liste finissaient toujours par diverger.
 * Tracés dans components/services/ServiceGlyphs.tsx.
 */
export type ServiceGlyphName =
  | 'qr'
  | 'agenda'
  | 'panier'
  | 'vitrine'
  | 'recherche'
  | 'megaphone'
  | 'engrenage'
  | 'anneaux';

/** Capture réelle de la démonstration, cadrée dans un mockup. */
export type ServiceVisualSpec = {
  kind: 'capture';
  src: string;
  frame: 'phone' | 'screen';
  width: number;
  height: number;
};

/** Une étape du parcours d'un service sans démonstration. */
export type ServiceJourneyStep = { title: Bilingual; text: Bilingual };

/** Un écran du parcours d'une démo, avec sa légende. */
export type ServiceStep = { src: string; caption: Bilingual };

export type Service = {
  /** Identifiant stable : ancre `/services#slug`, valeur du formulaire, clé d'email. */
  slug: string;
  /**
   * `principal` : un bloc entier sur /services, une carte sur l'accueil.
   * `secondaire` : une carte discrète en bas de /services. Le service existe
   * pour de bon — il se commande, il se chiffre — mais lui donner un bloc
   * déséquilibrerait la page en faveur d'une offre rare.
   */
  tier: 'principal' | 'secondaire';
  glyph: ServiceGlyphName;
  /**
   * Étiquette courte : tuile du sommaire, pied de page, menu déroulant du
   * formulaire, objet de l'email. Elle est courte parce que six tuiles
   * tiennent sur une rangée — un nom plus long y passe sur deux lignes et
   * déforme la grille.
   */
  name: Bilingual;
  /** Ce que ça résout, en trois ou quatre mots. Une tuile, pas un titre. */
  solves: Bilingual;
  /** Le titre montré au client : ce qu'il OBTIENT. */
  benefit: Bilingual;
  /** Deux lignes maximum, sous le bénéfice. */
  lead: Bilingual;
  /** Trois points concrets. Jamais plus : au-delà, une liste devient un mur. */
  points: BilingualList;
  /** LE délai indicatif. Il n'en existe pas d'autre ailleurs. */
  timeline: Bilingual;
  visual?: ServiceVisualSpec;
  /**
   * Services sans démonstration : le mécanisme en trois étapes — ce que fait
   * le client, ce que fait le site, ce que reçoit le commerçant. Remplace
   * les compositions qui imitaient une capture d'écran.
   */
  journey?: ServiceJourneyStep[];
  /** Lien vers la démonstration, quand elle existe. */
  demoHref?: string;
  /**
   * Le parcours de la démo en trois écrans réels (`npm run captures`).
   * Réservé aux services qui ont une démo : on ne légende pas ce qu'on ne
   * peut pas montrer.
   */
  steps?: ServiceStep[];
  /**
   * Projet réel plutôt que démonstration : le showroom de meubles.
   * Il ne porte PAS la mention « fictif » — ce serait mentir dans l'autre sens.
   */
  realClient?: { url: string; label: Bilingual };
};

export const services: Service[] = [
  {
    slug: 'menu-qr',
    tier: 'principal',
    glyph: 'qr',
    name: { fr: 'Menu QR', ar: 'قائمة QR' },
    solves: { fr: 'Votre carte, à jour', ar: 'قائمتك محدَّثة دائمًا' },
    benefit: {
      fr: 'Votre carte change en trente secondes',
      ar: 'قائمتك تتغيّر في ثلاثين ثانية',
    },
    lead: {
      fr: 'Vos clients scannent le code posé sur la table. Vous modifiez un prix depuis votre téléphone, la carte est à jour pour tout le monde.',
      ar: 'يمسح زبائنك الرمز الموضوع على الطاولة. تعدّل سعرًا من هاتفك، فتتحدّث القائمة للجميع.',
    },
    points: {
      fr: [
        'Le QR code, fourni prêt à imprimer',
        'Photos, prix et disponibilités que vous gérez seul',
        'Se lit d’une main, même sur un vieux téléphone',
      ],
      ar: [
        'رمز QR جاهز للطباعة',
        'الصور والأسعار والتوفّر تديرها بنفسك',
        'تُقرأ بيد واحدة، حتى على هاتف قديم',
      ],
    },
    timeline: { fr: '1 semaine', ar: 'أسبوع واحد' },
    visual: {
      kind: 'capture',
      src: '/services/capture-menu.png',
      frame: 'phone',
      width: 828,
      height: 1720,
    },
    demoHref: '/demo/menu',
    steps: [
      {
        src: '/services/etape-zitouna-1.png',
        caption: { fr: 'Le client scanne', ar: 'الزبون يمسح الرمز' },
      },
      {
        src: '/services/etape-zitouna-2.png',
        caption: { fr: 'Il lit la carte', ar: 'يتصفّح القائمة' },
      },
      {
        src: '/services/etape-zitouna-3.png',
        caption: { fr: 'Il appelle le serveur', ar: 'ينادي النادل' },
      },
    ],
  },
  {
    slug: 'prise-de-rendez-vous',
    tier: 'principal',
    glyph: 'agenda',
    name: { fr: 'Rendez-vous', ar: 'المواعيد' },
    solves: { fr: 'Fini les appels', ar: 'لا مزيد من المكالمات' },
    benefit: {
      fr: 'Votre téléphone cesse de sonner',
      ar: 'هاتفك يتوقّف عن الرنين',
    },
    lead: {
      fr: 'Vos clients réservent seuls, à toute heure. Le rappel de la veille part sur WhatsApp, et une annulation libère le créneau sans un appel.',
      ar: 'يحجز زبائنك بأنفسهم في أي وقت. يصل تذكير اليوم السابق عبر واتساب، والإلغاء يحرّر الموعد دون أي مكالمة.',
    },
    points: {
      fr: [
        'Créneaux calculés selon la durée de chaque soin',
        'Rappel WhatsApp automatique la veille',
        'Annulation autonome — le créneau se remplit à nouveau',
      ],
      ar: [
        'مواعيد تُحسب وفق مدّة كل خدمة',
        'تذكير تلقائي عبر واتساب في اليوم السابق',
        'يلغي الزبون بنفسه، والموعد يُملأ من جديد',
      ],
    },
    timeline: { fr: '2 à 3 semaines', ar: 'من أسبوعين إلى ثلاثة' },
    visual: {
      kind: 'capture',
      src: '/services/capture-el-yasmine.png',
      frame: 'screen',
      width: 2080,
      height: 1280,
    },
    demoHref: '/demo/rendezvous',
    steps: [
      {
        src: '/services/etape-el-yasmine-1.png',
        caption: { fr: 'Le client choisit la prestation', ar: 'الزبون يختار الخدمة' },
      },
      {
        src: '/services/etape-el-yasmine-2.png',
        caption: { fr: 'Il choisit son créneau', ar: 'يختار الموعد' },
      },
      {
        src: '/services/etape-el-yasmine-3.png',
        caption: { fr: 'Il reçoit la confirmation', ar: 'يتلقّى التأكيد' },
      },
    ],
  },
  {
    slug: 'boutique-en-ligne',
    tier: 'principal',
    glyph: 'panier',
    name: { fr: 'Boutique', ar: 'متجر' },
    solves: { fr: 'Commander sans appeler', ar: 'الطلب دون مكالمة' },
    benefit: {
      fr: 'La commande arrive complète',
      ar: 'الطلب يصلك مكتملًا',
    },
    lead: {
      fr: 'Le produit, la taille, la couleur, la quantité et la wilaya dans un seul message WhatsApp. Plus d’allers-retours pour reconstituer une commande.',
      ar: 'المنتج والمقاس واللون والكمّية والولاية في رسالة واتساب واحدة. لا مزيد من الأخذ والردّ لإكمال الطلب.',
    },
    points: {
      fr: [
        'Catalogue avec filtres, recherche et variantes',
        'Panier qui calcule le total et les frais de livraison',
        'Vous gérez produits et stocks depuis votre téléphone',
      ],
      ar: [
        'كتالوج بفلاتر وبحث وخيارات',
        'سلّة تحسب المجموع ومصاريف التوصيل',
        'تدير المنتجات والمخزون من هاتفك',
      ],
    },
    timeline: { fr: '4 à 6 semaines', ar: 'من 4 إلى 6 أسابيع' },
    journey: [
      {
        title: { fr: 'Le client choisit', ar: 'الزبون يختار' },
        text: {
          fr: 'Il parcourt le catalogue, ouvre une fiche, choisit la taille, la couleur et la quantité.',
          ar: 'يتصفّح الكتالوج، ويفتح صفحة المنتج، ويختار المقاس واللون والكمّية.',
        },
      },
      {
        title: { fr: 'Le site rassemble la commande', ar: 'الموقع يجمع الطلب' },
        text: {
          fr: 'Panier, wilaya de livraison, coordonnées : tout est réuni avant l’envoi, sans échange de messages.',
          ar: 'السلّة وولاية التوصيل ومعلومات التواصل: كل شيء يُجمع قبل الإرسال، دون تبادل رسائل.',
        },
      },
      {
        title: { fr: 'Vous recevez une commande complète', ar: 'يصلك طلب مكتمل' },
        text: {
          fr: 'Elle arrive par WhatsApp ou dans votre espace, référence et options comprises. Vous préparez le colis.',
          ar: 'يصلك عبر واتساب أو في مساحتك، بمرجعه وخياراته. ولا يبقى عليك سوى تجهيز الطرد.',
        },
      },
    ],
  },
  {
    slug: 'site-vitrine',
    tier: 'principal',
    glyph: 'vitrine',
    name: { fr: 'Site vitrine', ar: 'موقع تعريفي' },
    solves: { fr: 'Être trouvé sur Google', ar: 'الظهور في غوغل' },
    benefit: {
      fr: 'Vos clients vous trouvent',
      ar: 'زبائنك يجدونك',
    },
    lead: {
      fr: 'Un site qui sort dans Google quand quelqu’un cherche votre métier dans votre ville, et qui donne envie d’entrer.',
      ar: 'موقع يظهر في غوغل حين يبحث أحدهم عن مهنتك في مدينتك، ويشجّع على زيارتك.',
    },
    points: {
      fr: [
        'Référencement local et fiche Google Maps',
        'Vos services et vos réalisations présentés page par page',
        'Contact WhatsApp en un geste, depuis chaque page',
      ],
      ar: [
        'تحسين الظهور المحلي وبطاقة خرائط غوغل',
        'خدماتك وأعمالك معروضة صفحة بصفحة',
        'تواصل عبر واتساب بلمسة، من كل صفحة',
      ],
    },
    timeline: { fr: '1 à 2 semaines', ar: 'من أسبوع إلى أسبوعين' },
    visual: {
      kind: 'capture',
      src: '/services/capture-showroom.jpg',
      frame: 'screen',
      width: 2200,
      height: 1400,
    },
    /*
     * Le client réel a sa propre section plus bas (#realisation) : le bloc
     * le signale et y renvoie, au lieu d'envoyer le visiteur hors du site
     * au milieu du catalogue.
     */
    realClient: {
      url: '#realisation',
      label: { fr: 'Voir la réalisation', ar: 'اطّلع على الإنجاز' },
    },
  },
  {
    slug: 'plateforme-annonces',
    tier: 'principal',
    glyph: 'recherche',
    name: { fr: 'Annonces', ar: 'إعلانات مبوّبة' },
    solves: { fr: 'Chercher, filtrer, trouver', ar: 'بحث سريع ونتيجة دقيقة' },
    benefit: {
      fr: 'Vos clients trouvent sans vous appeler',
      ar: 'زبائنك يجدون دون أن يتّصلوا بك',
    },
    lead: {
      fr: 'Une recherche par wilaya, budget et type, une fiche complète, une demande de visite. Le même socle sert l’immobilier, l’automobile et le matériel professionnel.',
      ar: 'بحث حسب الولاية والميزانية والنوع، بطاقة كاملة، وطلب زيارة. القاعدة نفسها تخدم العقار والسيارات والعتاد المهني.',
    },
    points: {
      fr: [
        'Filtres combinés : wilaya, budget, type, surface',
        'Fiche détaillée avec galerie et localisation',
        'Demande de visite qui arrive qualifiée',
      ],
      ar: [
        'فلاتر مركّبة: الولاية، الميزانية، النوع، المساحة',
        'بطاقة مفصّلة بمعرض صور وموقع',
        'طلب زيارة يصلك بتفاصيله كاملة',
      ],
    },
    timeline: { fr: '6 à 8 semaines', ar: 'من 6 إلى 8 أسابيع' },
    journey: [
      {
        title: { fr: 'Le visiteur filtre', ar: 'الزائر يصفّي' },
        text: {
          fr: 'Wilaya, budget, type, surface : il réduit la liste à ce qui l’intéresse vraiment.',
          ar: 'الولاية والميزانية والنوع والمساحة: يختصر القائمة إلى ما يهمّه فعلًا.',
        },
      },
      {
        title: { fr: 'Il ouvre la fiche entière', ar: 'يفتح البطاقة كاملة' },
        text: {
          fr: 'Photos, description, localisation : il sait à quoi s’attendre avant de décrocher.',
          ar: 'الصور والوصف والموقع: يعرف ما ينتظره قبل أن يتّصل.',
        },
      },
      {
        title: { fr: 'Vous recevez une demande de visite', ar: 'تصلك طلبات الزيارة' },
        text: {
          fr: 'Elle arrive avec le bien concerné et les coordonnées. Plus d’appels pour redire ce qui est déjà écrit.',
          ar: 'يصلك الطلب بالعقار المعني ومعلومات التواصل. لا مكالمات لإعادة ما هو مكتوب أصلًا.',
        },
      },
    ],
  },
  {
    slug: 'campagne-publicitaire',
    tier: 'principal',
    glyph: 'megaphone',
    name: { fr: 'Campagne', ar: 'حملة إعلانية' },
    solves: { fr: 'Amener des clients', ar: 'جلب الزبائن إليك' },
    benefit: {
      fr: 'On amène les clients jusqu’à vous',
      ar: 'نجلب الزبائن إليك',
    },
    lead: {
      fr: 'Des campagnes Facebook, Instagram et TikTok qui mènent à une page conçue pour convertir. La page fait partie du service — une publicité qui tombe dans le vide ne rapporte rien.',
      ar: 'حملات على فيسبوك وإنستغرام وتيك توك تقود إلى صفحة مصمَّمة لتحويل الزائر إلى زبون. الصفحة جزء من الخدمة — إعلان يقود إلى الفراغ لا يعود بشيء.',
    },
    points: {
      fr: [
        'Page d’arrivée dessinée pour un seul objectif',
        'Pixel et suivi posés proprement, mesure fiable',
        'Rapport clair : dépensé, contacts, ventes',
      ],
      ar: [
        'صفحة وصول مصمَّمة لهدف واحد',
        'تتبّع مضبوط للزيارات والطلبات، وقياس موثوق',
        'تقرير واضح: المصروف، الاتصالات، المبيعات',
      ],
    },
    timeline: {
      fr: 'Mise en place en quelques jours',
      ar: 'الإعداد في بضعة أيام',
    },
    journey: [
      {
        title: { fr: 'La publicité touche votre public', ar: 'الإعلان يصل إلى جمهورك' },
        text: {
          fr: 'Facebook, Instagram ou TikTok, ciblés sur votre wilaya et votre clientèle.',
          ar: 'فيسبوك أو إنستغرام أو تيك توك، موجّهة إلى ولايتك وزبائنك.',
        },
      },
      {
        title: { fr: 'Elle mène à une page faite pour ça', ar: 'يقود إلى صفحة مصمّمة لذلك' },
        text: {
          fr: 'Un seul message, une seule action. La page fait partie du service : une publicité qui tombe dans le vide ne rapporte rien.',
          ar: 'رسالة واحدة وإجراء واحد. الصفحة جزء من الخدمة: إعلان يقود إلى الفراغ لا يعود بشيء.',
        },
      },
      {
        title: { fr: 'Vous voyez ce que chaque dinar a donné', ar: 'ترى ما حقّقه كل دينار' },
        text: {
          fr: 'Dépense, contacts reçus, ventes : un rapport clair, pas des graphiques décoratifs.',
          ar: 'المصروف والاتصالات والمبيعات: تقرير واضح، لا رسوم بيانية للزينة.',
        },
      },
    ],
  },

  /*
   * Les deux offres secondaires.
   *
   * Elles n'ont pas de bloc sur /services : deux cartes en bas de page. Mais
   * elles sont des services entiers, avec leur identifiant, leur délai et
   * leur place dans le formulaire — `plateforme-sur-mesure` remplace
   * l'ancien `application-web`, que le configurateur recommandait et que le
   * visiteur ne trouvait sur aucune page.
   */
  {
    slug: 'plateforme-sur-mesure',
    tier: 'secondaire',
    glyph: 'engrenage',
    name: { fr: 'Plateforme sur mesure', ar: 'منصّة خاصة' },
    solves: { fr: 'Un outil à vous', ar: 'أداة خاصة بك' },
    benefit: {
      fr: 'L’outil suit votre façon de travailler',
      ar: 'الأداة تتبع طريقتك في العمل',
    },
    lead: {
      fr: 'Quand aucun logiciel du marché ne correspond à votre métier, on construit celui qui manque. On cadre d’abord ce dont vous vous servirez vraiment.',
      ar: 'حين لا يناسب أي برنامج جاهز مهنتك، نبني الأداة الناقصة. نحدّد أولًا ما ستستعمله فعلًا.',
    },
    points: {
      fr: [
        'Le besoin cadré avec vous avant la première ligne de code',
        'Comptes et droits d’accès pour chaque membre de l’équipe',
        'Une base qui accepte les fonctions que vous ajouterez ensuite',
      ],
      ar: [
        'تحديد الحاجة معك قبل أول سطر برمجي',
        'حسابات وصلاحيات لكل فرد في الفريق',
        'قاعدة تقبل الوظائف التي تضيفها لاحقًا',
      ],
    },
    timeline: {
      fr: 'Défini après le cadrage',
      ar: 'يُحدَّد بعد تحديد الحاجة',
    },
  },
  {
    slug: 'invitation-mariage',
    tier: 'secondaire',
    glyph: 'anneaux',
    name: { fr: 'Invitation de mariage', ar: 'دعوة زفاف' },
    solves: { fr: 'Vos invités confirment', ar: 'مدعوّوك يؤكّدون' },
    benefit: {
      fr: 'Vous savez qui vient',
      ar: 'تعرف من سيحضر',
    },
    lead: {
      fr: 'Une page que vos invités ouvrent depuis WhatsApp, avec le lieu, le programme et la confirmation de présence en un geste.',
      ar: 'صفحة يفتحها مدعوّوك من واتساب، فيها المكان والبرنامج وتأكيد الحضور بلمسة واحدة.',
    },
    points: {
      fr: [
        'Le lieu sur une carte, l’itinéraire en un clic',
        'Le programme de la journée, heure par heure',
        'La liste des présences, tenue à jour pour vous',
      ],
      ar: [
        'المكان على الخريطة، والطريق بنقرة واحدة',
        'برنامج اليوم، ساعة بساعة',
        'قائمة الحضور، محدَّثة باستمرار',
      ],
    },
    timeline: { fr: 'Quelques jours', ar: 'بضعة أيام' },
  },
];

/** Les six services qui occupent un bloc entier de /services. */
export const primaryServices = services.filter((s) => s.tier === 'principal');

/** Les deux offres présentées en cartes, en bas de /services. */
export const secondaryServices = services.filter((s) => s.tier === 'secondaire');

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Libellés communs de la page /services. */
export const showcaseUi = {
  seeDemo: { fr: 'Voir la démonstration', ar: 'شاهد النموذج' },
  tryHere: { fr: 'Essayez-la ici', ar: 'جرّبه هنا' },
  openFull: { fr: 'Ouvrir en plein écran', ar: 'افتحه في شاشة كاملة' },
  demoFrameTitle: {
    fr: 'Démonstration essayable',
    ar: 'نموذج توضيحي قابل للتجربة',
  },
  demoOnRequest: {
    fr: 'Démonstration sur demande',
    ar: 'نموذج توضيحي عند الطلب',
  },
  demoNote: {
    fr: 'Démonstration — projet fictif conçu par MADDEV',
    ar: 'نموذج توضيحي — مشروع افتراضي من تصميم MADDEV',
  },
  realNote: { fr: 'Client réel', ar: 'زبون حقيقي' },
  delayLabel: { fr: 'Délai indicatif', ar: 'المدّة التقريبية' },
  quote: { fr: 'Demander un devis', ar: 'اطلب عرض سعر' },
  alsoKicker: { fr: 'Et aussi', ar: 'وأيضًا' },
  alsoCta: { fr: 'En parler', ar: 'تحدّث معنا' },
} satisfies Record<string, Bilingual>;
