import type { Bilingual, DemoBrand } from './types';

/**
 * Démonstration « Cabinet dentaire Amel » — prise de rendez-vous.
 *
 * Cabinet FICTIF. La bande d'avertissement en haut de la démo est la
 * condition qui rend cette page acceptable ; ne jamais la retirer.
 *
 * Ce que la démonstration doit prouver — et ce n'est PAS la réservation :
 * le rappel WhatsApp la veille et l'annulation autonome. Un cabinet perd de
 * l'argent sur les rendez-vous manqués et sur le temps passé au téléphone,
 * pas sur la prise de rendez-vous elle-même. Toute la page est construite
 * autour de ces deux moments.
 *
 * Les créneaux occupés ne sont pas tirés au hasard : ils viennent d'une
 * fonction déterministe (voir `slotTaken`). Un tirage aléatoire donnerait un
 * planning différent à chaque rendu, donc un désaccord entre le serveur et le
 * navigateur, et surtout une démonstration qu'on ne peut pas montrer deux
 * fois de la même façon à un client.
 */

export const cabinet: DemoBrand & {
  tagline: Bilingual;
  address: Bilingual;
  phoneDisplay: string;
  /** Photo de façade ou de salle d'attente, si elle arrive un jour. */
  cover?: string;
} = {
  slug: 'rendezvous',
  name: { fr: 'Cabinet dentaire Amel', ar: 'عيادة أمل لطب الأسنان' },
  sector: {
    fr: 'Cabinet dentaire — prise de rendez-vous',
    ar: 'عيادة أسنان — حجز المواعيد',
  },
  solves: {
    fr: 'Le patient réserve, reçoit son rappel et annule seul. Le téléphone cesse de sonner.',
    ar: 'يحجز المريض، ويصله التذكير، ويلغي بنفسه. يتوقّف الهاتف عن الرنين.',
  },
  tagline: {
    fr: 'Soins et prévention, du samedi au jeudi',
    ar: 'علاج ووقاية، من السبت إلى الخميس',
  },
  address: { fr: '14 rue des Frères Aouati, Kouba — Alger', ar: '14 شارع الإخوة عواتي، القبة — الجزائر' },
  phoneDisplay: '+213 23 00 00 00',
};

export type Practitioner = {
  id: string;
  name: Bilingual;
  role: Bilingual;
  /** Initiales affichées tant qu'aucun portrait n'est fourni. */
  initials: string;
  photo?: string;
};

export const practitioners: Practitioner[] = [
  {
    id: 'amel',
    name: { fr: 'Dre Amel Benhamou', ar: 'د. أمل بن حمو' },
    role: { fr: 'Dentiste — soins et prévention', ar: 'طبيبة أسنان — علاج ووقاية' },
    initials: 'AB',
  },
  {
    id: 'karim',
    name: { fr: 'Dr Karim Aït Slimane', ar: 'د. كريم آيت سليمان' },
    role: { fr: 'Orthodontiste — adultes et enfants', ar: 'أخصائي تقويم — للكبار والصغار' },
    initials: 'KA',
  },
];

export type Reason = {
  id: string;
  label: Bilingual;
  /** En minutes — affiché au patient, il situe la durée de sa venue. */
  duration: number;
  /** Restreint à un praticien, quand l'acte lui est propre. */
  only?: string;
};

export const reasons: Reason[] = [
  {
    id: 'controle',
    label: { fr: 'Consultation de contrôle', ar: 'استشارة ومراقبة' },
    duration: 30,
  },
  {
    id: 'detartrage',
    label: { fr: 'Détartrage', ar: 'إزالة الجير' },
    duration: 45,
  },
  {
    id: 'carie',
    label: { fr: 'Soin d’une carie', ar: 'علاج تسوّس' },
    duration: 45,
  },
  {
    id: 'urgence',
    label: { fr: 'Urgence — douleur', ar: 'حالة مستعجلة — ألم' },
    duration: 20,
  },
  {
    id: 'ortho',
    label: { fr: 'Consultation orthodontie', ar: 'استشارة تقويم الأسنان' },
    duration: 30,
    only: 'karim',
  },
];

/**
 * Horaires d'ouverture, par jour de la semaine (0 = dimanche).
 * Vendredi fermé ; samedi en demi-journée.
 */
