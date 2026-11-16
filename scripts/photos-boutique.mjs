/**
 * Prépare les photographies de la démonstration « Nadâ — parfums & soins ».
 *
 *     npm run photos:boutique
 *
 * Même principe que scripts/photos.mjs (Café Zitouna), dont il reprend la
 * logique : ce script choisit le CADRAGE et ramène chaque source à une
 * taille raisonnable ; `next/image` produit ensuite les tailles
 * intermédiaires et l'AVIF.
 *
 * ── Où vivent les fichiers ──────────────────────────────────────────────
 *     photos-sources/boutique/   les originaux retenus, versionnés, avec
 *                                CREDITS.md (source, photographe, licence).
 *                                Les candidates examinées et les refusées
 *                                restent hors du dépôt (.gitignore).
 *     public/demo/boutique/      ce qui est servi. Entièrement reconstruit
 *                                par ce script — ne rien y déposer à la main.
 *     content/demos/boutique-photos.ts
 *                                dimensions réelles et vignette floue de
 *                                chaque image, lues par les composants.
 *
 * ── Une seule proportion pour tous les produits ─────────────────────────
 * Les photos viennent de séries différentes : fond rose, sable, gris, marbre,
 * blanc. Posées telles quelles côte à côte, elles se liraient comme un
 * catalogue de banque d'images. Toutes les vues produit sont donc recadrées
 * en 4:5 et la vitrine les pose dans des cadres de même proportion, sur le
 * crème de la marque : c'est le cadre qui fait l'unité, pas les photos.
 *
 * ── Photo manquante ─────────────────────────────────────────────────────
 * Un produit sans photo valable n'en reçoit pas d'inventée : la vitrine
 * affiche un aplat ambre portant le nom du produit. Il suffit de ne pas le
 * lister ici.
 *
 * ── Règle de tri (rappel, voir CREDITS.md) ──────────────────────────────
 * Aucune photo portant une marque, un logo, un texte lisible ou un
 * filigrane — même recadrée : un flacon reconnaissable reste une marque.
 */
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'photos-sources/boutique');
const OUT = resolve(ROOT, 'public/demo/boutique');

/**
 * Vues produit : 4:5, 1200 × 1500. Sert la carte du catalogue (≈ 280 px) et
 * la galerie de la fiche (≈ 600 px) en densité 2.
 *
 * `position` : où garder le sujet quand on recadre. « attention » laisse
 * sharp viser la zone la plus contrastée — le flacon ; une direction
 * explicite sert quand le sujet n'est pas le plus contrasté de l'image.
 *
 * `centreX` : centre horizontal du cadrage, en fraction de la largeur, quand
 * ni l'un ni l'autre ne suffit. Le musc blanc en a besoin : « attention »
 * visait le bouchon posé à côté, plus contrasté que le flacon dépoli, et
 * coupait le flacon en deux.
 */
const PRODUITS = [
  { src: 'huile-d-oud.jpg', position: 'attention' },
  { src: 'rose-de-blida.jpg', position: 'attention' },
  { src: 'rose-de-blida-2.jpg', position: 'attention' },
  { src: 'rose-de-blida-3.jpg', position: 'attention' },
  { src: 'ambre-du-sahara.jpg', position: 'attention' },
  { src: 'ambre-du-sahara-2.jpg', position: 'attention' },
  { src: 'musc-blanc.jpg', centreX: 0.36 },
  // Tons gris, hors palette : dernière vue de la galerie seulement.
  { src: 'musc-blanc-2.jpg', position: 'attention' },
  { src: 'neroli-de-tipaza.jpg', position: 'attention' },
  { src: 'coffret.jpg', position: 'centre' },
  { src: 'coffret-2.jpg', position: 'centre' },
  { src: 'creme-mains.jpg', position: 'centre' },
  { src: 'brume-cheveux.jpg', position: 'attention' },
];

/**
 * Photographies d'ambiance, recadrées à la main.
 *
 * Le hero existe en deux coupes : un bandeau large pour l'écran d'ordinateur
 * et un portrait pour le téléphone. Une seule source recadrée par
 * `object-cover` perdait soit les flacons sur mobile, soit le haut de l'image
 * sur grand écran.
 */
const AMBIANCE = [
  {
    src: 'hero.jpg',
    out: 'hero-large.webp',
    /*
     * Carré, pas bandeau : sur grand écran, l'image se pose à côté du texte.
     * Un bandeau tiré d'une source en portrait coupait le pot du haut.
     */
    format: { largeur: 1600, hauteur: 1600 },
    qualite: 74,
  },
  {
    src: 'hero.jpg',
    out: 'hero-portrait.webp',
    format: { largeur: 1200, hauteur: 1500 },
    qualite: 74,
  },
  {
    src: 'ambiance-1.jpg',
    out: 'ambiance-1.webp',
    format: { largeur: 1600, hauteur: 1067 },
    qualite: 74,
  },
  {
    src: 'ambiance-2.jpg',
    out: 'ambiance-2.webp',
    format: { largeur: 1600, hauteur: 1067 },
    qualite: 70,
  },
];

