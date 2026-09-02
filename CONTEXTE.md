# MADDEV — contexte du projet

Ce fichier existe pour qu'une session repartant de zéro puisse reprendre le
projet sans rien perdre. Il décrit ce qui a été **décidé**, et pourquoi.
Le code dit *comment* ; ce fichier dit *pourquoi*.

---

## 1. Positionnement

**La promesse, en une phrase :** des sites qui rapportent des commandes.
En arabe : **مواقع تجلب الطلبات**

Ce n'est pas un slogan décoratif. Elle est reprise **mot pour mot** dans le
`<title>` de l'accueil, dans le `h1` de la page et sur l'image de partage.
Ces trois endroits doivent toujours dire la même chose : un visiteur qui lit
un titre sur Google puis un autre sur la page ne sait plus à qui il parle.

### La règle de fond : vendre le résultat, pas le catalogue

Le site dit ce que le client **obtient**, jamais ce qu'on **fabrique**.
Chaque titre de section répond à « qu'est-ce que j'y gagne ? », jamais à
« qu'est-ce que vous faites ? ».

| ❌ Catalogue | ✅ Résultat |
| --- | --- |
| Site vitrine | Vos clients vous trouvent |
| Boutique e-commerce | La commande arrive complète |
| Application web | Vous pilotez tout vous-même |
| Publicité | On amène les clients jusqu'à vous |
| Quatre façons de faire grandir votre activité | Ce que vous y gagnez |
| Ce qui nous rend différents | Ce que vous n'aurez pas ailleurs |

Techniquement, deux champs dans `content/services.ts` :

- `benefit` — le titre affiché au client (le gain) ;
- `name` — l'étiquette courte, réservée à la navigation, au menu déroulant du
  formulaire, aux données structurées et au résultat du configurateur, là où
  il faut un nom et non une phrase.

Ne jamais afficher `name` comme titre de section.

### Ce qui nous distingue

Trois arguments, à rendre explicites et non devinables :

1. **Aucun template.** Chaque site est dessiné pour la marque du client.
2. **Vous validez avant qu'on code.** La maquette d'abord, aucune ligne de
   code avant accord.
3. **Une propriété, pas un abonnement.** Code, domaine et accès transférés au
   nom du client à la livraison.

---

## 2. Ton d'écriture

### Français

Une idée par phrase. Le concret bat l'adjectif.

- ❌ « une expérience utilisateur optimale »
- ✅ « votre client trouve le produit en deux clics »

**Bannis du site entier :** solutions digitales · innovant · sur-mesure
premium · excellence · passionné · transformer votre business · à l'ère du
digital · notre équipe d'experts · clé en main.

Bannis aussi : *équipe passionnée*, *depuis des années*, et tout superlatif
non mesurable.

### Arabe

**Arabe algérien parlé, sur toutes les pages sans exception.** Un site à deux
registres selon la page paraît assemblé, pas conçu.

On écrit `شنو`, `واش`, `علاش`, `كيفاش`, `إمتى`, `شحال`, `كلش`,
`راك`, `اللي`, `ما ...ش`, `تيليفون`, `بلاش`, `غدوة`, `إيه`,
`نبداو`, `نقدرو`, `بزاف`, `شوية`.

On évite l'arabe littéraire : `ماذا`, `لماذا`, `كيف`, `متى`, `الذي`,
`التي`, `ليس`, `سوف`, `إنّ`, `لديك`, `نعم`, et les tournures
ornementées.

**État : conforme.** Vérifié page par page sur les huit pages arabes — zéro
marqueur littéraire. Le contrôle se refait en une commande (voir §8).

> **Historique de cette règle.** Elle a changé trois fois : parlé, puis
> standard, puis parlé de nouveau — l'accueil et la page Services servant de
> référence. C'est la version en vigueur. Ne pas rouvrir le débat sans
> décision explicite : chaque bascule coûte une soixantaine de remplacements.
>
> Note de vocabulaire : le registre est de l'**arabe algérien parlé**
> (darija), même si les échanges l'ont parfois appelé « arabe standard ». Le
> site est en darija ; c'est cette réalité que décrit ce fichier.

### Ce qui ne doit jamais apparaître

- **Aucun prix.** Ni fourchette, ni « à partir de », ni ordre de grandeur.
- **Aucun argument bilingue.**
- Aucune donnée inventée : pas de client fictif, de témoignage, de
  statistique non mesurée, de logo de partenaire, de chiffre de performance
  non constaté.

---

## 3. Identité visuelle

### Couleurs — `tailwind.config.ts`