export const opening: Record<number, { from: number; to: number } | null> = {
  0: { from: 9, to: 17 }, // dimanche
  1: { from: 9, to: 17 },
  2: { from: 9, to: 17 },
  3: { from: 9, to: 17 },
  4: { from: 9, to: 17 }, // jeudi
  5: null, // vendredi
  6: { from: 9, to: 13 }, // samedi
};

/** Pas des créneaux, en minutes. */
export const SLOT_MINUTES = 30;

/**
 * Un créneau est-il déjà pris ?
 *
 * Déterministe à partir de la date et de l'heure : le même planning
 * s'affiche à chaque visite, sur le serveur comme dans le navigateur. Le
 * calcul n'a aucune prétention à la réalité — il produit simplement un
 * planning vraisemblable, plus chargé en fin de journée qu'au milieu.
 */
export function slotTaken(isoDate: string, minutes: number, practitionerId: string): boolean {
  const key = `${isoDate}|${minutes}|${practitionerId}`;
  let seed = 7;
  for (let i = 0; i < key.length; i += 1) {
    seed = (seed * 31 + key.charCodeAt(i)) % 9973;
  }
  // Les fins de journée se remplissent en premier : c'est ce que voit un
  // patient qui appelle, et c'est ce qui rend la démonstration crédible.
  const lateBias = minutes >= 15 * 60 ? 18 : 0;
  return seed % 100 < 34 + lateBias;
}

/** Noms des jours, écrits à la main : `Intl` en arabe donnerait des chiffres arabo-indiens. */
export const weekdays: Record<number, Bilingual> = {
  0: { fr: 'Dimanche', ar: 'الأحد' },
  1: { fr: 'Lundi', ar: 'الإثنين' },
  2: { fr: 'Mardi', ar: 'الثلاثاء' },
  3: { fr: 'Mercredi', ar: 'الأربعاء' },
  4: { fr: 'Jeudi', ar: 'الخميس' },
  5: { fr: 'Vendredi', ar: 'الجمعة' },
  6: { fr: 'Samedi', ar: 'السبت' },
};

export const months: Record<number, Bilingual> = {
  0: { fr: 'janvier', ar: 'جانفي' },
  1: { fr: 'février', ar: 'فيفري' },
  2: { fr: 'mars', ar: 'مارس' },
  3: { fr: 'avril', ar: 'أفريل' },
  4: { fr: 'mai', ar: 'ماي' },
  5: { fr: 'juin', ar: 'جوان' },
  6: { fr: 'juillet', ar: 'جويلية' },
  7: { fr: 'août', ar: 'أوت' },
  8: { fr: 'septembre', ar: 'سبتمبر' },
  9: { fr: 'octobre', ar: 'أكتوبر' },
  10: { fr: 'novembre', ar: 'نوفمبر' },
  11: { fr: 'décembre', ar: 'ديسمبر' },
};

