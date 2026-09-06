/**
 * Les illustrations de la carte du Café Zitouna.
 *
 * Pourquoi elles existent : sur une carte de café, l'image du plat est ce
 * qui déclenche la commande. Une initiale dans un carré est le pire endroit
 * où économiser — personne ne commande un plat qu'il ne voit pas.
 *
 * Pourquoi elles sont dessinées : le café est fictif, il n'a pas de photos.
 * Un dessin assumé vaut mieux qu'une photo de banque d'images, qui se
 * reconnaît et fait mentir toute la page.
 *
 * ── Ce qui fait la famille ──────────────────────────────────────────────
 * Treize symboles pour vingt-deux plats. C'est délibéré : un plat sans
 * illustration propre reprend celle de sa catégorie, et plusieurs plats
 * partagent le même dessin dans une teinte différente (le tadjine zitoun
 * prend le vert olive, la chakhchoukha le rouge). Vingt-deux dessins
 * distincts pèseraient plus lourd et se ressembleraient moins.
 *
 * Les règles communes, qui font qu'on les lit comme une seule main :
 *   - même grille de 64 × 64, mêmes marges ;
 *   - aplats seulement, aucun dégradé — la palette du café et rien d'autre ;
 *   - la nourriture est vue de dessus, comme on la photographie ; les
 *     boissons sont vues d'un angle haut, sans quoi un verre se réduit à
 *     un rond ;
 *   - même niveau de détail : trois ou quatre formes, jamais plus.
 *
 * Elles sont en composants React et non en fichiers : elles se teintent avec
 * les jetons de la démo, restent nettes à toute densité, et ne déclenchent
 * aucune requête réseau — la carte s'ouvre en terrasse, sur un réseau lent.
 */

/** La palette du café. Aucune autre couleur n'entre ici. */
const C = {
  clay: '#b4532a',
  clayDeep: '#7c3115',
  cream: '#fbf3e7',
  cream2: '#f4e7d4',
  cream3: '#ecd9be',
  crust: '#e3bd85',
  crustLight: '#f0d6ac',
  olive: '#5c6b3f',
  oliveSoft: '#c9d5aa',
  gold: '#b07d18',
  goldLight: '#dda94c',
  white: '#ffffff',
};

export type DishArtName =
  | 'tasse'
  | 'tasse-mousse'
  | 'theiere'
  | 'verre-menthe'
  | 'verre-agrume'
  | 'verre-lait'
  | 'verre-avocat'
  | 'galette'
  | 'galette-miel'
  | 'pain'
  | 'bourek'
  | 'feuillete'
  | 'plat-rouge'
  | 'plat-olive'
  | 'plat-dore'
  | 'losange'
  | 'spirale';

export function DishArt({
  name,
  className,
}: {
  name: DishArtName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      shapeRendering="geometricPrecision"
    >
      {shapes(name)}
    </svg>
  );
}

