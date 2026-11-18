/**
 * Parcours complet de la démonstration boutique « Nadâ » (ajout 39).
 *
 *     npm run dev        # ou npm run start, dans un terminal
 *     npm run parcours:boutique
 *
 * Joue ce que ferait un visiteur, puis le marchand, dans un navigateur neuf,
 * sur téléphone (390 px) :
 *   1. fiche produit : envoi vide refusé, champs signalés ; commande passée ;
 *   2. confirmation, et son encart « côté marchand » ;
 *   3. panier à deux articles : livraison offerte ;
 *   4. registre : la commande est là, « Appeler » n'appelle pas, WhatsApp
 *      est pré-rempli sans destinataire ;
 *   5. appel sans réponse, confirmation (le stock baisse), envoi simulé,
 *      retour (le stock remonte) ;
 *   6. liste noire, puis nouvelle commande du même numéro : signalée ;
 *   7. chiffres recalculés ; stock à zéro → « Rupture » sur la vitrine.
 *
 * Chaque étape vérifie son résultat ; le script s'arrête au premier écart en
 * le nommant, et sort avec un code d'erreur.
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const S = `${BASE}/demo/boutique`;

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
let etape = '';
function verifier(condition, message) {
  if (!condition) throw new Error(`${etape} : ${message}`);
  console.log(`  ✓ ${message}`);
}

const navigateur = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await navigateur.newPage();
const erreurs = [];
page.on('pageerror', (e) => erreurs.push(String(e).slice(0, 160)));
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

const texte = (sel) => page.evaluate((s) => document.querySelector(s)?.textContent?.trim() ?? '', sel);
const cliquer = (debut) =>
  page.evaluate((t) => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim().startsWith(t));
    if (!b) return false;
    b.click();
    return true;
  }, debut);
const stock = (slug) => page.evaluate((s) => JSON.parse(localStorage.getItem('nada-demo-stocks') || '{}')[s], slug);

async function remplir(nom, tel, commune) {
  await page.type('input[autocomplete=name]', nom);
  await page.type('input[type=tel]', tel);
  await page.select('select[id$="-wilaya"]', '16');
  await page.waitForFunction(() => document.querySelector('select[id$="-commune"]')?.options.length > 2, { timeout: 15000 });
  await page.select('select[id$="-commune"]', commune);
  await pause(200);
  await page.type('input[autocomplete=street-address]', '3 rue des Pins, près du marché');
}

try {
  etape = '1. Fiche produit';
  console.log(etape);
  await page.goto(`${S}/p/rose-de-blida`, { waitUntil: 'load', timeout: 180000 });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${S}/p/rose-de-blida`, { waitUntil: 'load' });
  await page.waitForSelector('form#commande');
  await page.evaluate(() => document.querySelector('form#commande').requestSubmit());
  await pause(300);
  const invalides = await page.evaluate(() => document.querySelectorAll('[aria-invalid=true]').length);
  verifier(invalides >= 3, `envoi vide refusé, ${invalides} champs signalés`);
  await remplir('Test Parcours', '0555123456', 'Kouba');
  await page.evaluate(() => document.querySelector('form#commande button[type=submit]').click());
  await page.waitForFunction(() => location.pathname.includes('/merci/'), { timeout: 20000 });
  const id = page.url().split('/').pop();
  verifier(/^ND-[A-Z0-9]{5}$/.test(id), `commande ${id} passée`);

  etape = '2. Confirmation';
  console.log(etape);
  await page.waitForSelector('aside[aria-labelledby=cote-marchand] a', { timeout: 20000 });
  verifier((await texte('h1')).startsWith('Merci'), 'page de remerciement');
  const encart = await page.evaluate(() => document.querySelector('aside[aria-labelledby=cote-marchand] a').getAttribute('href'));
  verifier(encart === `/demo/boutique/admin/commande/${id}`, 'encart côté marchand vers la fiche du registre');

  etape = '3. Panier';
  console.log(etape);
  await page.goto(`${S}/p/musc-blanc`, { waitUntil: 'load' });
  await page.waitForSelector('form#commande');
  verifier(await cliquer('ou ajouter au panier'), 'musc blanc ajouté au panier');
  await page.goto(`${S}/p/neroli-de-tipaza`, { waitUntil: 'load' });
  await page.waitForSelector('form#commande');
  await cliquer('ou ajouter au panier');
  await page.goto(`${S}/panier`, { waitUntil: 'load' });
  await page.waitForFunction(() => /offerte/i.test(document.body.innerText), { timeout: 15000 });
  verifier(true, 'deux articles : livraison offerte');

  etape = '4. Registre';
  console.log(etape);
  await page.goto(`${BASE}${encart}`, { waitUntil: 'load' });
  await page.waitForSelector('h1');
  verifier((await texte('h1')) === id, 'la commande est dans le registre');
  const avant = (await stock('rose-de-blida')) ?? 3;
  await cliquer('Appeler');
  await pause(300);
  const fenetre = await page.evaluate(() => ({
    ouverte: document.querySelector('dialog')?.open,
    tel: [...document.querySelectorAll('a')].some((a) => a.href.startsWith('tel:')),
  }));
  verifier(fenetre.ouverte && !fenetre.tel, '« Appeler » ouvre la fenêtre de démonstration, aucun lien tel:');
  await page.evaluate(() => document.querySelector('dialog button').click());
  const wa = await page.evaluate(() => [...document.querySelectorAll('a')].find((a) => a.textContent.trim() === 'WhatsApp')?.href ?? '');
  verifier(wa.startsWith('https://wa.me/?text=') && decodeURIComponent(wa).includes(id), 'WhatsApp sans destinataire, message avec le numéro de commande');

  etape = '5. Traitement';
  console.log(etape);
  const statut = () => page.evaluate(() => document.querySelector('h1').nextElementSibling.textContent.trim());
  await cliquer('Pas de réponse');
  await pause(300);
  verifier((await statut()) === 'À rappeler', 'appel sans réponse : à rappeler');
  await cliquer('Joint, commande confirmée');
  await pause(300);
  verifier((await statut()) === 'Confirmée' && (await stock('rose-de-blida')) === avant - 1, `confirmée, stock ${avant} → ${avant - 1}`);
  await cliquer('Remettre au livreur');
  await pause(300);
  verifier(/SIM-/.test(await page.evaluate(() => document.body.innerText)), 'envoi simulé avec numéro de suivi');
  await cliquer('Colis retourné');
  await pause(200);
  await page.evaluate(() => [...document.querySelectorAll('label')].find((l) => /Refusé à la livraison/.test(l.textContent)).querySelector('input').click());
  await cliquer('Marquer retournée');
  await pause(300);
  verifier((await statut()) === 'Retournée' && (await stock('rose-de-blida')) === avant, 'retournée, stock remis');

  etape = '6. Liste noire';
  console.log(etape);
  await cliquer('Ajouter à la liste noire');
  await pause(200);
  await page.evaluate(() => document.querySelector('fieldset input[type=radio]').click());
  await cliquer('Ajouter à la liste noire');
  await pause(300);
  verifier(/Sur la liste noire/.test(await page.evaluate(() => document.body.innerText)), 'numéro ajouté à la liste noire');
  await page.goto(`${S}/p/ambre-du-sahara`, { waitUntil: 'load' });
  await page.waitForSelector('form#commande');
  await pause(500);
  await page.evaluate(() => document.querySelector('form#commande button[type=submit]').click());
  await page.waitForFunction(() => location.pathname.includes('/merci/'), { timeout: 20000 });
  const id2 = page.url().split('/').pop();
  await page.goto(`${BASE}/demo/boutique/admin/commande/${id2}`, { waitUntil: 'load' });
  await page.waitForSelector('h1');
  await pause(500);
  const alertes = await page.evaluate(() => document.body.innerText);
  verifier(/Sur la liste noire/.test(alertes) && /déjà refusé/.test(alertes), `nouvelle commande ${id2} signalée (liste noire, colis déjà refusé)`);

  etape = '7. Chiffres et stock';
  console.log(etape);
  await page.goto(`${BASE}/demo/boutique/admin/chiffres`, { waitUntil: 'load' });
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Tout')?.click());
  await page.waitForFunction(() => /Biskra/.test(document.body.innerText), { timeout: 15000 });
  verifier(/Alger/.test(await page.evaluate(() => document.querySelector('#t-retours').closest('section').innerText)), 'le retour d’Alger compte dans les retours par wilaya');
  await page.goto(`${BASE}/demo/boutique/admin/produits`, { waitUntil: 'load' });
  await page.waitForSelector('button[aria-label="Retirer un Rose de Blida du stock"]');
  for (let i = 0; i < 30; i++) {
    const ok = await page.evaluate(() => {
      const b = document.querySelector('button[aria-label="Retirer un Rose de Blida du stock"]');
      if (b.disabled) return false;
      b.click();
      return true;
    });
    if (!ok) break;
    await pause(40);
  }
  await page.goto(`${S}/p/rose-de-blida`, { waitUntil: 'load' });
  await page.waitForSelector('form#commande');
  await pause(400);
  const rupture = await page.evaluate(() => ({
    badge: /Rupture/.test(document.querySelector('main').innerText),
    bloque: document.querySelector('form#commande button[type=submit]').disabled,
  }));
  verifier(rupture.badge && rupture.bloque, 'stock à zéro : « Rupture » sur la fiche, commande impossible');

  if (erreurs.length) throw new Error(`erreurs JavaScript : ${erreurs.join(' | ')}`);
  console.log('\nParcours complet : tout est conforme.');
  await navigateur.close();
} catch (e) {
  console.error(`\n✗ ${e.message}`);
  await navigateur.close();
  process.exit(1);
}
