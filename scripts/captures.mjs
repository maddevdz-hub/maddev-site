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

/** Écran de téléphone des parcours en trois étapes. */
const TELEPHONE = { width: 390, height: 760 };

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/** Arrête le script en nommant l'élément manquant. */
async function exiger(page, capture, selecteur) {
  const ok = await page.evaluate((s) => !!document.querySelector(s), selecteur);
  if (!ok) throw new Error(`${capture} : « ${selecteur} » introuvable — la démo a changé, le parcours est à revoir.`);
}

/**
 * Clique le premier élément visible dont le texte correspond. `debut` : le
 * texte doit commencer par la valeur (une carte de plat porte aussi son prix).
 */
async function cliquerTexte(page, capture, texte, balise = 'button', debut = false) {
  const ok = await page.evaluate(
    (texte, balise, debut) => {
      const net = (e) => (e.getAttribute('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim();
      const cible = [...document.querySelectorAll(balise)]
        .filter((e) => e.getBoundingClientRect().width > 0)
        .reverse()
        .find((e) => (debut ? net(e).startsWith(texte) : net(e) === texte));
      if (!cible) return false;
      cible.click();
      return true;
    },
    texte,
    balise,
    debut,
  );
  if (!ok) throw new Error(`${capture} : bouton « ${texte} » introuvable — la démo a changé, le parcours est à revoir.`);
}

/** Place l'élément à `marge` pixels du haut, sans animation. */
async function cadrer(page, selecteur, marge) {
  await page.evaluate(
    (s, marge) => {
      document.documentElement.style.scrollBehavior = 'auto';
      const e = document.querySelector(s);
      window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - marge);
    },
    selecteur,
    marge,
  );
}

/** Rendez-vous : un soin, le jour le plus ouvert, la première heure libre. */
async function choisirCreneau(page, capture) {
  await exiger(page, capture, '[data-soin="detartrage"]');
  await page.evaluate(() => document.querySelector('[data-soin="detartrage"]').click());
  await pause(400);
  await exiger(page, capture, '[data-jour]');
  const max = await page.evaluate(async () => {
    let meilleur = null;
    let max = -1;
    for (const j of document.querySelectorAll('[data-jour]')) {
      j.click();
      await new Promise((r) => setTimeout(r, 120));
      const n = document.querySelectorAll('[data-visite=horaires] [data-debut]').length;
      if (n > max) { max = n; meilleur = j.getAttribute('data-jour'); }
    }
    if (meilleur) document.querySelector(`[data-jour="${meilleur}"]`).click();
    return max;
  });
  if (max < 1) throw new Error(`${capture} : aucun jour ne propose de créneau.`);
  await pause(400);
  await exiger(page, capture, '[data-visite=horaires] [data-debut]');
  await page.evaluate(() => document.querySelector('[data-visite=horaires] [data-debut]').click());
  await pause(400);
}

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
    /*
     * Nom de fichier propre à la démo, et pas « capture-rendezvous » : le
     * cache d'images de Next et celui de Vercel rangent par adresse. Une
     * capture remplacée sous le même nom resterait servie dans son ancienne
     * version — c'est arrivé quand la clinique a remplacé le cabinet Amel.
     */
    file: 'capture-el-yasmine.png',
    url: '/demo/rendezvous',
    /*
     * 1040 px : la démo passe en mise en page large, calendrier et
     * récapitulatif côte à côte. À 760 elle bascule en mise en page mobile,
     * aérée, et l'agenda ne tient plus dans l'image.
     */
    viewport: { width: 1040, height: 640 },
    /*
     * On ne capture pas l'accueil, qui ne prouve rien : on conduit la démo
     * jusqu'à l'agenda. Un soin choisi, le jour qui offre le plus de créneaux,
     * une heure retenue — on voit alors les jours complets, le vendredi
     * fermé, les heures libres et le récapitulatif rempli. C'est cet écran
     * qui prouve le service.
     *
     * Chaque élément est EXIGÉ : s'il manque, le script s'arrête en le
     * nommant. L'ancienne version cliquait « si possible » et photographiait
     * en silence le mauvais écran le jour où un libellé changeait.
     */
    async prepare(page) {
      const exiger = async (selecteur) => {
        const ok = await page.evaluate((s) => !!document.querySelector(s), selecteur);
        if (!ok) throw new Error(`capture-el-yasmine : « ${selecteur} » introuvable — la démo a changé, le cadrage est à revoir.`);
      };
      const pause = (ms) => new Promise((r) => setTimeout(r, ms));

      await exiger('[data-soin="detartrage"]');
      await page.evaluate(() => document.querySelector('[data-soin="detartrage"]').click());
      await pause(400);

      await exiger('[data-jour]');
      const jour = await page.evaluate(async () => {
        let meilleur = null;
        let max = -1;
        for (const j of document.querySelectorAll('[data-jour]')) {
          j.click();
          await new Promise((r) => setTimeout(r, 120));
          const n = document.querySelectorAll('[data-visite=horaires] [data-debut]').length;
          if (n > max) { max = n; meilleur = j.getAttribute('data-jour'); }
        }
        document.querySelector(`[data-jour="${meilleur}"]`).click();
        return { meilleur, max };
      });
      if (jour.max < 1) throw new Error('capture-el-yasmine : aucun jour ne propose de créneau.');
      await pause(400);

      await exiger('[data-visite=horaires] [data-debut]');
      await page.evaluate(() => document.querySelector('[data-visite=horaires] [data-debut]').click());
      await pause(400);

      /*
       * Cadrage : « 01 Soin » juste sous l'en-tête collant. Dans ces 640 px
       * tiennent les six soins et leurs durées, la semaine avec ses jours
       * complets et son vendredi fermé, et le récapitulatif prêt à confirmer.
       *
       * Défilement instantané imposé : la démo défile en douceur, et une
       * capture prise pendant l'animation tombait n'importe où.
       */
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        const soin = document.querySelector('[data-soin]');
        const fixe = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hauteur-fixe')) || 0;
        window.scrollTo(0, soin.getBoundingClientRect().top + window.scrollY - fixe - 94);
      });
    },
  },
  /*
   * ── Les trois écrans de chaque démo ──────────────────────────────────
   *
   * Une capture seule montre un écran ; trois montrent un parcours. Chaque
   * écran est un état RÉEL de la démo, atteint en la conduisant : rien n'est
   * recomposé. Si un bouton attendu a disparu, le script s'arrête.
   *
   * Menu : il n'existe pas d'écran « gérant » dans la démo. Le parcours
   * montré est donc celui du client du café — l'affiche, la carte, l'appel
   * du serveur — et pas une modification de prix qu'on ne sait pas montrer.
   */
  {
    file: 'etape-zitouna-1.png',
    url: '/demo/menu/affiche',
    viewport: TELEPHONE,
    // Sous la bande d'avertissement : le QR code et sa consigne.
    scrollTo: 40,
  },
  {
    file: 'etape-zitouna-2.png',
    url: '/demo/menu',
    viewport: TELEPHONE,
    scrollTo: 96,
  },
  {
    file: 'etape-zitouna-3.png',
    url: '/demo/menu',
    viewport: TELEPHONE,
    async prepare(page) {
      // Deux plats ajoutés à la commande, puis l'appel du serveur ouvert.
      for (const plat of ['Café arabe', 'Msemen au miel']) {
        await cliquerTexte(page, 'etape-zitouna-3', plat, 'button', true);
        await pause(500);
        await cliquerTexte(page, 'etape-zitouna-3', 'Ajouter à ma commande');
        await pause(300);
        await cliquerTexte(page, 'etape-zitouna-3', 'Fermer');
        await pause(400);
      }
      // Le bouton porte aussi le nombre de plats de la commande.
      await cliquerTexte(page, 'etape-zitouna-3', 'Appeler le serveur', 'button', true);
      await pause(700);
    },
  },
  {
    file: 'etape-el-yasmine-1.png',
    url: '/demo/rendezvous',
    viewport: TELEPHONE,
    async prepare(page) {
      await exiger(page, 'etape-el-yasmine-1', '[data-soin="detartrage"]');
      await page.evaluate(() => document.querySelector('[data-soin="detartrage"]').click());
      await pause(400);
      await cadrer(page, '[data-soin]', 70);
    },
  },
  {
    file: 'etape-el-yasmine-2.png',
    url: '/demo/rendezvous',
    viewport: TELEPHONE,
    async prepare(page) {
      await choisirCreneau(page, 'etape-el-yasmine-2');
      await cadrer(page, '[data-jour]', 110);
    },
  },
  {
    file: 'etape-el-yasmine-3.png',
    url: '/demo/rendezvous',
    viewport: TELEPHONE,
    async prepare(page) {
      await choisirCreneau(page, 'etape-el-yasmine-3');
      await exiger(page, 'etape-el-yasmine-3', 'input[name="prenom"]');
      // « Démo » et le numéro d'exemple de la démo elle-même : aucune
      // personne inventée dans une capture.
      await page.type('input[name="prenom"]', 'Démo');
      await page.type('input[name="telephone"]', '0555 12 34 56');
      await exiger(page, 'etape-el-yasmine-3', '[data-visite="confirmer"]');
      await page.evaluate(() => document.querySelector('[data-visite="confirmer"]').click());
      await page.waitForSelector('[data-visite="rappel-whatsapp"]', { timeout: 8000 });
      await pause(900);
      await cadrer(page, '[data-visite="rappel-whatsapp"]', 330);
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
  /*
   * La réalisation, en trois vues prises sur le site en ligne du client :
   * l'accueil, la collection, une fiche produit sur téléphone. Version
   * française du site, la même pour les deux langues de /services.
   */
  {
    file: 'realisation-showroom-accueil.jpg',
    url: 'https://henna-meubles-2026.vercel.app/fr',
    absolute: true,
    viewport: { width: 1280, height: 800 },
  },
  {
    file: 'realisation-showroom-collection.jpg',
    url: 'https://henna-meubles-2026.vercel.app/fr/collection',
    absolute: true,
    viewport: { width: 1280, height: 800 },
  },
  {
    file: 'realisation-showroom-produit.jpg',
    url: 'https://henna-meubles-2026.vercel.app/fr/produit/salon-modulaire-ivoire',
    absolute: true,
    viewport: TELEPHONE,
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

// `node scripts/captures.mjs capture-el-yasmine.png` ne refait que celle-là.
const demandees = process.argv.slice(2);
const aFaire = demandees.length ? SHOTS.filter((s) => demandees.includes(s.file)) : SHOTS;
if (demandees.length && aFaire.length !== demandees.length) {
  console.error(`Capture inconnue. Disponibles : ${SHOTS.map((s) => s.file).join(', ')}`);
  process.exit(1);
}

for (const shot of aFaire) {
  const page = await browser.newPage();
  // Thème clair imposé : la démo de rendez-vous a un thème sombre, et Chrome
  // suit celui de Windows. Sans cette ligne, la capture dépendrait de la
  // machine qui la prend.
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.setViewport({ ...shot.viewport, deviceScaleFactor: 2 });
  const target = shot.absolute ? shot.url : `${BASE}${shot.url}`;
  // Un site externe peut garder une connexion ouverte (vidéo, mesure
  // d'audience) et ne jamais atteindre le silence réseau complet : on y
  // tolère deux requêtes en cours. Nos propres démos, elles, doivent se taire.
  const reponse = await page.goto(target, {
    waitUntil: shot.absolute ? 'networkidle2' : 'networkidle0',
    timeout: 60000,
  });
  // Une page en erreur se photographie très bien : on s'arrête plutôt que de
  // publier sur /services la capture d'une 404 ou d'une 500.
  if (!reponse || reponse.status() >= 400) {
    throw new Error(`${shot.file} : ${target} a répondu ${reponse ? reponse.status() : 'rien'} — capture annulée.`);
  }

  // Les polices Google arrivent après le premier rendu : sans cette attente,
  // la capture montre la police de repli et la démo paraît bâclée.
  await page.evaluateHandle('document.fonts.ready');

  if (shot.scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), shot.scrollTo);
  }
  if (shot.prepare) {
    await shot.prepare(page);
  }
  // Les images d'un site externe finissent d'arriver après la navigation.
  await new Promise((r) => setTimeout(r, shot.absolute ? 2500 : 500));

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
