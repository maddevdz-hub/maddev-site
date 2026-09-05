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

**Arabe standard moderne, partout.** Décidé en septembre 2026, après trois
bascules. Une seule exception prévue : l'invitation de mariage (`/demo/mariage`),
où le registre littéraire est celui du genre.

On écrit `ماذا`, `لماذا`, `كيف`, `متى`, `الذي`, `التي`, `يمكنك`, `تُقدَّم` ;
on évite le parlé algérien : `شنو`, `واش`, `علاش`, `كيفاش`, `إمتى`, `شحال`,
`كلش`, `راك`, `اللي`, `ما ...ش`, `بزاف`, `دروك`, `بصح`.

> ⚠️ **La règle et l'état du code divergent aujourd'hui. Lire ceci avant de
> toucher à une chaîne arabe.**
>
> | | Registre | |
> | --- | --- | --- |
> | Les 8 pages du site (`content/`, `messages/ar.json`) | **darija** | conversion à faire — voir §7 |
> | La démo `/demo/menu` (`content/demos/menu.ts`) | **standard** | conforme |
> | `/demo/mariage` | littéraire | à construire |
>
> Le site a été écrit en darija sur consigne, puis la règle a été inversée
> alors que la conversion du site était explicitement remise à plus tard. Ce
> n'est donc pas une incohérence oubliée : c'est un chantier ouvert, listé
> dans §7. Tant qu'il n'est pas fait, un visiteur qui passe de `/ar/services`
> à `/demo/menu/ar` change de registre.

> **Historique.** La règle a changé quatre fois : parlé → standard → parlé →
> standard. Chaque bascule coûte une soixantaine de remplacements sur six
> fichiers. **Ne pas la rouvrir sans décision écrite**, et si elle est
> rouverte, convertir d'un bloc plutôt que page par page — c'est le mélange
> des registres qui fait paraître un site assemblé, pas le registre choisi.

### Contrôle du registre

    node -e "const fs=require('fs');const d=['شنو','واش','علاش','كيفاش','إمتى','شحال','كلش','اللي','بزاف','دروك'];for(const f of ['content/demos/menu.ts']){fs.readFileSync(f,'utf8').split('
').forEach((l,i)=>{const h=d.filter(m=>l.includes(m));if(h.length)console.log(f+':'+(i+1)+' '+h)})}"

Attention aux faux positifs : `بوراك` contient `راك`, `التيليفون` contient
`التي`, `إمتى` contient `متى`.

### Ce qui ne doit jamais apparaître

- **Aucun prix.** Ni fourchette, ni « à partir de », ni ordre de grandeur.
- **Aucun argument bilingue.**
- Aucune donnée inventée : pas de client fictif, de témoignage, de
  statistique non mesurée, de logo de partenaire, de chiffre de performance
  non constaté.

  **Amendement (septembre 2026).** Les démonstrations font exception, sous
  une condition qui ne se négocie pas : elles portent en permanence la bande
  qui les identifie comme fictives (voir §10). Un projet fictif *signalé*
  n'est pas une fausse référence ; c'est un échantillon. Sans la bande, la
  règle initiale s'applique de nouveau et la page doit être retirée.

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
| `/demo/menu` | Démonstration Café Zitouna (hors chrome MADDEV) | terminée |
| `/demo/rendezvous` | Démonstration Cabinet dentaire Amel | terminée |

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

État au 4 septembre 2026. Ce qui figurait ici et n'y est plus a été fait :
les trois différenciateurs sont explicites (« Aucun template » ouvre la page
Services), la réassurance est sous le formulaire de contact, l'audit du ton
français est passé, et la performance mobile a été corrigée à la racine —
plus aucun élément n'est livré invisible (voir §6 et §8).

### 1. Les six démonstrations restantes

Une seule à la fois, terminée et montrée avant de passer à la suivante :
sept chantiers ouverts donnent sept moitiés de travail. Le tableau des sept,
avec ce que chacune doit prouver, est en §9.

Après chaque démo : captures desktop et mobile dans les deux langues, liste
des photos à fournir, mise à jour de ce fichier.

### 2. Convertir l'arabe du site en standard moderne

