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
  | 'anneaux'
  | 'inscriptions'
  | 'logo';

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

/**
 * Les trois groupes de /services (plan V2, B). L'ordre du tableau est celui
 * de la page. Les phrases d'introduction de chaque groupe restent à valider :
 * pas de texte tant qu'il ne l'est pas.
 */
export type ServiceGroup = 'vendre' | 'organiser' | 'trouver';
export const serviceGroups: { id: ServiceGroup; name: Bilingual; intro: Bilingual }[] = [
  {
    id: 'vendre',
    name: { fr: 'Pour vendre', ar: 'للبيع' },
    intro: {
      fr: 'Que vous vendiez par une publicité, sur une boutique en ligne ou dans votre local : le client commande seul, et la commande vous arrive complète.',
      ar: 'سواء كنت تبيع عبر إعلان أو متجر إلكتروني أو داخل محلّك: الزبون يطلب بنفسه، والطلب يصلك مكتملًا.',
    },
  },
  {
    id: 'organiser',
    name: { fr: 'Pour organiser votre travail', ar: 'لتنظيم عملك' },
    intro: {
      fr: 'Les rendez-vous, les inscriptions, les commandes à suivre : ce que vous gérez aujourd’hui au téléphone et sur papier passe dans un outil qui tient dans votre téléphone.',
      ar: 'المواعيد والتسجيلات والطلبات التي تتابعها: ما تديره اليوم بالهاتف والورق ينتقل إلى أداة تحملها في هاتفك.',
    },
  },
  {
    id: 'trouver',
    name: { fr: 'Pour être trouvé et reconnu', ar: 'ليجدك الناس ويعرفوك' },
    intro: {
      fr: 'Qu’on vous trouve sur Google quand on cherche votre métier dans votre ville, et qu’on vous reconnaisse au premier coup d’œil.',
      ar: 'أن يجدك الناس على غوغل حين يبحثون عن مهنتك في مدينتك، وأن يعرفوك من أول نظرة.',
    },
  },
];

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
  /** Groupe de /services (plan V2) ; seuls les principaux en ont un. */
  group?: ServiceGroup;
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
  /** « Pour qui : » — trois cas d'usage, montrés sous le service. */
  useCases: BilingualList;
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
   * Planches d'identité montrées comme preuve (logo) : des images, jamais
   * un logo présenté comme travail client.
   */
  planches?: { src: string; width: number; height: number; caption: Bilingual }[];
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
    group: 'vendre',
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
    useCases: {
      fr: ['Café et salon de thé', 'Restaurant et fast-food', 'Pâtisserie et glacier'],
      ar: ['مقهى وصالون شاي', 'مطعم ووجبات سريعة', 'حلويات ومثلّجات'],
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
        caption: { fr: 'Le client scanne', ar: 'الزبون يمسح الرمز ضوئيًا' },
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
    group: 'organiser',
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
    useCases: {
      fr: ['Cabinet médical ou dentaire', 'Salon de coiffure et institut de beauté', 'Avocat, notaire, consultant'],
      ar: ['عيادة طبية أو عيادة أسنان', 'صالون حلاقة ومعهد تجميل', 'محامٍ أو موثّق أو مستشار'],
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
    slug: 'page-produit',
    tier: 'principal',
    group: 'vendre',
    glyph: 'megaphone',
    name: { fr: 'Page produit', ar: 'صفحة منتج' },
    solves: { fr: 'Vendre depuis une pub', ar: 'البيع من إعلان' },
    benefit: {
      fr: 'Le visiteur de votre publicité commande en une minute',
      ar: 'زائر إعلانك يطلب في دقيقة',
    },
    lead: {
      fr: 'Une page par produit, pensée pour celui qui arrive d’une publicité TikTok, Instagram ou Facebook : il commande sans vous écrire, livraison calculée selon sa wilaya.',
      ar: 'صفحة لكل منتج، مصمَّمة لمن يأتي من إعلان على تيك توك أو إنستغرام أو فيسبوك: يطلب دون أن يراسلك، ومصاريف التوصيل تُحسب حسب ولايته.',
    },
    points: {
      fr: [
        'Formulaire court : nom, téléphone, wilaya et commune, livraison calculée',
        'Une offre jointe proposée juste avant le bouton de commande',
        'Pixel Meta et TikTok installés : vous savez quelles commandes chaque publicité a rapportées',
      ],
      ar: [
        'استمارة قصيرة: الاسم والهاتف والولاية والبلدية، مع حساب التوصيل',
        'عرض إضافي يُقترح قبل زر الطلب مباشرة',
        'بيكسل ميتا وبيكسل تيك توك مثبَّتان: تعرف الطلبات التي جلبها كل إعلان',
      ],
    },
    useCases: {
      fr: ['Vente de cosmétiques et parfums par publicité', 'Vêtements et accessoires vendus sur TikTok', 'Un produit phare lancé avec une campagne'],
      ar: ['بيع مستحضرات التجميل والعطور عبر الإعلانات', 'ملابس وإكسسوارات تُباع على تيك توك', 'منتج رئيسي يُطلق بحملة إعلانية'],
    },
    timeline: { fr: '1 à 2 semaines', ar: 'من أسبوع إلى أسبوعين' },
    visual: {
      kind: 'capture',
      src: '/services/capture-nada-fiche.png',
      frame: 'phone',
      width: 828,
      height: 1720,
    },
    demoHref: '/demo/boutique/p/rose-de-blida',
  },
  {
    slug: 'boutique-en-ligne',
    tier: 'principal',
    group: 'vendre',
    glyph: 'panier',
    name: { fr: 'Boutique', ar: 'متجر' },
    solves: { fr: 'Commander sans appeler', ar: 'الطلب دون مكالمة' },
    benefit: {
      fr: 'La commande arrive complète, vérifiée avant l’envoi',
      ar: 'الطلب يصلك مكتملًا، ومُتحقَّقًا منه قبل الشحن',
    },
    lead: {
      fr: 'Catalogue, panier et paiement à la livraison, avec un registre où vous confirmez chaque commande par téléphone avant d’expédier.',
      ar: 'كتالوج وسلّة ودفع عند الاستلام، مع سجلّ تؤكّد فيه كل طلب بالهاتف قبل الشحن.',
    },
    points: {
      fr: [
        'Commandes douteuses signalées : numéro invalide, doublon, client sur liste noire',
        'Confirmation, expédition et retours suivis depuis un seul écran',
        'Les retours par wilaya et ce qu’ils vous coûtent, calculés pour vous',
      ],
      ar: [
        'تنبيه على الطلبات المشبوهة: رقم غير صالح، طلب مكرَّر، زبون في القائمة السوداء',
        'التأكيد والشحن والمرتجعات تتابعها من شاشة واحدة',
        'المرتجعات حسب الولاية وما تكلّفك، محسوبة لك',
      ],
    },
    useCases: {
      fr: ['Magasin de vêtements ou de chaussures', 'Parfumerie et cosmétiques', 'Électroménager et accessoires de téléphone'],
      ar: ['محلّ ملابس أو أحذية', 'عطور ومستحضرات تجميل', 'أجهزة منزلية وإكسسوارات الهواتف'],
    },
    timeline: { fr: '4 à 6 semaines', ar: 'من 4 إلى 6 أسابيع' },
    visual: {
      kind: 'capture',
      src: '/services/capture-nada-accueil.png',
      frame: 'phone',
      width: 828,
      height: 1720,
    },
    demoHref: '/demo/boutique',
  },
  {
    slug: 'site-vitrine',
    tier: 'principal',
    group: 'trouver',
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
        'Création ou reprise de votre fiche Google : horaires, photos, lien vers le site',
        'Vos services et vos réalisations présentés page par page',
        'Contact WhatsApp en un geste, depuis chaque page',
      ],
      ar: [
        'إنشاء بطاقتك على غوغل أو تحديثها: ساعات العمل، والصور، ورابط الموقع',
        'خدماتك وأعمالك معروضة صفحة بصفحة',
        'تواصل عبر واتساب بلمسة، من كل صفحة',
      ],
    },
    useCases: {
      fr: ['Artisan : menuisier, plombier, électricien', 'Entreprise de services ou de BTP', 'Showroom et commerce de quartier'],
      ar: ['حرفي: نجّار، سبّاك، كهربائي', 'مؤسسة خدمات أو بناء وأشغال عمومية', 'معرض ومحلّ في الحيّ'],
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
    slug: 'application',
    tier: 'principal',
    group: 'organiser',
    glyph: 'engrenage',
    name: { fr: 'Application', ar: 'تطبيق' },
    solves: { fr: 'Un outil à vous', ar: 'أداة خاصة بك' },
    benefit: {
      fr: 'L’outil de votre métier, installé sur vos téléphones',
      ar: 'أداة عملك، مثبَّتة على هواتفكم',
    },
    lead: {
      fr: 'Quand aucun logiciel du marché ne correspond à votre façon de travailler, on construit celui qui manque : il s’ouvre dans le navigateur et s’installe sur l’écran d’accueil comme une application.',
      ar: 'حين لا يناسب أي برنامج جاهز طريقتك في العمل، نبني الأداة الناقصة: تُفتح في المتصفّح، وتُثبَّت على الشاشة الرئيسية للهاتف كأي تطبيق.',
    },
    points: {
      fr: [
        'Le besoin cadré avec vous avant la première ligne de code',
        'Comptes et droits d’accès pour chaque membre de l’équipe',
        'Sur ordinateur, Android et iPhone, sans passer par les magasins d’applications',
      ],
      ar: [
        'تحديد الحاجة معك قبل أول سطر برمجي',
        'حسابات وصلاحيات لكل فرد في الفريق',
        'على الحاسوب وأندرويد وآيفون، دون المرور بمتاجر التطبيقات',
      ],
    },
    useCases: {
      fr: ['Suivi des commandes et des livraisons d’un commerce', 'Gestion des chantiers ou des interventions d’une entreprise', 'Outil interne d’une équipe : stock, plannings, clients'],
      ar: ['متابعة طلبات وتوصيلات متجر', 'تسيير الورشات أو التدخّلات لدى مؤسسة', 'أداة داخلية لفريق: المخزون، والجداول، والزبائن'],
    },
    timeline: { fr: 'Défini après le cadrage', ar: 'يُحدَّد بعد تحديد الحاجة' },
    visual: {
      kind: 'capture',
      src: '/services/capture-nada-registre.png',
      frame: 'phone',
      width: 828,
      height: 1720,
    },
    demoHref: '/demo/boutique/admin',
  },
  {
    slug: 'inscriptions',
    tier: 'principal',
    group: 'organiser',
    glyph: 'inscriptions',
    name: { fr: 'Inscriptions', ar: 'التسجيل' },
    solves: { fr: 'S’inscrire en ligne', ar: 'التسجيل عبر الإنترنت' },
    benefit: {
      fr: 'Les inscriptions arrivent rangées, groupe par groupe',
      ar: 'التسجيلات تصلك مرتَّبة، فوجًا بفوج',
    },
    lead: {
      fr: 'Pour les écoles, centres de formation et clubs : l’élève ou le parent s’inscrit seul, et vous retrouvez la liste des inscrits par groupe.',
      ar: 'للمدارس ومراكز التكوين والنوادي: التلميذ أو وليّه يسجّل بنفسه، وتجد قائمة المسجَّلين حسب كل فوج.',
    },
    points: {
      fr: [
        'Formulaire d’inscription adapté à vos formations et à vos groupes',
        'Liste des inscrits par groupe, exportable',
        'Rappels avant la rentrée ou la séance, et paiement en ligne si vous le souhaitez',
      ],
      ar: [
        'استمارة تسجيل حسب تكويناتك وأفواجك',
        'قائمة المسجَّلين حسب الفوج، قابلة للتصدير',
        'تذكير قبل الدخول أو الحصّة، ودفع عبر الإنترنت إن أردت',
      ],
    },
    useCases: {
      fr: ['École privée et crèche', 'Centre de formation et de langues', 'Club de sport et association'],
      ar: ['مدرسة خاصة وروضة أطفال', 'مركز تكوين ومركز لغات', 'نادٍ رياضي وجمعية'],
    },
    timeline: { fr: '3 à 5 semaines', ar: 'من 3 إلى 5 أسابيع' },
  },
  {
    slug: 'logo-identite',
    tier: 'principal',
    group: 'trouver',
    glyph: 'logo',
    name: { fr: 'Logo', ar: 'شعار' },
    solves: { fr: 'Être reconnu', ar: 'أن يعرفك الناس' },
    benefit: {
      fr: 'Un logo à vous, prêt pour l’enseigne comme pour Instagram',
      ar: 'شعار خاص بك، جاهز للافتة كما لإنستغرام',
    },
    lead: {
      fr: 'Un logo dessiné pour votre activité, et tout ce qu’il faut pour l’utiliser partout : enseigne, réseaux sociaux, emballages, site.',
      ar: 'شعار يُرسم لنشاطك، ومعه كل ما تحتاجه لاستعماله في كل مكان: اللافتة، ومواقع التواصل، والتغليف، والموقع.',
    },
    points: {
      fr: [
        'Deux ou trois pistes présentées : vous choisissez avant la finalisation',
        'Fichiers en couleur et en noir et blanc (SVG, PDF, PNG), avec palette et polices',
        'Déclinaisons prêtes : photo de profil, couverture Facebook, icône de site, et un guide d’une page',
      ],
      ar: [
        'نعرض عليك اتجاهين أو ثلاثة، وتختار قبل الصيغة النهائية',
        'ملفات بالألوان وبالأبيض والأسود (SVG وPDF وPNG)، مع الألوان والخطوط',
        'نسخ جاهزة: صورة الحساب، وغلاف فيسبوك، وأيقونة الموقع، ودليل استعمال من صفحة واحدة',
      ],
    },
    useCases: {
      fr: ['Commerce qui ouvre ses portes', 'Marque qui se lance sur Instagram', 'Activité dont le logo actuel s’imprime mal'],
      ar: ['محلّ يفتح أبوابه', 'علامة تنطلق على إنستغرام', 'نشاط شعاره الحالي لا يُطبع بشكل جيد'],
    },
    timeline: { fr: '2 à 3 semaines', ar: 'من أسبوعين إلى 3 أسابيع' },
    /*
     * La preuve : notre propre identité, et celle de la marque fictive de la
     * démo boutique, chacune légendée pour ce qu'elle est. Aucun autre logo :
     * on n'en présente aucun comme un travail fait pour un client.
     */
    planches: [
      {
        src: '/services/planche-maddev.png',
        width: 1600,
        height: 1000,
        caption: { fr: 'Notre propre identité', ar: 'هويتنا' },
      },
      {
        src: '/services/planche-nada.png',
        width: 1600,
        height: 1000,
        caption: { fr: 'Marque fictive de démonstration', ar: 'علامة وهمية للعرض' },
      },
    ],
  },
  {
    slug: 'plateforme-annonces',
    // Secondaire depuis le plan V2 : un site qui présente les annonces d'une
    // agence, sur demande. Son nouveau texte reste à valider.
    tier: 'secondaire',
    glyph: 'recherche',
    name: { fr: 'Site d’annonces', ar: 'موقع عروض' },
    solves: { fr: 'Chercher, filtrer, trouver', ar: 'بحث سريع ونتيجة دقيقة' },
    benefit: {
      fr: 'Les biens de votre agence, consultables sans vous appeler',
      ar: 'عروض وكالتك، يتصفّحها الزبون دون أن يتّصل بك',
    },
    lead: {
      fr: 'Pour une agence immobilière ou automobile : vos annonces avec photos, filtres par wilaya et budget, et des demandes de visite qui arrivent avec le bien concerné.',
      ar: 'لوكالة عقارية أو وكالة سيارات: عروضك بالصور، وتصفية حسب الولاية والميزانية، وطلبات معاينة تصلك ومعها العرض المعني.',
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
        'طلب معاينة يصلك بتفاصيله كاملة',
      ],
    },
    useCases: {
      fr: ['Agence immobilière', 'Concessionnaire et vendeur de voitures', 'Location de matériel'],
      ar: ['وكالة عقارية', 'وكالة أو بائع سيارات', 'تأجير العتاد'],
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
    useCases: {
      fr: ['Mariage', 'Fiançailles', 'Henné et fête familiale'],
      ar: ['زفاف', 'خطوبة', 'حنّة وحفل عائلي'],
    },
    timeline: { fr: 'Quelques jours', ar: 'بضعة أيام' },
  },
];

/**
 * Les services qui occupent un bloc entier de /services, dans l'ordre des
 * groupes puis de cette liste (plan V2) — accueil, pied de page et sommaire
 * suivent le même ordre.
 */
const ORDRE_PRINCIPAL = [
  'page-produit',
  'boutique-en-ligne',
  'menu-qr',
  'prise-de-rendez-vous',
  'application',
  'inscriptions',
  'site-vitrine',
  'logo-identite',
];
const rang = (s: Service) =>
  serviceGroups.findIndex((g) => g.id === s.group) * 100 + ORDRE_PRINCIPAL.indexOf(s.slug);
export const primaryServices = services.filter((s) => s.tier === 'principal').sort((a, b) => rang(a) - rang(b));

/** Les offres présentées en cartes, en bas de /services. */
export const secondaryServices = services.filter((s) => s.tier === 'secondaire');

/**
 * Tous les services dans l'ordre de la page : groupes, puis secondaires.
 * C'est l'ordre du formulaire de contact et du menu déroulant.
 */
export const servicesInPageOrder = [...primaryServices, ...secondaryServices];

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
  forWho: { fr: 'Pour qui :', ar: 'لمن:' },
} satisfies Record<string, Bilingual>;
