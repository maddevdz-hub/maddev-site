/**
 * Vérification des liens du site, avant chaque mise en ligne.
 *
 *     npm run dev                  # dans un terminal (ou npm run start)
 *     npm run verifie:liens
 *
 * Parcourt le site en partant de /fr, /ar, des démonstrations et du sitemap,
 * en suivant chaque lien interne trouvé dans le HTML servi. Pour chaque
 * lien : la page répond (moins de 400, après redirections), et l'ancre
 * (#…) existe dans la page visée. Puis les redirections permanentes connues
 * sont rejouées une par une.
 *
 * Limite assumée : seuls les liens présents dans le HTML rendu par le
 * serveur sont vus. Ceux que le navigateur ajoute après coup (fiches du
 * registre de la démo, par exemple) relèvent des scripts de parcours.
 *
 * Sort avec un code d'erreur au premier défaut constaté, après la liste.
 */
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

/** Ancres retirées, renvoyées côté navigateur (components/ui/HashScroll.tsx). */
const ANCRES_REMPLACEES = Object.fromEntries(
  [...readFileSync('components/ui/HashScroll.tsx', 'utf8').matchAll(/'([a-z0-9-]+)':\s*'([a-z0-9-]+)'/g)].map((m) => [m[1], m[2]]),
);

const DEPARTS = ['/fr', '/ar', '/demo/boutique', '/demo/boutique/admin', '/demo/menu', '/demo/rendezvous'];

/** Redirections permanentes attendues : [adresse, destination]. */
const REDIRECTIONS = [
  ['/fr/realisations', '/fr/services'],
  ['/ar/realisations', '/ar/services'],
  ['/fr/contact?service=campagne-publicitaire', '/fr/contact?service=page-produit'],
  ['/ar/contact?service=campagne-publicitaire', '/ar/contact?service=page-produit'],
  ['/fr/contact?service=plateforme-sur-mesure', '/fr/contact?service=application'],
  ['/ar/contact?service=plateforme-sur-mesure', '/ar/contact?service=application'],
];

const pages = new Map(); // chemin -> { statut, ids, liens }
const fautes = [];

const decoder = (s) => s.replace(/&amp;/g, '&');

async function charger(chemin) {
  if (pages.has(chemin)) return pages.get(chemin);
  const entree = { statut: 0, ids: new Set(), liens: [] };
  pages.set(chemin, entree);
  try {
    const r = await fetch(BASE + chemin, { redirect: 'follow' });
    entree.statut = r.status;
    entree.final = new URL(r.url).pathname + new URL(r.url).search;
    if (!(r.headers.get('content-type') ?? '').includes('text/html')) return entree;
    const html = await r.text();
    for (const m of html.matchAll(/\sid="([^"]+)"/g)) entree.ids.add(m[1]);
    for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) entree.liens.push(decoder(m[1]));
  } catch (e) {
    entree.statut = -1;
    entree.erreur = String(e);
  }
  return entree;
}

function interne(href) {
  if (/^(mailto:|tel:|https?:\/\/(?!localhost)|\/\/|javascript:)/.test(href)) return null;
  if (href.startsWith(BASE)) href = href.slice(BASE.length);
  if (href.startsWith('/_next/')) return null;
  return href;
}

// Départs + pages du sitemap
const departs = [...DEPARTS];
try {
  const xml = await (await fetch(BASE + '/sitemap.xml')).text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) departs.push(new URL(m[1]).pathname);
} catch {
  fautes.push('sitemap.xml illisible');
}

const aVisiter = [...new Set(departs)];
const vus = new Set();
let liensVerifies = 0;

while (aVisiter.length) {
  const chemin = aVisiter.shift();
  if (vus.has(chemin)) continue;
  vus.add(chemin);
  const page = await charger(chemin);
  if (page.statut >= 400 || page.statut <= 0) {
    fautes.push(`${chemin} → ${page.statut}${page.erreur ? ' ' + page.erreur : ''}`);
    continue;
  }
  for (const brut of page.liens) {
    const href = interne(brut);
    if (href === null) continue;
    liensVerifies++;
    const [cheminCible, ancre] = href.startsWith('#') ? [chemin, href.slice(1)] : href.split('#');
    const cible = cheminCible || chemin;
    const pageCible = await charger(cible);
    if (pageCible.statut >= 400 || pageCible.statut <= 0) {
      fautes.push(`${chemin} : lien ${href} → ${pageCible.statut}`);
      continue;
    }
    if (ancre) {
      const id = ANCRES_REMPLACEES[ancre] ?? ancre;
      if (!pageCible.ids.has(id)) fautes.push(`${chemin} : ancre ${href} introuvable dans ${cible}`);
    }
    // On ne parcourt que le site lui-même (pages HTML), sans les fichiers.
    if (!vus.has(cible) && !/\.[a-z0-9]{2,5}$/i.test(cible.split('?')[0])) aVisiter.push(cible.split('?')[0]);
  }
}

// Redirections
for (const [source, attendu] of REDIRECTIONS) {
  const r = await fetch(BASE + source, { redirect: 'manual' });
  const dest = r.headers.get('location') ?? '';
  const destChemin = dest.startsWith('http') ? new URL(dest).pathname + new URL(dest).search : dest;
  const ok = r.status === 301 && destChemin === attendu;
  if (!ok) fautes.push(`redirection ${source} → ${r.status} ${destChemin || '(aucune)'} (attendu 301 ${attendu})`);
  console.log(`${ok ? '✓' : '✗'} 301 ${source} → ${destChemin}`);
}

console.log(`\n${vus.size} pages parcourues, ${liensVerifies} liens internes vérifiés.`);
if (fautes.length) {
  console.log(`\n${fautes.length} défaut(s) :`);
  for (const f of [...new Set(fautes)]) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('Aucun lien cassé, aucune ancre manquante.');
