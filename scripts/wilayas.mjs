/**
 * Wilayas et communes de la démonstration boutique.
 *
 *     npm run wilayas
 *
 * ── Source ──────────────────────────────────────────────────────────────
 * Jeu de données « Algeria Wilayas & Communes 2026 », ihahachi/algeria-cities
 * (https://github.com/ihahachi/algeria-cities), licence MIT selon son README.
 * Fichier : json/algeria_cities.json, copié tel quel dans
 * data-sources/wilayas/ — on ne le modifie jamais à la main.
 * 69 wilayas, 1 541 communes : le découpage de 2026 (onze wilayas nouvelles,
 * numérotées de 59 à 69).
 *
 * ── Vérification ────────────────────────────────────────────────────────
 * Contrôlé le 16 novembre 2026 :
 *   - 69 wilayas, codes 1 à 69, aucune commune en double ;
 *   - numéros et noms des wilayas 59 à 69 conformes à la liste publiée
 *     (Aflou 59, Barika 60, El Kantara 61, Bir El Ater 62, El Aricha 63,
 *     Ksar Chellala 64, Aïn Oussera 65, Messaad 66, Ksar El Boukhari 67,
 *     Boussaâda 68, El Abiodh Sidi Cheikh 69).
 *
 * ── Une correction, et une seule ────────────────────────────────────────
 * Onze communes portent le nom de wilaya « Touggourt » mais le code 30, qui
 * est celui d'Ouargla. Le nom fait foi : elles passent au code 55, et
 * Touggourt retrouve ses 13 communes. Toute AUTRE incohérence entre code et
 * nom arrête le script : on ne corrige pas en silence ce qu'on n'a pas
 * examiné.
 *
 * ── Sorties ─────────────────────────────────────────────────────────────
 *   content/demos/wilayas.ts                 les 69 wilayas (code, nom)
 *   public/demo/boutique-communes/NN.json    les communes d'une wilaya,
 *                                            chargées à la demande : la fiche
 *                                            produit n'embarque pas 1 541 noms.
 * Le dossier des communes est hors de public/demo/boutique/, que le script
 * des photos vide entièrement.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(ROOT, 'data-sources/wilayas/algeria_cities.json');
const OUT_COMMUNES = resolve(ROOT, 'public/demo/boutique-communes');

const CORRECTIONS = { Touggourt: { de: 30, vers: 55 } };

const brut = JSON.parse(readFileSync(SOURCE, 'utf8'));

const communes = brut.map((c) => {
  const corr = CORRECTIONS[c.wilaya_name_fr];
  const code = corr && c.wilaya_code === corr.de ? corr.vers : c.wilaya_code;
  return { code, wilaya: c.wilaya_name_fr, commune: c.commune_name_fr, daira: c.daira_name_fr };
});

// Contrôles : un code = un nom, un nom = un code, 69 wilayas, pas de doublon.
const nomParCode = new Map();
for (const c of communes) {
  if (!nomParCode.has(c.code)) nomParCode.set(c.code, new Set());
  nomParCode.get(c.code).add(c.wilaya);
}
const erreurs = [];
for (const [code, noms] of nomParCode) if (noms.size > 1) erreurs.push(`code ${code} : ${[...noms].join(' / ')}`);
if (nomParCode.size !== 69) erreurs.push(`${nomParCode.size} wilayas au lieu de 69`);
const cles = new Set();
for (const c of communes) {
  const k = `${c.code}|${c.commune}`;
  if (cles.has(k)) erreurs.push(`doublon : ${k}`);
  cles.add(k);
}
if (erreurs.length) {
  console.error('Jeu de données incohérent, rien n’est écrit :\n  ' + erreurs.join('\n  '));
  process.exit(1);
}

const wilayas = [...nomParCode.entries()]
  .map(([code, noms]) => ({ code, nom: [...noms][0] }))
  .sort((a, b) => a.code - b.code);

writeFileSync(
  resolve(ROOT, 'content/demos/wilayas.ts'),
  `/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main. Produit par \`npm run wilayas\`.
 *
 * Les 69 wilayas d'Algérie (découpage 2026). Source : ihahachi/algeria-cities,
 * licence MIT — détails, vérification et correction dans scripts/wilayas.mjs.
 * Les communes de chaque wilaya se chargent à la demande depuis
 * /demo/boutique-communes/NN.json.
 */

export type Wilaya = { code: number; nom: string };

export const wilayas: Wilaya[] = ${JSON.stringify(wilayas, null, 2)};
`,
);

mkdirSync(OUT_COMMUNES, { recursive: true });
for (const f of readdirSync(OUT_COMMUNES)) rmSync(resolve(OUT_COMMUNES, f), { force: true });
for (const w of wilayas) {
  const liste = communes
    .filter((c) => c.code === w.code)
    .map((c) => ({ nom: c.commune, daira: c.daira }))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  writeFileSync(resolve(OUT_COMMUNES, `${String(w.code).padStart(2, '0')}.json`), JSON.stringify(liste));
}

const touggourt = communes.filter((c) => c.code === 55).length;
console.log(`${wilayas.length} wilayas, ${communes.length} communes. Touggourt : ${touggourt} communes après correction.`);