| Token | Valeur | Usage |
| --- | --- | --- |
| `ink` | `#0e0f14` | Fond principal |
| `ink2` | `#14161c` | Sections alternées |
| `ink3` | `#1c1f28` | Cartes |
| `line` | `rgba(255,255,255,.08)` | Bordures |
| `line2` | `rgba(255,255,255,.14)` | Bordures accentuées |
| `coral` | `#ff5a5f` | Accent principal |
| `coral2` | `#ff8a5f` | Accent secondaire |
| `txt` | `#f4f2ef` | Texte principal |
| `txt2` | `#a8a4ad` | Texte secondaire |
| `bg-brand` | `linear-gradient(120deg,#ff5a5f,#ff8a5f)` | Dégradé signature |

**Il n'y a volontairement pas de troisième niveau de gris.** Un ancien token
`txt3` (`#6a6874`) donnait 3,5:1 sur `ink`, sous le seuil AA de 4,5:1. Il a
été **retiré de la palette** plutôt que documenté comme « à éviter » : un
token qui existe finit toujours par être utilisé. Tout texte s'écrit en
`txt2` (7,9:1) ou `txt` (17:1) ; la hiérarchie passe par la taille et la
graisse, jamais par le contraste.

### Typographies

| Écriture | Titres | Corps |
| --- | --- | --- |
| Latin | Space Grotesk (500, 700) | Outfit (400–700) |
| Arabe | Cairo (700, 900) | Tajawal (400–800) |

Les quatre familles sont montées en variables CSS sur `<html>` ;
`app/globals.css` choisit la paire selon `html[lang]`. Aucun composant n'a
connaissance de la langue.

### Logo

Le symbole est **deux « D » qui se chevauchent** en dégradé corail. Source
unique : `components/brand/DDMark.tsx`. Le filigrane (`DDPattern.tsx`), le
favicon (`app/icon.svg`) et les icônes d'application reprennent les mêmes
tracés — les mettre à jour **ensemble**.

- Le mot-symbole « MADDEV » est rendu en **HTML**, pas dans le SVG, pour
  garantir la police du site.
- Le conteneur du lockup porte **`dir="ltr"`**, toujours. Voir §6.
- Fond sombre : version couleur. Fond clair : `maddev-logo-light.svg`.

> Les fichiers du pack de marque n'ont jamais été fournis. Le symbole actuel
> a été **reconstruit** d'après la charte, et les icônes générées depuis lui.

---

## 4. Structure du site

Huit pages, servies en arabe et en français sous un préfixe de langue
(`/ar/...`, `/fr/...`). L'arabe est la langue par défaut.

| Route | Contenu | État |
| --- | --- | --- |
| `/` | Hero, réassurance, 4 services, réalisation vedette, 3 piliers, FAQ, CTA | terminé |
| `/services` | 4 blocs détaillés, formules récurrentes, CTA | terminé |
| `/realisations` | 1 projet réel | capture manquante |
| `/process` | 5 étapes, timeline verticale | terminé |
| `/a-propos` | Qui je suis, pourquoi MADDEV, comment je travaille | photo manquante |
| `/site-ou-facebook` | Comparatif 6 critères + « quand Facebook suffit » | terminé |
| `/contact` | Formulaire, coordonnées, FAQ | terminé |
| `/quiz` | Configurateur 4 questions + résultat | terminé |

Plus : `sitemap.xml` (16 URL avec hreflang), `robots.txt`,
`manifest.webmanifest`, image Open Graph 1200×630 générée à la volée, 404 et
écran d'erreur bilingues.

### Où vit le contenu

| Fichier | Contient |
| --- | --- |
| `content/services.ts` | Les 4 services : `benefit`, `name`, promesse, description, livrables, cible, résultat, délai |
| `content/projects.ts` | Réalisations : titre, type, résultat, chiffres **mesurés**, lien |
| `content/process.ts` | Les 5 étapes |
| `content/about.ts` | Page « qui sommes-nous », photo, identité facultative |
| `content/faq.ts` | Les 7 objections réelles |
| `content/comparison.ts` | Comparatif Facebook + bloc « quand Facebook suffit » |
| `content/site.ts` | **Coordonnées** : WhatsApp, email, URL |
| `lib/configurator.ts` | Questions du quiz + règle de recommandation |
| `messages/{ar,fr}.json` | Chrome d'interface, navigation, métadonnées SEO |

Le texte bilingue vit **en place** dans `content/`, sous la forme
`{ fr: '…', ar: '…' }`. Seul le chrome d'interface est dans `messages/`.

