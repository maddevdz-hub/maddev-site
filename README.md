# MADDEV — site du studio

Site vitrine bilingue arabe / français du studio MADDEV.
Next.js 14 (App Router), TypeScript, Tailwind CSS.

---

## Si vous revenez à ce projet dans deux ans

Lisez cette section en premier ; le reste du fichier détaille chaque point.

### Ce qu'il faut installer

| | Version utilisée pour développer | Minimum |
| --- | --- | --- |
| Node.js | 24.15.0 | 18.17 |
| npm | 11.12.1 | 9 |

Les versions exactes de toutes les dépendances sont figées dans
`package-lock.json`. **Ne le supprimez pas** : c'est lui, et lui seul, qui
garantit que `npm install` réinstalle en 2027 exactement ce qui tournait en
2026. Un projet dont on a perdu le lock se reconstruit avec des versions plus
récentes, et casse pour des raisons introuvables.

```bash
npm install
npm run dev
```

Le site répond sur `http://localhost:3000`. La racine redirige vers `/ar`.

### Où se trouve quoi

| Je veux changer… | Fichier |
| --- | --- |
| un texte de page (services, FAQ, méthode, à-propos) | `content/*.ts` |
| un libellé d'interface, un titre de page, une description SEO | `messages/ar.json` et `messages/fr.json` |
| les coordonnées (WhatsApp, email, domaine) | `content/site.ts` |
| les questions du configurateur | `lib/configurator.ts` |
| une couleur, une police | `tailwind.config.ts` et `app/globals.css` |
| le contenu d'une démonstration | `content/demos/*.ts` |
| une image | `public/` (voir le tableau plus bas) |

Le texte bilingue vit **en place**, sous la forme `{ fr: '…', ar: '…' }`.
Il n'y a pas de fichier de traduction séparé à tenir synchronisé : si vous
modifiez une phrase, sa version dans l'autre langue est juste à côté.

### Les images

| Quoi | Où | État |
| --- | --- | --- |
| Logos et monogrammes | `public/maddev-*.svg` | en place |
| Icônes d'application | `public/icons/`, `app/icon.svg`, `app/apple-icon.png` | en place |
| Capture du projet client | `public/projects/showroom-meubles-bba.png` | **manquante** |
| Photo du fondateur | `public/about/` | **manquante** |
| Photos des démonstrations | `public/demo/<démo>/` | **manquantes** |

Tant qu'une image manque, le code affiche un état d'attente dessiné — jamais
un rectangle vide. Il suffit de déposer le fichier et de renseigner le champ
correspondant dans `content/` pour qu'il prenne la place.

### Les comptes

⚠️ À compléter au fur et à mesure des créations — un compte dont on a oublié
le nom est un compte perdu.

| Service | À quoi il sert | Compte |
| --- | --- | --- |
| Email du studio | contact, inscriptions | `maddev.dz@gmail.com` |
| Registrar du domaine | `maddev.dev` | *à compléter* |
| GitHub | code source, dépôt privé | *à compléter* |
| Vercel | hébergement, connecté à GitHub | *à compléter* |
| Resend | envoi des emails du formulaire | *à compléter* |

### Les pièges connus

Ils sont documentés dans `CONTEXTE.md`, avec la raison de chaque décision.
Deux valent d'être rappelés ici :

- **Ne lancez jamais `npm run build` pendant que `npm run dev` tourne.** Le
  build écrase `.next` et le serveur de développement se met à renvoyer des
  erreurs de syntaxe sur des fichiers parfaitement valides. Arrêtez le dev,
  buildez, relancez.
- **Si les polices ne se chargent pas en développement**, relancez sans rien
  vider. `next/font` applique un délai de 3 secondes codé en dur, uniquement
  en dev ; effacer `.next` supprime les polices déjà téléchargées et aggrave
  le problème.

---

## Démarrer

```bash
npm install
```

```bash
npm run dev
```

Le site est servi sur `http://localhost:3000`. La racine redirige vers la bonne
langue, `/ar` par défaut.

Autres commandes :

```bash
npm run build
```

```bash
npm run typecheck
```

