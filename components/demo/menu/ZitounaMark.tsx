/**
 * Marque du Café Zitouna — une branche d'olivier.
 *
 * « Zitouna » veut dire l'olivier : le symbole dit le nom sans le répéter.
 * Dessiné ici plutôt qu'importé pour deux raisons — il doit se teinter par
 * `currentColor` selon l'endroit où il apparaît, et une démonstration ne
 * doit dépendre d'aucun fichier que le client n'aurait pas.
 *
 * Rien de commun avec le monogramme MADDEV : ce café a sa propre marque.
 */
export function ZitounaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* La tige */}
      <path
        d="M24 43V13.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Feuilles, alternées de part et d'autre */}
      <path
        d="M24 33c-6.5 0-10.5-2.6-11.5-7.6 5-1.7 9.8-.2 11.5 7.6Z"
        fill="currentColor"
        opacity=".85"
      />
      <path
        d="M24 26.5c6.5 0 10.5-2.6 11.5-7.6-5-1.7-9.8-.2-11.5 7.6Z"
        fill="currentColor"
        opacity=".85"
      />
      <path
        d="M24 20c-5.6 0-9-2.2-9.9-6.5 4.3-1.5 8.4-.2 9.9 6.5Z"
        fill="currentColor"
        opacity=".6"
      />
      {/* L'olive */}
      <ellipse cx="30.5" cy="10.5" rx="4.4" ry="5.6" fill="currentColor" />
      <path
        d="M30.5 5.2c1.6 1.4 2.4 3.2 2.4 5.3"
        stroke="var(--cream, #fff)"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity=".5"
      />
    </svg>
  );
}
