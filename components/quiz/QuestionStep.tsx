'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { QuizIcon } from './QuizIcon';
import type { Question } from '@/lib/configurator';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { withNumerals } from '@/components/ui/Numerals';

/**
 * Une question du configurateur, présentée en cartes cliquables.
 *
 * Accessibilité — le motif ARIA « radiogroup » est suivi, avec un écart
 * délibéré : les flèches déplacent le focus SANS sélectionner. Dans le motif
 * standard, une flèche sélectionne, ce qui ici ferait basculer aussitôt à la
 * question suivante (les options font avancer le quiz). Un utilisateur au
 * clavier ne pourrait plus parcourir les choix avant de se décider. La
 * sélection se fait donc à la souris, à Entrée ou à Espace.
 */
export function QuestionStep({
  question,
  locale,
  selected,
  onSelect,
  autoFocus,
}: {
  question: Question;
  locale: Locale;
  selected?: string;
  onSelect: (value: string) => void;
  /** Place le focus sur une option — vrai dès que le visiteur a commencé. */
  autoFocus: boolean;
}) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isRtl = locale === 'ar';

  // À l'arrivée sur la question, le focus part sur l'option déjà choisie
  // (cas d'un retour en arrière) ou sur la première.
  useEffect(() => {
    if (!autoFocus) return;
    const index = Math.max(
      question.options.findIndex((o) => o.value === selected),
      0,
    );
    optionRefs.current[index]?.focus();
    // Volontairement dépendant de la seule question : on ne veut pas
    // reprendre le focus à chaque changement de sélection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, autoFocus]);

  function moveFocus(from: number, delta: number) {
    const count = question.options.length;
    const next = (from + delta + count) % count;
    optionRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    // En RTL, la flèche droite va vers l'option précédente.
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = isRtl ? 'ArrowRight' : 'ArrowLeft';

    switch (event.key) {
      case 'ArrowDown':
      case forward:
        event.preventDefault();
        moveFocus(index, 1);
        break;
      case 'ArrowUp':
      case backward:
        event.preventDefault();
        moveFocus(index, -1);
        break;
      case 'Home':
        event.preventDefault();
        optionRefs.current[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        optionRefs.current[question.options.length - 1]?.focus();
        break;
      default:
        break;
    }
  }

  // Un seul élément du groupe est atteignable à la tabulation.
  const roving = Math.max(
    question.options.findIndex((o) => o.value === selected),
    0,
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <h2
          id={`question-${question.id}`}
          className="text-[clamp(1.5rem,4.5vw,2.15rem)] font-bold leading-tight tracking-tight text-txt"
        >
          {question.title[locale]}
        </h2>
        {question.subtitle ? (
          <p
            id={`question-${question.id}-hint`}
            className="text-[15px] leading-relaxed text-txt2"
          >
            {question.subtitle[locale]}
          </p>
        ) : null}
      </div>

      <div
        role="radiogroup"
        aria-labelledby={`question-${question.id}`}
        aria-describedby={
          question.subtitle ? `question-${question.id}-hint` : undefined
        }
        className="grid gap-3 sm:grid-cols-2"
      >
        {question.options.map((option, index) => {
          const isSelected = option.value === selected;
          // Nombre impair d'options : la dernière occuperait une demi-rangée
          // et déséquilibrerait le bloc. Elle prend donc toute la largeur —
          // ce qui tombe juste, car c'est toujours la réponse d'une autre
          // nature (« je ne sais pas encore »), qu'un trait discontinu
          // distingue des choix fermes.
          const isLoneLast =
            question.options.length % 2 === 1 &&
            index === question.options.length - 1;

          return (
            <button
              key={option.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={index === roving ? 0 : -1}
              onClick={() => onSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'group flex items-center gap-4 rounded-2xl border p-5 text-start',
                'transition-[transform,border-color,background-color] duration-300',
                'hover:-translate-y-0.5 motion-reduce:hover:transform-none',
                isLoneLast && 'sm:col-span-2 border-dashed',
                isSelected
                  ? 'border-coral/60 bg-brand-soft'
                  : isLoneLast
                    ? 'border-line2 bg-ink3/40 hover:border-coral/40 hover:bg-ink3/70'
                    : 'border-line bg-ink3/70 hover:border-coral/40 hover:bg-ink3',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300',
                  isSelected
                    ? 'border-coral/50 bg-brand text-[#1a0c0c]'
                    : 'border-line bg-white/[.03] text-coral2 group-hover:border-coral/35',
                )}
              >
                <QuizIcon name={option.icon} />
              </span>

              <span className="flex-1 text-[15px] font-medium leading-snug text-txt">
                {withNumerals(option.label[locale])}
              </span>

              {/* Pastille d'état — redondante avec la couleur, pour ne pas
                  reposer sur la seule teinte. */}
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                  isSelected
                    ? 'border-coral bg-coral'
                    : 'border-line2 group-hover:border-coral/50',
                )}
              >
                {isSelected ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 10.4 3 3 7-7"
                      stroke="#1a0c0c"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
