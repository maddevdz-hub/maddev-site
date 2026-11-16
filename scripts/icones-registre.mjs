/**
 * Icônes du registre Nadâ (application installable de la démo boutique).
 *
 *     npm run dev                 # dans un terminal : le script emprunte
 *     npm run icones:registre     # la police Cormorant servie par la démo
 *
 * Dessine un « N » Cormorant crème sur le vert Nadâ, avec le point ambré du
 * carnet, puis l'enregistre aux tailles demandées par Android et iOS dans
 * public/demo/boutique/registre/. La version « maskable » garde le dessin
 * dans les 60 % centraux : Android rogne l'icône à sa forme (cercle, goutte…).
 */
import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SORTIE = 'public/demo/boutique/registre';

const ICONES = [
  { fichier: 'icone-192.png', taille: 192, echelle: 0.78, rayon: 0 },
  { fichier: 'icone-512.png', taille: 512, echelle: 0.78, rayon: 0 },
  { fichier: 'icone-maskable-512.png', taille: 512, echelle: 0.56, rayon: 0 },
  { fichier: 'apple-touch-icon.png', taille: 180, echelle: 0.74, rayon: 0 },
];

mkdirSync(SORTIE, { recursive: true });
const navigateur = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await navigateur.newPage();
await page.goto(`${BASE}/demo/boutique/livraison`, { waitUntil: 'networkidle0', timeout: 180000 });

for (const i of ICONES) {
  await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });
  await page.evaluate(({ taille, echelle }) => {
    document.getElementById('icone')?.remove();
    const d = document.createElement('div');
    d.id = 'icone';
    d.style.cssText = `position:fixed;inset:0 auto auto 0;z-index:99999;width:${taille}px;height:${taille}px;background:#22352c;display:grid;place-items:center;`;
    const h = Math.round(taille * echelle);
    d.innerHTML = `<div style="position:relative;width:${h}px;height:${h}px;display:grid;place-items:center">
      <span style="font-family:var(--font-cormorant),Georgia,serif;font-weight:600;font-size:${Math.round(h * 0.95)}px;line-height:1;color:#f7f2ea;transform:translateY(-3%)">N</span>
      <span style="position:absolute;right:${Math.round(h * 0.06)}px;bottom:${Math.round(h * 0.17)}px;width:${Math.round(h * 0.11)}px;height:${Math.round(h * 0.11)}px;border-radius:50%;background:#c69456"></span>
    </div>`;
    document.body.appendChild(d);
  }, i);
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: `${SORTIE}/${i.fichier}`, clip: { x: 0, y: 0, width: i.taille, height: i.taille } });
  console.log(`✓ ${SORTIE}/${i.fichier}`);
}
await navigateur.close();
