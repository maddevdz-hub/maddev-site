/**
 * Bande d'avertissement des démonstrations.
 *
 * RÈGLE ABSOLUE : toute page de démonstration FICTIVE la porte, en haut,
 * avant tout autre contenu. Elle n'est pas décorative — c'est elle qui
 * distingue une démonstration d'une fausse référence client. Une référence
 * inventée découverte détruit plus de confiance que l'absence de référence ;
 * et c'est cette franchise qui rend crédible le seul vrai client du studio.
 *
 * ⚠️ Une seule page ne la porte pas, et ce n'est pas un oubli : le showroom
 * de meubles de Bordj Bou Arréridj est un VRAI client. Lui coller la bande
 * mentirait dans l'autre sens.
 *
 * Discrète mais lisible : jamais en dessous de 4,5:1 de contraste, jamais
 * masquée au défilement, jamais réduite à une icône. Si une démonstration
 * paraît « plus belle » sans elle, c'est la démonstration qu'il faut revoir.
 *
 * Le composant est volontairement autonome : ni charte MADDEV, ni token du
 * site, pour pouvoir vivre au-dessus de n'importe quelle identité.
 */
export function DemoBanner({
  /** Lien de retour vers le site du studio. */
  backHref = '/fr/services',
  backLabel = 'Retour à MADDEV',
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div
      role="note"
      className="relative z-50 flex flex-wrap items-center justify-center gap-x-3 gap-y-0 bg-[#241a12] px-4 py-1 text-center text-[13px] font-medium leading-snug text-[#f6ece0] sm:text-sm"
    >
      <span className="inline-flex items-center gap-2 py-1">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#e0a44a]"
        />
        Démonstration — projet fictif conçu par MADDEV
      </span>

      {backLabel ? (
        <a
          href={backHref}
          className="hidden min-h-[44px] items-center underline decoration-[#e0a44a] underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0a44a] sm:inline-flex"
        >
          {backLabel}
        </a>
      ) : null}
    </div>
  );
}
