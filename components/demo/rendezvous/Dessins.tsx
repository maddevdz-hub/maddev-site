import type { DessinId } from "@/content/demos/rendezvous/visuels";

/**
 * Les dessins de la clinique : l'arcade de l'accueil et un dessin par soin.
 *
 * Ils remplacent des cadres pointillés qui affichaient « Dessin « arcade » » —
 * l'étape des dessins n'avait jamais été faite. Un cadre vide dans une
 * démonstration dit exactement l'inverse de ce qu'elle doit prouver.
 *
 * ── Ce qui fait la famille ───────────────────────────────────────────────
 * - Le trait de l'image de partage : contour vert, intérieur clair, deux
 *   pixels quelle que soit la taille du cadre (`non-scaling-stroke`) — un
 *   dessin agrandi dans l'accueil ne doit pas s'épaissir.
 * - Les dents des soins sont vues de face, sous une ligne de gencive ;
 *   l'arcade de l'accueil est vue de dessus, comme dans l'image de partage.
 * - Aucune couleur en dur : tout passe par les variables de la démo, pour
 *   que le thème sombre redessine les mêmes traits dans ses propres tons.
 * - Le vert pour la dent et l'instrument, l'ambre pour ce qui ne va pas
 *   (tartre, teinte, fêlure) — la même logique que les alertes du site.
 *
 * Décoratifs : le nom du soin est écrit juste à côté.
 */

