import type { Bilingual } from './services';

export type ProcessStep = {
  /** Numéro affiché — la séquence compte, on la montre. */
  number: string;
  slug: string;
  title: Bilingual;
  /** Une phrase de résumé. */
  summary: Bilingual;
  /** Ce qui se passe concrètement pendant l'étape. */
  details: Record<'fr' | 'ar', string[]>;
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    slug: 'decouverte',
    title: { fr: 'Découverte', ar: 'الاكتشاف' },
    summary: {
      fr: 'On comprend votre besoin avant d’écrire la moindre ligne de code.',
      ar: 'نفهمو واش راك تحتاج قبل ما نكتبو حتى سطر كود.',
    },
    details: {
      fr: [
        'Un appel ou une rencontre pour cerner votre activité et vos clients',
        'On identifie l’objectif réel : vendre, rassurer, automatiser',
        'Vous recevez un devis chiffré avec un délai ferme',
      ],
      ar: [
        'مكالمة ولا لقاء باش نفهمو نشاطك وزبائنك',
        'نحدّدو الهدف الحقيقي: تبيع، تبني الثقة، ولا تربح الوقت',
        'تاخذ عرض سعر مفصّل مع أجل واضح',
      ],
    },
  },
  {
    number: '02',
    slug: 'design',
    title: { fr: 'Design', ar: 'التصميم' },
    summary: {
      fr: 'Une maquette validée par vous avant le développement.',
      ar: 'تصميم تشوفو وتوافق عليه قبل ما نبداو البرمجة.',
    },
    details: {
      fr: [
        'Maquette des écrans clés, en version mobile d’abord',
        'Choix des couleurs, typographies et ton du contenu',
        'Deux tours d’ajustements inclus — on ne code qu’une fois validé',
      ],
      ar: [
        'تصميم للشاشات المهمة، نبداو بنسخة التيليفون',
        'نختارو الألوان والخطوط وطريقة الكلام',
        'جولتين تعديل مشمولين — ما نبرمجو حتى توافق',
      ],
    },
  },
  {
    number: '03',
    slug: 'developpement',
    title: { fr: 'Développement', ar: 'التطوير' },
    summary: {
      fr: 'Construction avec une technologie moderne, testée au fur et à mesure.',
      ar: 'نبنيو بتقنيات حديثة، ونختبرو في كل مرحلة.',
    },
    details: {
      fr: [
        'Un site rapide, bien référencé et fait pour durer',
        'Un lien de préversion pour suivre l’avancement en direct',
        'Tests sur mobile, tablette et ordinateur',
      ],
      ar: [
        'موقع سريع، يبان في البحث، ويدوم',
        'رابط تشوف فيه التقدّم مباشرة',
        'نختبرو على التيليفون واللوحة والحاسوب',
      ],
    },
  },
  {
    number: '04',
    slug: 'lancement',
    title: { fr: 'Lancement', ar: 'الإطلاق' },
    summary: {
      fr: 'Mise en ligne, puis formation pour que vous soyez autonome.',
      ar: 'نطلقو الموقع، ونوريوك كيفاش تسيّرو بيدك.',
    },
    details: {
      fr: [
        'Nom de domaine, hébergement et certificat de sécurité configurés',
        'Session de formation pour gérer vos contenus vous-même',
        'Vérification finale des performances et du référencement',
      ],
      ar: [
        'نضبطو اسم الموقع والاستضافة وشهادة الأمان',
        'حصة تكوين باش تسيّر محتواك بيدك',
        'تحقيق أخير من السرعة والظهور في غوغل',
      ],
    },
  },
  {
    number: '05',
    slug: 'suivi',
    title: { fr: 'Suivi', ar: 'المتابعة' },
    summary: {
      fr: 'Maintenance et évolution — on reste joignables après la livraison.',
      ar: 'صيانة وتطوير — نبقاو معاك بعد التسليم.',
    },
    details: {
      fr: [
        'Mises à jour techniques et sauvegardes régulières',
        'Évolutions et nouvelles fonctions quand votre activité grandit',
        'Option : gestion de vos campagnes publicitaires au mois',
      ],
      ar: [
        'تحديثات تقنية ونسخ احتياطية بانتظام',
        'تطويرات ووظائف جديدة كي يكبر نشاطك',
        'اختياري: نسيّرولك حملاتك الإعلانية كل شهر',
      ],
    },
  },
];
