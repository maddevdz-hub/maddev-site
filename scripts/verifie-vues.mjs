/**
 * Vérification visuelle : capture des blocs de /services en FR et AR,
 * desktop et mobile, pour les REGARDER.
 *
 *     npm run dev            # dans un terminal
 *     node scripts/verifie-vues.mjs
 *
 * Raison d'être : un build vert ne vérifie que le code. Un titre en encre
 * sombre sur fond sombre, une image qui ne charge pas, un bloc resté
 * transparent — rien de tout cela n'échoue au build. Les captures partent
 * dans un dossier temporaire, elles ne sont pas versionnées.
 *
 * Le défilement est volontairement LENT (300 px toutes les 110 ms) : plus
 * vite, l'IntersectionObserver n'a pas le temps de révéler les blocs et l'on
 * photographie des sections vides en croyant à un bug.
 */
import puppeteer from 'puppeteer-core';
const OUT = process.env.OUT_DIR ?? 'C:/Users/monce/AppData/Local/Temp/maddev-vues';
import { mkdirSync } from 'node:fs';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});

const vues = [
  { nom: 'v-ar-desktop-bloc1', url: '/ar/services', w: 1440, h: 900, sel: '#menu-qr' },
  { nom: 'v-ar-desktop-bloc2', url: '/ar/services', w: 1440, h: 900, sel: '#prise-de-rendez-vous' },
  { nom: 'v-fr-mobile-bloc1', url: '/fr/services', w: 390, h: 844, sel: '#menu-qr' },
  { nom: 'v-ar-mobile-bloc3', url: '/ar/services', w: 390, h: 844, sel: '#boutique-en-ligne' },
  { nom: 'v-fr-desktop-bas', url: '/fr/services', w: 1440, h: 900, sel: '#campagne-publicitaire' },
];

for (const v of vues) {
  const page = await browser.newPage();
  await page.setViewport({ width: v.w, height: v.h });
  await page.goto(`http://localhost:3000${v.url}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); }
  });
  await new Promise(r => setTimeout(r, 2500));
  const el = await page.$(v.sel);
  await el.screenshot({ path: `${OUT}/${v.nom}.png` });
  console.log('  ' + v.nom);
  await page.close();
}
await browser.close();
