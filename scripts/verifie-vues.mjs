/**
 * Vérification visuelle : capture des vues de /services en FR et AR,
 * desktop et mobile, pour les REGARDER.
 *
 *     npm run dev            # dans un terminal
 *     npm run vues
 *
 * Raison d'être : un build vert ne vérifie que le code. Un titre en encre
 * sombre sur fond sombre, une image qui ne charge pas, un bloc resté
 * transparent — rien de tout cela n'échoue au build. Les captures partent
 * dans un dossier temporaire, elles ne sont pas versionnées.
 *
 * Deux cadrages :
 *   - `sel`   : la capture d'un bloc précis, après défilement jusqu'à lui.
 *   - sans    : le PREMIER ÉCRAN, sans défiler — le seul moyen de vérifier
 *               qu'une chose annoncée « au-dessus du pli » y est vraiment.
 *
 * Le défilement est volontairement LENT (300 px toutes les 110 ms) : plus
 * vite, l'IntersectionObserver n'a pas le temps de révéler les blocs et l'on
 * photographie des sections vides en croyant à un bug. Une première version
 * de ce script défilait à 400 px / 60 ms et annonçait « 8 blocs cachés » —
 * un outil de vérification trop pressé invente des pannes.
 */
import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const OUT = process.env.OUT_DIR ?? 'C:/Users/monce/AppData/Local/Temp/maddev-vues';
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
mkdirSync(OUT, { recursive: true });

/**
 * Les vues à regarder. Cette liste change à chaque étape : on y met ce que
 * l'on vient de toucher, pas la page entière — six captures qu'on examine
 * valent mieux que trente qu'on survole.
 */
const vues = JSON.parse(
  process.env.VUES ??
    JSON.stringify([
      { nom: 'fr-desktop-premier-ecran', url: '/fr/services', w: 1440, h: 900 },
      { nom: 'ar-desktop-premier-ecran', url: '/ar/services', w: 1440, h: 900 },
      { nom: 'fr-mobile-premier-ecran', url: '/fr/services', w: 390, h: 844 },
      { nom: 'ar-mobile-premier-ecran', url: '/ar/services', w: 390, h: 844 },
    ]),
);

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const v of vues) {
  const page = await browser.newPage();
  await page.setViewport({ width: v.w, height: v.h, deviceScaleFactor: 2 });
  await page.goto(`${BASE}${v.url}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');

  if (v.sel) {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 110));
      }
    });
    await new Promise((r) => setTimeout(r, 2000));

    // Un bloc resté « armed » est un bloc invisible pour le visiteur.
    const caches = await page.$$eval('[data-reveal="armed"]', (n) => n.length);
    if (caches > 0) console.log(`  ! ${caches} bloc(s) restés cachés`);

    const el = await page.$(v.sel);
    if (!el) {
      console.log(`  ! ${v.nom} : ${v.sel} introuvable`);
      await page.close();
      continue;
    }
    await el.screenshot({ path: `${OUT}/${v.nom}.png` });
  } else {
    // Premier écran : surtout ne pas défiler.
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${OUT}/${v.nom}.png` });
  }

  console.log(`  ${v.nom}  ${v.w}×${v.h}`);
  await page.close();
}

await browser.close();
console.log(`Vues écrites dans ${OUT}`);
