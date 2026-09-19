import {
  services,
  getService,
  type Bilingual,
  type Service,
} from '@/content/services';

/**
 * Configurateur « Trouvez votre solution ».
 *
 * Ce fichier contient TOUT ce qui définit le quiz : les questions, les
 * options, et la règle de recommandation. L'interface (components/quiz/)
 * ne fait que l'afficher — ajouter ou reformuler une question se fait ici,
 * sans toucher à un seul composant.
 *
 * Les identifiants de service viennent de content/services.ts et de nulle
 * part ailleurs : ce fichier en avait sa propre série, si bien que le quiz
 * recommandait une « application web » introuvable sur le site.
 *
 * Le texte est bilingue en place, comme dans content/services.ts. Seul le
 * chrome d'interface (boutons, progression, libellés du résultat) vit dans
 * messages/ar.json et messages/fr.json.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuestionId = 'situation' | 'goal' | 'contact' | 'budget';

/**
 * La situation du visiteur — ce qu'il TIENT, pas ce qu'il veut commander.
 *
 * La première question demandait « Quel est votre projet ? » avec quatre
 * réponses tirées de notre catalogue : vitrine, e-commerce, application,
 * refonte. Un gérant de café n'y trouvait rien qui lui ressemble, répondait
 * « un commerce à présenter », et repartait avec un site vitrine — alors que
 * le menu QR existe et lui prend une semaine.
 *
 * On part donc de son métier. La correspondance vers un service est notre
 * travail, pas le sien.
 *
 * `refonte` est la seule valeur qui ne désigne pas un métier : c'est un
 * drapeau. Le service à refondre se déduit des réponses suivantes — sinon
 * quelqu'un qui veut refondre SA boutique recevrait « site vitrine ».
 */
export type Situation =
  | 'restauration'
  | 'rendez-vous'
  | 'boutique'
  | 'notoriete'
  | 'parc'
  | 'outil'
  | 'refonte';
export type Goal = 'presence' | 'vente' | 'trafic' | 'automatisation';

/**
 * Comment les clients joignent le visiteur AUJOURD'HUI.
 *
 * Cette question remplace « Vendez-vous des produits physiques ? », qui ne
 * changeait la recommandation que dans la branche refonte — un chemin sur
 * sept — et ne servait à rien ailleurs.
 *
 * Elle ne change aucun service : elle change le CONSTAT. « Ils ne me
 * trouvent pas encore » dit un problème de visibilité, pas d'outil, et ce
 * problème se formule différemment selon le métier — un café qu'on ne
 * trouve pas n'a pas la même plaie qu'un parc de véhicules invisible.
 */
export type Contact = 'appel' | 'messagerie' | 'introuvable';
/**
 * Tranches de budget. Elles servent UNIQUEMENT à qualifier le prospect :
 * la réponse part dans le message qui nous est adressé et n'est jamais
 * réaffichée au visiteur. Le site n'annonce aucun montant.
 */
export type Budget = 'lt50' | '50-100' | '100-200' | 'gt200' | 'unknown';

export type Answers = {
  situation?: Situation;
  goal?: Goal;
  contact?: Contact;
  budget?: Budget;
};

/** Nom d'icône dessinée dans components/quiz/QuizIcon.tsx */
export type OptionIcon =
  | 'store'
  | 'cart'
  | 'idea'
  | 'refresh'
  | 'couverts'
  | 'horloge'
  | 'immeubles'
  | 'telephone'
  | 'introuvable'
  | 'badge'
  | 'coins'
  | 'target'
  | 'gears'
  | 'boxes'
  | 'box'
  | 'briefcase'
  | 'coinSmall'
  | 'coinMid'
  | 'coinHigh'
  | 'coinMax'
  | 'chat';

export type QuizOption = {
  /** Valeur stockée dans les réponses. */
  value: string;
  icon: OptionIcon;
  label: Bilingual;
};

