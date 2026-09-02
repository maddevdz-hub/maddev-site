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
      ar: 'عندي صفحة فيسبوك، علاش نحتاج موقع؟',
    },
    answer: {
      fr: 'Facebook est un terrain loué : si la page ferme demain, vous perdez tout — messages, audience, années de publications. Le site vous appartient. Et une page Facebook n’apparaît pratiquement jamais quand quelqu’un cherche votre métier sur Google.',
      ar: 'فيسبوك أرض مكراة: إذا تسكّرت الصفحة غدوة تخسر كلش — الرسائل، الجمهور، وسنين من المنشورات. أما الموقع فهو ملكك. وزيد، صفحة فيسبوك ما تبانش كي يدوّر واحد على خدمتك في غوغل.',
    },
    link: {
      route: 'compare',
      label: {
        fr: 'Voir la comparaison complète',
        ar: 'شوف المقارنة الكاملة',
      },
    },
  },
  {
    id: 'delai',
    question: {
      fr: 'Combien de temps pour avoir mon site ?',
      ar: 'شحال ياخذ الوقت باش يكون موقعي جاهز؟',
    },
    answer: {
      fr: 'Entre une et six semaines selon le projet. Un site vitrine part sur une à deux semaines ; une boutique complète demande davantage. Le délai exact est fixé avant de commencer, pas en cours de route.',
      ar: 'ما بين أسبوع وستة أسابيع حسب المشروع. الموقع التعريفي يكمل في أسبوع ولا أسبوعين، أما المتجر الكامل يحتاج أكثر. والأجل نحدّدوه بالضبط قبل ما نبداو، ماشي في وسط الخدمة.',
    },
  },
  {
    id: 'technique',
    question: {
      fr: 'Je ne comprends rien à l’informatique.',
      ar: 'ما نفهم والو في الإعلام الآلي.',
    },
    answer: {
      fr: 'Ce n’est pas votre métier, c’est le mien. Vous envoyez vos photos et vos informations, je m’occupe de tout le reste. À la livraison, une heure de formation suffit pour que vous soyez autonome.',
      ar: 'هذي ماشي خدمتك، هذي خدمتي أنا. تبعث الصور والمعلومات، ونتكفّل أنا بالباقي. ويوم التسليم، ساعة تكوين وحدة تكفيك باش تولّي تسيّر بيدك.',
    },
  },
  {
    id: 'modifier',
    question: {
      fr: 'Puis-je modifier le site moi-même ?',
      ar: 'نقدر نبدّل في الموقع بيدي؟',
    },
    answer: {
      fr: 'Oui. Vous disposez d’un panneau de gestion utilisable depuis votre téléphone : ajouter un produit, changer un prix, publier une photo. Sans passer par moi et sans frais.',
      ar: 'إيه. عندك لوحة تحكّم تستعملها من تيليفونك: تزيد منتج، تبدّل سعر، تنشر صورة. بلا ما تعدّي عليّا وبلا زيادة في الفلوس.',
    },
  },
  {
    id: 'satisfaction',
    question: {
      fr: 'Et si le résultat ne me plaît pas ?',
      ar: 'وإذا ما عجبتنيش النتيجة؟',
    },
    answer: {
      fr: 'Vous validez la maquette avant qu’une seule ligne de code soit écrite. Tant qu’elle ne vous convient pas, on la reprend — c’est justement le moment où changer d’avis ne coûte rien.',
      ar: 'توافق على التصميم قبل ما نكتبو حتى سطر كود. وما دام ما عجبكش، نعاودوه — هذي بالضبط اللحظة اللي ما يكلّفش فيها تبديل الرأي والو.',
    },
    link: {
      route: 'process',
      label: { fr: 'Voir notre méthode', ar: 'شوف طريقتنا' },
    },
  },
  {
    id: 'apres',
    question: {
      fr: 'Que se passe-t-il après la livraison ?',
      ar: 'واش يصرا بعد التسليم؟',
    },
    answer: {
      fr: 'Le site est à vous. Un mois de corrections est inclus : si quelque chose ne va pas, je le règle. Passé ce délai, la maintenance est une option que vous prenez ou non.',
      ar: 'الموقع يولّي ملكك. شهر من التصحيحات مشمول: إذا خلّ شي حاجة نصلّحها. وبعد هذي المدة، الصيانة تبقى خيار تاخذو ولا تخليه.',
    },
  },
  {
    id: 'propriete',
    question: {
      fr: 'Le site m’appartient vraiment ?',
      ar: 'الموقع ملكي فعلًا؟',
    },
    answer: {
      fr: 'Oui, entièrement. Le code, le nom de domaine et tous les accès sont mis à votre nom et vous sont transférés. Vous pouvez confier le site à quelqu’un d’autre demain sans rien me demander.',
      ar: 'إيه، كامل. الكود واسم الموقع وكل الوصولات يتسجّلو باسمك ويتحوّلو ليك. وتقدر تعطي الموقع لواحد آخر غدوة بلا ما تسقسيني.',
    },
  },
];
