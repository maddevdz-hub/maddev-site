import type { Bilingual } from './services';

/**
 * Page « Qui sommes-nous ».
 *
 * ⚠️ Aucun fait personnel n'est inventé ici. Le texte ne contient ni nom,
 * ni ville, ni diplôme, ni nombre d'années d'expérience — rien que je
 * puisse affirmer sans le savoir. Renseignez `identity.name` et
 * `identity.role` si vous voulez signer la page ; laissés vides, ils
 * disparaissent simplement de l'affichage.
 */
export const about = {
  /** Facultatif : s'affiche sous la photo quand c'est renseigné. */
  identity: {
    name: '',
    role: {
      fr: 'Développeur, fondateur de MADDEV',
      ar: 'مطوّر ومؤسّس MADDEV',
    } as Bilingual,
  },

  /**
   * Photo du fondateur.
   * Déposez le fichier dans /public/about/ puis indiquez le chemin ici
   * (ex. '/about/portrait.jpg'). Tant que c'est vide, un cadre de marque
   * neutre est affiché — jamais une photo d'illustration achetée.
   */
  photo: '',

  /** Qui je suis — première personne, trois phrases, aucun superlatif. */
  intro: {
    fr: [
      'Je suis le développeur derrière MADDEV.',
      'Je conçois et je code moi-même les sites que je livre : il n’y a pas d’intermédiaire entre vous et la personne qui construit votre site.',
      'Quand vous écrivez à MADDEV, c’est moi qui réponds.',
    ],
    ar: [
      'أنا المطوّر الذي يقف وراء MADDEV.',
      'أصمّم وأبرمج بنفسي المواقع التي أسلّمها: لا وسيط بينك وبين من يبني موقعك.',
      'حين تراسل MADDEV، أنا من يرد عليك.',
    ],
  } as Record<'fr' | 'ar', string[]>,

  /** Pourquoi MADDEV existe. */
  why: {
    title: {
      fr: 'Pourquoi MADDEV existe',
      ar: 'لماذا يوجد MADDEV',
    } as Bilingual,
    paragraphs: {
      fr: [
        'La plupart des commerces algériens n’existent en ligne que sur Facebook. Ça fonctionne — jusqu’au jour où ça ne fonctionne plus.',
        'Une page Facebook est un terrain loué. Vous n’en possédez ni les règles, ni l’audience, ni les données. Si la page est suspendue demain, il ne reste rien : ni les messages, ni les clients, ni les années de publications.',
        'Un site vous appartient. Il porte votre nom, il apparaît sur Google quand quelqu’un cherche votre métier, et personne ne peut vous le retirer.',
      ],
      ar: [
        'أغلب المحلات في الجزائر لا وجود لها على الإنترنت إلا عبر فيسبوك. وهذا يعمل، إلى أن يأتي اليوم الذي يتوقّف فيه.',
        'صفحة فيسبوك أرض مستأجرة. لا تملك قواعدها، ولا جمهورها، ولا بياناتها. وإذا علّق فيسبوك الصفحة غدًا، لا يبقى شيء: لا الرسائل، ولا الزبائن، ولا سنوات المنشورات.',
        'أما الموقع فملكك. يحمل اسمك، ويظهر في غوغل حين يبحث أحدهم عن مهنتك، ولا يستطيع أحد أن ينتزعه منك.',
      ],
    } as Record<'fr' | 'ar', string[]>,
  },

  /** Comment je travaille — engagements vérifiables, pas des promesses vagues. */
  how: {
    title: {
      fr: 'Comment je travaille',
      ar: 'كيف أعمل',
    } as Bilingual,
    points: [
      {
        title: {
          fr: 'La maquette est validée avant la première ligne de code',
          ar: 'توافق على التصميم قبل أول سطر برمجي',
        } as Bilingual,
        text: {
          fr: 'Vous voyez à quoi ressemblera votre site avant qu’il soit construit. Tant que la maquette ne vous convient pas, on la reprend — c’est le moment où changer d’avis ne coûte rien.',
          ar: 'ترى شكل موقعك قبل بنائه. وما دام التصميم لا يعجبك، نعيد العمل عليه. هذه هي اللحظة التي لا يكلّف فيها تغيير الرأي شيئًا.',
        } as Bilingual,
      },
      {
        title: {
          fr: 'Le site vous appartient à 100 %',
          ar: 'الموقع ملكك بالكامل',
        } as Bilingual,
        text: {
          fr: 'Le code, le nom de domaine et tous les accès sont mis à votre nom et vous sont transférés à la livraison. Vous n’êtes lié à personne, et surtout pas à moi.',
          ar: 'أسجّل الكود واسم النطاق وكل صلاحيات الدخول باسمك، وأنقلها إليك يوم التسليم. لا تبقى مرتبطًا بأحد، ولا بي أنا.',
        } as Bilingual,
      },
      {
        title: {
          fr: 'Vous savez vous en servir avant que je parte',
          ar: 'تعرف كيف تستعمله قبل أن أغادر',
        } as Bilingual,
        text: {
          fr: 'Une heure de formation à la livraison, et un mois de corrections inclus. La maintenance reste une option, jamais une obligation.',
          ar: 'ساعة تدريب يوم التسليم، وشهر من التصحيحات مشمول. أما الصيانة فتبقى خيارًا، لا التزامًا.',
        } as Bilingual,
      },
    ],
  },
} as const;
