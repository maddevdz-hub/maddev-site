import { Fragment, type ReactNode } from 'react';

/**
 * Isole les nombres d'un texte arabe.
 *
 * En RTL, un nombre écrit en chiffres latins reste lu de gauche à droite,
 * mais les ESPACES et les TIRETS qui le composent sont des caractères
 * « neutres » : l'algorithme bidi leur donne la direction du paragraphe. Un
 * millier écrit « 50 000 » se scinde donc en deux séquences réordonnées —
 * « 000 50 » à l'écran — et un intervalle « 9:00–18:00 » s'inverse de même.
 *
 * Deux précautions, toutes deux nécessaires :
 *   1. les séparateurs internes deviennent insécables (U+202F pour les
 *      milliers, U+2011 pour les intervalles), ce qui soude le nombre ;
 *   2. chaque nombre est enveloppé dans une île `dir="ltr"` isolée, qui le
 *      soustrait au réordonnancement du texte qui l'entoure.
 *
 * À utiliser partout où une chaîne bilingue peut contenir un nombre.
 */

/** Un nombre : chiffres, puis éventuels groupes/intervalles/décimales. */
const NUMBER = /\d+(?:[\s\u202f\u00a0]\d{3})*(?:[.,:]\d+)*(?:\s?[–—\-‑]\s?\d+(?:[\s\u202f\u00a0]\d{3})*(?:[.,:]\d+)*)*/g;

/** Sépare les milliers par une espace fine insécable, les plages par un tiret insécable. */
function tighten(value: string): string {
  return value
    .replace(/(\d)[\s\u00a0](\d{3})/g, '$1\u202f$2')
    .replace(/\s?[–—\-]\s?(?=\d)/g, '\u2011');
}

/**
 * Renvoie le texte avec chaque nombre isolé.
 * Les textes sans chiffre traversent la fonction sans allocation superflue.
 */
export function withNumerals(text: string): ReactNode {
  if (!/\d/.test(text)) return text;

  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  NUMBER.lastIndex = 0;

  while ((match = NUMBER.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span key={match.index} dir="ltr" className="numerals">
        {tighten(match[0])}
      </span>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}

/** Version composant, pour les cas où le JSX se lit mieux. */
export function Numerals({ children }: { children: string }) {
  return <>{withNumerals(children)}</>;
}
