import type { Locale } from '@/i18n/config';

/**
 * Bande d'avertissement des démonstrations.
 *
 * RÈGLE ABSOLUE : toute page de démonstration la porte, en haut, avant tout
 * autre contenu. Elle n'est pas décorative — c'est elle qui distingue une
 * démonstration d'une fausse référence client. Une référence inventée
 * découverte détruit plus de confiance que l'absence de référence ; et
 * c'est cette franchise qui rend crédible le seul vrai client du studio.
 *
 * Discrète mais lisible : jamais en dessous de 4,5:1 de contraste, jamais
 * masquée au défilement, jamais réduite à une icône. Si une démonstration
 * paraît « plus belle » sans elle, c'est la démonstration qu'il faut revoir.
 *
 * Le composant est volontairement autonome : ni charte MADDEV, ni token du
 * site, pour pouvoir vivre au-dessus de n'importe quelle identité.
 */

const text: Record<Locale, string> = {
  fr: 'Démonstration — projet fictif conçu par MADDEV',
  ar: 'نموذج توضيحي — مشروع افتراضي من تصميم MADDEV',
};

export function DemoBanner({
  locale,
  /** Lien de retour vers le site du studio. */
  backHref = '/',
  backLabel,
}: {
  locale: Locale;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div
      role="note"
      className="relative z-50 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 bg-[#241a12] px-4 py-1.5 text-center text-[13px] font-medium leading-snug text-[#f6ece0] sm:text-sm"
    >
      <span className="inline-flex min-h-[44px] items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#e0a44a]"
        />
        {text[locale]}
      </span>

      {backLabel ? (
        <a
          href={backHref}
          className="inline-flex min-h-[44px] items-center underline decoration-[#e0a44a] underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0a44a]"
        >
          {backLabel}
        </a>
      ) : null}
    </div>
  );
}