Les huit pages sont en darija ; la règle en vigueur est le standard (§2).
Environ 110 chaînes dans `content/*.ts` et `messages/ar.json`. À faire d'un
bloc, jamais page par page — c'est le mélange qui se voit.

Le travail a déjà été fait une fois dans l'autre sens : les remplacements
sont mécaniques, mais la relecture ne l'est pas.

### 3. Refaire la page `/services`

Chaque service devient un bloc large et visuel : capture réelle de sa
démonstration cadrée dans un mockup, le bénéfice en titre, deux lignes
maximum, trois points concrets, un bouton « Voir la démonstration ». Les
blocs alternent visuellement.

**Des captures optimisées, jamais d'iframe ni de démo intégrée en direct** —
la page doit rester sous 2 s. Elle attend donc que les démos existent : la
faire maintenant obligerait à la refaire.

### 4. Étendre l'offre

Ajouter aux services et aux options du configurateur : QR Menu, prise de
rendez-vous, invitation. Touche `content/services.ts`, `lib/configurator.ts`
et les deux dictionnaires. À faire **une fois**, quand les démos existent.

### 5. Captures des démos pour la galerie

`/realisations` affiche aujourd'hui, pour chaque démo, une vignette aux
couleurs de la démo et son nom — honnête, mais ce n'est pas une capture. Les
prendre toutes en une passe une fois les sept prêtes : sept fichiers pris au
même moment se tiennent, sept fichiers pris au fil de l'eau non.

### 6. Assets manquants

| Quoi | Où le déposer |
| --- | --- |
| Pack de marque (favicons, lockup SVG couleur et blanc) | `public/logo/` |
| Capture du projet client | `public/projects/showroom-meubles-bba.png` puis renseigner `image` |
| Photo du fondateur | `public/about/` puis renseigner `about.photo` |
| Photos des démonstrations | `public/demo/<démo>/` — listes fournies démo par démo |

Les icônes d'application sont en place et correctes (les 192 px et
apple-touch étaient recadrées sur un fragment, régénérées depuis la 512).

### 7. Avant publication

- **Pousser sur GitHub.** Le dépôt local existe, les commits sont faits, mais
  le projet ne vit encore que sur un disque dur. Procédure pas à pas dans le
  README, section « Mettre le code sur GitHub ».
- `RESEND_API_KEY` dans les variables Vercel — sans elle, le formulaire
  fonctionne mais les demandes restent dans les logs.
- Relecture de tout l'arabe par un locuteur natif, après la conversion en
  standard : il a été écrit sans relecture humaine.
- Test réel de l'ajout à l'écran d'accueil sur iOS et Android.
- Brancher `maddev.dev` (procédure dans le README).

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
  *Rusicade*, et aucune mention de *Next.js* côté visiteur.
- **Contenu livré visible** : zéro élément rendu par le serveur en
  `opacity: 0` sur les 16 pages. C'était la cause unique du LCP dégradé.

      for p in "" services realisations process a-propos site-ou-facebook contact quiz; do
        curl -s "http://localhost:3000/fr/$p" | grep -c 'opacity:0'
      done

- **Nombres en RTL** : les tranches de budget du configurateur et les
  horaires sont isolés (`components/ui/Numerals.tsx`). Vérification par
  l'ordre **visuel** — position X des nœuds de texte — et non par l'ordre du
  DOM, qui est toujours correct et ne prouve rien.
- **Démonstrations** : `noindex` sur chacune, absentes du `sitemap.xml`,
  bande d'avertissement présente dans les deux langues.

Commandes :

    npm run dev        # ne pas vider .next au préalable
    npm run build      # arrêter le dev avant
    npm run typecheck

---

## 9. Les démonstrations

Le studio n'a **qu'une seule réalisation cliente réelle**. Les démonstrations
comblent cet écart : des projets fictifs, complets et utilisables, qui
montrent le résultat métier par métier. Elles remplacent les maquettes
gratuites qu'on offrait auparavant pour décrocher un client.

### La bande, condition de tout le reste

Chaque page de démonstration porte, en haut, avant tout autre contenu :

    FR   Démonstration — projet fictif conçu par MADDEV
    AR   نموذج توضيحي — مشروع افتراضي من تصميم MADDEV

