import type { Locale } from '@/i18n/config';

/**
 * Les six blocs de la page /services.
 *
 * Cette page a remplacé /realisations : c'est désormais LA page où un
 * visiteur voit ce que nous savons faire. Il doit pouvoir la parcourir en
 * diagonale, sans lire une ligne, et comprendre les six services.
 *
 * L'ordre n'est pas décoratif — il va du plus facile à décider au plus
 * engageant. Un gérant de café dit oui à un menu QR en trente secondes ;
 * personne ne commande une campagne publicitaire sur un premier écran. Le
 * premier bloc détermine l'impression, il porte donc le service le plus
 * simple à se représenter.
 *
 * Trois points par bloc, jamais cinq. L'ancienne page en alignait cinq et
 * personne ne les lisait : au-delà de trois, une liste devient un mur.
 */

export type Bilingual = Record<Locale, string>;

export type ShowcaseVisual =
  /** Capture réelle de la démonstration, cadrée dans un mockup. */
  | { kind: 'capture'; src: string; frame: 'phone' | 'screen'; width: number; height: number }
  /** Visuel dessiné, tant que la démonstration n'existe pas. */
  | { kind: 'drawn'; figure: 'boutique' | 'annonces' | 'campagne' };

/** Les six pictogrammes du sommaire, dessinés dans ServiceGlyphs. */
export type ShowcaseGlyph =
  | 'qr'
  | 'agenda'
  | 'panier'
  | 'vitrine'
  | 'recherche'
  | 'megaphone';

export type ShowcaseItem = {
  /** Sert d'ancre : /services#menu-qr */
  slug: string;
  /**
   * La tuile du sommaire.
   *
   * Un visiteur arrive avec un besoin précis ; il ne doit pas parcourir six
   * blocs pour trouver le sien. Le nom est court — c'est une étiquette, pas
   * un titre — et `solves` tient en trois ou quatre mots : au-delà, la
   * rangée devient un paragraphe et ne se lit plus d'un coup d'œil.
   */
  nav: { glyph: ShowcaseGlyph; name: Bilingual; solves: Bilingual };
  /** Le bénéfice, jamais ce que nous fabriquons. */
  benefit: Bilingual;
  /** Deux lignes maximum. */
  lead: Bilingual;
  /** Trois points concrets. Jamais plus. */
  points: Record<Locale, string[]>;
  delay: Bilingual;
  visual: ShowcaseVisual;
  /** Lien vers la démonstration, quand elle existe. */
  demoHref?: string;
  /**
   * Projet réel plutôt que démonstration : le showroom de meubles.
   * Il ne porte PAS la mention « fictif » — ce serait mentir dans l'autre sens.
   */
  realClient?: { url: string; label: Bilingual };
};