function shapes(name: DishArtName) {
  switch (name) {
    /* ---------------------------------------------------------- boissons */

    case 'tasse':
      return <Tasse contenu={C.clayDeep} />;

    case 'tasse-mousse':
      return (
        <Tasse contenu={C.cream2}>
          {/* La feuille tracée dans la mousse : le seul détail du dessin. */}
          <path
            d="M32 25c4 3.4 6 6.6 6 9s-2 5.6-6 9c-4-3.4-6-6.6-6-9s2-5.6 6-9Z"
            fill={C.clay}
            opacity=".78"
          />
          <path d="M32 26v16" stroke={C.cream2} strokeWidth="1.3" strokeLinecap="round" />
        </Tasse>
      );

    /* La théière vue de dessus : bec, anse, couvercle. Un cercle nu ne dirait
       rien, ces trois appendices suffisent à la nommer. */
    case 'theiere':
      return (
        <>
          {/*
            Bec et anse tracés en croûte : en crème sur fond crème, ils
            disparaissaient et la théière se lisait comme une simple tasse.
          */}
          <path
            d="M15 28 2 24.5l1.5 10L15 37Z"
            fill={C.cream3}
            stroke={C.crust}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M48 22c9-2 14 3 14 10s-5 12-14 10"
            fill="none"
            stroke={C.crust}
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M48 22c9-2 14 3 14 10s-5 12-14 10"
            fill="none"
            stroke={C.cream3}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="19" fill={C.white} stroke={C.crust} strokeWidth="1.8" />
          <circle cx="32" cy="32" r="7.5" fill={C.cream3} stroke={C.crust} strokeWidth="1.4" />
          <circle cx="32" cy="32" r="2.8" fill={C.clay} />
        </>
      );

    case 'verre-menthe':
      return (
        <Verre liquide={C.oliveSoft}>
          {/* La feuille de menthe POSÉE sur le bord — détachée, elle flottait. */}
          <path
            d="M34 21.5c1.5-6 7-10 12.5-10.5.5 5.5-3 11-9 12.5-1.5.4-3 .2-3.5-2Z"
            fill={C.olive}
          />
          <path d="M35.5 22 45.5 12.5" stroke={C.white} strokeWidth="1.3" strokeLinecap="round" opacity=".5" />
        </Verre>
      );

    case 'verre-agrume':
      return (
        <Verre liquide="#e79438">
          {/* La tranche d'orange sur le bord — rayons compris. */}
          <g transform="translate(45 17)">
            <circle r="9.5" fill={C.goldLight} />
            <circle r="7.2" fill="#f4b25c" />
            <g stroke={C.cream} strokeWidth="1.1" strokeLinecap="round">
              <path d="M0-7.2V7.2M-7.2 0H7.2M-5.1-5.1l10.2 10.2M-5.1 5.1 5.1-5.1" />
            </g>
            <circle r="1.5" fill={C.cream} />
          </g>
        </Verre>
      );

    case 'verre-lait':
      // Le lait d'amande était en crème sur un verre crème sur fond crème :
      // il ne restait à l'écran que la paille. Teinte assombrie.
      return (
        <Verre liquide="#e6d0a8">
          <Paille />
        </Verre>
      );

    case 'verre-avocat':
      return (
        <Verre liquide="#b9c98c">
          <Paille />
        </Verre>
      );

    /* ------------------------------------------------------------ salé et
       petit-déjeuner : strictement vus de dessus. */

    case 'galette':
      return <Galette />;

    case 'galette-miel':
      return (
        <Galette>
          {/* Le miel étalé, puis la coulure qui passe le bord. */}
          <path
            d="M18 30c3-7 11-10 16-7.5s8 9 5.5 13.5-9 6-14.5 4-9-6-7-10Z"
            fill={C.goldLight}
          />
          <path d="M40 40c3.5 1.5 5 4.5 4 7.5s-5.5 3-6.5-.5 0-5.5 2.5-7Z" fill={C.goldLight} />
        </Galette>
      );

    /* La tartine : croûte, mie, et la confiture ÉTALÉE — un petit ovale
       sombre au milieu d'une tranche se lisait comme un caillou. */
    case 'pain':
      return (
        <>
          <path
            d="M11 27c0-9.5 9.5-15 21-15s21 5.5 21 15v20a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5Z"
            fill={C.crust}
          />
          <path
            d="M16 28c0-7 7-11.5 16-11.5S48 21 48 28v19H16Z"
            fill={C.crustLight}
          />
          <path
            d="M19 29c0-5.5 5.8-9.5 13-9.5S45 23.5 45 29v11.5c0 1.9-1.5 3.5-3.4 3.5H22.4c-1.9 0-3.4-1.6-3.4-3.5Z"
            fill={C.clay}
          />
          {/* Les grains de la confiture de figues. */}
          <circle cx="27" cy="30" r="1.5" fill={C.clayDeep} opacity=".55" />
          <circle cx="36" cy="33" r="1.5" fill={C.clayDeep} opacity=".55" />
          <circle cx="30" cy="38" r="1.3" fill={C.clayDeep} opacity=".55" />
        </>
      );

    /* Le rouleau de bourek, posé de biais : à plat il se lirait comme une
       barre, l'inclinaison suffit à en faire un objet. */
    case 'bourek':
      return (
        <g transform="rotate(-20 32 32)">
          <rect x="7" y="24" width="50" height="16" rx="8" fill={C.crust} />
          {/*
            Reflet suivant la courbe du rouleau. Un second rectangle posé sur
            le premier créait une arête droite : on lisait un domino.
          */}
          <path
            d="M13 28.5c5-2.5 33-2.5 38 0 2.5 1.2 2.5 3.6 0 4.8-5 2.5-33 2.5-38 0-2.5-1.2-2.5-3.6 0-4.8Z"
            fill={C.crustLight}
          />
          {/* Les tours de pliage : c'est ce qui dit « roulé ». */}
          <path
            d="M23 25.5 20 38.5M32 24.5 29 39.5M41 25.5 38 38.5"
            stroke={C.crust}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx="52" cy="32" rx="3.6" ry="7.6" fill={C.cream3} />
        </g>
      );

    /* Le feuilleté plié — m'hadjeb, karantika : une galette carrée pliée,
       vue de dessus, avec la farce qui affleure. */
    case 'feuillete':
      return (
        <g transform="rotate(8 32 32)">
          <rect x="12" y="12" width="40" height="40" rx="6" fill={C.crustLight} />
          {/* Le coin rabattu : sans lui, on lisait une carte, pas un pliage. */}
          <path d="M12 18a6 6 0 0 1 6-6h17L12 35Z" fill={C.crust} />
          <path d="M35 12 12 35" stroke={C.cream3} strokeWidth="1.6" strokeLinecap="round" />
          {/* La farce qui affleure au bord du pliage. */}
          <path
            d="M17 41c8 2.8 22 2.8 30 0"
            stroke={C.clay}
            strokeWidth="3.4"
            strokeLinecap="round"
            opacity=".7"
          />
        </g>
      );

    case 'plat-rouge':
      return <Plat sauce="#c0492c" garniture={C.cream2} />;

    case 'plat-olive':
      return <Plat sauce="#a8813a" garniture={C.olive} />;

    case 'plat-dore':
      return <Plat sauce={C.goldLight} garniture={C.clay} />;

    /* --------------------------------------------------------- douceurs */

    case 'losange':
      return (
        <>
          <path d="M32 6 58 32 32 58 6 32Z" fill={C.gold} />
          <path d="M32 13.5 50.5 32 32 50.5 13.5 32Z" fill={C.goldLight} />
          {/* L'amande posée au centre. */}
          <ellipse cx="32" cy="32" rx="6" ry="9" fill={C.cream2} transform="rotate(-22 32 32)" />
          <path d="M30 26.5c-1.5 3-1.5 8 0 11" stroke={C.cream3} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </>
      );

    /* La zlabia : une spirale d'un seul trait, glacée de miel. */
    case 'spirale':
      return (
        <>
          <path
            d="M56 32a24 24 0 1 1-24-24 17 17 0 1 0 17 17 10 10 0 1 1-10-10"
            fill="none"
            stroke={C.clay}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M56 32a24 24 0 1 1-24-24 17 17 0 1 0 17 17 10 10 0 1 1-10-10"
            fill="none"
            stroke={C.goldLight}
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity=".75"
          />
        </>
      );
  }
}