Source unique : `components/demo/DemoBanner.tsx`. Elle ne se retire pas, ne
se réduit pas à une icône, ne disparaît pas au défilement. C'est elle qui
distingue une démonstration d'une fausse référence — et c'est cette franchise
qui rend croyable le seul vrai client.

### Trois règles techniques

1. **Hors de `app/[locale]/`.** Une démo rend son propre `<html>` : elle
   n'hérite ni de l'en-tête, ni du pied de page, ni des polices du studio.
   Le visiteur doit voir le site d'un café, pas une page MADDEV déguisée.
2. **`noindex, nofollow`** dans ses métadonnées, et absence du `sitemap.xml`
   (qui se construit depuis `routes`, où les démos ne figurent pas). Un
   projet fictif indexé finirait par être pris pour un vrai.
3. **Aucun jeton de la charte MADDEV.** Couleurs, polices et rayons vivent
   dans le CSS local de la démo et ne migrent jamais vers `tailwind.config`.

### Le registre arabe des démos

Standard moderne, comme le reste — voir §2, qui porte la règle et l'état
réel du code. L'invitation de mariage fait exception : littéraire.

### Routage

    /demo/menu          → redirige vers la langue du visiteur (middleware)
    /demo/menu/fr|ar    → la démo
    /demo/menu/fr/affiche → l'affiche du QR, imprimable

L'adresse **courte**, sans langue, est la seule à communiquer : c'est elle
qu'encode le QR code, et elle survit à un changement de langue par défaut.

### Ce qu'une démonstration doit prouver

Pas décrire : **prouver**. Le visiteur ouvre la démo et s'en sert. Les
filtres filtrent, la recherche cherche, le calendrier refuse les créneaux
pris, le panier calcule, le formulaire valide et confirme. Données locales,
aucune base — mais comportement complet. Une démo dont les boutons ne font
rien dessert plus qu'elle ne sert.

Deux exigences de fond, également non négociables :

- **Identité propre à chaque démo.** Sept fois le même gabarit repeint se
  repère en trois secondes et prouve l'inverse de ce qu'on veut montrer. Une
  menuiserie d'art, une clinique et une agence immobilière n'ont ni les mêmes
  couleurs, ni la même typographie, ni la même densité.
- **Contenu crédible et local.** Vrais plats algériens, wilayas et quartiers
  réels, produits plausibles. Prix ronds et manifestement illustratifs.
  Jamais « Produit 1 », jamais « Lorem ».

Cible de qualité : le niveau d'un studio européen. C'est l'écart avec ce que
livre un prestataire local qui doit sauter aux yeux.

### État des sept démonstrations

| Démo | Route | Ce qu'elle doit prouver | État |
| --- | --- | --- | --- |
| Café Zitouna | `/demo/menu` | la carte change en 30 s, sans réimprimer | **terminée** |
| Atelier Nour — menuiserie d'art | `/demo/vitrine` | le visiteur a envie de commander une pièce | à faire |
| Zahra Cosmétiques | `/demo/boutique` | la commande arrive complète — produit, variante, quantité, wilaya — en un seul message WhatsApp | à faire |
| Cabinet dentaire Amel | `/demo/rendezvous` | le téléphone cesse de sonner. Le cœur n'est PAS la prise de rendez-vous : c'est le rappel WhatsApp la veille et l'annulation autonome | **terminée** |
| Dar Immo | `/demo/annonces` | recherche wilaya / budget / type / pièces, fiche avec galerie et plan, demande de visite. Le client trouve sans appeler quinze fois | à faire |
| Moncef & Lina | `/demo/mariage` | les invités confirment en un clic. **L'aperçu WhatsApp est vital** : des centaines de personnes le verront avant d'ouvrir. Registre littéraire | à faire |
| Sofa Prestige | `/demo/campagne` | où mène une campagne publicitaire et pourquoi la page convertit. Une page, un objectif | à faire |

### Ce qui existe pour la démo terminée

    app/demo/menu/[locale]/           layout (html, polices, CSS local), page, affiche
    components/demo/menu/             MenuBoard, OpenNow, ZitounaMark, PrintButton
    content/demos/menu.ts             22 plats, 5 catégories, textes d'interface
    lib/qr.ts                         QR en SVG, côté serveur, correction niveau Q