export type Question = {
  id: QuestionId;
  title: Bilingual;
  /** Précision affichée sous le titre. */
  subtitle?: Bilingual;
  /** Une question facultative peut être sautée (bouton « Passer »). */
  optional?: boolean;
  options: QuizOption[];
};

// ---------------------------------------------------------------------------
// Les 4 questions
// ---------------------------------------------------------------------------

export const questions: Question[] = [
  {
    id: 'situation',
    title: {
      fr: 'Vous êtes dans quelle situation ?',
      ar: 'ما وضع نشاطك اليوم؟',
    },
    subtitle: {
      fr: 'Choisissez ce qui décrit le mieux votre activité aujourd’hui.',
      ar: 'اختر ما يصف نشاطك اليوم أفضل وصف.',
    },
    /*
     * L'ordre suit celui de /services : du plus simple à se représenter au
     * plus engageant. « J'ai déjà un site » ferme la liste — c'est la seule
     * réponse qui parle d'un site plutôt que d'un métier.
     */
    options: [
      {
        value: 'restauration',
        icon: 'couverts',
        label: {
          fr: 'Un restaurant, un café, un fast-food',
          ar: 'مطعم أو مقهى أو مطعم سريع',
        },
      },
      {
        value: 'rendez-vous',
        icon: 'horloge',
        label: {
          fr: 'Un cabinet, un salon, un atelier sur rendez-vous',
          ar: 'عيادة أو صالون أو ورشة بالموعد',
        },
      },
      {
        value: 'boutique',
        icon: 'cart',
        label: {
          fr: 'Un commerce avec des produits à vendre',
          ar: 'متجر بمنتجات للبيع',
        },
      },
      {
        value: 'notoriete',
        icon: 'store',
        label: {
          fr: 'Une activité à faire connaître',
          ar: 'نشاط أريد التعريف به',
        },
      },
      {
        value: 'parc',
        icon: 'immeubles',
        label: {
          fr: 'Un parc de biens ou de véhicules à publier',
          ar: 'عقارات أو مركبات للنشر',
        },
      },
      {
        value: 'outil',
        icon: 'idea',
        label: {
          fr: 'Une idée d’outil métier',
          ar: 'فكرة أداة لمهنتي',
        },
      },
      {
        value: 'refonte',
        icon: 'refresh',
        label: {
          fr: 'J’ai déjà un site à améliorer',
          ar: 'لديّ موقع أريد تحسينه',
        },
      },
    ],
  },
  {
    id: 'goal',
    title: {
      fr: 'Votre objectif principal ?',
      ar: 'واش هدفك الأساسي؟',
    },
    subtitle: {
      fr: 'Celui qui compte le plus pour vous dans les mois qui viennent.',
      ar: 'الأهم بالنسبة ليك في الشهور الجاية.',
    },
    options: [
      {
        value: 'presence',
        icon: 'badge',
        label: {
          fr: 'Exister en ligne professionnellement',
          ar: 'حضور احترافي على الإنترنت',
        },
      },
      {
        value: 'vente',
        icon: 'coins',
        label: {
          fr: 'Vendre et recevoir des commandes',
          ar: 'نبيع ونستقبل الطلبات',
        },
      },
      {
        value: 'trafic',
        icon: 'target',
        label: {
          fr: 'Attirer des clients grâce à la publicité',
          ar: 'نجلب الزبائن بالإعلانات',
        },
      },
      {
        value: 'automatisation',
        icon: 'gears',
        label: {
          fr: 'Automatiser un processus métier',
          ar: 'نربح الوقت في خدمة متكرّرة',
        },
      },
    ],
  },
  {
    id: 'contact',
    title: {
      fr: 'Aujourd’hui, comment vos clients vous contactent-ils ?',
      ar: 'اليوم، كيف يتواصل معك زبائنك؟',
    },
    options: [
      {
        value: 'appel',
        icon: 'telephone',
        label: {
          fr: 'Ils appellent ou passent',
          ar: 'يتّصلون أو يمرّون بالمحل',
        },
      },
      {
        value: 'messagerie',
        icon: 'chat',
        label: {
          fr: 'Messenger ou WhatsApp',
          ar: 'ماسنجر أو واتساب',
        },
      },
      {
        value: 'introuvable',
        icon: 'introuvable',
        label: {
          fr: 'Ils ne me trouvent pas encore',
          ar: 'لا يعثرون عليّ بعد',
        },
      },
    ],
  },
  {
    id: 'budget',
    title: {
      fr: 'Quel budget avez-vous en tête ?',
      ar: 'شحال الميزانية اللي راك تفكّر فيها؟',
    },
    subtitle: {
      fr: 'Cela ne change pas notre recommandation — c’est ce qui nous permet de vous répondre avec une proposition juste.',
      ar: 'هذا ما يبدّلش توصيتنا — بصح يعاوننا نحضّرو عرض مناسب ليك.',
    },
    options: [
      {
        value: 'lt50',
        icon: 'coinSmall',
        label: { fr: 'Moins de 50 000 DA', ar: 'أقل من 50 000 دج' },
      },
      {
        value: '50-100',
        icon: 'coinMid',
        label: { fr: '50 000 – 100 000 DA', ar: 'من 50 000 إلى 100 000 دج' },
      },
      {
        value: '100-200',
        icon: 'coinHigh',
        label: { fr: '100 000 – 200 000 DA', ar: 'من 100 000 إلى 200 000 دج' },
      },
      {
        value: 'gt200',
        icon: 'coinMax',
        label: { fr: 'Plus de 200 000 DA', ar: 'أكثر من 200 000 دج' },
      },
      {
        value: 'unknown',
        icon: 'chat',
        label: { fr: 'Je ne sais pas encore', ar: 'ما زال ما نعرفش' },
      },
    ],
  },
];

