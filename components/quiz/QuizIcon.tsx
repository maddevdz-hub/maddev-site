import type { OptionIcon } from '@/lib/configurator';
import { cn } from '@/lib/utils';

/**
 * Icônes des options du configurateur.
 * Même facture que les icônes de services (tracé 1.6, extrémités arrondies)
 * pour que le quiz appartienne visuellement au reste du site.
 */
const glyphs: Record<OptionIcon, JSX.Element> = {
  // Q1 — la situation du visiteur
  /* Restauration : une fourchette et un couteau, posés comme au couvert. */
  couverts: (
    <>
      <path d="M7 3v7.5a2.5 2.5 0 0 1-2.5 2.5h0A2.5 2.5 0 0 1 2 10.5V3" />
      <path d="M4.5 3v7" />
      <path d="M4.5 13v8" />
      <path d="M16 3c3 0 5.5 3 5.5 7s-2 5-3.5 5h-2Z" />
      <path d="M18 15v6" />
    </>
  ),
  /* Rendez-vous : une horloge, l'heure réservée. */
  horloge: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  /* Parc de biens : deux immeubles, l'un derrière l'autre. */
  immeubles: (
    <>
      <path d="M3 21V8.5l6-3.5v16" />
      <path d="M9 11h8a1.5 1.5 0 0 1 1.5 1.5V21" />
      <path d="M2 21h20" />
      <path d="M5.6 10.5h.9M5.6 14h.9M12 14.5h.9M15.2 14.5h.9M12 17.8h.9M15.2 17.8h.9" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19V9.5" />
      <path d="M3 9.5 4.8 4.5h14.4L21 9.5a2.6 2.6 0 0 1-4.5 1.6 2.6 2.6 0 0 1-4.5 0 2.6 2.6 0 0 1-4.5 0A2.6 2.6 0 0 1 3 9.5Z" />
      <path d="M9.75 20.5v-5h4.5v5" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.2l2.1 10.4a1.6 1.6 0 0 0 1.6 1.3h7.9a1.6 1.6 0 0 0 1.6-1.25L20 7.5H6" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </>
  ),
  idea: (
    <>
      <path d="M9 17.5a6 6 0 1 1 6 0v1.2a1.3 1.3 0 0 1-1.3 1.3h-3.4A1.3 1.3 0 0 1 9 18.7v-1.2Z" />
      <path d="M10 21.5h4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.3" />
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.7" />
      <path d="M20 4.5v4.2h-4.2M4 19.5v-4.2h4.2" />
    </>
  ),

  // Q2 — objectif
  badge: (
    <>
      <path d="M12 3 14 5.3l3-.5.6 3 2.7 1.4-1.4 2.8 1.4 2.8-2.7 1.4-.6 3-3-.5L12 21l-2-2.3-3 .5-.6-3-2.7-1.4L5.1 12 3.7 9.2 6.4 7.8l.6-3 3 .5L12 3Z" />
      <path d="m9.3 12 1.9 1.9 3.5-3.8" />
    </>
  ),
  coins: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 10v4M18 10v4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  gears: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.5 12H2.1M21.9 12h-2.4M6.7 6.7 5 5M19 19l-1.7-1.7M6.7 17.3 5 19M19 5l-1.7 1.7" />
    </>
  ),

  // Q3 — produits
  boxes: (
    <>
      <rect x="2.5" y="12.5" width="8" height="8" rx="1.4" />
      <rect x="13.5" y="12.5" width="8" height="8" rx="1.4" />
      <rect x="8" y="3.5" width="8" height="8" rx="1.4" />
      <path d="M6.5 12.5v8M17.5 12.5v8M12 3.5v8" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 20 7.2v9.6L12 21l-8-4.2V7.2L12 3Z" />
      <path d="m4 7.2 8 4.2 8-4.2M12 11.4V21" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2.2" />
      <path d="M8.5 7V5.4A1.9 1.9 0 0 1 10.4 3.5h3.2a1.9 1.9 0 0 1 1.9 1.9V7" />
      <path d="M2.5 12.5h19M10.5 12.5v2h3v-2" />
    </>
  ),

  // Q4 — budget
  coinSmall: (
    <>
      <ellipse cx="12" cy="16.5" rx="7" ry="2.8" />
      <path d="M5 16.5v-2.2c0-1.55 3.13-2.8 7-2.8s7 1.25 7 2.8v2.2" />
    </>
  ),
  coinMid: (
    <>
      <ellipse cx="12" cy="17.5" rx="7" ry="2.6" />
      <path d="M5 17.5v-2c0-1.44 3.13-2.6 7-2.6s7 1.16 7 2.6v2" />
      <path d="M5 13.5v-2c0-1.44 3.13-2.6 7-2.6s7 1.16 7 2.6v2" />
    </>
  ),
  coinHigh: (
    <>
      <ellipse cx="12" cy="18.4" rx="6.6" ry="2.3" />
      <path d="M5.4 18.4v-1.8c0-1.27 2.96-2.3 6.6-2.3s6.6 1.03 6.6 2.3v1.8" />
      <path d="M5.4 14.8V13c0-1.27 2.96-2.3 6.6-2.3s6.6 1.03 6.6 2.3v1.8" />
      <path d="M5.4 11.2V9.4c0-1.27 2.96-2.3 6.6-2.3s6.6 1.03 6.6 2.3v1.8" />
    </>
  ),
  coinMax: (
    <>
      <ellipse cx="12" cy="19" rx="6.2" ry="2.1" />
      <path d="M5.8 19v-1.6c0-1.16 2.78-2.1 6.2-2.1s6.2.94 6.2 2.1V19" />
      <path d="M5.8 15.7v-1.6c0-1.16 2.78-2.1 6.2-2.1s6.2.94 6.2 2.1v1.6" />
      <path d="M5.8 12.4v-1.6c0-1.16 2.78-2.1 6.2-2.1s6.2.94 6.2 2.1v1.6" />
      <path d="M5.8 9.1V7.5c0-1.16 2.78-2.1 6.2-2.1s6.2.94 6.2 2.1v1.6" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 11.8c0 4-3.8 7.2-8.5 7.2a9.8 9.8 0 0 1-2.6-.35L4 21l1.2-3.6A6.9 6.9 0 0 1 3.5 11.8C3.5 7.8 7.3 4.6 12 4.6s8.5 3.2 8.5 7.2Z" />
      <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
    </>
  ),
};

export function QuizIcon({
  name,
  className,
}: {
  name: OptionIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
    >
      {glyphs[name]}
    </svg>
  );
}
