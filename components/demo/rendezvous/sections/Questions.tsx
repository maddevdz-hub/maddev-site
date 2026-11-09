import { Section } from "@/components/demo/rendezvous/Section";
import { reglages } from "@/content/demos/rendezvous/reglages";
import { typo } from "@/lib/demos/rendezvous/format";

/**
 * Questions fréquentes.
 *
 * Cette section affichait un cadre pointillé : « Cinq questions en accordéon
 * — étape 6 ». L'étape n'avait jamais été faite.
 *
 * Chaque réponse décrit ce que le système fait VRAIMENT, et rien de plus :
 * - le guide existe, au-dessus du calendrier ;
 * - le calendrier écarte les heures où le soin ne tient pas ;
 * - le rappel part par le canal et au délai des réglages ;
 * - la liste d'attente prévient avant que le créneau ne réapparaisse ;
 * - l'annulation se fait côté clinique — le patient n'annule pas en ligne,
 *   la réponse ne le lui promet donc pas.
 *
 * `<details>` plutôt qu'un accordéon en JavaScript : il s'ouvre au clavier,
 * se lit sans script, et chaque question reste un vrai bouton pour les
 * lecteurs d'écran.
 */

const { rappel } = reglages;

const questions: { question: string; reponse: string }[] = [
  {
    question: "Je ne sais pas quel soin choisir.",
    reponse:
      "Utilisez « Me laisser guider », au-dessus du calendrier : trois questions au plus, et vous arrivez au bon rendez-vous. Dans le doute, la première consultation est faite pour cela.",
  },
  {
    question: "Pourquoi certains horaires ne me sont-ils pas proposés ?",
    reponse:
      "Chaque soin a sa durée. Le calendrier ne propose que les heures où le soin entier tient, avant le rendez-vous suivant et avant la fermeture. Vous ne réservez jamais un créneau trop court.",
  },
  {
    question: "Vais-je recevoir un rappel ?",
    reponse: `Oui. Un rappel ${rappel.canal} part ${rappel.delaiHeures} h avant le rendez-vous, sur le numéro que vous indiquez en réservant.`,
  },
  {
    question: "Le jour qui m’arrange est complet.",
    reponse:
      "Inscrivez-vous sur sa liste d’attente avec votre numéro WhatsApp. Si un créneau se libère ce jour-là, vous êtes prévenu avant qu’il ne réapparaisse en ligne.",
  },
  {
    question: "Comment annuler ou déplacer un rendez-vous ?",
    reponse:
      "Prévenez la clinique. L’annulation libère le créneau à l’instant, et la première personne en liste d’attente est prévenue : votre place sert à quelqu’un plutôt que de rester vide.",
  },
];

export function Questions() {
  return (
    <Section id="questions" numero="05" nom="Questions" titre="Questions fréquentes.">
      <ul className="max-w-[48rem] border-t border-line">
        {questions.map((q, i) => (
          <li key={q.question} className="border-b border-line">
            <details className="group" open={i === 0}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-[1.3rem] leading-snug text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                {typo(q.question)}
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-2 text-ink-2 transition-transform duration-200 ease-calme group-open:rotate-45"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[40rem] pb-6 pr-14 text-[16px] leading-relaxed text-ink-2">{typo(q.reponse)}</p>
            </details>
          </li>
        ))}
      </ul>
    </Section>
  );
}