### Coordonnées réelles

    WhatsApp   213551584581   (affiché : +213 551 58 45 81)
    Email      maddev.dz@gmail.com
    Domaine    https://maddev.dev

---

## 5. Décisions et leur raison

### Aucun prix n'est affiché

Annoncer une fourchette avant d'avoir compris le périmètre revient soit à
s'engager sur un montant qu'on ne tiendra pas, soit à faire fuir un prospect
que le projet aurait intéressé. Une grille tarifaire inventée a existé dans
`lib/configurator.ts` ; elle a été **supprimée**.

La question budget du configurateur qualifie sans chiffrer : la tranche
déclarée part **dans le message qui nous est adressé** (via l'URL
`/contact?service=…&budget=…` ou la charge utile du lead) et n'est **jamais**
réaffichée au visiteur. L'écran de résultat promet une réponse chiffrée sous
24 h, produite par un humain.

### Une seule réalisation, réelle

Trois projets figuraient sur le site : deux ont été supprimés parce que l'un
n'avait pas été livré et l'autre était interne. Les présenter comme des
réalisations clients était un mensonge que la première question précise d'un
prospect aurait défait.

Il reste **un** projet vérifiable : un showroom de meubles à Bordj Bou
Arréridj, en ligne, avec ses chiffres mesurés (67 pages, Lighthouse 94–99).
Le nom du client n'est pas publié.

**Aucun mockup dessiné.** Les six reconstitutions d'interface en CSS — avec
faux prix « 24 500 DA » et fausses statistiques — ont été supprimées. Une
agence qui dessine de faux écrans se trahit immédiatement. Tant qu'une
capture réelle n'existe pas, on affiche un cadre navigateur neutre portant
l'URL réelle du projet, ou un visuel de marque.

### Le bilinguisme n'est jamais un argument

C'est le minimum, pas un avantage. En faire un argument nous rabaisse. Le
visiteur constate la version arabe en un clic ; il n'a pas besoin qu'on la
lui vende.

Treize mentions commerciales ont été supprimées : sous-titre du hero,
mini-statistique « AR · FR », point de réassurance « Bilingue natif », pilier
« Le bilingue, c'est notre métier », livrables de trois services, page
Méthode, statistique du projet, FAQ, page « qui sommes-nous », page Contact,
image de partage.

Les clés JSON ont été renommées en conséquence (`bilingual` → `response`,
`ownership`, `validation`) : une clé nommée `bilingual` contenant « Le site
est à vous » piège le prochain éditeur.

Le code technique du RTL (`dir`, type `Bilingual`, miroirs de flèches) n'est
pas concerné.

### Aucune donnée personnelle inventée

La page « qui sommes-nous » ne contient ni nom, ni ville, ni diplôme, ni
nombre d'années. Tout y est soit vérifiable, soit un engagement tenu. Les
champs `about.identity.name` et `about.photo` sont volontairement vides et
disparaissent de l'affichage tant qu'ils ne sont pas renseignés.

### Répéter une idée n'est pas toujours une faute

Deux règles distinctes, à ne pas confondre :

**Dans un même bloc argumentaire, on ne répète pas.** Le pilier « Pas de
jargon, pas de surprise » disait « un délai annoncé » alors que la
statistique du hero annonce déjà « 24 h » et que la barre de réassurance dit
« délais annoncés et tenus » ; il disait aussi « un interlocuteur unique »
quand « Contact direct » dit déjà « vous parlez au développeur ». Il a été
recentré sur le prix, seul angle que rien d'autre n'aborde.

**Entre une affirmation et une réponse à objection, on répète volontairement.**
La FAQ de l'accueil reprend « le site m'appartient » et « vous validez la
maquette », déjà posés plus haut. Ce n'est pas une redite : l'idée est
d'abord affirmée comme promesse, puis reprise quand le visiteur la met en
doute. Ce sont deux moments différents dans sa tête. **À conserver.**

### Sécurité du formulaire

Quatre couches, toutes côté serveur : champ piège invisible, rejet des envois
en moins de 3 s, limitation à 3 requêtes par IP sur 10 minutes, validation
stricte (longueurs, format email ou téléphone, caractères de contrôle
retirés, slugs vérifiés).

⚠️ Le compteur de débit vit **en mémoire**. Sur Vercel, chaque instance a le
sien et il repart à zéro après mise en veille. C'est un garde-fou contre les
envois répétés, pas contre une attaque distribuée. Vercel KV corrigerait cela
en une vingtaine de lignes.

---

## 6. Pièges déjà rencontrés

À lire avant de toucher au RTL, aux polices ou aux visuels.

### Les nombres s'inversent en RTL