/** Vignette de 16 px, en base64 : l'aplat flou affiché pendant le chargement. */
async function vignette(image) {
  const buf = await image
    .clone()
    .resize(16, 16, { fit: 'inside' })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

const manquantes = [...PRODUITS.map((p) => p.src), ...AMBIANCE.map((a) => a.src)].filter(
  (f) => !existsSync(resolve(SRC, f)),
);
if (manquantes.length) {
  console.error(`Source introuvable dans photos-sources/boutique/ : ${[...new Set(manquantes)].join(', ')}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
// Le dossier servi est ENTIÈREMENT reconstruit : une image renommée ne doit
// pas laisser derrière elle un fichier que plus rien ne référence.
for (const f of readdirSync(OUT)) rmSync(resolve(OUT, f), { force: true });

const registre = {};
const ligne = (nom, s) =>
  console.log(`  ${nom.padEnd(26)} ${s.width}×${s.height}  ${Math.round(s.size / 1024)} ko`);

for (const photo of AMBIANCE) {
  const source = sharp(resolve(SRC, photo.src)).rotate();
  const meta = await source.metadata();
  let image;
  if (photo.bande) {
    const top = Math.round(meta.height * photo.bande.depuis);
    const height = Math.round(meta.height * photo.bande.hauteur);
    image = source
      .clone()
      .extract({ left: 0, top, width: meta.width, height })
      .resize({ width: photo.largeur });
  } else {
    image = source.clone().resize(photo.format.largeur, photo.format.hauteur, {
      fit: 'cover',
      position: 'attention',
    });
  }
  const sortie = await image.clone().webp({ quality: photo.qualite }).toFile(resolve(OUT, photo.out));
  registre[photo.out.replace('.webp', '')] = {
    src: `/demo/boutique/${photo.out}`,
    width: sortie.width,
    height: sortie.height,
    blur: await vignette(image),
  };
  ligne(photo.out, sortie);
}

for (const produit of PRODUITS) {
  const out = produit.src.replace(/\.[a-z]+$/, '.webp');

  /*
   * Garde-fou : une source trop petite serait AGRANDIE pour remplir le 4:5,
   * donc floue. C'est arrivé avec des photos Pexels en paysage téléchargées
   * à 1 600 px de large. On s'arrête plutôt que de servir une image molle.
   */
  const meta = await sharp(resolve(SRC, produit.src)).metadata();
  const facteur = Math.max(1200 / meta.width, 1500 / meta.height);
  if (facteur > 1) {
    console.error(
      `${produit.src} : ${meta.width}×${meta.height}, il faudrait l'agrandir ×${facteur.toFixed(2)}. ` +
        'Fournir une source plus grande.',
    );
    process.exit(1);
  }

  let image;
  if (produit.centreX !== undefined) {
    // Cadrage 4:5 posé à la main autour du centre demandé.
    const largeur = Math.min(meta.width, Math.round(meta.height * 0.8));
    const hauteur = Math.round(largeur * 1.25);
    const gauche = Math.max(0, Math.min(meta.width - largeur, Math.round(meta.width * produit.centreX - largeur / 2)));
    const haut = Math.max(0, Math.round((meta.height - hauteur) / 2));
    image = sharp(resolve(SRC, produit.src))
      .rotate()
      .extract({ left: gauche, top: haut, width: largeur, height: Math.min(hauteur, meta.height) })
      .resize(1200, 1500, { fit: 'cover' });
  } else {
    image = sharp(resolve(SRC, produit.src))
      .rotate()
      .resize(1200, 1500, { fit: 'cover', position: produit.position });
  }
  const sortie = await image.clone().webp({ quality: 80 }).toFile(resolve(OUT, out));
  registre[out.replace('.webp', '')] = {
    src: `/demo/boutique/${out}`,
    width: sortie.width,
    height: sortie.height,
    blur: await vignette(image),
  };
  ligne(out, sortie);
}

const fichier = `/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Produit par \`npm run photos:boutique\` (scripts/photos-boutique.mjs).
 *
 * Dimensions réelles et vignette floue de chaque photographie de la
 * démonstration Nadâ. Sources, photographes et licences :
 * photos-sources/boutique/CREDITS.md.
 */

export type PhotoBoutique = {
  src: string;
  width: number;
  height: number;
  /** Aplat flou de 16 px, affiché le temps que la photo arrive. */
  blur: string;
};

export const photosBoutique = ${JSON.stringify(registre, null, 2)} satisfies Record<string, PhotoBoutique>;

export type NomPhotoBoutique = keyof typeof photosBoutique;
`;

writeFileSync(resolve(ROOT, 'content/demos/boutique-photos.ts'), fichier);
console.log('\ncontent/demos/boutique-photos.ts réécrit.');