/**
 * Libellés des tranches, en français, pour le message qui NOUS est envoyé.
 * Ils ne sont jamais rendus dans l'interface.
 */
export const budgetLabels: Record<Budget, string> = {
  lt50: 'Moins de 50 000 DA',
  '50-100': '50 000 – 100 000 DA',
  '100-200': '100 000 – 200 000 DA',
  gt200: 'Plus de 200 000 DA',
  unknown: 'Ne sait pas encore',
};

/** Valide une valeur venant d'une URL ou d'un POST avant de s'en servir. */
export function isBudget(value: unknown): value is Budget {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(budgetLabels, value)
  );
}

// ---------------------------------------------------------------------------
// Phrases du résultat
//
// Le « pourquoi » est composé de deux phrases entières plutôt que de
// fragments assemblés : en arabe comme en français, recoller des morceaux
// produit vite des phrases bancales. Un constat + une conclusion.
// ---------------------------------------------------------------------------

export type SituationKey =
  | 'restauration'
  | 'restaurationInvisible'
  | 'rendezVous'
  | 'rendezVousInvisible'
  | 'boutique'
  | 'boutiqueInvisible'
  | 'notoriete'
  | 'notorieteInvisible'
  | 'parc'
  | 'parcInvisible'
  | 'outilIdee'
  | 'outilInvisible'
  | 'outilAutomatisation'
  | 'redesign'
  | 'redesignInvisible';

/**
 * Une conclusion par service atteignable en recommandation principale.
 *
 * `campagne-publicitaire` n'y figure pas : la publicité ne vient jamais
 * seule, elle s'ajoute en second à un service qui l'accueille. Une campagne
 * qui mène à une page inexistante ne rapporte rien.
 */
export type ConclusionKey =
  | 'menu-qr'
  | 'prise-de-rendez-vous'
  | 'boutique-en-ligne'
  | 'site-vitrine'
  | 'plateforme-annonces'
  | 'plateforme-sur-mesure'
  | 'redesign';

/**
 * Constat : ce que le visiteur vient de nous dire, reformulé.
 *
 * Chaque métier a deux versions. La seconde sert quand il répond « ils ne me
 * trouvent pas encore » : sa plaie n'est alors pas l'outil mais la
 * visibilité, et le constat doit le dire — sinon on lui explique comment
 * mieux servir des clients qui ne viennent pas.
 *
 * Deux phrases entières, jamais des fragments recollés : en arabe comme en
 * français, assembler des morceaux produit vite des phrases bancales.
 */
