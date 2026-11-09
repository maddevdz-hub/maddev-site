/**
 * Numéros de mobile algériens : 05, 06 ou 07 suivis de huit chiffres,
 * éventuellement écrits avec l’indicatif +213.
 */
export function normaliserTelephone(saisie: string): string | null {
  const brut = saisie.replace(/[\s.\-()]/g, "");
  const international = brut.match(/^(?:\+|00)213([567]\d{8})$/);
  if (international) return `0${international[1]}`;
  const national = brut.match(/^0[567]\d{8}$/);
  return national ? brut : null;
}

/** 0555 12 34 56 */
export function formaterTelephone(numero: string): string {
  return `${numero.slice(0, 4)} ${numero.slice(4, 6)} ${numero.slice(6, 8)} ${numero.slice(8, 10)}`;
}

/** 0555 •• •• 56 — ce que montre l’espace cabinet dans la démonstration. */
export function masquerTelephone(numero: string): string {
  return `${numero.slice(0, 4)} •• •• ${numero.slice(8, 10)}`;
}
