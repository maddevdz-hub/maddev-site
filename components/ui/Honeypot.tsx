/**
 * Champ piège anti-robots.
 *
 * Invisible pour un visiteur — y compris pour un lecteur d'écran, grâce à
 * aria-hidden et tabIndex={-1} : personne d'humain ne peut l'atteindre, ni
 * à la souris, ni au clavier, ni à la synthèse vocale. Les robots, eux,
 * lisent le HTML et remplissent tous les champs qu'ils trouvent.
 *
 * On le cache en le sortant de l'écran plutôt qu'avec `display: none` :
 * certains robots ignorent les champs masqués de cette façon.
 */
export function HoneypotField({ name = 'company' }: { name?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor={`${name}-hp`}>
        Ne remplissez pas ce champ
        <input
          id={`${name}-hp`}
          type="text"
          name={name}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