Identité : terre cuite `#b4532a` et crème `#fbf3e7`, Fraunces + Karla en
latin, Almarai en arabe — aucune de ces polices n'est utilisée ailleurs.
Fonctionnel : filtres cumulatifs (ET, pas OU), suivi de lecture des
catégories, appel du serveur avec confirmation honnêtement signalée comme
sans effet, indicateur d'ouverture calculé sur l'heure du visiteur.

### Les visuels : dessinés, pas photographiés

Décidé en septembre 2026 : **aucune photographie ne sera fournie**. Les
visuels des démonstrations sont produits en SVG et en CSS — compositions
typographiques, illustrations dessinées, motifs géométriques inspirés du
zellige, dégradés. Ce n'est pas un pis-aller : un site tenu sans photo vaut
mieux qu'un site aux images médiocres, et le dessin évite les néons et les
sourires de banque d'images.

Interdits : le rectangle gris avec une icône, l'émoji en guise
d'illustration, l'image de remplacement répétée, l'espace vide non traité.
**Chaque bloc visuel est une décision de design, jamais un emplacement en
attente.** Un champ image optionnel reste prévu partout : si de vraies photos
arrivent un jour, elles remplacent le visuel sans refonte.

Exception : `/demo/menu` recevra 22 photographies de plats, déjà listées.

### Ce qui existe pour la prise de rendez-vous

    app/demo/rendezvous/[locale]/     layout, CSS local, page
    components/demo/rendezvous/       BookingFlow, AmelMarks
    content/demos/rendezvous.ts       praticiens, motifs, horaires, textes

Identité : pétrole `#0d2b31`, menthe et blanc, angles nets — l'inverse du
café, qui est chaud et arrondi. Sora + Inter en latin, Readex Pro en arabe.
Zéro image bitmap : quatre SVG dessinés (arcade dentaire, motif zellige,
figure de planning, glyphes).

**Le mécanisme à ne pas casser.** Réserver un créneau l'ajoute à `booked` :
il apparaît alors « Pris » dans l'agenda. L'annuler l'en retire, et le
créneau redevient cliquable. Sans cette liste, on annulerait un créneau qui
n'a jamais cessé d'être libre — le bouton existerait, mais ne prouverait
rien. C'est le seul argument que cette démo doit faire passer.

Les créneaux occupés viennent d'une fonction déterministe (`slotTaken`) : le
même planning s'affiche à chaque visite. Un tirage aléatoire donnerait une
démonstration qu'on ne peut pas montrer deux fois de la même façon.

Le calendrier est calculé après le montage, jamais au rendu serveur — le
serveur ignore le fuseau du visiteur. D'où le squelette de même hauteur au
premier rendu, qui évite tout saut de mise en page.

### Les images des démos

Aucune photo n'est encore fournie. Chaque démo prévoit ses emplacements et
un état d'attente dessiné — **jamais un rectangle vide**. Pour le café :
`public/demo/menu/<slug>.jpg` (22 plats, carré 800 px) et
`cafe-interieur.jpg` (2000 × 1200). Il suffit de déposer le fichier et de
renseigner `image:` / `cover:` dans `content/demos/menu.ts` ; `next/image`
sert alors de l'AVIF ou du WebP, produit les tailles, diffère le chargement,
et la place est déjà réservée — décalage de mise en page nul.

La liste complète, avec les termes de recherche Unsplash ou Pexels, est
donnée démo par démo au moment de la livraison.

---

## 10. Journal des décisions

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
| Hero et en-têtes désanimés | 26 éléments livrés invisibles sur l'accueil, 0 aujourd'hui ; `Reveal` réécrit en CSS, Framer Motion retiré de la révélation au défilement ; ~35 kB de JS en moins par page |
| Next.js retiré de la vitrine | 3 mentions visiteur supprimées ; la statistique du hero devient « 0 template utilisé », qui est mesurable et sert le différenciateur |
| Démonstrations autorisées | La règle « aucun projet fictif » devient « aucun projet fictif **non identifié** » ; la bande d'avertissement est la contrepartie |
| Registre arabe : standard | Quatrième bascule. Les démos sont conformes, le site reste à convertir (§2, §7) |
| Projet sous git | Dépôt local, `.gitattributes` pour figer les fins de ligne en LF, `engines: node >=18.17`. Reste à pousser |
