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
      ar: 'الصفحة مستضافة عند Meta وخاضعة لقوانينها. تستعملها وما تملكهاش.',
    },
    website: {
      fr: 'Le nom de domaine et le code sont à votre nom. Vous en disposez comme de n’importe quel bien.',
      ar: 'اسم الموقع والكود باسمك. تتصرّف فيهم كيما تتصرّف في أي ملك آخر.',
    },
  },
  {
    id: 'google',
    criterion: { fr: 'Visibilité sur Google', ar: 'الظهور في غوغل' },
    facebook: {
      fr: 'Une page Facebook remonte rarement lorsqu’un client cherche un métier et une ville.',
      ar: 'صفحة فيسبوك قلّ ما تبان كي يدوّر زبون على خدمة ومدينة.',
    },
    website: {
      fr: 'Le site est indexé et peut apparaître sur ces recherches, avec une fiche Google Maps liée.',
      ar: 'الموقع مسجّل في غوغل ويقدر يبان في هذي البحوث، مع بطاقة في خرائط غوغل.',
    },
  },
  {
    id: 'donnees',
    criterion: { fr: 'Données clients', ar: 'بيانات الزبائن' },
    facebook: {
      fr: 'Les abonnés restent chez Facebook. Vous ne pouvez ni les exporter, ni les emporter ailleurs.',
      ar: 'المتابعين يبقاو عند فيسبوك. ما تقدرش تخرّجهم ولا تنقلهم لبلاصة أخرى.',
    },
    website: {
      fr: 'Les demandes arrivent chez vous : formulaire, WhatsApp, email. La liste vous appartient.',
      ar: 'الطلبات توصلك أنت: استمارة، واتساب، بريد. والقائمة ملكك.',
    },
  },
  {
    id: 'duree',
    criterion: { fr: 'Durée de vie', ar: 'الاستمرارية' },
    facebook: {
      fr: 'Une page peut être restreinte ou supprimée sans préavis, et le recours est limité.',
      ar: 'الصفحة تقدر تتقيّد ولا تتمحى بلا إشعار، وما عندكش وين تشتكي.',
    },
    website: {
      fr: 'Le site reste en ligne tant que le domaine et l’hébergement sont payés. Rien d’autre ne le menace.',
      ar: 'الموقع يبقى على الإنترنت ما دام النطاق والاستضافة مخلّصين. ما كاين والو آخر يهدّدو.',
    },
  },
  {
    id: 'cout',
    criterion: { fr: 'Coût', ar: 'التكلفة' },
    facebook: {
      fr: 'Créer la page ne coûte rien. Être vu coûte : sans publicité, peu de monde voit vos publications.',
      ar: 'تدير الصفحة بلاش. أما تبان، هذا اللي يكلّف: بلا إعلانات، قليل اللي يشوفو منشوراتك.',
    },
    website: {
      fr: 'Un investissement au départ, puis le domaine et l’hébergement à renouveler chaque année.',
      ar: 'استثمار في البداية، ومن بعد تجدّد النطاق والاستضافة كل عام.',
    },
  },
  {
    id: 'credibilite',
    criterion: { fr: 'Crédibilité', ar: 'المصداقية' },
    facebook: {
      fr: 'Votre commerce a la même apparence que n’importe quelle autre page.',
      ar: 'نشاطك يبان كيما أي صفحة أخرى، بلا فرق.',
    },
    website: {
      fr: 'Une adresse à votre nom, une présentation qui vous ressemble : le sérieux se voit avant l’appel.',
      ar: 'عنوان باسمك وعرض يشبهك: الجدّية تبان قبل ما يرفع الزبون التيليفون.',
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
    ar: 'إمتى تكفي صفحة فيسبوك',
  } as Bilingual,
  intro: {
    fr: 'Un site n’est pas toujours le bon investissement. Dans ces trois situations, une page Facebook bien tenue fait le travail :',
    ar: 'الموقع ماشي ديما هو الاستثمار الصح. في هذي الحالات الثلاثة، تكفي صفحة فيسبوك مهتمّ بيها:',
  } as Bilingual,
  cases: [
    {
      fr: 'Vous vendez à quelques clients réguliers qui vous connaissent déjà et vous appellent directement.',
      ar: 'تبيع لعدد قليل من الزبائن الدائمين اللي يعرفوك ويتّصلو بيك مباشرة.',
    },
    {
      fr: 'Votre activité est saisonnière et ne tourne que quelques semaines par an.',
      ar: 'نشاطك موسمي وما يخدمش غير بضع أسابيع في العام.',
    },
    {
      fr: 'Vous débutez et vous testez encore votre offre : mieux vaut valider que ça se vend avant d’investir.',
      ar: 'راك في البداية وما زال تجرّب عرضك: خير تتأكّد بلي يتباع قبل ما تستثمر.',
    },
  ] as Bilingual[],
  conclusion: {
    fr: 'Si vous êtes dans un de ces cas, nous vous le dirons — et nous ne vous vendrons pas de site. Revenez quand votre activité aura besoin d’un terrain qui vous appartient.',
    ar: 'إذا راك في وحدة من هذي الحالات نقولوهالك — وما نبيعوكش موقع. ارجع لنا كي يحتاج نشاطك أرض يملكها هو.',
  } as Bilingual,
};
