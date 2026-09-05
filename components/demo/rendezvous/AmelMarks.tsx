/**
 * Les visuels du cabinet, dessinés — aucune photographie.
 *
 * Un cabinet dentaire photographié est presque toujours laid : néons, fauteuil
 * clinique, sourires de banque d'images. Le dessin géométrique évite ce piège
 * et donne au cabinet une identité qu'aucune photo générique ne lui donnerait.
 *
 * Tout se teinte par `currentColor` : le même tracé sert en pétrole sur blanc,
 * en blanc sur pétrole, ou en menthe très pâle dans un fond.
 */

/**
 * Marque du cabinet : une arcade dentaire réduite à sa géométrie.
 *
 * Des points alignés sur un arc — c'est la forme qu'un dentiste reconnaît
 * immédiatement, et qu'un patient lit simplement comme un motif calme. Pas de
 * dent souriante : le sérieux fait partie du service vendu.
 */
export function AmelMark({ className }: { className?: string }) {
  // Douze points répartis sur un demi-arc, les molaires plus larges.
  const teeth = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const angle = Math.PI * (1 - t);
    const rx = 30;
    const ry = 26;
    const cx = 36 + Math.cos(angle) * rx;
    // L'arc s'ouvre vers le BAS, comme une arcade vue de face, et tient
    // entièrement dans la hauteur du cadre.
    const cy = 12 + Math.sin(angle) * ry;
    // Les extrémités de l'arcade sont les molaires : plus grosses.
    const size = 2.6 + Math.abs(t - 0.5) * 3.4;
    return { cx, cy, size, key: i };
  });

  return (
    <svg viewBox="0 0 72 56" fill="none" aria-hidden="true" className={className}>
      {teeth.map(({ cx, cy, size, key }) => (
        <ellipse
          key={key}
          cx={cx}
          cy={cy}
          rx={size}
          ry={size * 1.15}
          fill="currentColor"
          opacity={key === 5 ? 1 : 0.55 + (key % 3) * 0.12}
        />
      ))}
    </svg>
  );
}

/**
 * Bandeau géométrique inspiré du zellige.
 *
 * Motif à huit branches, tramé et répété : il donne une texture au fond sans
 * jamais concurrencer le texte. Rendu en `pattern` SVG plutôt qu'en image —
 * il pèse deux cents octets, se teinte, et reste net à toutes les densités
 * d'écran.
 */
export function ZelligeField({
  id,
  className,
  opacity = 0.06,
  scale = 56,
}: {
  /** Identifiant unique dans la page : deux motifs ne peuvent pas le partager. */
  id: string;
  className?: string;
  opacity?: number;
  scale?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={id}
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          {/* L'étoile à huit branches : deux carrés superposés. */}
          <rect
            x={scale * 0.28}
            y={scale * 0.28}
            width={scale * 0.44}
            height={scale * 0.44}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x={scale * 0.28}
            y={scale * 0.28}
            width={scale * 0.44}
            height={scale * 0.44}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            transform={`rotate(45 ${scale * 0.5} ${scale * 0.5})`}
          />
          <circle cx={scale * 0.5} cy={scale * 0.5} r="1.6" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * Composition du hero : une journée de cabinet, en abstrait.
 *
 * Trois colonnes de créneaux dont certains sont pleins et d'autres vides —
 * c'est littéralement le sujet de la page, un planning qui se remplit. Le
 * dessin dit ce que fait l'outil avant que le visiteur ait lu une ligne.
 */
export function PlanningFigure({ className }: { className?: string }) {
  const columns = [
    [1, 1, 0, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 0, 1, 1, 0, 1],
  ];

  return (
    <svg
      viewBox="0 0 240 260"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="am-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e7c86" />
          <stop offset="100%" stopColor="#0a5b63" />
        </linearGradient>
      </defs>

      {columns.map((column, ci) =>
        column.map((filled, ri) => {
          const x = 12 + ci * 76;
          const y = 12 + ri * 30;
          return (
            <rect
              key={`${ci}-${ri}`}
              x={x}
              y={y}
              width={64}
              height={22}
              rx={5}
              fill={filled ? 'url(#am-fill)' : 'none'}
              stroke={filled ? 'none' : 'currentColor'}
              strokeWidth="1.2"
              strokeDasharray={filled ? undefined : '4 4'}
              opacity={filled ? 1 - ri * 0.07 : 0.5}
            />
          );
        }),
      )}

      {/* Le créneau que l'on vient de réserver : détaché, encadré, vivant. */}
      <rect
        x={82}
        y={128}
        width={72}
        height={30}
        rx={6}
        fill="#ffffff"
        stroke="#0e7c86"
        strokeWidth="2.5"
      />
      <circle cx={118} cy={143} r="4.5" fill="#0e7c86" />
    </svg>
  );
}

/** Coche, pour les confirmations. */
export function CheckMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Le glyphe WhatsApp, pour l'aperçu du rappel. */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.2 1.26-1.96 1.42-.52.11-1.2.2-3.5-.75-2.94-1.22-4.83-4.2-4.98-4.4-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.59.83 2.02.9 2.17.07.14.12.31.02.5-.1.2-.15.32-.29.49-.15.17-.3.38-.44.51-.14.14-.29.3-.12.58.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.39-.24.65-.14.27.09 1.69.8 1.98.94.29.15.48.22.55.34.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
