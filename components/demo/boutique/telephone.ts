/**
 * Le numéro de téléphone algérien, tolérant à la saisie.
 *
 * Le faux numéro est la première cause de colis perdu en paiement à la
 * livraison. On l'attrape avant l'envoi, avec un message en français simple,
 * et on propose la correction quand elle est évidente.
 *
 * Accepté : un mobile de 10 chiffres commençant par 05, 06 ou 07, saisi avec
 * ou sans espaces, points ou tirets, et avec +213, 00213 ou 213 devant.
 */
export type AnalyseTelephone =
  | { ok: true; normalise: string; affiche: string }
  | { ok: false; erreur: string; suggestion?: string };

export function formaterTelephone(dix: string): string {
  return `${dix.slice(0, 4)} ${dix.slice(4, 6)} ${dix.slice(6, 8)} ${dix.slice(8, 10)}`;
}

export function analyserTelephone(saisie: string): AnalyseTelephone {
  let chiffres = saisie.replace(/[^\d+]/g, '');
  if (chiffres.startsWith('+213')) chiffres = '0' + chiffres.slice(4);
  else if (chiffres.startsWith('00213')) chiffres = '0' + chiffres.slice(5);
  else if (chiffres.startsWith('213') && chiffres.length >= 12) chiffres = '0' + chiffres.slice(3);
  chiffres = chiffres.replace(/\D/g, '');

  if (!chiffres) return { ok: false, erreur: 'Indiquez votre numéro : on vous appelle pour confirmer.' };

  if (/^0[567]\d{8}$/.test(chiffres)) {
    return { ok: true, normalise: chiffres, affiche: formaterTelephone(chiffres) };
  }

  // Le 0 du début oublié : 555 12 34 56 → 0555 12 34 56.
  if (/^[567]\d{8}$/.test(chiffres)) {
    const s = '0' + chiffres;
    return { ok: false, erreur: 'Il manque le 0 du début.', suggestion: formaterTelephone(s) };
  }

  if (/^0[567]\d{7}$/.test(chiffres)) {
    return { ok: false, erreur: 'Il manque un chiffre : un numéro mobile en compte 10.' };
  }
  if (/^0[567]\d{9,}$/.test(chiffres)) {
    return { ok: false, erreur: 'Il y a un chiffre de trop : un numéro mobile en compte 10.' };
  }
  if (/^0[234]\d{7}$/.test(chiffres)) {
    return { ok: false, erreur: 'C’est un numéro fixe : indiquez un mobile (05, 06 ou 07), le livreur vous appellera dessus.' };
  }
  return { ok: false, erreur: 'Ce numéro ne ressemble pas à un mobile algérien (05, 06 ou 07, puis 8 chiffres).' };
}