/** Tous les textes d'interface de la démonstration. */
export const rdvUi = {
  heroKicker: {
    fr: 'Prendre rendez-vous',
    ar: 'حجز موعد',
  },
  heroTitle: {
    fr: 'Votre rendez-vous en quatre gestes',
    ar: 'موعدك في أربع خطوات',
  },
  heroText: {
    fr: 'Choisissez votre praticien, le motif et l’heure. Vous recevez la confirmation immédiatement, et un rappel la veille.',
    ar: 'اختر الطبيب وسبب الزيارة والساعة. تصلك التأكيد فورًا، وتذكير في اليوم السابق.',
  },
  heroCta: { fr: 'Choisir un créneau', ar: 'اختيار موعد' },
  heroCall: { fr: 'Appeler le cabinet', ar: 'الاتصال بالعيادة' },

  step: { fr: 'Étape', ar: 'الخطوة' },
  stepPractitioner: { fr: 'Le praticien', ar: 'الطبيب' },
  stepReason: { fr: 'Le motif', ar: 'سبب الزيارة' },
  stepSlot: { fr: 'Le créneau', ar: 'الموعد' },
  stepDetails: { fr: 'Vos coordonnées', ar: 'معلومات التواصل' },

  minutes: { fr: 'min', ar: 'دقيقة' },
  taken: { fr: 'Pris', ar: 'محجوز' },
  closed: { fr: 'Fermé', ar: 'مغلق' },
  noSlot: {
    fr: 'Aucun créneau libre ce jour-là. Essayez le lendemain.',
    ar: 'لا يوجد موعد متاح في هذا اليوم. جرّب اليوم الموالي.',
  },
  today: { fr: 'Aujourd’hui', ar: 'اليوم' },
  tomorrow: { fr: 'Demain', ar: 'غدًا' },

  fieldName: { fr: 'Nom et prénom', ar: 'الاسم واللقب' },
  fieldPhone: { fr: 'Téléphone', ar: 'رقم الهاتف' },
  fieldPhoneHint: {
    fr: 'C’est sur ce numéro qu’arrive le rappel.',
    ar: 'على هذا الرقم يصل التذكير.',
  },
  fieldFirst: { fr: 'Première visite au cabinet', ar: 'أول زيارة للعيادة' },
  required: { fr: 'Ce champ est obligatoire', ar: 'هذا الحقل مطلوب' },
  invalidPhone: {
    fr: 'Numéro algérien attendu — 10 chiffres, commençant par 0.',
    ar: 'رقم جزائري مطلوب — 10 أرقام تبدأ بـ 0.',
  },
  confirm: { fr: 'Confirmer le rendez-vous', ar: 'تأكيد الموعد' },
  back: { fr: 'Retour', ar: 'رجوع' },
  change: { fr: 'Modifier', ar: 'تعديل' },

  doneTitle: { fr: 'Rendez-vous confirmé', ar: 'تم تأكيد الموعد' },
  doneWith: { fr: 'avec', ar: 'مع' },
  reminderTitle: {
    fr: 'Rappel WhatsApp la veille, à 18 h',
    ar: 'تذكير عبر واتساب في اليوم السابق، على الساعة 18:00',
  },
  reminderText: {
    fr: 'C’est ce message qui fait la différence entre un patient qui vient et un créneau perdu. S’il répond « annuler », la place se libère aussitôt pour quelqu’un d’autre.',
    ar: 'هذه الرسالة هي الفرق بين مريض يحضر وموعد ضائع. وإذا ردّ بكلمة «إلغاء»، يتحرّر المكان فورًا لمريض آخر.',
  },
  cancel: { fr: 'Annuler ce rendez-vous', ar: 'إلغاء هذا الموعد' },
  cancelled: {
    fr: 'Rendez-vous annulé. Le créneau est de nouveau libre — sans un seul appel.',
    ar: 'أُلغي الموعد. أصبح متاحًا من جديد — دون أي مكالمة.',
  },
  restart: { fr: 'Prendre un autre rendez-vous', ar: 'حجز موعد آخر' },
  demoNote: {
    fr: 'Démonstration : aucun message n’est réellement envoyé.',
    ar: 'نموذج توضيحي: لا تُرسَل أي رسالة فعليًا.',
  },

  whyTitle: { fr: 'Ce qui change pour le cabinet', ar: 'ما الذي يتغيّر في العيادة' },
  why: [
    {
      title: { fr: 'Le téléphone se libère', ar: 'يتحرّر الهاتف' },
      text: {
        fr: 'Les rendez-vous se prennent en dehors des heures d’ouverture, pendant les soins, la nuit, le vendredi.',
        ar: 'تُحجز المواعيد خارج أوقات العمل، أثناء العلاج، ليلًا، ويوم الجمعة.',
      },
    },
    {
      title: { fr: 'Moins de rendez-vous manqués', ar: 'مواعيد فائتة أقل' },
      text: {
        fr: 'Le rappel de la veille arrive là où le patient regarde vraiment : WhatsApp.',
        ar: 'يصل تذكير اليوم السابق حيث ينظر المريض فعلًا: واتساب.',
      },
    },
    {
      title: { fr: 'Le créneau annulé se remplit', ar: 'الموعد الملغى يُملأ' },
      text: {
        fr: 'Une annulation libère la place immédiatement, au lieu de laisser un trou dans la journée.',
        ar: 'الإلغاء يحرّر المكان فورًا، بدل ترك فراغ في اليوم.',
      },
    },
  ],

  hoursTitle: { fr: 'Horaires', ar: 'أوقات العمل' },
  hoursWeek: { fr: 'Samedi au jeudi', ar: 'من السبت إلى الخميس' },
  hoursSat: { fr: 'Samedi', ar: 'السبت' },
  hoursClosed: { fr: 'Vendredi fermé', ar: 'الجمعة مغلق' },
} as const;
