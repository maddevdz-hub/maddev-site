import type { Locale } from '@/i18n/config';

export type ServiceIcon = 'window' | 'cart' | 'app' | 'megaphone';

/** Une chaîne disponible dans les deux langues. */
export type Bilingual = Record<Locale, string>;
export type BilingualList = Record<Locale, string[]>;

export type Service = {
  /** Identifiant stable — sert d'ancre (#slug) et de valeur dans le formulaire de contact. */
  slug: string;
  icon: ServiceIcon;
  /** Étiquette courte — navigation, menu déroulant, données structurées. */
  name: Bilingual;
  /**
   * Le titre montré au client : ce qu'il OBTIENT, jamais ce qu'on fabrique.
   * « Vos clients vous trouvent » plutôt que « Site vitrine ».
   */
  benefit: Bilingual;
  /** La ligne concrète sous le bénéfice — le comment, en une phrase. */
  promise: Bilingual;
  /** 2-3 phrases : à quoi ça sert concrètement. */
  description: Bilingual;
  /** Livrables précis affichés avec des coches. */
  deliverables: BilingualList;
  /** Le client type. */
  audience: Bilingual;
  /** Résultat concret obtenu par le client. */
  result: Bilingual;
  timeline: Bilingual;
};

export const services: Service[] = [
  {
    slug: 'site-vitrine',
    icon: 'window',
    name: {
      fr: 'Site vitrine',
      ar: 'موقع تعريفي',
    },
    benefit: {
      fr: 'Vos clients vous trouvent',
      ar: 'زبائنك يلقاوك',
    },
    promise: {
      fr: 'Un site qui apparaît sur Google quand quelqu’un cherche votre métier dans votre ville.',
      ar: 'موقع يبان في غوغل كي يدوّر واحد على خدمتك في مدينتك.',
    },
    description: {
      fr: 'Un site rapide et élégant qui présente votre activité, vos services et vos coordonnées. Votre vitrine reste ouverte 24 h/24, même quand votre local est fermé.',
      ar: 'موقع سريع وأنيق يوري نشاطك، خدماتك، وكيفاش يتواصلو معاك. واجهتك تبقى محلولة 24 ساعة على 24، حتى كي يكون محلّك مسكّر.',
    },
    deliverables: {
      fr: [
        'Design moderne, responsive sur tous les écrans',
        'Jusqu’à 5 pages',
        'Référencement local + fiche Google Maps',
        'Bouton WhatsApp direct',
        'Hébergement offert la première année',
      ],
      ar: [
        'تصميم عصري متجاوب مع كل الشاشات',
        'حتى 5 صفحات',
        'تحسين الظهور المحلي + بطاقة خرائط جوجل',
        'زر واتساب مباشر',
        'الاستضافة مجانية السنة الأولى',
      ],
    },
    audience: {
      fr: 'Commerces, cabinets, artisans et professionnels qui veulent exister en ligne sérieusement.',
      ar: 'المحلات، المكاتب، الحرفيين والمهنيين اللي حابين حضور جدّي على الإنترنت.',
    },
    result: {
      fr: 'Vos clients consultent vos services depuis leur téléphone et vous contactent directement, sans passer par un annuaire ou un intermédiaire.',
      ar: 'زبائنك يشوفو خدماتك من التيليفون ويتصلو بيك نيشان، بلا دليل وبلا وسيط.',
    },
    timeline: {
      fr: '1 à 2 semaines',
      ar: 'أسبوع إلى أسبوعين',
    },
  },
  {
    slug: 'boutique-ecommerce',
    icon: 'cart',
    name: {
      fr: 'Boutique e-commerce',
      ar: 'متجر إلكتروني',
    },
    benefit: {
      fr: 'La commande arrive complète',
      ar: 'الطلب يوصلك كامل',
    },
    promise: {
      fr: 'Le produit, le coloris, les dimensions, la wilaya — dans un seul message WhatsApp. Plus d’allers-retours.',
      ar: 'المنتج، اللون، المقاسات، الولاية — في رسالة واتساب وحدة. ما بقاوش الرواح والجاي.',
    },
    description: {
      fr: 'Un vrai magasin en ligne : catalogue, panier, commandes. Vous gérez vos produits et vos prix en autonomie via un tableau de bord simple, sans nous appeler à chaque changement.',
      ar: 'متجر حقيقي على الإنترنت: كتالوج، سلة، طلبات. تسيّر منتجاتك وأسعارك بوحدك من لوحة تحكم ساهلة، بلا ما تعيّط لنا في كل تبديلة.',
    },
    deliverables: {
      fr: [
        'Catalogue avec filtres et recherche',
        'Fiches produit optimisées pour la conversion',
        'Panier + commande WhatsApp + paiement à la livraison',
        'Tableau de bord produits et commandes',
      ],
      ar: [
        'كتالوج مع فلاتر وبحث',
        'صفحات منتجات مُحسّنة للتحويل',
        'سلة + طلب عبر واتساب + الدفع عند الاستلام',
        'لوحة تحكم للمنتجات والطلبات',
      ],
    },
    audience: {
      fr: 'Commerces avec des produits — meubles, mode, décoration, électroménager — qui veulent vendre en ligne.',
      ar: 'المحلات اللي تبيع منتجات — أثاث، ألبسة، ديكور، أجهزة كهرومنزلية — وحابة تبيع على الإنترنت.',
    },
    result: {
      fr: 'Une fiche produit qui transforme le visiteur en commande : galerie photo, sélecteurs de couleur et de dimensions, et un bouton WhatsApp pré-rempli avec la référence exacte.',
      ar: 'صفحة منتج تحوّل الزائر لطلب: معرض تصاور، اختيار اللون والمقاسات، وزر واتساب يجي معمّر بمرجع المنتج.',
    },
    timeline: {
      fr: '4 à 8 semaines',
      ar: 'من 4 إلى 8 أسابيع',
    },
  },
  {
    slug: 'application-web',
    icon: 'app',
    name: {
      fr: 'Application web / MVP',
      ar: 'تطبيق ويب / MVP',
    },
    benefit: {
      fr: 'Vous pilotez tout vous-même',
      ar: 'تسيّر كلش بيدك',
    },
    promise: {
      fr: 'Ajouter un produit, changer un prix, masquer une pièce épuisée — depuis votre téléphone, en deux minutes.',
      ar: 'تزيد منتج، تبدّل سعر، تخبّي قطعة كملت — من تيليفونك، في دقيقتين.',
    },
    description: {
      fr: 'Des plateformes sur mesure : réservation, gestion interne, tableaux de bord. On commence par cadrer le besoin réel avec vous, pour éviter de développer des fonctions que personne n’utilisera.',
      ar: 'منصات مخصّصة: الحجز، التسيير الداخلي، لوحات التحكم. نبداو نحدّدو معاك واش تحتاج بالضبط، باش ما نطوّروش وظائف ما يستعملها حتى واحد.',
    },
    deliverables: {
      fr: [
        'Plateforme construite pour votre métier',
        'Base de données structurée',
        'Comptes et rôles utilisateurs',
        'Conseil produit inclus',
        'Architecture évolutive',
      ],
      ar: [
        'منصة مبنية على قدّ خدمتك',
        'قاعدة بيانات منظّمة',
        'حسابات وصلاحيات للمستخدمين',
        'استشارة في المنتج مضمّنة',
        'بنية قابلة للتطوير',
      ],
    },
    audience: {
      fr: 'Startups, entrepreneurs et professionnels avec un besoin métier spécifique qu’aucun outil du marché ne couvre.',
      ar: 'الشركات الناشئة، أصحاب المشاريع والمهنيين اللي عندهم حاجة خاصة في خدمتهم، ما تغطّيهاش الأدوات الجاهزة.',
    },
    result: {
      fr: 'Un outil qui automatise votre métier — réservations, gestion des équipes, suivi client — au lieu de dix fichiers Excel et d’un carnet.',
      ar: 'أداة تدير خدمتك بوحدها — الحجوزات، تسيير الفريق، متابعة الزبائن — بدل عشر ملفات إكسل ودفتر.',
    },
    timeline: {
      fr: 'Sur devis',
      ar: 'حسب دراسة المشروع',
    },
  },
  {
    slug: 'marketing-publicite',
    icon: 'megaphone',
    name: {
      fr: 'Marketing & Publicité',
      ar: 'تسويق وإعلانات',
    },
    benefit: {
      fr: 'On amène les clients jusqu’à vous',
      ar: 'نجيبولك الزبائن',
    },
    promise: {
      fr: 'Des campagnes mesurées : on sait exactement ce que chaque dinar a rapporté.',
      ar: 'حملات مقيسة: نعرفو بالضبط شحال جاب كل دينار.',
    },
    description: {
      fr: 'Campagnes publicitaires sur Facebook, Instagram et TikTok, avec un tracking installé proprement. Comme c’est nous qui avons développé le site, la mesure est fiable — et l’optimisation aussi.',
      ar: 'حملات إعلانية على فيسبوك وإنستغرام وتيك توك، مع تتبّع مركّب كيما يلزم. وخاطر حنا اللي درنا الموقع، القياس يجي مضبوط — والتحسين تاني.',
    },
    deliverables: {
      fr: [
        'Setup et lancement des campagnes',
        'Pixel et tracking installés proprement',
        'Visuels et textes rédigés pour vous',
        'Gestion mensuelle en option',
        'Rapport clair : dépensé → leads / ventes',
      ],
      ar: [
        'إعداد الحملات وإطلاقها',
        'بيكسل وتتبّع مضبوطان',
        'تصاور ونصوص مكتوبة من عندنا',
        'تسيير شهري اختياري',
        'تقرير واضح: المصروف ← العملاء / المبيعات',
      ],
    },
    audience: {
      fr: 'Tout client qui a déjà un site ou une boutique et veut des visiteurs qualifiés, pas des vues.',
      ar: 'كل واحد عندو موقع ولا متجر وحاب زوّار مهتمين بالصح، ماشي غير مشاهدات.',
    },
    result: {
      fr: 'Des visiteurs ciblés qui arrivent sur une page conçue pour convertir — parce qu’on a construit les deux, la publicité et la page.',
      ar: 'زوّار مستهدفين يوصلو لصفحة مدروسة باش تحوّل — خاطر حنا اللي بنينا الزوج: الإعلان والصفحة.',
    },
    timeline: {
      fr: 'Setup en quelques jours',
      ar: 'الإعداد في بضعة أيام',
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