export const showcase: ShowcaseItem[] = [
  {
    slug: 'menu-qr',
    nav: {
      glyph: 'qr',
      name: { fr: 'Menu QR', ar: 'قائمة QR' },
      solves: { fr: 'Votre carte, à jour', ar: 'قائمتك محدَّثة دائمًا' },
    },
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
    delay: { fr: '1 semaine', ar: 'أسبوع واحد' },
    visual: {
      kind: 'capture',
      src: '/services/capture-menu.png',
      frame: 'phone',
      width: 828,
      height: 1720,
    },
    demoHref: '/demo/menu',
  },
  {
    slug: 'prise-de-rendez-vous',
    nav: {
      glyph: 'agenda',
      name: { fr: 'Rendez-vous', ar: 'المواعيد' },
      solves: { fr: 'Fini les appels', ar: 'لا مزيد من المكالمات' },
    },
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
        'Agenda par praticien, par motif, par durée',
        'Rappel WhatsApp automatique la veille',
        'Annulation autonome — le créneau se remplit à nouveau',
      ],
      ar: [
        'أجندة حسب الطبيب وسبب الزيارة والمدّة',
        'تذكير تلقائي عبر واتساب في اليوم السابق',
        'إلغاء ذاتي — والموعد يُملأ من جديد',
      ],
    },
    delay: { fr: '2 à 3 semaines', ar: 'من أسبوعين إلى ثلاثة' },
    visual: {
      kind: 'capture',
      src: '/services/capture-rendezvous.png',
      frame: 'screen',
      width: 1520,
      height: 936,
    },
    demoHref: '/demo/rendezvous',
  },
  {
    slug: 'boutique-en-ligne',
    nav: {
      glyph: 'panier',
      name: { fr: 'Boutique', ar: 'متجر' },
      solves: { fr: 'Commander sans appeler', ar: 'الطلب دون مكالمة' },
    },
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
    delay: { fr: '4 à 6 semaines', ar: 'من 4 إلى 6 أسابيع' },
    visual: { kind: 'drawn', figure: 'boutique' },
  },
  {
    slug: 'site-vitrine',
    nav: {
      glyph: 'vitrine',
      name: { fr: 'Site vitrine', ar: 'موقع تعريفي' },
      solves: { fr: 'Être trouvé sur Google', ar: 'الظهور في غوغل' },
    },
    benefit: {
      fr: 'Vos clients vous trouvent',
      ar: 'زبائنك يجدونك',
    },
    lead: {
      fr: 'Un site qui sort dans Google quand quelqu’un cherche votre métier dans votre ville, et qui donne envie d’entrer.',
      ar: 'موقع يظهر في غوغل حين يبحث أحدهم عن مهنتك في مدينتك، ويدعو إلى الدخول.',
    },
    points: {
      fr: [
        'Référencement local et fiche Google Maps',
        'Catalogue consultable depuis le téléphone',
        'Contact WhatsApp en un geste, depuis chaque page',
      ],
      ar: [
        'تحسين الظهور المحلي وبطاقة خرائط غوغل',
        'كتالوج يُتصفَّح من الهاتف',
        'تواصل عبر واتساب بلمسة، من كل صفحة',
      ],
    },
    delay: { fr: '1 à 2 semaines', ar: 'من أسبوع إلى أسبوعين' },
    visual: {
      kind: 'capture',
      src: '/services/capture-showroom.jpg',
      frame: 'screen',
      width: 2200,
      height: 1400,
    },
    realClient: {
      url: 'https://henna-meubles-2026.vercel.app',
      label: { fr: 'Voir le site en ligne', ar: 'زيارة الموقع' },
    },
  },
  {
    slug: 'plateforme-annonces',
    nav: {
      glyph: 'recherche',
      name: { fr: 'Annonces', ar: 'إعلانات' },
      solves: { fr: 'Chercher, filtrer, trouver', ar: 'بحث وفلترة وعثور' },
    },
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
        'طلب زيارة يصل مؤهَّلًا',
      ],
    },
    delay: { fr: '6 à 8 semaines', ar: 'من 6 إلى 8 أسابيع' },
    visual: { kind: 'drawn', figure: 'annonces' },
  },
  {
    slug: 'campagne-publicitaire',
    nav: {
      glyph: 'megaphone',
      name: { fr: 'Campagne', ar: 'حملة إعلانية' },
      solves: { fr: 'Amener des clients', ar: 'جلب الزبائن إليك' },
    },
    benefit: {
      fr: 'On amène les clients jusqu’à vous',
      ar: 'نجلب الزبائن إليك',
    },
    lead: {
      fr: 'Des campagnes Facebook, Instagram et TikTok qui mènent à une page conçue pour convertir. La page fait partie du service — une publicité qui tombe dans le vide ne rapporte rien.',
      ar: 'حملات على فيسبوك وإنستغرام وتيك توك تقود إلى صفحة مصمَّمة للتحويل. الصفحة جزء من الخدمة — إعلان يقود إلى الفراغ لا يعود بشيء.',
    },
    points: {
      fr: [
        'Page d’arrivée dessinée pour un seul objectif',
        'Pixel et suivi posés proprement, mesure fiable',
        'Rapport clair : dépensé, contacts, ventes',
      ],
      ar: [
        'صفحة وصول مصمَّمة لهدف واحد',
        'بيكسل وتتبّع مركّبان بإحكام، وقياس موثوق',
        'تقرير واضح: المصروف، الاتصالات، المبيعات',
      ],
    },
    delay: { fr: 'Mise en place en quelques jours', ar: 'الإعداد في بضعة أيام' },
    visual: { kind: 'drawn', figure: 'campagne' },
  },
];

/** La carte discrète du bas de page. */
export const alsoCard = {
  kicker: { fr: 'Et aussi', ar: 'وأيضًا' },
  title: { fr: 'Invitations de mariage', ar: 'دعوات الزفاف' },
  text: {
    fr: 'Une page que vos invités ouvrent depuis WhatsApp, avec le lieu, le programme et la confirmation de présence en un clic.',
    ar: 'صفحة يفتحها مدعوّوك من واتساب، فيها المكان والبرنامج وتأكيد الحضور بنقرة واحدة.',
  },
  cta: { fr: 'En parler', ar: 'تحدّث معنا' },
} satisfies Record<string, Bilingual>;

/** Textes de l'en-tête et des libellés communs. */
export const showcaseUi = {
  seeDemo: { fr: 'Voir la démonstration', ar: 'شاهد النموذج' },
  demoNote: {
    fr: 'Démonstration — projet fictif conçu par MADDEV',
    ar: 'نموذج توضيحي — مشروع افتراضي من تصميم MADDEV',
  },
  realNote: { fr: 'Client réel', ar: 'زبون حقيقي' },
  delayLabel: { fr: 'Délai indicatif', ar: 'المدّة التقريبية' },
  soon: { fr: 'Démonstration en préparation', ar: 'النموذج قيد التحضير' },
} satisfies Record<string, Bilingual>;
