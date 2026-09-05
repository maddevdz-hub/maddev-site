import type { DemoBrand } from './types';

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
  tagline: string;
  address: string;
  phoneDisplay: string;
  /** Photo de façade ou de salle d'attente, si elle arrive un jour. */
  cover?: string;
} = {
  slug: 'rendezvous',
  name: 'Cabinet dentaire Amel',
  sector: 'Cabinet dentaire — prise de rendez-vous',
  solves: 'Le patient réserve, reçoit son rappel et annule seul. Le téléphone cesse de sonner.',
  tagline: 'Soins et prévention, du samedi au jeudi',
  address: '14 rue des Frères Aouati, Kouba — Alger',
  phoneDisplay: '+213 23 00 00 00',
};

export type Practitioner = {
  id: string;
  name: string;
  role: string;
  /** Initiales affichées tant qu'aucun portrait n'est fourni. */
  initials: string;
  photo?: string;
};

export const practitioners: Practitioner[] = [
  {
    id: 'amel',
    name: 'Dre Amel Benhamou',
    role: 'Dentiste — soins et prévention',
    initials: 'AB',
  },
  {
    id: 'karim',
    name: 'Dr Karim Aït Slimane',
    role: 'Orthodontiste — adultes et enfants',
    initials: 'KA',
  },
];

export type Reason = {
  id: string;
  label: string;
  /** En minutes — affiché au patient, il situe la durée de sa venue. */
  duration: number;
  /** Restreint à un praticien, quand l'acte lui est propre. */
  only?: string;
};

export const reasons: Reason[] = [
  {
    id: 'controle',
    label: 'Consultation de contrôle',
    duration: 30,
  },
  {
    id: 'detartrage',
    label: 'Détartrage',
    duration: 45,
  },
  {
    id: 'carie',
    label: 'Soin d’une carie',
    duration: 45,
  },
  {
    id: 'urgence',
    label: 'Urgence — douleur',
    duration: 20,
  },
  {
    id: 'ortho',
    label: 'Consultation orthodontie',
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
export const weekdays: Record<number, string> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
};

export const months: Record<number, string> = {
  0: 'janvier',
  1: 'février',
  2: 'mars',
  3: 'avril',
  4: 'mai',
  5: 'juin',
  6: 'juillet',
  7: 'août',
  8: 'septembre',
  9: 'octobre',
  10: 'novembre',
  11: 'décembre',
};

/** Tous les textes d'interface de la démonstration. */
export const rdvUi = {
  heroKicker: 'Prendre rendez-vous',
  heroTitle: 'Votre rendez-vous en quatre gestes',
  heroText: 'Choisissez votre praticien, le motif et l’heure. Vous recevez la confirmation immédiatement, et un rappel la veille.',
  heroCta: 'Choisir un créneau',
  heroCall: 'Appeler le cabinet',

  step: 'Étape',
  stepPractitioner: 'Le praticien',
  stepReason: 'Le motif',
  stepSlot: 'Le créneau',
  stepDetails: 'Vos coordonnées',

  minutes: 'min',
  taken: 'Pris',
  closed: 'Fermé',
  noSlot: 'Aucun créneau libre ce jour-là. Essayez le lendemain.',
  today: 'Aujourd’hui',
  tomorrow: 'Demain',

  fieldName: 'Nom et prénom',
  fieldPhone: 'Téléphone',
  fieldPhoneHint: 'C’est sur ce numéro qu’arrive le rappel.',
  fieldFirst: 'Première visite au cabinet',
  required: 'Ce champ est obligatoire',
  invalidPhone: 'Numéro algérien attendu — 10 chiffres, commençant par 0.',
  confirm: 'Confirmer le rendez-vous',
  back: 'Retour',
  change: 'Modifier',

  doneTitle: 'Rendez-vous confirmé',
  doneWith: 'avec',
  reminderTitle: 'Rappel WhatsApp la veille, à 18 h',
  reminderText: 'C’est ce message qui fait la différence entre un patient qui vient et un créneau perdu. S’il répond « annuler », la place se libère aussitôt pour quelqu’un d’autre.',
  cancel: 'Annuler ce rendez-vous',
  cancelled: 'Rendez-vous annulé. Le créneau est de nouveau libre — sans un seul appel.',
  restart: 'Prendre un autre rendez-vous',
  demoNote: 'Démonstration : aucun message n’est réellement envoyé.',

  whyTitle: 'Ce qui change pour le cabinet',
  why: [
    {
      title: 'Le téléphone se libère',
      text: 'Les rendez-vous se prennent en dehors des heures d’ouverture, pendant les soins, la nuit, le vendredi.',
    },
    {
      title: 'Moins de rendez-vous manqués',
      text: 'Le rappel de la veille arrive là où le patient regarde vraiment : WhatsApp.',
    },
    {
      title: 'Le créneau annulé se remplit',
      text: 'Une annulation libère la place immédiatement, au lieu de laisser un trou dans la journée.',
    },
  ],

  hoursTitle: 'Horaires',
  hoursWeek: 'Samedi au jeudi',
  hoursSat: 'Samedi',
  hoursClosed: 'Vendredi fermé',
} as const;