export const situations: Record<SituationKey, Bilingual> = {
  restauration: {
    fr: 'Vous servez des clients à table, et votre carte change plus souvent que vous ne la réimprimez.',
    ar: 'تقدّم الخدمة لزبائن على الطاولات، وقائمتك تتغيّر أكثر مما تعيد طباعتها.',
  },
  restaurationInvisible: {
    fr: 'On vous découvre en passant devant, et ceux qui ne passent pas ne savent même pas ce que vous servez.',
    ar: 'يكتشفك الناس حين يمرّون أمامك، ومن لا يمرّ لا يعرف حتى ماذا تقدّم.',
  },
  rendezVous: {
    fr: 'Votre activité fonctionne sur rendez-vous, et le téléphone sonne pendant que vous êtes avec un client.',
    ar: 'نشاطك يقوم على المواعيد، والهاتف يرنّ بينما أنت مع زبون.',
  },
  rendezVousInvisible: {
    fr: 'Vous travaillez sur rendez-vous, mais rien en ligne ne permet d’en prendre un — ni même de savoir que vous existez.',
    ar: 'تعمل بالمواعيد، لكن لا شيء على الإنترنت يسمح بحجز موعد، ولا حتى بمعرفة أنك موجود.',
  },
  boutique: {
    fr: 'Vos clients commandent en vous écrivant, et chaque commande se reconstitue message après message.',
    ar: 'يطلب زبائنك بمراسلتك، وكل طلب يُجمَّع رسالة بعد رسالة.',
  },
  boutiqueInvisible: {
    fr: 'Vous avez des produits à vendre, mais il faut déjà vous connaître pour les voir : personne ne tombe dessus par hasard.',
    ar: 'لديك منتجات للبيع، لكن يجب أن يعرفك المرء مسبقًا ليراها: لا أحد يعثر عليها مصادفة.',
  },
  notoriete: {
    fr: 'Votre activité tourne surtout au bouche-à-oreille, et vous voulez qu’elle tienne debout sans lui.',
    ar: 'نشاطك يقوم أساسًا على التوصية الشفهية، وتريده أن يصمد دونها.',
  },
  notorieteInvisible: {
    fr: 'Quand quelqu’un cherche votre métier dans votre ville, il tombe sur vos concurrents et jamais sur vous.',
    ar: 'حين يبحث أحدهم عن مهنتك في مدينتك، يجد منافسيك ولا يجدك أبدًا.',
  },
  parc: {
    fr: 'Vous avez des biens ou des véhicules à publier, et chaque demande commence aujourd’hui par un appel pour savoir ce qui reste disponible.',
    ar: 'لديك عقارات أو مركبات للنشر، وكل طلب يبدأ اليوم بمكالمة لمعرفة ما بقي متوفّرًا.',
  },
  parcInvisible: {
    fr: 'Ce que vous proposez n’existe nulle part en ligne : personne ne peut le voir avant de vous avoir appelé.',
    ar: 'ما تعرضه غير موجود على الإنترنت: لا أحد يمكنه رؤيته قبل أن يتّصل بك.',
  },
  outilIdee: {
    fr: 'Vous avez une idée d’outil métier et il faut la transformer en quelque chose que votre équipe utilisera vraiment.',
    ar: 'عندك فكرة منصّة ولازم تولّي منتج يتستعمل.',
  },
  outilInvisible: {
    fr: 'Vous partez d’une idée d’outil métier et de rien d’autre : aujourd’hui, personne ne vous trouve en ligne.',
    ar: 'تنطلق من فكرة أداة لمهنتك ومن لا شيء غيرها: اليوم، لا أحد يعثر عليك على الإنترنت.',
  },
  outilAutomatisation: {
    fr: 'Vous voulez automatiser un fonctionnement interne qui vous coûte du temps aujourd’hui.',
    ar: 'حاب تربح الوقت في خدمة داخلية راهي تاكلك وقت اليوم.',
  },
  redesign: {
    fr: 'Vous avez déjà un site, mais il ne travaille pas assez pour vous.',
    ar: 'عندك موقع بصح ما يخدمش ليك كيما لازم.',
  },
  redesignInvisible: {
    fr: 'Vous avez déjà un site, mais vos clients ne le croisent jamais : il ne vous amène personne.',
    ar: 'لديك موقع بالفعل، لكن زبائنك لا يصادفونه أبدًا: لا يجلب لك أحدًا.',
  },
};

