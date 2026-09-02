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
      'أنا المطوّر اللي راه وراء MADDEV.',
      'نصمّم ونبرمج بيدي المواقع اللي نسلّمها: ما كاينش وسيط بينك وبين اللي يبني موقعك.',
      'كي تراسل MADDEV، أنا اللي نردّ عليك.',
    ],
  } as Record<'fr' | 'ar', string[]>,

  /** Pourquoi MADDEV existe. */
  why: {
    title: {
      fr: 'Pourquoi MADDEV existe',
      ar: 'علاش وُجد MADDEV',
    } as Bilingual,
    paragraphs: {
      fr: [
        'La plupart des commerces algériens n’existent en ligne que sur Facebook. Ça fonctionne — jusqu’au jour où ça ne fonctionne plus.',
        'Une page Facebook est un terrain loué. Vous n’en possédez ni les règles, ni l’audience, ni les données. Si la page est suspendue demain, il ne reste rien : ni les messages, ni les clients, ni les années de publications.',
        'Un site vous appartient. Il porte votre nom, il apparaît sur Google quand quelqu’un cherche votre métier, et personne ne peut vous le retirer.',
      ],
      ar: [
        'أغلب التجّار في الجزائر ما عندهمش وجود رقمي غير على فيسبوك. وهذا ينجح — حتى يجي النهار اللي ما ينجحش.',
        'صفحة فيسبوك أرض مكراة. ما تملكش قوانينها، لا جمهورها، لا بياناتها. وإذا تعلّقت الصفحة غدوة، ما يبقى والو: لا الرسائل، لا الزبائن، لا سنين المنشورات.',
        'أما الموقع فهو ملكك. يحمل اسمك، ويبان في غوغل كي يدوّر واحد على خدمتك، وحتى واحد ما يقدر ياخذهولك.',
      ],
    } as Record<'fr' | 'ar', string[]>,
  },

  /** Comment je travaille — engagements vérifiables, pas des promesses vagues. */
  how: {
    title: {
      fr: 'Comment je travaille',
      ar: 'كيفاش نخدم',
    } as Bilingual,
    points: [
      {
        title: {
          fr: 'La maquette est validée avant la première ligne de code',
          ar: 'التصميم توافق عليه قبل أول سطر كود',
        } as Bilingual,
        text: {
          fr: 'Vous voyez à quoi ressemblera votre site avant qu’il soit construit. Tant que la maquette ne vous convient pas, on la reprend — c’est le moment où changer d’avis ne coûte rien.',
          ar: 'تشوف شكل موقعك قبل ما يتبنى. وما دام التصميم ما عجبكش، نعاودوه — هذي هي اللحظة اللي ما يكلّفش فيها تبديل الرأي والو.',
        } as Bilingual,
      },
      {
        title: {
          fr: 'Le site vous appartient à 100 %',
          ar: 'الموقع ملكك 100٪',
        } as Bilingual,
        text: {
          fr: 'Le code, le nom de domaine et tous les accès sont mis à votre nom et vous sont transférés à la livraison. Vous n’êtes lié à personne, et surtout pas à moi.',
          ar: 'الكود واسم الموقع وكل الوصولات يتسجّلو باسمك ويتحوّلو ليك يوم التسليم. ما راكش مربوط بحتى واحد، وخاصة ماشي بيا.',
        } as Bilingual,
      },
      {
        title: {
          fr: 'Vous savez vous en servir avant que je parte',
          ar: 'تعرف كيفاش تستعملو قبل ما نروح',
        } as Bilingual,
        text: {
          fr: 'Une heure de formation à la livraison, et un mois de corrections inclus. La maintenance reste une option, jamais une obligation.',
          ar: 'ساعة تكوين يوم التسليم، وشهر من التصحيحات مشمول. أما الصيانة تبقى خيار، ماشي التزام.',
        } as Bilingual,
      },
    ],
  },
} as const;
