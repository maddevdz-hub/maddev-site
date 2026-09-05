/**
 * Capture les démonstrations pour la page /services.
 *
 * Pourquoi un script et non des captures faites à la main : la page /services
 * montre les démos telles qu'elles sont RÉELLEMENT. Dès qu'une démo change,
 * il faut refaire son image, et une capture manuelle finit toujours par
 * dater — on se retrouve à vendre un écran qui n'existe plus.
 *
 *     npm run dev            # dans un terminal
 *     node scripts/captures.mjs
 *
 * Le script pilote le Chrome déjà installé sur la machine (puppeteer-core, pas
 * puppeteer : aucun Chromium de 180 Mo à télécharger). Si Chrome est ailleurs,
 * passer son chemin dans CHROME_PATH.
 *
 * Chaque capture est prise en densité 2 pour rester nette sur un écran
 * Retina ; Next se charge ensuite de produire l'AVIF ou le WebP aux tailles
 * utiles — on livre donc un PNG source, pas une image optimisée à la main.
 */
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/services');
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);

/**
 * Ce qu'on capture, et dans quel cadre.
 *
 * `phone` : la démo se vit sur un téléphone (une carte de café se lit à
 * table). `screen` : elle se vit sur un écran large (un agenda de cabinet se
 * regarde en entier).
 */
const SHOTS = [
  {
    file: 'capture-menu.png',
    url: '/demo/menu',
    viewport: { width: 414, height: 860 },
    // On saute la bande d'avertissement pour cadrer sur le nom du café et sa
    // carte : c'est ce que le prospect doit reconnaître d'un coup d'œil.
    scrollTo: 96,
  },
  {
    file: 'capture-rendezvous.png',
    url: '/demo/rendezvous',
    viewport: { width: 760, height: 468 },
    /*
     * On ne capture pas la première étape, qui ne montre que deux noms : on
     * conduit la démo jusqu'à l'agenda, où l'on voit les créneaux libres, les
     * créneaux pris barrés et le vendredi fermé. C'est cet écran-là qui prouve
     * le service ; une capture de la page d'accueil n'en prouverait aucun.
     */
    async prepare(page) {
      const clickByText = (text) =>
        page.evaluate((t) => {
          const btn = [...document.querySelectorAll('#reserver button')].find(
            (b) => b.textContent.includes(t),
          );
          btn?.click();
        }, text);

      await clickByText('Amel Benhamou');
      await new Promise((r) => setTimeout(r, 300));
      await clickByText('Détartrage');
      await new Promise((r) => setTimeout(r, 400));
      await page.evaluate(() => {
        const cible = document.querySelector('#reserver');
        if (cible) window.scrollTo(0, cible.offsetTop + 52);
      });
    },
  },
  {
    file: 'capture-showroom.jpg',
    /*
     * Le seul client RÉEL du studio, capturé sur son site en ligne — pas une
     * reconstitution. C'est la seule image de la page qui prouve un travail
     * livré à quelqu'un ; elle ne porte donc aucune mention « fictif ».
     */
    url: 'https://henna-meubles-2026.vercel.app',
    absolute: true,
    viewport: { width: 1100, height: 700 },
  },
];

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error('Aucun navigateur trouvé. Renseignez CHROME_PATH.');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const shot of SHOTS) {
  const page = await browser.newPage();
  await page.setViewport({ ...shot.viewport, deviceScaleFactor: 2 });
  const target = shot.absolute ? shot.url : `${BASE}${shot.url}`;
  await page.goto(target, { waitUntil: 'networkidle0', timeout: 45000 });

  // Les polices Google arrivent après le premier rendu : sans cette attente,
  // la capture montre la police de repli et la démo paraît bâclée.
  await page.evaluateHandle('document.fonts.ready');

  if (shot.scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), shot.scrollTo);
  }
  if (shot.prepare) {
    await shot.prepare(page);
  }
  await new Promise((r) => setTimeout(r, 500));

  const file = resolve(OUT, shot.file);
  const jpeg = shot.file.endsWith('.jpg');
  await page.screenshot(
    jpeg
      ? { path: file, type: 'jpeg', quality: 82 }
      : { path: file, type: 'png' },
  );
  console.log(`  ${shot.file}  ${shot.viewport.width}×${shot.viewport.height} @2x`);
  await page.close();
}

await browser.close();
console.log('Captures écrites dans public/services/');