---

## Comment fonctionne le bilingue

Toutes les pages vivent sous un segment de langue : `/ar/services`,
`/fr/services`, etc. C'est ce qui permet d'avoir de vraies métadonnées SEO par
langue, un `<html lang dir>` correct rendu côté serveur, et un sitemap
bilingue — ce qu'un simple contexte React ne peut pas donner.

| Pièce | Rôle |
| --- | --- |
| `middleware.ts` | Redirige `/`, `/services`… vers `/ar/...` ou `/fr/...`. Respecte le cookie de choix, puis l'en-tête `Accept-Language`, puis l'arabe. |
| `i18n/config.ts` | Liste des langues, sens d'écriture, table des routes, helper `href()`. |
| `messages/ar.json`, `messages/fr.json` | Toutes les chaînes d'interface. |
| `i18n/dictionaries.ts` | Charge le bon dictionnaire côté serveur. |
| `components/layout/LangToggle.tsx` | Le bouton de bascule. |

**Le bouton de bascule** remplace le premier segment de l'URL : depuis
`/fr/services`, il envoie sur `/ar/services` — on reste sur la même page. La
navigation passe par `useTransition`, donc React garde l'ancienne page à
l'écran pendant le chargement, sans clignotement. Le choix est mémorisé dans un
cookie (`maddev_locale`) lu par le middleware aux visites suivantes.

**Les polices changent avec la langue** sans qu'aucun composant ne le sache :
les quatre familles sont montées en variables CSS sur `<html>`, et
`app/globals.css` choisit la paire selon `html[lang]`.

```css
html[lang='fr'] { --font-display: var(--font-space-grotesk); --font-body: var(--font-outfit); }
html[lang='ar'] { --font-display: var(--font-cairo);        --font-body: var(--font-tajawal); }
```

**Le RTL** repose sur les propriétés logiques de Tailwind (`ms-`/`me-`,
`ps-`/`pe-`, `start-`/`end-`, `text-start`) plutôt que sur gauche/droite. Le
miroir arabe est donc automatique. Deux détails traités à part :

- les flèches directionnelles sont retournées via `rtl:-scale-x-100` ;
- les numéros de téléphone, emails et chiffres restent en écriture latine
  (classe `.numerals` ou `dir="ltr"` local).

---

## Modifier le contenu

Le texte des services, projets et étapes du process ne se trouve pas dans les
composants — il est isolé dans `content/`, avec les deux langues côte à côte.

| Fichier | Contient |
| --- | --- |
| `content/services.ts` | Les 4 services : promesse, description, livrables, cible, résultat, délai. |
| `content/projects.ts` | Les réalisations : titre, type, résultat, chiffres mesurés, lien vers le site en ligne. |
| `content/process.ts` | Les 5 étapes de la méthode. |
| `content/site.ts` | **Coordonnées** : WhatsApp, email, URL du site. |
| `messages/*.json` | Tout le reste : navigation, titres de sections, libellés du formulaire, métadonnées SEO. |

### Règle de contenu

**Aucune donnée inventée.** Pas de prix indicatif, pas de client fictif, pas
de témoignage, pas de statistique non mesurée, pas de logo de partenaire. Un
champ sans valeur réelle est supprimé, jamais rempli d'un placeholder — c'est
pour cette raison que `content/site.ts` ne contient plus ni réseaux sociaux
ni année de création.

Les seuls chiffres publiés sont ceux du projet en ligne (67 pages, bilingue
AR/FR, Lighthouse 94–99) et ils sont vérifiables sur le site livré.

### ⚠️ Deux emplacements à remplir avant publication

| Quoi | Où | En attendant |
| --- | --- | --- |
| Votre photo | `about.photo` dans `content/about.ts`, fichier dans `public/about/` | Un cadre de marque neutre — jamais une photo d'illustration |
| Votre nom | `about.identity.name` (facultatif) | La ligne disparaît simplement |

La page « Qui sommes-nous » ne contient **aucun fait personnel inventé** :
ni nom, ni ville, ni diplôme, ni nombre d'années. Tout ce qui s'y trouve
est soit vérifiable, soit un engagement que vous tenez.

