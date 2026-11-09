import { reglages } from "@/content/demos/rendezvous/reglages";
import { formatHeure, formatPlageJours, NBSP, nomJour, typo } from "@/lib/demos/rendezvous/format";
import { instantCabinet } from "@/lib/demos/rendezvous/temps";

export function PiedDePage() {
  const { cabinet, horaires } = reglages;
  const annee = instantCabinet(Date.now()).jour.slice(0, 4);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="conteneur grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-[1.35rem] leading-none text-ink">{reglages.cabinet.nomCourt}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-2">
            {reglages.cabinet.designation}
          </p>
          <p className="mt-4 text-sm text-ink-2">{cabinet.specialites.join(" · ")}</p>
        </div>
        <div>
          <h2 className="etiquette">Adresse</h2>
          <address className="mt-3 not-italic text-ink">{cabinet.adresse}</address>
        </div>
        <div>
          <h2 className="etiquette">Horaires</h2>
          <p className="mt-3 text-ink first-letter:uppercase">
            du {formatPlageJours(horaires.joursOuverts)}
          </p>
          <p className="chiffre text-lg text-ink">
            {formatHeure(horaires.ouverture)}
            {NBSP}–{NBSP}
            {formatHeure(horaires.fermeture)}
          </p>
          <p className="mt-1 text-sm text-ink-2 first-letter:uppercase">
            {typo(`${nomJour(horaires.jourFerme)} : fermé`)}
          </p>
        </div>
        <div>
          <h2 className="etiquette">Rendez-vous</h2>
          <a href="#reservation" className="bouton-secondaire mt-3">
            Réserver en ligne
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="conteneur flex flex-col gap-2 py-6 text-sm text-ink-2 sm:flex-row sm:justify-between">
          <p>
            © {annee} {cabinet.nom}
          </p>
          <p>Site de démonstration conçu par MADDEV</p>
        </div>
      </div>
    </footer>
  );
}
