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

export type QuestionId = 'type' | 'goal' | 'produits' | 'budget';

export type ProjectType = 'vitrine' | 'ecommerce' | 'app' | 'refonte';
export type Goal = 'presence' | 'vente' | 'trafic' | 'automatisation';
export type Produits = 'many' | 'few' | 'none';
/**
 * Tranches de budget. Elles servent UNIQUEMENT à qualifier le prospect :
 * la réponse part dans le message qui nous est adressé et n'est jamais
 * réaffichée au visiteur. Le site n'annonce aucun montant.
 */
export type Budget = 'lt50' | '50-100' | '100-200' | 'gt200' | 'unknown';

export type Answers = {
  type?: ProjectType;
  goal?: Goal;
  produits?: Produits;
  budget?: Budget;
};

/** Nom d'icône dessinée dans components/quiz/QuizIcon.tsx */
export type OptionIcon =
  | 'store'
  | 'cart'
  | 'idea'
  | 'refresh'
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
    id: 'type',
    title: {
      fr: 'Quel est votre projet ?',
      ar: 'واش نوع مشروعك؟',
    },
    subtitle: {
      fr: 'Choisissez ce qui ressemble le plus à votre situation.',
      ar: 'اختار اللي يشبه حالتك أكثر.',
    },
    options: [
      {
        value: 'vitrine',
        icon: 'store',
        label: {
          fr: 'Un commerce ou une entreprise à présenter',
          ar: 'محل ولا شركة حاب نعرّف بيها',
        },
      },
      {
        value: 'ecommerce',
        icon: 'cart',
        label: {
          fr: 'Vendre des produits en ligne',
          ar: 'نبيع منتجات على الإنترنت',
        },
      },
      {
        value: 'app',
        icon: 'idea',
        label: {
          fr: 'Une idée d’application ou de plateforme',
          ar: 'فكرة تطبيق ولا منصّة',
        },
      },
      {
        value: 'refonte',
        icon: 'refresh',
        label: {
          fr: 'J’ai déjà un site à améliorer',
          ar: 'عندي موقع وحاب نحسّنو',
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
    id: 'produits',
    title: {
      fr: 'Vendez-vous des produits physiques ?',
      ar: 'راك تبيع منتجات فعلية؟',
    },
    options: [
      {
        value: 'many',
        icon: 'boxes',
        label: {
          fr: 'Oui, beaucoup de produits',
          ar: 'إيه، بزاف من المنتجات',
        },
      },
      {
        value: 'few',
        icon: 'box',
        label: {
          fr: 'Oui, quelques-uns',
          ar: 'إيه، شوية من المنتجات',
        },
      },
      {
        value: 'none',
        icon: 'briefcase',
        label: {
          fr: 'Non, je propose des services',
          ar: 'لا، نقدّم خدمات',
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
  | 'ecommerceMany'
  | 'ecommerceFew'
  | 'ecommerceIntent'
  | 'appIdea'
  | 'automation'
  | 'redesign'
  | 'presenceServices'
  | 'presence'
  | 'traffic';

export type ConclusionKey =
  | 'site-vitrine'
  | 'boutique-en-ligne'
  | 'plateforme-sur-mesure'
  | 'campagne-publicitaire'
  | 'redesign';

/** Constat : ce que le visiteur vient de nous dire, reformulé. */
export const situations: Record<SituationKey, Bilingual> = {
  ecommerceMany: {
    fr: 'Vous avez un catalogue fourni et vous voulez recevoir des commandes en ligne.',
    ar: 'عندك كتالوج غني وحاب تستقبل الطلبات على الإنترنت.',
  },
  ecommerceFew: {
    fr: 'Vous vendez quelques produits et vous voulez que vos clients puissent les commander sans vous appeler.',
    ar: 'تبيع شوية من المنتجات وحاب زبائنك يطلبوها بلا ما يتّصلو بيك.',
  },
  ecommerceIntent: {
    fr: 'Vous voulez vendre en ligne et encaisser de vraies commandes, pas seulement montrer vos produits.',
    ar: 'حاب تبيع على الإنترنت وتستقبل طلبات حقيقية، ماشي غير تعرض منتجاتك.',
  },
  appIdea: {
    fr: 'Vous avez une idée de plateforme et il faut la transformer en produit utilisable.',
    ar: 'عندك فكرة منصّة ولازم تولّي منتج يتستعمل.',
  },
  automation: {
    fr: 'Vous voulez automatiser un fonctionnement interne qui vous coûte du temps aujourd’hui.',
    ar: 'حاب تربح الوقت في خدمة داخلية راهي تاكلك وقت اليوم.',
  },
  redesign: {
    fr: 'Vous avez déjà un site, mais il ne travaille pas assez pour vous.',
    ar: 'عندك موقع بصح ما يخدمش ليك كيما لازم.',
  },
  presenceServices: {
    fr: 'Vous proposez des services et vous voulez une présence en ligne qui inspire confiance.',
    ar: 'تقدّم خدمات وحاب حضور رقمي يعطي الثقة.',
  },
  presence: {
    fr: 'Vous voulez d’abord exister en ligne, proprement et sérieusement.',
    ar: 'حاب لوّل حضور على الإنترنت، نظيف وجدّي.',
  },
  traffic: {
    fr: 'Vous cherchez surtout à faire venir des clients qualifiés.',
    ar: 'راك تدوّر قبل كلش على زبائن مهتمّين فعلًا.',
  },
};

/** Conclusion : pourquoi ce service répond exactement à ce constat. */
export const conclusions: Record<ConclusionKey, Bilingual> = {
  'site-vitrine': {
    fr: 'Un site vitrine couvre exactement ce besoin : il vous présente, rassure vos visiteurs, et transforme leur intérêt en appel ou en message WhatsApp.',
    ar: 'الموقع التعريفي يغطّي هذي الحاجة بالضبط: يعرّف بيك، يطمّن زوّارك، ويحوّل اهتمامهم لمكالمة ولا رسالة واتساب.',
  },
  'boutique-en-ligne': {
    fr: 'Une boutique e-commerce est ce qui vous fera gagner le plus : catalogue, panier, et commande WhatsApp ou paiement à la livraison, sans intermédiaire.',
    ar: 'المتجر الإلكتروني هو الأنسب ليك: كتالوج، سلة، وطلب عبر واتساب ولا خلاص عند الاستلام، بلا وسيط.',
  },
  'plateforme-sur-mesure': {
    fr: 'Une application sur mesure est la bonne réponse : on cadre le besoin réel avec vous avant de développer, pour éviter de construire ce que personne n’utilisera.',
    ar: 'التطبيق المخصّص هو الجواب الصح: نحدّدو الحاجة الحقيقية معاك قبل البرمجة، باش ما نبنيوش حاجة ما يستعملها حتى واحد.',
  },
  'campagne-publicitaire': {
    fr: 'Des campagnes bien ciblées amèneront les visiteurs, et comme nous construisons aussi la page d’arrivée, la mesure reste fiable.',
    ar: 'الحملات المستهدفة تجلب الزوار، وبما أننا نبنيو صفحة الوصول تاني، القياس يبقى موثوق.',
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

/** Réalisation à montrer en exemple, quand il en existe une pertinente. */
const exampleProject: Record<string, string | undefined> = {
  'site-vitrine': undefined,
  'boutique-en-ligne': 'showroom-meubles-bba',
  // Pas de réalisation publiable sur ces deux axes pour l'instant : on
  // montre un visuel de marque plutôt qu'un projet qui n'existe pas.
  'plateforme-sur-mesure': undefined,
  'campagne-publicitaire': undefined,
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
 * Détermine le service principal.
 *
 * L'ordre des règles est délibéré : l'intention de vendre l'emporte sur tout
 * le reste, puis le besoin d'outil métier. La refonte n'est pas un service à
 * part — c'est une manière d'aborder le service détecté en dessous, sinon un
 * visiteur qui veut refondre SA boutique recevrait une reco « site vitrine ».
 */
function pickPrimarySlug(answers: Answers): string {
  const { type, goal, produits } = answers;

  if (type === 'ecommerce' || goal === 'vente' || produits === 'many') {
    return 'boutique-en-ligne';
  }
  if (type === 'app' || goal === 'automatisation') {
    return 'plateforme-sur-mesure';
  }
  if (produits === 'few' && goal !== 'presence') {
    // Quelques produits sans volonté claire de vitrine : la boutique reste
    // le meilleur point de départ.
    return 'boutique-en-ligne';
  }
  return 'site-vitrine';
}

/** Choisit la phrase de constat la plus proche de ce que le visiteur a dit. */
function pickSituation(answers: Answers, primarySlug: string): SituationKey {
  const { type, goal, produits } = answers;

  if (type === 'refonte') return 'redesign';

  if (primarySlug === 'boutique-en-ligne') {
    if (produits === 'many') return 'ecommerceMany';
    if (produits === 'few') return 'ecommerceFew';
    return 'ecommerceIntent';
  }

  if (primarySlug === 'plateforme-sur-mesure') {
    return goal === 'automatisation' ? 'automation' : 'appIdea';
  }

  if (goal === 'trafic') return 'traffic';
  if (produits === 'none') return 'presenceServices';
  return 'presence';
}

export function getRecommendation(answers: Answers): Recommendation {
  const primarySlug = pickPrimarySlug(answers);
  const service = getService(primarySlug) ?? services[0];
  const isRedesign = answers.type === 'refonte';

  // La publicité ne remplace jamais la reco principale : elle la complète.
  const secondary =
    answers.goal === 'trafic' && primarySlug !== 'campagne-publicitaire'
      ? getService('campagne-publicitaire')
      : undefined;

  return {
    service,
    secondary,
    isRedesign,
    situationKey: pickSituation(answers, primarySlug),
    conclusionKey: isRedesign
      ? 'redesign'
      : (primarySlug as ConclusionKey),
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
  type: 'p',
  goal: 'o',
  produits: 'v',
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