### Ajouter une réalisation

Ajoutez une entrée dans `content/projects.ts`. Les `stats` n'acceptent que des
valeurs mesurées.

Tant que le champ `image` est vide, la carte affiche un cadre navigateur
neutre portant l'URL réelle du projet — jamais une reconstitution d'interface.
Déposez la capture dans `public/projects/`, renseignez `image` (par exemple
`/projects/showroom-meubles-bba.png`), et la vraie image remplace le cadre
sans autre modification.

---

## Le configurateur « Trouvez votre solution »

Un quiz de 4 questions qui recommande un service au visiteur qui ne sait pas
encore ce dont il a besoin. Accessible sur `/ar/quiz` et `/fr/quiz`, avec une
entrée dans le hero de l'accueil et dans le footer.

**Tout se règle dans [`lib/configurator.ts`](lib/configurator.ts)** : les
questions, les options, les phrases du résultat et la règle de
recommandation. Aucun composant à toucher pour reformuler une question ou
ajuster la logique.

Le résultat est **partageable** : les réponses sont sérialisées dans l'URL
(`/fr/quiz?p=ecommerce&o=vente&v=many&b=100-200`). Un lien rouvre directement
la recommandation, et les statistiques peuvent enfin distinguer les
recommandations servies. Toute valeur inconnue dans l'URL est ignorée.

### La règle de recommandation

Elle s'appuie sur les questions 1 à 3, dans cet ordre de priorité :

| Condition | Reco |
| --- | --- |
| `type: ecommerce` ou `goal: vente` ou `produits: many` | Boutique e-commerce |
| `type: app` ou `goal: automatisation` | Application web / MVP |
| sinon | Site vitrine |
| `goal: trafic` | ajoute Marketing & Publicité en complément |

`type: refonte` n'est pas un service à part : c'est un drapeau posé sur le
service détecté en dessous. Sinon un visiteur qui veut refondre **sa boutique**
recevrait une reco « site vitrine ».

### Le configurateur n'affiche aucun prix

C'est délibéré. Annoncer une fourchette avant d'avoir compris le périmètre
revient soit à s'engager sur un montant qu'on ne tiendra pas, soit à faire
fuir un prospect que le projet aurait intéressé.

La question 4 qualifie sans chiffrer : la tranche déclarée part **dans le
message qui vous est adressé** et n'est jamais réaffichée au visiteur. Elle
voyage par l'URL (`/contact?service=…&budget=…`) quand le prospect clique sur
« Demander cette solution », et directement dans la charge utile depuis la
capture de lead. L'écran de résultat promet une réponse chiffrée sous 24 h —
c'est un humain qui la produit.

### Où vont les leads

Le champ « Recevez votre recommandation détaillée » poste sur la même route
que le formulaire de contact (`/api/contact`), avec `source: 'configurator'`.
L'email reçu porte la mention `Origine : Configurateur` et le service
recommandé, pour distinguer ces leads des demandes classiques. La capture est
facultative : le résultat reste affiché quoi qu'il arrive.

---

## Le formulaire de contact

Il poste réellement sur `/api/contact` (`app/api/contact/route.ts`).

- **Sans `RESEND_API_KEY`** : la demande est écrite dans les logs du serveur et
  l'utilisateur voit quand même la confirmation. Pratique en local.