/* ------------------------------------------------------- formes partagées */

/**
 * La tasse et sa soucoupe, vues d'un angle haut.
 *
 * Partagée par le café serré, le café au lait, le café blanc et le chocolat :
 * seul le contenu change. C'est exactement le principe — un symbole, plusieurs
 * plats.
 */
function Tasse({
  contenu,
  children,
}: {
  contenu: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <ellipse cx="32" cy="37" rx="27" ry="20" fill={C.cream3} />
      <path
        d="M49 27c8-1 12 2.5 12 7s-4 8-12 7"
        fill="none"
        stroke={C.white}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="34" rx="20" ry="15" fill={C.white} />
      <ellipse cx="32" cy="34" rx="15" ry="10.8" fill={contenu} />
      {children}
    </>
  );
}

/**
 * Le verre haut, vu du même angle que la tasse.
 *
 * Un verre vu de dessus n'est qu'un rond : il faut cet angle pour qu'on
 * reconnaisse une boisson. Les trois jus partagent ce dessin et ne diffèrent
 * que par la couleur du liquide et ce qu'on pose sur le bord.
 */
function Verre({
  liquide,
  children,
}: {
  liquide: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <path d="M19 21h26l-3.4 33.5A5 5 0 0 1 36.6 59h-9.2a5 5 0 0 1-5-4.5Z" fill={C.white} />
      <path d="M21.2 28.5h21.6l-2.7 26A5 5 0 0 1 35.1 59h-6.2a5 5 0 0 1-5-4.5Z" fill={liquide} />
      {/* Le contour : sans lui, un verre pâle s'efface sur le fond crème. */}
      <path
        d="M19 21h26l-3.4 33.5A5 5 0 0 1 36.6 59h-9.2a5 5 0 0 1-5-4.5Z"
        fill="none"
        stroke={C.cream3}
        strokeWidth="1.8"
      />
      <ellipse cx="32" cy="21" rx="13" ry="5" fill={C.white} stroke={C.cream3} strokeWidth="1.5" />
      <ellipse cx="32" cy="21" rx="9.5" ry="3.2" fill={liquide} />
      {children}
    </>
  );
}