const TRAIT = {
  fill: "none",
  stroke: "var(--accent)",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

const SECONDAIRE = { ...TRAIT, stroke: "var(--trait)", strokeWidth: 1.5 } as const;
const ALERTE = { ...TRAIT, stroke: "var(--alerte-vif)" } as const;

export function Dessin({ id, className = "" }: { id: DessinId; className?: string }) {
  if (id === "arcade") return <Arcade className={className} />;

  return (
    <svg
      viewBox="12 0 176 70"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className={className}
    >
      {SCENES[id]}
    </svg>
  );
}

/* ------------------------------------------------------------- l'arcade */

/*
 * La géométrie de l'image de partage, ramenée à 240 de large : seize dents
 * le long d'une demi-ellipse, plus larges au fond qu'en façade, chacune
 * tournée selon la tangente de l'arcade.
 */
const ARCADE = Array.from({ length: 16 }, (_, i) => {
  const th = ((-90 + ((i + 0.5) * 180) / 16) * Math.PI) / 180;
  const k = Math.abs(Math.sin(th)) ** 2;
  const w = 12 + 11 * k;
  const h = 11 + 10.4 * k;
  return {
    x: 120 + 73.4 * Math.sin(th),
    y: 181 - 107.4 * Math.cos(th),
    w,
    h,
    angle: (Math.atan2(107.4 * Math.sin(th), 73.4 * Math.cos(th)) * 180) / Math.PI,
  };
});

function Arcade({ className }: { className: string }) {
  return (
    <svg
      viewBox="20 48 200 152"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className={className}
    >
      <path d="M28.5 183C28.5 96 68.5 59 120 59s91.5 37 91.5 124" {...SECONDAIRE} stroke="var(--line-2)" />
      <path
        d="M63 183c0-61.3 24.7-86.6 57-86.6s57 25.3 57 86.6"
        {...SECONDAIRE}
        stroke="var(--line-2)"
        strokeDasharray="2 5"
      />
      {ARCADE.map((d, i) => (
        <rect
          key={i}
          x={-d.w / 2}
          y={-d.h / 2}
          width={d.w}
          height={d.h}
          rx={Math.min(d.w, d.h) * 0.38}
          transform={`translate(${d.x.toFixed(2)} ${d.y.toFixed(2)}) rotate(${d.angle.toFixed(2)})`}
          {...TRAIT}
          fill="var(--surface)"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------ les soins */

/** Une dent vue de face : couronne arrondie en bas, ouverte sous la gencive. */
function dent(x: number, largeur: number, haut = 22, hauteur = 34) {
  const r = largeur * 0.36;
  const bas = haut + hauteur;
  return `M${x} ${haut}V${bas - r}Q${x} ${bas} ${x + r} ${bas}H${x + largeur - r}Q${x + largeur} ${bas} ${x + largeur} ${bas - r}V${haut}`;
}

/** Une rangée de dents, et la gencive festonnée qui les coiffe. */
function Rangee({
  depart,
  nombre,
  largeur = 20,
  ecart = 3,
  haut = 22,
  hauteur = 34,
}: {
  depart: number;
  nombre: number;
  largeur?: number;
  ecart?: number;
  haut?: number;
  hauteur?: number;
}) {
  const xs = Array.from({ length: nombre }, (_, i) => depart + i * (largeur + ecart));
  const fin = xs[xs.length - 1] + largeur;
  // La gencive passe en arc au-dessus de chaque dent.
  const gencive =
    `M${depart - 6} ${haut + 2}` +
    xs.map((x) => `Q${x + largeur / 2} ${haut - 7} ${x + largeur + ecart / 2} ${haut + 1}`).join("") +
    `L${fin + 6} ${haut + 2}`;
  return (
    <>
      {xs.map((x) => (
        <path key={x} d={dent(x, largeur, haut, hauteur) + "Z"} {...TRAIT} fill="var(--surface)" />
      ))}
      <path d={gencive} {...SECONDAIRE} />
    </>
  );
}

/** Une étincelle à quatre branches : l'éclat après l'éclaircissement. */
function etincelle(x: number, y: number, t: number) {
  return `M${x} ${y - t}Q${x} ${y} ${x + t} ${y}Q${x} ${y} ${x} ${y + t}Q${x} ${y} ${x - t} ${y}Q${x} ${y} ${x} ${y - t}Z`;
}

const SCENES: Record<Exclude<DessinId, "arcade">, JSX.Element> = {
  /* L'examen : quatre dents et le miroir qui les inspecte. */
  "premiere-consultation": (
    <>
      <Rangee depart={30} nombre={4} />
      <circle cx="146" cy="34" r="13" {...TRAIT} fill="var(--surface)" />
      <circle cx="146" cy="34" r="8" {...SECONDAIRE} />
      <path d="M155.5 43.5 178 66" {...TRAIT} />
    </>
  ),

  /* Le contrôle : les bagues et le fil, et la coche du réglage fait. */
  "controle-orthodontique": (
    <>
      <Rangee depart={22} nombre={6} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={22 + i * 23 + 6.5} y="36" width="7" height="7" rx="1.5" {...TRAIT} fill="var(--accent-soft)" />
      ))}
      <path d="M20 39.5Q90 42.5 160 39.5" {...SECONDAIRE} stroke="var(--accent)" />
      <circle cx="176" cy="26" r="10" {...TRAIT} fill="var(--accent-soft)" />
      <path d="m171.5 26 3 3 6-6.5" {...TRAIT} />
    </>
  ),

  /* La pose : la gouttière transparente, en place autour des couronnes. */
  "pose-appareil": (
    <>
      <Rangee depart={45} nombre={5} haut={22} hauteur={32} />
      <path
        d="M39 20V55Q39 62 46 62H156Q163 62 163 55V20"
        {...SECONDAIRE}
        stroke="var(--accent)"
        strokeDasharray="4 4"
      />
    </>
  ),

  /* Le détartrage : le tartre au collet, et l'instrument qui le retire. */
  detartrage: (
    <>
      <Rangee depart={30} nombre={4} />
      {[
        [41, 27], [47, 29], [62, 26], [70, 28.5], [86, 27.5], [93, 26], [108, 28],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="var(--alerte-vif)" />
      ))}
      <path d="M184 7 166 20" {...TRAIT} strokeWidth={5} />
      <path d="M166 20 134 42" {...TRAIT} />
      <path d="M134 42q-5 3.6-3 8" {...TRAIT} />
    </>
  ),

  /* L'éclaircissement : la dent qui s'éclaire, et le teintier de l'ambre au blanc. */
  eclaircissement: (
    <>
      <Rangee depart={40} nombre={3} largeur={22} />
      <path d={etincelle(37, 14, 5)} {...TRAIT} fill="var(--accent-soft)" />
      <path d={etincelle(118, 10, 4)} {...TRAIT} fill="var(--accent-soft)" />
      {[0.55, 0.35, 0.18, 0].map((o, i) => (
        <rect
          key={o}
          x={140 + i * 11}
          y="26"
          width="8"
          height="24"
          rx="3"
          {...SECONDAIRE}
          fill="var(--alerte-vif)"
          fillOpacity={o}
        />
      ))}
    </>
  ),

  /* L'urgence : la dent fêlée, et la croix des premiers soins. */
  urgence: (
    <>
      <Rangee depart={58} nombre={3} largeur={24} />
      <path d="M90 24l-3 9 5 5-4 9 3 6" {...ALERTE} />
      <circle cx="160" cy="36" r="13" {...ALERTE} fill="var(--alerte-soft)" />
      <path d="M160 29.5v13M153.5 36h13" {...ALERTE} />
    </>
  ),
};
