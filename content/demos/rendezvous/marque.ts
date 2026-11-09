import type { DemoBrand } from '../types';
import { reglages } from './reglages';

/**
 * La clinique vue du registre des démonstrations.
 *
 * Le nom vient des réglages de la démo, pas d'une copie : il a déjà fallu
 * chercher un ancien nom dans des pixels et des commentaires, on ne le
 * dupliquera pas une troisième fois.
 */
export const cabinet: DemoBrand = {
  slug: 'rendezvous',
  name: reglages.cabinet.nom,
  sector: 'Clinique dentaire — prise de rendez-vous',
  solves: 'Les patients réservent seuls, le créneau tient compte de la durée du soin.',
};
