# Photographies d'origine

Les fichiers **tels qu'ils ont été fournis**, avant tout recadrage. Ils sont
versionnés exprès : on doit pouvoir refaire un cadrage dans deux ans sans
redemander les images à qui que ce soit.

Rien ici n'est servi au navigateur. Ce qui est servi vit dans
`public/demo/menu/`, et ce dossier est **entièrement reconstruit** par :

```
npm run photos
```

Ne jamais déposer une image directement dans `public/demo/menu/` : le script
vide le dossier à chaque exécution.

## menu/ — Café Zitouna

| Fichier | État |
| --- | --- |
| `background.jpg` | **utilisée** — en-tête, floutée et voilée |
| `coffe.jpg` | **utilisée** — bandeau « Cafés et thés » |
| `qahwa-arbia.jpg` | bonne, en attente |
| `atay-nanaa.jpg` | bonne, en attente |
| `baklawa.jpg` | bonne, en attente |
| `qahwa-halib.webp` | **inutilisable** — filigrane iStock visible |
| `jus-orange.jpg` | **inutilisable** — gobelet de marque « ARABICA Coffee House », et ce n'est pas un jus pressé |
| `msemen.jpg` | **inutilisable** — ce sont des pide farcies, pas des msemen |

Les trois « en attente » ne sont pas affichées parce qu'elles ne couvrent
aucune catégorie entière : **une catégorie passe en photo d'un bloc, ou reste
dessinée d'un bloc.** Trois vignettes photo au milieu de dix-neuf dessins se
lisent comme un import inachevé, pas comme un choix.

Pour activer une catégorie : compléter ses photos ici, les ajouter à la liste
`PLATS` de `scripts/photos.mjs`, relancer `npm run photos`, puis renseigner
`image` sur chaque plat de la catégorie dans `content/demos/menu.ts`.