- **Avec `RESEND_API_KEY`** : la demande part par email via l'API HTTP de
  [Resend](https://resend.com) — aucune dépendance npm supplémentaire.

Copiez `.env.example` vers `.env.local` et renseignez les clés.

### Protections anti-spam

L'endpoint est public : sans garde-fou, il devient une machine à envoyer des
emails. Quatre couches, toutes côté serveur :

| Protection | Comportement |
| --- | --- |
| Champ piège (`company`) | Invisible pour un humain (hors écran, `aria-hidden`, `tabIndex={-1}`). S'il est rempli, la réponse est `200` mais rien n'est envoyé — inutile d'apprendre au robot qu'il a été repéré. |
| Délai de remplissage | Moins de 3 s entre l'affichage du formulaire et l'envoi → `400 too_fast`. Le compteur part du montage, pas de la première frappe : un humain qui lit la page dépasse largement ce seuil. |
| Limitation de débit | 3 requêtes par IP sur 10 minutes, puis `429` avec `Retry-After`. |
| Validation stricte | Longueurs bornées, contact validé comme email **ou** téléphone, caractères de contrôle retirés (injection d'en-têtes email), slugs de service et tranches de budget vérifiés contre les listes connues. |

⚠️ **Limite connue de la limitation de débit** : le compteur vit en mémoire.
Sur un hébergement sans état comme Vercel, chaque instance a le sien et il
repart à zéro après une mise en veille. C'est un garde-fou contre les envois
répétés, pas une protection contre une attaque distribuée. Pour cela, il
faudrait un stockage partagé (Vercel KV ou Upstash Redis) — une vingtaine de
lignes à changer dans `app/api/contact/route.ts`.

Le menu déroulant se pré-remplit depuis l'URL : les boutons « Demander un
devis » de la page Services pointent vers `/contact?service=boutique-ecommerce`.

---

## Le logo

Les fichiers de référence n'étaient pas disponibles au moment de la
construction : le symbole **DD** (deux « D » qui se chevauchent en dégradé
corail) a été reconstruit d'après la charte. Pour le remplacer par les
originaux :

- **Sur le site**, le tracé vit dans `components/brand/DDMark.tsx` — c'est la
  seule source. Le motif en filigrane (`DDPattern.tsx`) et le favicon
  (`app/icon.svg`) reprennent les mêmes chemins : pensez à les mettre à jour
  ensemble.
- **Dans `public/`**, les fichiers `maddev-logo-*.svg` et `maddev-icon-*.svg`
  sont des assets autonomes pour les usages hors site (documents, réseaux).
  Le mot-symbole y est du texte SVG avec une pile de polices de repli ; sur le
  site, c'est le composant `Logo.tsx` qui rend « MADDEV » en HTML pour garantir
  la bonne police.

---

## Charte

Les tokens sont définis dans `tailwind.config.ts` :

| Token | Valeur | Usage |
| --- | --- | --- |
| `ink` | `#0e0f14` | Fond principal |
| `ink2` | `#14161c` | Sections alternées |
| `ink3` | `#1c1f28` | Cartes |
| `line` | `rgba(255,255,255,.08)` | Bordures |
| `coral` | `#ff5a5f` | Accent principal |
| `coral2` | `#ff8a5f` | Accent secondaire |
| `txt` / `txt2` | `#f4f2ef` / `#a8a4ad` | Texte |
| `bg-brand` | `linear-gradient(120deg,#ff5a5f,#ff8a5f)` | Dégradé signature |

**Il n'y a volontairement pas de troisième niveau de gris.** Un ancien token
`txt3` (`#6a6874`) donnait 3,5:1 sur le fond `ink`, sous le seuil AA de
4,5:1 : tout texte qui l'utilisait échouait. Il a été retiré de la palette
plutôt que documenté comme « à éviter », parce qu'un token qui existe finit
toujours par être utilisé. Tout texte s'écrit en `txt2` (7,9:1) ou `txt`
(17:1), et la hiérarchie passe par la taille et la graisse.

Contrôlé sur les 4 pages principales × 2 langues × mobile et desktop :
**zéro échec de contraste**, zéro zone tactile sous 44 px.

---

## Publier sur maddev.dev

### 1. Mettre le code sur GitHub

Le dépôt local est **déjà créé et le premier commit est fait**. Il reste à
l'envoyer sur GitHub. Toutes les commandes se lancent depuis le dossier du
projet.

**a. Créer le dépôt privé.** Sur [github.com/new](https://github.com/new) :

- *Repository name* : `maddev-site`
- *Description* : Site du studio MADDEV
- cochez **Private** — le dépôt contient le contenu du site, pas seulement du
  code ; il n'a aucune raison d'être public
- **ne cochez rien d'autre** : ni README, ni .gitignore, ni licence. Le projet
  en a déjà, et GitHub créerait un conflit au premier envoi
- *Create repository*

**b. Relier le projet au dépôt.** Remplacez `VOTRE-COMPTE` par votre nom
d'utilisateur GitHub :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/maddev-site.git
```

**c. Envoyer le code :**

```bash
git push -u origin main
```

Git ouvre une fenêtre de connexion GitHub au premier envoi. Connectez-vous
dans le navigateur ; Windows retient ensuite l'autorisation, et les envois
suivants ne demandent plus rien.

Si aucune fenêtre ne s'ouvre et que git réclame un mot de passe : GitHub
n'accepte plus les mots de passe de compte depuis 2021. Créez un jeton sur
[github.com/settings/tokens](https://github.com/settings/tokens) →
*Generate new token (classic)* → cochez la case **repo** → copiez le jeton et
collez-le à la place du mot de passe. Le nom d'utilisateur reste le vôtre.

**d. Vérifier.** Rechargez la page du dépôt : les fichiers doivent y être, et
la mention *Private* figurer à côté du nom. Vérifiez qu'il n'y a **pas** de
dossier `node_modules` — s'il apparaît, le `.gitignore` n'a pas été pris en
compte, arrêtez-vous et corrigez avant d'aller plus loin.

### Le travail au quotidien, ensuite

Trois commandes suffisent. Après chaque séance de modifications :

```bash
git status
```

Elle liste ce qui a changé. Puis :

```bash
git add .
git commit -m "Décrivez ce que vous avez changé"
git push
```

`git add .` prépare tous les fichiers modifiés, `git commit` enregistre une
version dans l'historique local, `git push` l'envoie sur GitHub. Tant que
vous n'avez pas poussé, le travail n'existe que sur votre disque.

Un message de commit utile dit **ce qui change**, pas « mise à jour » :
« Ajout de la démonstration Café Zitouna », « Correction des nombres inversés
en arabe ». C'est ce que vous lirez dans deux ans pour retrouver quand
quelque chose a été introduit.

### 2. Importer dans Vercel

Sur [vercel.com](https://vercel.com), connectez-vous avec GitHub, puis
**Add New → Project** et importez le dépôt. Next.js est détecté tout seul :
ne touchez à aucun réglage de build.

### 3. Variables d'environnement

Avant de cliquer sur Deploy, dépliez **Environment Variables** :

| Variable | Valeur | Obligatoire |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://maddev.dev` | oui |
| `RESEND_API_KEY` | votre clé Resend | pour recevoir les emails |
| `CONTACT_TO_EMAIL` | `maddev.dz@gmail.com` | non |
| `CONTACT_FROM_EMAIL` | `MADDEV <contact@maddev.dev>` | non |

Sans `RESEND_API_KEY`, le formulaire fonctionne mais les demandes ne partent
pas par email — elles restent dans les logs Vercel. **Deploy.**

### 4. Brancher maddev.dev

**Settings → Domains → Add**, saisissez `maddev.dev`. Vercel affiche les
enregistrements DNS à créer chez votre registrar :

| Type | Nom | Valeur |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

⚠️ Vercel affiche les valeurs exactes dans son écran — **recopiez les
siennes**, pas celles-ci : elles peuvent changer.

La propagation DNS prend de quelques minutes à 24 h. Le certificat HTTPS est
émis automatiquement une fois le domaine vérifié.

### 5. Après la mise en ligne

1. Vérifiez que `NEXT_PUBLIC_SITE_URL` vaut bien `https://maddev.dev` — c'est
   lui qui construit les URL du sitemap et de l'Open Graph. Si vous le
   changez, **redéployez** : la valeur est figée à la construction.
2. Testez l'aperçu du lien en vous envoyant `https://maddev.dev/ar` sur
   WhatsApp. L'image doit apparaître. Si elle ne sort pas du premier coup,
   passez le lien dans le
   [debugger Facebook](https://developers.facebook.com/tools/debug/) pour
   vider le cache des robots.
3. Déclarez le site sur [Google Search Console](https://search.google.com/search-console)
   et soumettez `https://maddev.dev/sitemap.xml`.

### Configurer Resend

1. Créez un compte sur [resend.com](https://resend.com).
2. **Domains → Add Domain**, saisissez `maddev.dev` et ajoutez les
   enregistrements DNS indiqués (SPF et DKIM) chez votre registrar.
3. Une fois le domaine vérifié, **API Keys → Create**, copiez la clé dans
   `RESEND_API_KEY` sur Vercel, puis redéployez.

Tant que le domaine n'est pas vérifié chez Resend, laissez
`CONTACT_FROM_EMAIL` vide : le code retombe sur l'expéditeur de test de
Resend, qui fonctionne sans vérification.

---

## Structure

```
app/
├─ [locale]/                 # toutes les pages, par langue
│  ├─ layout.tsx             # <html lang dir>, polices, header, footer
│  ├─ page.tsx               # accueil
│  ├─ services/              # page la plus détaillée
│  ├─ realisations/
│  ├─ process/
│  ├─ contact/
│  └─ quiz/                  # configurateur « Trouvez votre solution »
├─ api/contact/route.ts      # réception du formulaire
├─ globals.css · fonts.ts · icon.svg · sitemap.ts · robots.ts
├─ demo/menu/[locale]/       # démonstration « Café Zitouna », hors du site
components/
├─ brand/                    # DDMark, Logo, DDPattern
├─ layout/                   # Header, Footer, LangToggle
├─ ui/                       # Button, Section, Reveal, Badge, Numerals…
├─ ui/Visuals.tsx            # visuels projets et services
├─ demo/                     # DemoBanner (bande obligatoire), DemoCard
├─ quiz/                     # configurateur
├─ home/ · services/ · work/ · process/ · contact/
content/                     # ← le contenu éditable
├─ demos/                    # ← contenu des démonstrations
lib/configurator.ts          # ← questions + logique du quiz
lib/qr.ts                    # génération des QR codes, côté serveur
i18n/ · messages/ · public/
```

### Les démonstrations

Elles vivent **hors** de `app/[locale]/` : elles rendent leur propre `<html>`
et n'héritent donc ni de l'en-tête, ni du pied de page, ni des polices du
studio. Chacune a son identité complète, définie dans son propre fichier CSS.

Trois règles qui ne se négocient pas :

1. **La bande d'avertissement** (`components/demo/DemoBanner.tsx`) figure en
   haut de chaque page de démonstration, dans les deux langues. C'est elle
   qui distingue une démonstration d'une fausse référence client.
2. **`noindex`** dans les métadonnées de chaque démo : un projet fictif
   indexé par Google finirait par être pris pour un vrai.
3. **Aucun jeton de la charte MADDEV** dans une démo. Les couleurs et les
   polices appartiennent au propriétaire fictif du site.

Le middleware complète l'adresse courte : `/demo/menu` redirige vers la
langue du visiteur. C'est cette forme, sans langue, qu'il faut communiquer
et encoder dans un QR code.

## Animations

Toutes les animations n'utilisent que `transform` et `opacity` — les deux
seules propriétés que le navigateur anime sans recalculer la mise en page.
Une seule courbe et une seule durée pour tout le site : `--ease` et
`--duration` dans `globals.css`, `EASE` et `DURATION` dans `lib/motion.ts`.
Les deux doivent rester identiques.

⚠️ **Le contenu visible au chargement ne s'anime jamais.** Un bloc rendu par
le serveur avec `opacity: 0` reste invisible jusqu'à l'hydratation ; quand ce
bloc est dans le premier écran, c'est lui que le navigateur retient comme
élément LCP, et le score s'effondre alors que la page était prête. Le
composant `Reveal` mesure donc chaque bloc après le montage et n'arme
l'animation que pour ceux situés sous la ligne de flottaison. Le hero et les
en-têtes de page ne sont pas animés du tout.

`prefers-reduced-motion` est respecté à deux niveaux : une règle globale dans
`globals.css` neutralise les animations CSS décoratives (anneaux, halo,
dégradés qui respirent), et les composants Framer Motion lisent
`useReducedMotion()` pour supprimer déplacements et délais.
