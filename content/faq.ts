import type { Bilingual } from './services';

export type FaqItem = {
  id: string;
  question: Bilingual;
  answer: Bilingual;
  /**
   * Renvoie vers une page du site quand la réponse mérite d'être creusée.
   * La clé correspond à une entrée de `routes` dans i18n/config.
   */
  link?: { route: 'compare' | 'process' | 'services'; label: Bilingual };
};

/**
 * Les objections réellement posées par les commerçants, et les réponses
 * qu'on leur donne. Deux à trois phrases, aucune promesse invérifiable.
 */
export const faq: FaqItem[] = [
  {
    id: 'facebook',
    question: {
      fr: 'J’ai déjà une page Facebook, pourquoi un site ?',
      ar: 'لديّ صفحة فيسبوك، فلماذا أحتاج إلى موقع؟',
    },
    answer: {
      fr: 'Facebook est un terrain loué : si la page ferme demain, vous perdez tout — messages, audience, années de publications. Le site vous appartient. Et une page Facebook n’apparaît pratiquement jamais quand quelqu’un cherche votre métier sur Google.',
      ar: 'فيسبوك أرض مستأجرة: إذا اختفت الصفحة غدًا، تخسر كل شيء، من الرسائل والجمهور إلى سنوات من المنشورات. أما الموقع فملكك. ثم إن صفحة فيسبوك لا تكاد تظهر حين يبحث أحدهم عن مهنتك في غوغل.',
    },
    link: {
      route: 'compare',
      label: {
        fr: 'Voir la comparaison complète',
        ar: 'اطّلع على المقارنة الكاملة',
      },
    },
  },
  {
    id: 'delai',
    question: {
      fr: 'Combien de temps pour avoir mon site ?',
      ar: 'كم يستغرق إنجاز موقعي؟',
    },
    answer: {
      fr: 'Entre une et six semaines selon le projet. Un site vitrine part sur une à deux semaines ; une boutique complète demande davantage. Le délai exact est fixé avant de commencer, pas en cours de route.',
      ar: 'بين أسبوع وستة أسابيع حسب المشروع. يستغرق الموقع التعريفي أسبوعًا إلى أسبوعين، ويحتاج المتجر الكامل إلى وقت أطول. نحدّد الأجل بدقة قبل أن نبدأ، لا في منتصف العمل.',
    },
  },
  {
    id: 'technique',
    question: {
      fr: 'Je ne comprends rien à l’informatique.',
      ar: 'لا أفهم شيئًا في المعلوماتية.',
    },
    answer: {
      fr: 'Ce n’est pas votre métier, c’est le mien. Vous envoyez vos photos et vos informations, je m’occupe de tout le reste. À la livraison, une heure de formation suffit pour que vous soyez autonome.',
      ar: 'هذه ليست مهنتك، بل مهنتي. ترسل صورك ومعلوماتك، وأتكفّل أنا بالباقي. وعند التسليم، تكفيك ساعة تدريب لتدير موقعك بنفسك.',
    },
  },
  {
    id: 'modifier',
    question: {
      fr: 'Puis-je modifier le site moi-même ?',
      ar: 'هل يمكنني تعديل الموقع بنفسي؟',
    },
    answer: {
      fr: 'Oui. Vous disposez d’un panneau de gestion utilisable depuis votre téléphone : ajouter un produit, changer un prix, publier une photo. Sans passer par moi et sans frais.',
      ar: 'نعم. لديك لوحة تحكّم تستعملها من هاتفك: تضيف منتجًا، وتغيّر سعرًا، وتنشر صورة. دون المرور بي، ودون أي تكلفة إضافية.',
    },
  },
  {
    id: 'satisfaction',
    question: {
      fr: 'Et si le résultat ne me plaît pas ?',
      ar: 'وإن لم تعجبني النتيجة؟',
    },
    answer: {
      fr: 'Vous validez la maquette avant qu’une seule ligne de code soit écrite. Tant qu’elle ne vous convient pas, on la reprend — c’est justement le moment où changer d’avis ne coûte rien.',
      ar: 'توافق على التصميم قبل أن نكتب أي سطر برمجي. وما دام لا يعجبك، نعيد العمل عليه. هذه بالضبط اللحظة التي لا يكلّف فيها تغيير الرأي شيئًا.',
    },
    link: {
      route: 'process',
      label: { fr: 'Voir notre méthode', ar: 'اطّلع على طريقتنا' },
    },
  },
  {
    id: 'apres',
    question: {
      fr: 'Que se passe-t-il après la livraison ?',
      ar: 'ماذا يحدث بعد التسليم؟',
    },
    answer: {
      fr: 'Le site est à vous. Un mois de corrections est inclus : si quelque chose ne va pas, je le règle. Passé ce délai, la maintenance est une option que vous prenez ou non.',
      ar: 'يصبح الموقع ملكك. يشمل العرض شهرًا من التصحيحات: إذا ظهر خلل، أصلحه. وبعد هذه المدة، تبقى الصيانة خيارًا تأخذه أو تتركه.',
    },
  },
  {
    id: 'propriete',
    question: {
      fr: 'Le site m’appartient vraiment ?',
      ar: 'هل الموقع ملكي فعلًا؟',
    },
    answer: {
      fr: 'Oui, entièrement. Le code, le nom de domaine et tous les accès sont mis à votre nom et vous sont transférés. Vous pouvez confier le site à quelqu’un d’autre demain sans rien me demander.',
      ar: 'نعم، بالكامل. أسجّل الكود واسم النطاق وكل صلاحيات الدخول باسمك، وأنقلها إليك. ويمكنك غدًا أن تعهد بالموقع إلى شخص آخر دون أن تطلب مني شيئًا.',
    },
  },
];
