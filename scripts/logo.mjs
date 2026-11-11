/**
 * Régénère tout ce qui dérive du logo, depuis UNE source :
 *
 *     public/logo/maddev-mark.svg
 *
 * Produit :
 *   components/brand/dd-paths.ts      tracés lus par DDMark, DDPattern, image OG
 *   app/icon.svg                      favicon
 *   app/apple-icon.png                180 px
 *   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
 *   public/maddev-icon-{coral,dark,light}.svg
 *   public/maddev-logo-{dark,light}.svg
 *
 * Usage : npm run logo   (aucun serveur nécessaire)
 *
 * Le script échoue franchement si la source n'a pas la forme attendue :
 * deux tracés, celui de derrière d'abord, celui de devant ensuite.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const SOURCE = 'public/logo/maddev-mark.svg';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const svg = readFileSync(SOURCE, 'utf8');
const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
const paths = [...svg.matchAll(/<path\s+fill="(#[0-9a-fA-F]{6})"\s+d="([^"]+)"/g)];
if (!viewBox || paths.length !== 2) {
  throw new Error(
    `${SOURCE} : attendu un viewBox « 0 0 L H » et exactement deux <path fill d>, trouvé ${paths.length}.`,
  );
}
const W = Number(viewBox[1]);
const H = Number(viewBox[2]);
const [[, backColor, back], [, frontColor, front]] = paths;

const ecrit = (fichier, contenu) => {
  writeFileSync(fichier, contenu, 'utf8');
  console.log('écrit', fichier);
};

// ── 1. Les tracés, pour les composants ─────────────────────────────────
ecrit(
  'components/brand/dd-paths.ts',
  `/**
 * FICHIER GÉNÉRÉ par \`npm run logo\` depuis ${SOURCE}.
 * Ne pas modifier à la main : changer la source, puis relancer le script.
 *
 * Le D de derrière porte une réserve autour du D de devant : les deux
 * lettres ne se touchent pas, y compris en version monochrome.
 */
export const DD_WIDTH = ${W};
export const DD_HEIGHT = ${H};
export const DD_VIEWBOX = '0 0 ${W} ${H}';

/** D de derrière (à droite). */
export const DD_BACK = '${back}';
export const DD_BACK_COLOR = '${backColor}';

/** D de devant (à gauche). */
export const DD_FRONT = '${front}';
export const DD_FRONT_COLOR = '${frontColor}';
`,
);

// ── 2. Les SVG autonomes ───────────────────────────────────────────────
const marque = (cBack, cFront) =>
  `<path fill="${cBack}" d="${back}"/>\n  <path fill="${cFront}" d="${front}"/>`;

const icone = (cBack, cFront) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="MADDEV">
  <title>MADDEV</title>
  ${marque(cBack, cFront)}
</svg>
`;

ecrit(
  'app/icon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${marque(backColor, frontColor)}
</svg>
`,
);
ecrit('public/maddev-icon-coral.svg', icone(backColor, frontColor));
// Monochromes : aplat plein, jamais d'opacité. La réserve autour du D de
// devant sépare les deux lettres ; une opacité donnerait un gris qui change
// selon le fond et pâlit à l'impression.
ecrit('public/maddev-icon-dark.svg', icone('#0e0f14', '#0e0f14'));
ecrit('public/maddev-icon-light.svg', icone('#f4f2ef', '#f4f2ef'));

// Lockup : symbole de 76 de haut, calé sur la ligne du mot.
const k = 76 / H;
const largeurMarque = W * k;
const xTexte = Math.round(18 + largeurMarque + 20);
const lockup = (couleurTexte, note) =>
  `<!--
  Logo complet MADDEV — ${note}
  Fichier autonome destiné aux usages hors site (documents, réseaux, presse).
  Sur le site, c'est le composant components/brand/Logo.tsx qui est utilisé :
  il rend le mot-symbole en HTML pour garantir la bonne police.
  Généré par \`npm run logo\` depuis ${SOURCE}.
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${xTexte + 314} 100" width="${xTexte + 314}" height="100" role="img" aria-label="MADDEV">
  <title>MADDEV</title>
  <g transform="translate(18 12) scale(${k.toFixed(5)})">
  ${marque(backColor, frontColor)}
  </g>
  <text x="${xTexte}" y="66" fill="${couleurTexte}" font-family="'Space Grotesk','Outfit','Segoe UI',Arial,sans-serif" font-size="48" font-weight="700" letter-spacing="-0.5">MADDEV</text>
</svg>
`;
ecrit('public/maddev-logo-dark.svg', lockup('#f4f2ef', 'version pour fonds SOMBRES (texte clair).'));
ecrit('public/maddev-logo-light.svg', lockup('#0e0f14', 'version pour fonds CLAIRS (texte sombre).'));

// ── 3. Les icônes d'application ────────────────────────────────────────
// `part` : largeur du symbole rapportée au côté. Le format maskable garde
// une marge plus large — Android rogne jusqu'à un cercle de 80 %.
const ICONES = [
  ['app/apple-icon.png', 180, 0.56],
  ['public/icons/icon-192.png', 192, 0.56],
  ['public/icons/icon-512.png', 512, 0.56],
  ['public/icons/icon-maskable-512.png', 512, 0.44],
];

const navigateur = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
try {
  for (const [fichier, cote, part] of ICONES) {
    const page = await navigateur.newPage();
    await page.setViewport({ width: cote, height: cote, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><body style="margin:0">
      <div style="width:${cote}px;height:${cote}px;display:flex;align-items:center;justify-content:center;
        background:radial-gradient(circle at 50% 42%, #40242a 0%, #1c181d 45%, #14161c 75%)">
        <svg viewBox="0 0 ${W} ${H}" style="width:${part * 100}%">${marque(backColor, frontColor)}</svg>
      </div></body></html>`);
    await page.screenshot({ path: fichier, type: 'png' });
    await page.close();
    console.log('écrit', fichier);
  }
} finally {
  await navigateur.close();
}
