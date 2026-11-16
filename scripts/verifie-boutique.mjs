/**
 * Vérifications de la démonstration boutique « Nadâ ».
 *
 *     npm run dev                  # dans un terminal
 *     npm run verifie:boutique
 *
 * ── Débordement horizontal ──────────────────────────────────────────────
 * Chaque page de la démo, à 360 et 390 px : la largeur du document ne doit
 * jamais dépasser la largeur demandée. Les éléments qui dépassent sont
 * nommés, pour corriger la cause plutôt que masquer le symptôme (jamais
 * d'overflow-x: hidden sur html ou body).
 *
 * ⚠️ La comparaison se fait avec la largeur DEMANDÉE, pas avec
 * window.innerWidth. En émulation de téléphone, quand une page déborde, le
 * navigateur élargit la fenêtre de rendu : innerWidth grandit avec la page,
 * et un test « scrollWidth − innerWidth » affiche 0 sur une page qui
 * déborde. C'est arrivé : la fiche produit débordait de 13 px et le test la
 * déclarait propre. On teste donc avec ET sans émulation.
 *
 * Le script sort avec un code d'erreur si une page déborde.
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const PRODUITS = [
  'rose-de-blida',
  'ambre-du-sahara',
  'neroli-de-tipaza',
  'musc-blanc',
  'huile-d-oud',
  'coffret-decouverte',
  'creme-mains',
  'brume-cheveux',
];

const PAGES = [
  '/demo/boutique',
  '/demo/boutique/parfums',
  ...PRODUITS.map((p) => `/demo/boutique/p/${p}`),
  '/demo/boutique/panier',
  '/demo/boutique/livraison',
  ...(process.env.PAGES_EN_PLUS ? process.env.PAGES_EN_PLUS.split(',') : []),
];

const LARGEURS = [360, 390];

const navigateur = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
let fautes = 0;

for (const chemin of PAGES) {
  for (const largeur of LARGEURS) {
    for (const mobile of [false, true]) {
      const page = await navigateur.newPage();
      await page.setViewport({ width: largeur, height: 800, isMobile: mobile, hasTouch: mobile });
      const rep = await page.goto(BASE + chemin, { waitUntil: 'networkidle0', timeout: 120000 });
      if (!rep || rep.status() >= 400) {
        console.log(`✗ ${chemin} — statut ${rep ? rep.status() : 'aucun'}`);
        fautes++;
        await page.close();
        continue;
      }
      await page.evaluateHandle('document.fonts.ready');
      const r = await page.evaluate((w) => {
        const largeurDoc = document.documentElement.scrollWidth;
        const fautifs = [...document.querySelectorAll('body *')]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            return b.width > 0 && b.right > w + 0.5 && !e.closest('dialog');
          })
          .slice(0, 6)
          .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 3).join('.')} → ${Math.round(e.getBoundingClientRect().right)} px`);
        return { largeurDoc, fautifs };
      }, largeur);
      const ok = r.largeurDoc <= largeur;
      if (!ok) fautes++;
      console.log(
        `${ok ? '✓' : '✗'} ${chemin.padEnd(38)} ${largeur} px ${mobile ? 'téléphone' : 'fenêtre  '}  largeur ${r.largeurDoc}`,
      );
      if (!ok) for (const f of r.fautifs) console.log(`      ${f}`);
      await page.close();
    }
  }
}

await navigateur.close();
console.log(fautes ? `\n${fautes} contrôle(s) en échec.` : '\nAucun débordement.');
process.exit(fautes ? 1 : 0);
