/** Espace fine insécable, avant « h » et entre heures et minutes. */
export const FINE = String.fromCharCode(0x202f);
/** Espace insécable. */
export const NBSP = String.fromCharCode(0x00a0);

/** 8 h, 8 h 30 — à partir de minutes depuis minuit. */
export function formatHeure(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}${FINE}h` : `${h}${FINE}h${FINE}${String(m).padStart(2, "0")}`;
}

/** 20 min, 1 h, 1 h 30. */
export function formatDuree(minutes: number): string {
  if (minutes < 60) return `${minutes}${NBSP}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}${FINE}h` : `${h}${FINE}h${FINE}${String(m).padStart(2, "0")}`;
}

/** 2,5 — nombre au format français. */
export function formatNombre(n: number, decimales = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n);
}

const NOMS_JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** « samedi au jeudi » à partir de la liste ordonnée des jours ouverts. */
export function formatPlageJours(jours: readonly number[]): string {
  if (jours.length === 0) return "";
  return `${NOMS_JOURS[jours[0]]} au ${NOMS_JOURS[jours[jours.length - 1]]}`;
}

export function nomJour(jourSemaine: number): string {
  return NOMS_JOURS[jourSemaine] ?? "";
}

/**
 * Typographie française à l'affichage : espace insécable avant « : » et
 * dans les guillemets, espace fine insécable avant ; ! ?
 * Le contenu reste écrit avec des espaces ordinaires.
 */
export function typo(texte: string): string {
  return texte
    .replace(/ ([:»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ ([;!?])/g, `${FINE}$1`);
}
