import type { Bilingual } from './services';

export type ComparisonRow = {
  id: string;
  criterion: Bilingual;
  facebook: Bilingual;
  website: Bilingual;
};

/**
 * Comparatif site / page Facebook.
 *
 * Uniquement des faits vérifiables : aucun chiffre de trafic, aucun
 * pourcentage, aucun montant. Une comparaison qui exagère se retourne
 * contre celui qui la présente dès la première question précise.
 */
export const comparisonRows: ComparisonRow[] = [
  {
    id: 'propriete',
    criterion: { fr: 'Propriété', ar: 'الملكية' },
    facebook: {
      fr: 'La page est hébergée par Meta et soumise à ses règles. Vous l’utilisez, vous ne la possédez pas.',
      ar: 'تستضيف Meta الصفحة وتخضعها لقواعدها. أنت تستعملها، لكنك لا تملكها.',
    },
    website: {
      fr: 'Le nom de domaine et le code sont à votre nom. Vous en disposez comme de n’importe quel bien.',
      ar: 'اسم النطاق والكود باسمك. تتصرّف فيهما كما تتصرّف في أي ملك آخر.',
    },
  },
  {
    id: 'google',
    criterion: { fr: 'Visibilité sur Google', ar: 'الظهور في غوغل' },
    facebook: {
      fr: 'Une page Facebook remonte rarement lorsqu’un client cherche un métier et une ville.',
      ar: 'نادرًا ما تظهر صفحة فيسبوك حين يبحث زبون عن مهنة في مدينة.',
    },
    website: {
      fr: 'Le site est indexé et peut apparaître sur ces recherches, avec une fiche Google Maps liée.',
      ar: 'يفهرس غوغل الموقع، فيمكن أن يظهر في نتائج هذا البحث، مع بطاقة مرتبطة في خرائط غوغل.',
    },
  },
  {
    id: 'donnees',
    criterion: { fr: 'Données clients', ar: 'بيانات الزبائن' },
    facebook: {
      fr: 'Les abonnés restent chez Facebook. Vous ne pouvez ni les exporter, ni les emporter ailleurs.',
      ar: 'يبقى المتابعون عند فيسبوك. لا يمكنك تصديرهم ولا نقلهم إلى مكان آخر.',
    },
    website: {
      fr: 'Les demandes arrivent chez vous : formulaire, WhatsApp, email. La liste vous appartient.',
      ar: 'تصلك الطلبات مباشرة: استمارة، واتساب، بريد إلكتروني. والقائمة ملكك.',
    },
  },
  {
    id: 'duree',
    criterion: { fr: 'Durée de vie', ar: 'الاستمرارية' },
    facebook: {
      fr: 'Une page peut être restreinte ou supprimée sans préavis, et le recours est limité.',
      ar: 'يمكن لفيسبوك تقييد الصفحة أو حذفها دون إشعار، وفرص الاعتراض محدودة.',
    },
    website: {
      fr: 'Le site reste en ligne tant que le domaine et l’hébergement sont payés. Rien d’autre ne le menace.',
      ar: 'يبقى الموقع متاحًا ما دام النطاق والاستضافة مدفوعين. لا شيء آخر يهدّده.',
    },
  },
  {
    id: 'cout',
    criterion: { fr: 'Coût', ar: 'التكلفة' },
    facebook: {
      fr: 'Créer la page ne coûte rien. Être vu coûte : sans publicité, peu de monde voit vos publications.',
      ar: 'إنشاء الصفحة مجاني. أما الظهور فله ثمن: دون إعلانات، لا يرى منشوراتك إلا القليل.',
    },
    website: {
      fr: 'Un investissement au départ, puis le domaine et l’hébergement à renouveler chaque année.',
      ar: 'استثمار في البداية، ثم تجديد النطاق والاستضافة كل سنة.',
    },
  },
  {
    id: 'credibilite',
    criterion: { fr: 'Crédibilité', ar: 'المصداقية' },
    facebook: {
      fr: 'Votre commerce a la même apparence que n’importe quelle autre page.',
      ar: 'يبدو نشاطك كأي صفحة أخرى.',
    },
    website: {
      fr: 'Une adresse à votre nom, une présentation qui vous ressemble : le sérieux se voit avant l’appel.',
      ar: 'عنوان باسمك، وعرض يشبهك: الجدّية تظهر قبل أن يتّصل الزبون.',
    },
  },
];

/**
 * Le bloc le plus important de la page.
 *
 * Une agence qui déconseille l'achat est crue le jour où elle le
 * recommande. Ce texte n'est pas là pour faire joli : il doit rester
 * franc, sans formule d'atténuation qui le viderait de son sens.
 */
export const facebookIsEnough = {
  title: {
    fr: 'Quand une page Facebook suffit',
    ar: 'متى تكفي صفحة فيسبوك',
  } as Bilingual,
  intro: {
    fr: 'Un site n’est pas toujours le bon investissement. Dans ces trois situations, une page Facebook bien tenue fait le travail :',
    ar: 'الموقع ليس دائمًا الاستثمار الصحيح. في هذه الحالات الثلاث، تكفي صفحة فيسبوك تديرها بعناية:',
  } as Bilingual,
  cases: [
    {
      fr: 'Vous vendez à quelques clients réguliers qui vous connaissent déjà et vous appellent directement.',
      ar: 'تبيع لعدد قليل من الزبائن الدائمين الذين يعرفونك ويتّصلون بك مباشرة.',
    },
    {
      fr: 'Votre activité est saisonnière et ne tourne que quelques semaines par an.',
      ar: 'نشاطك موسمي، ولا يعمل إلا بضعة أسابيع في السنة.',
    },
    {
      fr: 'Vous débutez et vous testez encore votre offre : mieux vaut valider que ça se vend avant d’investir.',
      ar: 'أنت في البداية وما زلت تختبر عرضك: الأفضل أن تتأكّد أنه يباع قبل أن تستثمر.',
    },
  ] as Bilingual[],
  conclusion: {
    fr: 'Si vous êtes dans un de ces cas, nous vous le dirons — et nous ne vous vendrons pas de site. Revenez quand votre activité aura besoin d’un terrain qui vous appartient.',
    ar: 'إن كنت في إحدى هذه الحالات، سنقول لك ذلك، ولن نبيعك موقعًا. عد إلينا حين يحتاج نشاطك إلى أرض يملكها.',
  } as Bilingual,
};
