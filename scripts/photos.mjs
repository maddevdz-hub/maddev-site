/**
 * Prépare les photographies de la démonstration « Café Zitouna ».
 *
 *     npm run photos
 *
 * ── Pourquoi un script ──────────────────────────────────────────────────
 * Les fichiers fournis pèsent de 800 ko à 3 Mo et mesurent jusqu'à 5 310 px
 * de large. Aucun écran n'en affichera jamais le quart. Les livrer tels
 * quels, c'est quatorze mégaoctets dans le dépôt et une page qui met dix
 * secondes à s'ouvrir sur la 4G d'une terrasse — exactement ce qu'une démo
 * censée vendre la rapidité ne peut pas se permettre.
 *
 * `next/image` produit ensuite les tailles intermédiaires et l'AVIF. Ce
 * script ne fait que ce que Next ne peut pas faire : choisir le CADRAGE, et
 * ramener la source à une taille raisonnable.
 *
 * ── Où vivent les fichiers ──────────────────────────────────────────────
 *     photos-sources/menu/     les originaux, tels que fournis. Versionnés :
 *                              on doit pouvoir refaire un recadrage dans
 *                              deux ans sans redemander les photos.
 *     public/demo/menu/        ce qui est servi. Entièrement reconstruit
 *                              par ce script — ne rien y déposer à la main.
 *
 * Pour ajouter une photo : la déposer dans photos-sources/menu/ sous le nom
 * du plat (`msemen.jpg`), l'ajouter à PLATS ci-dessous, relancer le script,
 * puis renseigner `image` sur le plat dans content/demos/menu.ts.
 *
 * ── Ce qui est écrit en plus ────────────────────────────────────────────
 * `content/demos/menu-photos.ts` : dimensions réelles et vignette floue de
 * chaque image. Les composants les lisent de là plutôt que de porter des
 * nombres en dur — une image recadrée ne doit jamais obliger à corriger un
 * chiffre à la main dans un JSX, c'est ainsi qu'on décale une mise en page
 * sans s'en apercevoir.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'photos-sources/menu');
const OUT = resolve(ROOT, 'public/demo/menu');

/**
 * Les deux photographies d'ambiance, recadrées à la main.
 *
 * `bande` prend une fraction verticale de l'original : c'est le seul moyen
 * de garder le sujet quand on passe d'un portrait à un bandeau très large.
 */
const AMBIANCE = [
  {
    src: 'background.jpg',
    out: 'entete.webp',
    /*
     * L'en-tête. On garde la bande centrale — le comptoir et l'ardoise — et
     * l'on jette le toit en tôle et le sol, qui ne disent rien. Servie
     * derrière un voile crème dense, elle vaut comme texture, pas comme
     * décor : le nom du café doit rester le sujet.
     *
     * Bande large et courte, 3,4:1. Le bandeau affiché fait 2,6:1 sur
     * téléphone et 5,6:1 sur grand écran : aucune source ne convient aux
     * deux, et « object-cover » recadre la différence. Découpée en 2,4:1
     * comme au premier jet, la source transportait 30 % de pixels que le
     * recadrage jetait aussitôt.
     */
    bande: { depuis: 0.24, hauteur: 0.44 },
    largeur: 2400,
    /*
     * Qualité basse, et assumée : cette image est servie sous un voile crème
     * de 78 à 98 % d'opacité. Ce qu'on économise ici ne se voit nulle part —
     * et sur la 4G d'une terrasse, chaque dizaine de kilo-octets se voit.
     */
    qualite: 66,
  },
  {
    src: 'coffe.jpg',
    out: 'bandeau-cafes.webp',
    /*
     * Le bandeau de la catégorie « Cafés et thés ». L'original est un
     * portrait : on prend la bande du haut, celle du porte-filtre. Elle
     * exclut au passage la brique de lait du bas, dont l'étiquette est en
     * cyrillique — un détail que personne ne remarque jusqu'au jour où
     * quelqu'un le remarque.
     */
    bande: { depuis: 0.1, hauteur: 0.3 },
    largeur: 1800,
    // Celle-ci s'affiche à nu : elle garde une qualité pleine.
    qualite: 78,
  },
];