Chiffres, prix, numéros de téléphone et emails s'écrivent en latin **même en
arabe**. Sans précaution, l'ordre s'inverse à l'affichage. La classe
`.numerals` (`direction: ltr; unicode-bidi: isolate`) ou un `dir="ltr"` local
règle le problème. Toujours l'appliquer aux valeurs numériques.

### Le logo se retourne en RTL

En arabe, le **bloc** logo doit passer à droite — le flux du header s'en
charge — mais son **contenu** ne doit pas se retourner : le symbole reste
avant le mot. Sans `dir="ltr"` sur le conteneur, le symbole passait à droite
du mot. Un lockup ne se retourne jamais.

### Le motif DD écrase tout

Le filigrane répété paraît discret en maquette et devient dominant à l'usage.
Testé à 2,8 % : il concurrençait le texte. Ramené à 1 % : encore lu comme une
suite de logos, pas comme une texture. Sur les visuels aérés (couverture,
photo de profil) il a été **remplacé par un symbole unique très effacé**, ou
retiré. Sur le site, il ne fonctionne que derrière du contenu dense, à
0,014–0,022 d'opacité.

### `AnimatePresence` peut bloquer l'affichage

Le configurateur utilisait `AnimatePresence mode="wait"` : le compteur
avançait mais la question affichée restait figée, l'animation de sortie ne se
terminant jamais et le mode `wait` ne montant l'élément suivant qu'après.
Remplacé par un remontage franc sur changement de clé. **Ne pas rétablir.**

### Les polices Google expirent en développement

`next/font` applique un délai de 3 secondes **codé en dur, uniquement en
dev** (`fetch-css-from-google-fonts.js`). Sur une connexion lente, le
téléchargement échoue et le site s'affiche en police système.

Le bon réflexe : **relancer sans rien vider**. Vider `.next` supprime les
polices déjà téléchargées et force un nouveau tirage — c'est
contre-productif. En production, ce délai n'existe pas.

### Ne pas builder pendant que le dev tourne

`npm run build` écrase `.next` et casse le serveur de développement en cours
(« Cannot find module './vendor-chunks/…' »). Arrêter le dev avant de builder.

### `openGraph` remplace, il ne complète pas

Une page qui déclare son propre objet `openGraph` **écrase** celui hérité,
image comprise. Sept pages sur neuf partaient sans visuel sur WhatsApp. Tout
passe désormais par le helper `lib/metadata.ts` — ne pas écrire d'objet
`openGraph` en dur dans une page.

### L'arabe et l'image Open Graph

Le moteur de `next/og` (satori) ne sait pas façonner l'écriture arabe : il
échoue sur les substitutions contextuelles GSUB. Testé avec la police par
défaut puis avec Amiri — dans les deux cas l'image arabe n'était pas générée
du tout. La carte de partage est donc en écriture latine pour les deux
langues. Une version arabe demandera une image fixe préparée dans un outil
graphique.

### Le LCP est retardé par nos propres animations

Chaque élément LCP mesuré est un bloc de texte, livré avec
`style="opacity:0"` et animé par Framer Motion après hydratation. Load Time
et Load Delay sont à 0 ; **le Render Delay représente 80 à 87 % du LCP**
(2 300 à 3 000 ms). Vingt-six éléments sont livrés invisibles sur l'accueil.

### PowerShell et les crochets

`Test-Path "app\[locale]\..."` interprète les crochets comme des jokers et
retourne `False` sur un dossier existant. Utiliser `-LiteralPath`, ou bash.

### `grep -P` et la locale

`grep -P` échoue ici (« supports only unibyte and UTF-8 locales »). Pour
chercher de l'arabe ou compter des motifs Unicode, passer par Node.

---

## 7. Ce qui reste à faire, par priorité

### 1. Point 3 — rendre les trois différenciateurs explicites

Deux des trois sont **absents du site** :

| Différenciateur | État |
| --- | --- |
| Aucun template | **absent** — n'apparaît nulle part |
| Vous validez avant qu'on code | présent — pilier de l'accueil, page Méthode, FAQ |
| Une propriété, pas un abonnement | l'idée est là (« Le site est à vous ») mais **pas cette formulation** |

Avant d'ajouter un bloc dédié, vérifier les recoupements : « vous validez »
et « le site est à vous » sont déjà sur l'accueil. Le pilier « clarté » a
d'ailleurs dû être recentré sur le prix parce qu'il répétait le délai (déjà
dans la statistique 24 h et dans « Livraison rapide ») et l'interlocuteur
unique (déjà dans « Contact direct »).

