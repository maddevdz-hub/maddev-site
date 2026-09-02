import { cn } from '@/lib/utils';

/**
 * Barre de progression du quiz.
 *
 * La barre est remplie par un `transform: scaleX`, pas par une largeur :
 * le navigateur n'a alors aucune mise en page à recalculer à chaque étape.
 * L'origine du remplissage suit le sens de lecture (origin-left / origin-right).
 */
export function ProgressBar({
  current,
  total,
  label,
  className,
}: {
  /** Étape en cours, à partir de 1. */
  current: number;
  total: number;
  /** Libellé accessible, déjà interpolé (« Étape 2 sur 4 »). */
  label: string;
  className?: string;
}) {
  const ratio = Math.min(Math.max(current / total, 0), 1);

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex items-center justify-between">
        <span className="eyebrow-label text-txt2">{label}</span>
        <span className="numerals text-xs font-bold text-coral2">
          {current}/{total}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/[.07]"
      >
        <span
          className="block h-full w-full rounded-full bg-brand transition-transform duration-500 ease-out origin-left rtl:origin-right motion-reduce:transition-none"
          style={{ transform: `scaleX(${ratio})` }}
        />
      </div>
    </div>
  );
}