/**
 * Les photographies de plats — vignette carrée de 800 px, qui sert la liste
 * (72 px) et le panneau (132 px) en densité 2 comme en densité 3.
 *
 * ── VIDE, et volontairement ─────────────────────────────────────────────
 * Six fichiers ont été fournis en septembre 2026. Trois sont inutilisables :
 *
 *   qahwa-halib   filigrane « iStock — Credit: Farknot » en clair sur
 *                 l'image. Une photo sous filigrane sur une page destinée à
 *                 des clients, c'est un problème de licence avant d'être un
 *                 problème de finition.
 *   jus-orange    un gobelet de bubble tea portant la marque « ARABICA
 *                 COFFEE + HOUSE ». Ni le bon produit, ni la bonne enseigne :
 *                 on afficherait la marque d'un autre sur la carte du café.
 *   msemen        des pide farcies à l'œuf, sur des sous-plats marqués « CB
 *                 Coffee Board ». Ce n'est pas un msemen.
 *
 * Les trois restantes (qahwa-arbia, atay-nanaa, baklawa) sont bonnes, mais
 * elles ne couvrent aucune catégorie entière. Trois vignettes photo au
 * milieu de dix-neuf dessins ne se lisent pas comme un choix : elles se
 * lisent comme un import inachevé. La règle est donc : **une catégorie
 * passe en photo d'un bloc, ou reste dessinée d'un bloc.**
 *
 * Pour en activer une : compléter la catégorie, ajouter les fichiers ici,
 * relancer `npm run photos`, puis renseigner `image` sur chaque plat de la
 * catégorie dans content/demos/menu.ts.
 */
const PLATS = [];

/** Vignette de 16 px, en base64 : l'aplat flou affiché pendant le chargement. */
async function vignette(image) {
  const buf = await image
    .clone()
    .resize(16, 16, { fit: 'inside' })
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

mkdirSync(OUT, { recursive: true });
// Le dossier servi est ENTIÈREMENT reconstruit : sinon une image renommée
// laisse derrière elle un fichier orphelin que plus rien ne référence.
for (const f of readdirSync(OUT)) rmSync(resolve(OUT, f), { force: true });

const registre = {};

for (const photo of AMBIANCE) {
  const source = sharp(resolve(SRC, photo.src));
  const meta = await source.metadata();
  const top = Math.round(meta.height * photo.bande.depuis);
  const height = Math.round(meta.height * photo.bande.hauteur);

  const image = source
    .clone()
    .extract({ left: 0, top, width: meta.width, height })
    .resize({ width: photo.largeur });

  const sortie = await image.clone().webp({ quality: photo.qualite }).toFile(resolve(OUT, photo.out));
  registre[photo.out] = {
    src: `/demo/menu/${photo.out}`,
    width: sortie.width,
    height: sortie.height,
    blur: await vignette(image),
  };
  console.log(
    `  ${photo.out.padEnd(22)} ${sortie.width}×${sortie.height}  ${Math.round(sortie.size / 1024)} ko`,
  );
}

for (const src of PLATS) {
  const out = src.replace(/\.[a-z]+$/, '.webp');
  const image = sharp(resolve(SRC, src)).resize(800, 800, {
    fit: 'cover',
    position: 'attention', // sharp vise la zone la plus contrastée : le plat.
  });
  const sortie = await image.clone().webp({ quality: 80 }).toFile(resolve(OUT, out));
  registre[out] = {
    src: `/demo/menu/${out}`,
    width: sortie.width,
    height: sortie.height,
    blur: await vignette(image),
  };
  console.log(`  ${out.padEnd(22)} ${sortie.width}×${sortie.height}  ${Math.round(sortie.size / 1024)} ko`);
}

const fichier = `/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Produit par \`npm run photos\` (scripts/photos.mjs).
 *
 * Dimensions réelles et vignette floue de chaque photographie de la
 * démonstration. Les composants les lisent ici : une image recadrée ne doit
 * jamais obliger à corriger un nombre dans un JSX.
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  /** Aplat flou de 16 px, affiché le temps que la photo arrive. */
  blur: string;
};

export const photos = ${JSON.stringify(registre, null, 2)} satisfies Record<string, Photo>;
`;

writeFileSync(resolve(ROOT, 'content/demos/menu-photos.ts'), fichier);
console.log('\ncontent/demos/menu-photos.ts réécrit.');