/** Conclusion : pourquoi ce service répond exactement à ce constat. */
export const conclusions: Record<ConclusionKey, Bilingual> = {
  'menu-qr': {
    fr: 'Un menu QR répond exactement à cela : vos clients scannent le code posé sur la table, et vous changez un prix ou retirez un plat depuis votre téléphone, sans rien réimprimer.',
    ar: 'قائمة QR تجيب عن هذا تمامًا: يمسح زبائنك الرمز الموضوع على الطاولة، وتغيّر سعرًا أو تحذف طبقًا من هاتفك، دون إعادة طباعة.',
  },
  'prise-de-rendez-vous': {
    fr: 'Un agenda en ligne règle ce problème : vos clients réservent seuls à toute heure, le rappel part la veille sur WhatsApp, et une annulation libère le créneau sans un appel.',
    ar: 'أجندة على الإنترنت تحلّ هذه المشكلة: يحجز زبائنك بأنفسهم في أي وقت، ويصل التذكير في اليوم السابق عبر واتساب، والإلغاء يحرّر الموعد دون مكالمة.',
  },
  'boutique-en-ligne': {
    fr: 'Une boutique en ligne est ce qui vous fera gagner le plus : catalogue, panier, et commande WhatsApp ou paiement à la livraison, sans intermédiaire.',
    ar: 'المتجر الإلكتروني هو الأنسب ليك: كتالوج، سلة، وطلب عبر واتساب ولا خلاص عند الاستلام، بلا وسيط.',
  },
  'site-vitrine': {
    fr: 'Un site vitrine couvre exactement ce besoin : il vous présente, rassure vos visiteurs, et transforme leur intérêt en appel ou en message WhatsApp.',
    ar: 'الموقع التعريفي يغطّي هذي الحاجة بالضبط: يعرّف بيك، يطمّن زوّارك، ويحوّل اهتمامهم لمكالمة ولا رسالة واتساب.',
  },
  'plateforme-annonces': {
    fr: 'Une plateforme d’annonces traite cela à la source : vos clients filtrent par wilaya, par budget et par type, consultent la fiche complète, et ne vous appellent qu’une fois décidés.',
    ar: 'منصّة إعلانات تعالج ذلك من جذوره: يفلتر زبائنك حسب الولاية والميزانية والنوع، ويطّلعون على البطاقة الكاملة، ولا يتّصلون بك إلا بعد أن يقرّروا.',
  },
  'plateforme-sur-mesure': {
    fr: 'Une plateforme sur mesure est la bonne réponse : on cadre le besoin réel avec vous avant de développer, pour éviter de construire ce que personne n’utilisera.',
    ar: 'التطبيق المخصّص هو الجواب الصح: نحدّدو الحاجة الحقيقية معاك قبل البرمجة، باش ما نبنيوش حاجة ما يستعملها حتى واحد.',
  },
  redesign: {
    fr: 'On repart de votre site existant : on garde ce qui marche, on refait ce qui bloque, et on l’oriente vers ce résultat précis.',
    ar: 'ننطلقو من موقعك الحالي: نخلّيو اللي ينجح، ونعاودو اللي يعرقل، ونوجّهوه لهذي النتيجة بالضبط.',
  },
};

/*
 * Aucune grille tarifaire ici, et c'est délibéré : le configurateur ne
 * chiffre rien. Annoncer une fourchette avant d'avoir compris le périmètre
 * revient soit à s'engager sur un montant qu'on ne tiendra pas, soit à faire
 * fuir un prospect que le projet aurait intéressé. Le résultat promet une
 * réponse chiffrée sous 24 h ; c'est un humain qui la produit.
 */

