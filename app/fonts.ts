import { Space_Grotesk, Outfit, Cairo, Tajawal } from 'next/font/google';

/**
 * Les quatre familles de la charte, exposées en variables CSS.
 * globals.css choisit ensuite la paire display/body selon html[lang].
 * `display: 'swap'` évite le texte invisible pendant le chargement.
 *
 * Note mesurée : les variables des quatre familles étant montées sur
 * <html>, Next les considère toutes comme utilisées et précharge les six
 * fichiers — une page arabe récupère donc aussi Space Grotesk et Outfit
 * (~63 ko) qu'elle n'affichera jamais. Désactiver ce préchargement a été
 * testé au banc Lighthouse : aucun gain (89 contre 90 sur l'accueil arabe,
 * soit l'amplitude du bruit de mesure), les polices étant simplement
 * découvertes plus tard. Le réglage par défaut est donc conservé.
 *
 * Le vrai levier serait de ne monter que la paire de la langue courante,
 * ce qui suppose de scinder ce module — non fait, faute de gain démontré.
 */

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

/** Toutes les variables sont montées sur <html> : la bascule ne recharge rien. */
export const fontVariables = [
  spaceGrotesk.variable,
  outfit.variable,
  cairo.variable,
  tajawal.variable,
].join(' ');