### 2. Point 4 — réassurance sous le formulaire de contact

**Absent.** À ajouter sous le formulaire, sobrement, sans badge :

> Réponse sous 24 h · Un mois de corrections après livraison · Vous restez
> propriétaire de vos photos, textes et marque

### 3. Point 5 — le ton

- **Arabe : terminé.** Registre parlé uniforme sur les huit pages.
- **Français : audit passé.** Zéro occurrence des neuf termes bannis.
  Seul « sur mesure » subsiste, trois fois dans `content/services.ts`
  (service Application web). Ce n'est pas « sur-mesure premium », qui est le
  terme banni — à trancher : le garder ou le remplacer par une formulation
  concrète.

### 4. Assets manquants

| Quoi | Où le déposer |
| --- | --- |
| Pack de marque (favicons, lockup SVG couleur et blanc) | `public/logo/` |
| Icônes d'application 180 / 192 / 512 / maskable | `app/apple-icon.png`, `public/icons/` |
| Capture du projet | `public/projects/showroom-meubles-bba.png` puis renseigner `image` |
| Photo du fondateur | `public/about/` puis renseigner `about.photo` |

Les icônes actuelles ont été générées depuis le symbole reconstruit : elles
fonctionnent, mais doivent être remplacées par celles du pack.

### 5. Performance mobile

Six scores sur huit sont sous 95 (86 à 97 selon la page). Cause identifiée et
unique : les animations d'entrée (§6). Le correctif consiste à ne plus animer
le contenu visible au chargement — hero et en-têtes de page — et à réserver
`Reveal` à ce qui apparaît au défilement. Gain attendu : LCP autour de
0,6–0,9 s, score 95 à 100. Coût : le hero perd son apparition orchestrée.
**Arbitrage non tranché.**

Desktop est à 100 / 100 / 100 / 100 partout.

### 6. Avant publication

- `RESEND_API_KEY` dans les variables Vercel — sans elle, le formulaire
  fonctionne mais les demandes restent dans les logs.
- Relecture du contenu arabe par un locuteur natif : tout l'arabe du site a
  été écrit sans relecture humaine, et il est maintenant en darija — un
  registre où les maladresses se voient davantage.
- Test réel de l'ajout à l'écran d'accueil sur iOS et Android.
- Brancher `maddev.dev` (procédure détaillée dans le README).

---

## 8. Vérifications en place

Ce qui a été mesuré et doit le rester :

- **Build** : 0 erreur, 0 warning.
- **Accessibilité** : 100 sur toutes les pages, dans les deux langues, mobile
  et desktop. Zéro échec de contraste WCAG AA.
- **Zones tactiles** : aucune sous 44 px (elles étaient 208 avant correction).
- **Mobile 390 px** : aucun scroll horizontal sur les 16 pages.
- **RTL** : aucune propriété physique non appariée ; les seules restantes
  (`translate-x`, `origin-left`) ont toutes leur variante `rtl:`.
- **Langues** : aucune fuite de français sur les pages arabes et
  réciproquement, hormis le « ع » du sélecteur de langue.
- **Chaînes interdites** : zéro *lorem*, *TODO*, *24 500*, *Super Meuble*,
  *Rusicade*.

Commandes :

    npm run dev        # ne pas vider .next au préalable
    npm run build      # arrêter le dev avant
    npm run typecheck

---

## 9. Journal des décisions

Les tournants du projet, pour comprendre pourquoi le site est dans cet état.

| Décision | Effet |
| --- | --- |
| Suppression des prix | Grille tarifaire inventée retirée ; la question budget qualifie sans chiffrer |
| Deux projets sur trois supprimés | Non livré et interne — il ne reste qu'une réalisation vérifiable |
| Suppression des mockups CSS | Six faux écrans avec faux prix et fausses statistiques retirés |
| Le bilinguisme cesse d'être un argument | 13 mentions commerciales supprimées, 3 clés JSON renommées |
| Titres réécrits en bénéfice | Champ `benefit` ajouté ; `name` réservé aux usages techniques |
| Titres de page alignés sur la promesse | 5 `<title>` sur 8 réécrits ; `h1` et `<title>` de l'accueil identiques |
| Registre arabe unifié en parlé | ~110 remplacements sur 6 fichiers, les 8 pages vérifiées |
| Token `txt3` retiré | Échouait le contraste AA ; la hiérarchie passe par taille et graisse |
| `dir="ltr"` sur le lockup | Le contenu du logo ne se retourne plus en arabe |
| Helper `lib/metadata.ts` | 7 pages sur 9 partaient sans image de partage |