/**
 * Réalisation à montrer en exemple, quand il en existe une pertinente.
 *
 * Le showroom de meubles illustrait `boutique-ecommerce` ici pendant que
 * /services l'attachait au site vitrine. Le même client réel prouvait donc
 * deux choses différentes selon la page — et nous n'en avons qu'un.
 * Il illustre le site vitrine, partout et sans exception.
 *
 * Les autres restent vides : on montre un visuel de marque plutôt qu'un
 * projet qui n'existe pas.
 */
const exampleProject: Record<string, string | undefined> = {
  'site-vitrine': 'showroom-meubles-bba',
  'menu-qr': undefined,
  'prise-de-rendez-vous': undefined,
  'boutique-en-ligne': undefined,
  'plateforme-annonces': undefined,
  'plateforme-sur-mesure': undefined,
};

// ---------------------------------------------------------------------------
// La recommandation
// ---------------------------------------------------------------------------

export type Recommendation = {
  service: Service;
  /** Service complémentaire, proposé en second (« on recommande aussi »). */
  secondary?: Service;
  /** Le visiteur part d'un site existant : on parle de refonte, pas de création. */
  isRedesign: boolean;
  situationKey: SituationKey;
  conclusionKey: ConclusionKey;
  exampleProjectSlug?: string;
};

/**
 * Le service de base, directement déduit du métier du visiteur.
 *
 * C'est la table du brief, et elle se lit d'un coup d'œil : à chaque
 * situation son service. Aucune règle cachée ne vient la contredire — si
 * quelqu'un dit « je tiens un café », il reçoit le menu QR, pas un site
 * vitrine parce qu'une autre réponse aurait pesé plus lourd.
 */
const BASE_PAR_SITUATION: Record<Exclude<Situation, 'refonte'>, string> = {
  restauration: 'menu-qr',
  'rendez-vous': 'prise-de-rendez-vous',
  boutique: 'boutique-en-ligne',
  notoriete: 'site-vitrine',
  parc: 'plateforme-annonces',
  outil: 'plateforme-sur-mesure',
};

/**
 * Détermine le service principal.
 *
 * `refonte` n'est pas un service : c'est une manière d'aborder celui qu'on
 * détecte ensuite. Un visiteur qui veut refondre SA boutique doit recevoir
 * « boutique, en refonte » — pas « site vitrine ».
 *
 * La façon dont ses clients le joignent n'entre pas dans ce calcul : elle
 * dit une plaie, pas un besoin d'outil. Elle agit sur le constat.
 */
function pickPrimarySlug(answers: Answers): string {
  const { situation, goal } = answers;

  if (situation && situation !== 'refonte') {
    return BASE_PAR_SITUATION[situation];
  }

  /*
   * Deux cas tombent ici : la refonte, et une première question restée sans
   * réponse (URL trafiquée). On se rabat sur l'objectif.
   */
  if (goal === 'vente') return 'boutique-en-ligne';
  if (goal === 'automatisation') return 'plateforme-sur-mesure';
  return 'site-vitrine';
}

/**
 * Les deux constats de chaque service : le courant, et celui qu'on sert au
 * visiteur que personne ne trouve.
 *
 * Indexé par service et non par situation : le visiteur en refonte, ou celui
 * dont la première réponse manque, reçoit quand même le constat du service
 * qu'on lui recommande.
 */
const CONSTAT_PAR_SERVICE: Record<
  string,
  { courant: SituationKey; invisible: SituationKey }
> = {
  'menu-qr': { courant: 'restauration', invisible: 'restaurationInvisible' },
  'prise-de-rendez-vous': { courant: 'rendezVous', invisible: 'rendezVousInvisible' },
  'boutique-en-ligne': { courant: 'boutique', invisible: 'boutiqueInvisible' },
  'site-vitrine': { courant: 'notoriete', invisible: 'notorieteInvisible' },
  'plateforme-annonces': { courant: 'parc', invisible: 'parcInvisible' },
};