/** La paille des boissons épaisses — cherbet, avocat au lait. */
function Paille() {
  return (
    <path
      d="M38 18 47 4"
      stroke={C.clay}
      strokeWidth="4"
      strokeLinecap="round"
    />
  );
}

/**
 * La galette ronde vue de dessus, avec son quadrillage de cuisson.
 *
 * Le quadrillage s'arrête aux cordes du cercle plutôt que d'être détouré par
 * un `clipPath` : une découpe exigerait un identifiant, et trois galettes
 * cohabitent sur la carte — trois fois le même `id` dans la page. Les six
 * segments sont calculés une fois pour toutes, c'est plus léger et
 * strictement valide.
 */
function Galette({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <circle cx="32" cy="32" r="26" fill={C.crust} />
      <circle cx="32" cy="32" r="22" fill={C.crustLight} />
      <path
        d="M18 15.2v33.6M32 10v44M46 15.2v33.6M15.2 18h33.6M10 32h44M15.2 46h33.6"
        stroke={C.crust}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity=".85"
        fill="none"
      />
      {children}
    </>
  );
}

/**
 * L'assiette vue de dessus.
 *
 * Trois plats la partagent — karantika, chakhchoukha, tadjine zitoun — et se
 * distinguent par la couleur de la sauce et celle de la garniture. Les olives
 * vertes du tadjine sortent du même dessin que les pois chiches de la
 * chakhchoukha.
 */
function Plat({ sauce, garniture }: { sauce: string; garniture: string }) {
  return (
    <>
      <circle cx="32" cy="32" r="27" fill={C.white} />
      <circle cx="32" cy="32" r="22" fill={C.cream3} />
      <circle cx="32" cy="32" r="18" fill={sauce} />
      <ellipse cx="25" cy="27" rx="4" ry="3.4" fill={garniture} />
      <ellipse cx="38" cy="33" rx="4" ry="3.4" fill={garniture} />
      <ellipse cx="28.5" cy="39" rx="3.4" ry="2.9" fill={garniture} />
    </>
  );
}
