'use client';

/** Déclenche l'impression de l'affiche. Seul fragment interactif de la page. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-[52px] w-full rounded-full bg-[var(--clay)] text-[17px] font-bold text-white transition-transform hover:scale-[1.01] active:scale-[.99]"
    >
      {label}
    </button>
  );
}
