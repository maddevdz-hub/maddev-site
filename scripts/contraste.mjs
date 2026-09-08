/**
 * Mesure les contrastes RÉELS de la démonstration « Café Zitouna ».
 *
 *     npm run dev            # dans un terminal
 *     npm run contraste
 *
 * ── Pourquoi mesurer plutôt que calculer ────────────────────────────────
 * Sur un aplat, le contraste se calcule : deux couleurs, une formule. Dès
 * qu'un texte passe sur une photographie voilée, le fond n'est plus une
 * couleur mais quelques milliers de pixels différents, et la seule valeur
 * qui compte est celle du PIRE d'entre eux. Un voile réglé à l'œil tient
 * presque toujours au centre de l'image et cède dans un coin sombre.
 *
 * ── Comment ─────────────────────────────────────────────────────────────
 * On rend le texte transparent — sans rien déplacer, donc les cadres restent
 * exacts —, on photographie la zone, puis on parcourt tous les pixels situés
 * derrière chaque texte. Le rapport annoncé est celui du pixel le moins
 * favorable, jamais une moyenne.
 *
 * Une puce opaque (l'indicateur d'ouverture) est traitée de la même façon :
 * son fond propre est ce que l'on échantillonne.
 *
 * L'horloge est figée à 10 h : sans cela le résultat dépend de l'heure à
 * laquelle on lance le script, et l'indicateur bascule de « ouvert » à
 * « fermé » — donc de couleur.
 */
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const HEURE = '2026-09-08T10:00:00';

/** Luminance relative, définition WCAG 2.1. */
function luminance(r, g, b) {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function rapport(a, b) {
  const [x, y] = [luminance(...a), luminance(...b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** `rgb(95, 76, 62)` → [95, 76, 62] */
function lire(couleur) {
  const m = couleur.match(/\d+(\.\d+)?/g);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});

/**
 * Les textes à contrôler, par sélecteur.
 * `seuil` : 4,5 pour le texte courant, 3 pour le grand texte (≥ 24 px, ou
 * ≥ 18,66 px en gras) — c'est le barème AA.
 */
const CIBLES = [
  { nom: 'Nom du café (h1)', sel: 'header h1', seuil: 3 },
  { nom: 'Indicateur d’ouverture', sel: 'header [class*="rounded-full"]', seuil: 4.5 },
  { nom: 'Horaires', sel: 'header p .numerals', seuil: 4.5 },
];

for (const largeur of [390, 1280]) {
  const page = await browser.newPage();
  await page.setViewport({ width: largeur, height: 900, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument((iso) => {
    const fige = new Date(iso).getTime();
    const Vrai = Date;
    class Fixe extends Vrai {
      constructor(...args) {
        super(...(args.length === 0 ? [fige] : args));
      }
      static now() {
        return fige;
      }
    }
    window.Date = Fixe;
  }, HEURE);

  await page.goto(`${BASE}/demo/menu`, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise((r) => setTimeout(r, 600));

  /*
   * Les cadres et les couleurs d'encre, AVANT de rendre le texte transparent.
   *
   * On mesure la boîte des GLYPHES, obtenue par un Range sur les nœuds de
   * texte — pas celle de l'élément. La différence n'est pas cosmétique : la
   * boîte de l'indicateur d'ouverture englobe sa pastille verte, et le vert
   * de la pastille contre l'encre du texte donnait 1,63:1. Un échec mesuré
   * sur un pixel que personne ne lit reste un échec faux.
   */
  const cibles = await page.evaluate((liste) => {
    const boiteDuTexte = (el) => {
      const range = document.createRange();
      let boite = null;
      for (const n of el.childNodes) {
        if (n.nodeType !== Node.TEXT_NODE || !n.textContent.trim()) continue;
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) {
          if (r.width === 0 || r.height === 0) continue;
          boite = boite
            ? {
                x: Math.min(boite.x, r.x),
                y: Math.min(boite.y, r.y),
                r: Math.max(boite.r, r.right),
                b: Math.max(boite.b, r.bottom),
              }
            : { x: r.x, y: r.y, r: r.right, b: r.bottom };
        }
      }
      return boite && { x: boite.x, y: boite.y, w: boite.r - boite.x, h: boite.b - boite.y };
    };

    return liste.map((c) => {
      const el = document.querySelector(c.sel);
      if (!el) return { ...c, absent: true };
      const boite = boiteDuTexte(el);
      if (!boite) return { ...c, absent: true };
      return { ...c, encre: getComputedStyle(el).color, boite };
    });
  }, CIBLES);

  // Le texte disparaît, la mise en page ne bouge pas.
  await page.addStyleTag({
    content: 'header, header * { color: transparent !important; }',
  });
  await new Promise((r) => setTimeout(r, 200));

  const png = await page.screenshot({ clip: { x: 0, y: 0, width: largeur, height: 320 } });
  const { data, info } = await sharp(png)
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`\n── ${largeur} px ${'─'.repeat(46)}`);
  for (const c of cibles) {
    if (c.absent) {
      console.log(`  ${c.nom.padEnd(26)} SÉLECTEUR INTROUVABLE (${c.sel})`);
      continue;
    }
    const encre = lire(c.encre);
    const d = 2; // densité de la capture
    let pire = Infinity;
    let meilleur = 0;
    for (let y = Math.round(c.boite.y * d); y < Math.round((c.boite.y + c.boite.h) * d); y++) {
      for (let x = Math.round(c.boite.x * d); x < Math.round((c.boite.x + c.boite.w) * d); x++) {
        if (y < 0 || y >= info.height || x < 0 || x >= info.width) continue;
        const i = (y * info.width + x) * info.channels;
        const r = rapport(encre, [data[i], data[i + 1], data[i + 2]]);
        if (r < pire) pire = r;
        if (r > meilleur) meilleur = r;
      }
    }
    const ok = pire >= c.seuil;
    console.log(
      `  ${c.nom.padEnd(26)} pire ${pire.toFixed(2).padStart(6)}:1` +
        `   (meilleur ${meilleur.toFixed(2)}:1)   seuil AA ${c.seuil}   ${ok ? '✓' : '✗ ÉCHEC'}`,
    );
  }
  await page.close();
}

await browser.close();
console.log('');