/** Choisit la phrase de constat la plus proche de ce que le visiteur a dit. */
function pickSituation(answers: Answers, primarySlug: string): SituationKey {
  const { situation, goal, contact } = answers;
  const invisible = contact === 'introuvable';

  if (situation === 'refonte') {
    return invisible ? 'redesignInvisible' : 'redesign';
  }

  /*
   * L'outil interne garde ses deux angles — une idée à cadrer, ou un
   * fonctionnement à automatiser. Mais « personne ne me trouve » l'emporte
   * même ici : le visiteur vient de dire quelque chose sur son commerce, et
   * un constat qui l'ignore lui apprend seulement qu'on ne l'a pas écouté.
   */
  if (primarySlug === 'plateforme-sur-mesure') {
    if (invisible) return 'outilInvisible';
    return goal === 'automatisation' ? 'outilAutomatisation' : 'outilIdee';
  }

  const paire = CONSTAT_PAR_SERVICE[primarySlug] ?? CONSTAT_PAR_SERVICE['site-vitrine'];
  return invisible ? paire.invisible : paire.courant;
}

export function getRecommendation(answers: Answers): Recommendation {
  const primarySlug = pickPrimarySlug(answers);
  const service = getService(primarySlug) ?? services[0];
  const isRedesign = answers.situation === 'refonte';

  /*
   * La publicité ne remplace jamais la recommandation principale : elle la
   * complète. Le garde-fou vaut pour le jour où une situation la
   * désignerait en premier — une campagne qui mène à une page inexistante
   * ne rapporte rien.
   */
  const secondary =
    answers.goal === 'trafic' && primarySlug !== 'campagne-publicitaire'
      ? getService('campagne-publicitaire')
      : undefined;

  return {
    service,
    secondary,
    isRedesign,
    situationKey: pickSituation(answers, primarySlug),
    conclusionKey: isRedesign ? 'redesign' : (primarySlug as ConclusionKey),
    exampleProjectSlug: exampleProject[primarySlug],
  };
}

/** Nombre total d'étapes — utilisé par la barre de progression. */
export const totalSteps = questions.length;

// ---------------------------------------------------------------------------
// Sérialisation des réponses dans l'URL
//
// Le résultat devient ainsi partageable et mesurable : un prospect peut
// envoyer son lien, et les statistiques distinguent enfin les
// recommandations servies. Les clés sont courtes pour garder une URL lisible.
// ---------------------------------------------------------------------------

const PARAM_KEYS: Record<QuestionId, string> = {
  situation: 'p',
  goal: 'o',
  contact: 'v',
  budget: 'b',
};

/** Réponses -> paramètres d'URL. */
export function answersToParams(answers: Answers): URLSearchParams {
  const params = new URLSearchParams();
  questions.forEach((question) => {
    const value = answers[question.id];
    if (value) params.set(PARAM_KEYS[question.id], value);
  });
  return params;
}

/**
 * Paramètres d'URL -> réponses.
 * Toute valeur inconnue est ignorée : une URL trafiquée ne peut pas
 * introduire d'état invalide.
 */
export function answersFromParams(
  params: URLSearchParams | ReadonlyURLSearchParamsLike,
): Answers {
  const answers: Answers = {};

  questions.forEach((question) => {
    const raw = params.get(PARAM_KEYS[question.id]);
    if (!raw) return;
    if (question.options.some((option) => option.value === raw)) {
      // Les valeurs sont validées ci-dessus contre la liste des options.
      (answers as Record<string, string>)[question.id] = raw;
    }
  });

  return answers;
}

/** Un quiz est terminé quand chaque question a une réponse valide. */
export function isComplete(answers: Answers): boolean {
  return questions.every((question) => Boolean(answers[question.id]));
}

/** Sous-ensemble de l'API URLSearchParams dont nous avons besoin. */
type ReadonlyURLSearchParamsLike = { get(name: string): string | null };
