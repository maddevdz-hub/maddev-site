'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { ProgressBar } from './ProgressBar';
import { QuestionStep } from './QuestionStep';
import { ResultCard } from './ResultCard';
import { Button } from '@/components/ui/Button';
import {
  answersFromParams,
  answersToParams,
  getRecommendation,
  isComplete,
  questions,
  totalSteps,
  type Answers,
  type QuestionId,
} from '@/lib/configurator';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { EASE } from '@/lib/motion';

type State = {
  /** Index de la question courante, 0-based. */
  step: number;
  answers: Answers;
  /** Vrai une fois les 4 questions passées : on affiche la recommandation. */
  done: boolean;
  /** Sens du dernier déplacement — pilote la direction du glissement. */
  direction: 1 | -1;
  /** Le visiteur a touché à quelque chose : on peut déplacer le focus. */
  interacted: boolean;
};

type Action =
  | { type: 'select'; id: QuestionId; value: string }
  | { type: 'advance' }
  | { type: 'back' }
  | { type: 'restart' };

const initialState: State = {
  step: 0,
  answers: {},
  done: false,
  direction: 1,
  interacted: false,
};

/**
 * État de départ reconstruit depuis l'URL.
 * Un lien partagé rouvre directement la recommandation ; un lien partiel
 * reprend le quiz à la première question sans réponse.
 */
function stateFromUrl(params: { get(name: string): string | null }): State {
  const answers = answersFromParams(params);
  if (Object.keys(answers).length === 0) return initialState;

  const complete = isComplete(answers);
  const firstUnanswered = questions.findIndex((q) => !answers[q.id]);

  return {
    step: complete ? totalSteps - 1 : Math.max(firstUnanswered, 0),
    answers,
    done: complete,
    direction: 1,
    // Le visiteur arrive par un lien : ne pas lui voler le focus.
    interacted: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'select':
      return {
        ...state,
        interacted: true,
        answers: { ...state.answers, [action.id]: action.value },
      };

    case 'advance': {
      const next = state.step + 1;
      if (next >= totalSteps) {
        return { ...state, done: true, direction: 1, interacted: true };
      }
      return { ...state, step: next, direction: 1, interacted: true };
    }

    case 'back': {
      // Depuis le résultat, on revient à la dernière question.
      if (state.done) {
        return { ...state, done: false, step: totalSteps - 1, direction: -1 };
      }
      if (state.step === 0) return state;
      return { ...state, step: state.step - 1, direction: -1 };
    }

    case 'restart':
      return { ...initialState };

    default:
      return state;
  }
}

/**
 * Le configurateur : une question à la fois, puis la recommandation.
 *
 * Sélectionner une option fait avancer automatiquement après un court délai.
 * Ce délai n'est pas cosmétique : il laisse voir l'option cochée avant que
 * l'écran ne change, sinon le clic donne l'impression d'avoir raté sa cible.
 */
export function Configurator({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // L'état initial est dérivé de l'URL une seule fois, au montage.
  const [state, dispatch] = useReducer(
    reducer,
    searchParams,
    stateFromUrl,
  );

  const advanceTimer = useRef<ReturnType<typeof setTimeout>>();
  const topRef = useRef<HTMLDivElement>(null);

  const t = dict.quiz;
  const question = questions[state.step];
  const isRtl = locale === 'ar';

  // Un changement d'étape en cours de route ne doit jamais laisser le
  // visiteur devant une question hors écran.
  useEffect(() => {
    if (!state.interacted) return;
    const node = topRef.current;
    if (!node) return;
    const { top } = node.getBoundingClientRect();
    if (top < 0 || top > window.innerHeight * 0.4) {
      node.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, [state.step, state.done, state.interacted, reduce]);

  useEffect(() => {
    return () => clearTimeout(advanceTimer.current);
  }, []);

  /**
   * L'URL ne porte les réponses qu'une fois le résultat atteint : c'est ce
   * qui rend la recommandation partageable et mesurable. Pendant le quiz,
   * l'URL reste propre — sinon chaque clic polluerait l'historique et le
   * bouton « précédent » du navigateur deviendrait imprévisible.
   * `replace` plutôt que `push` pour la même raison.
   */
  useEffect(() => {
    const query = state.done ? answersToParams(state.answers).toString() : '';
    const target = query ? `${pathname}?${query}` : pathname;
    const current = window.location.pathname + window.location.search;
    if (current !== target) {
      router.replace(target, { scroll: false });
    }
  }, [state.done, state.answers, pathname, router]);

  const handleSelect = useCallback(
    (id: QuestionId, value: string) => {
      dispatch({ type: 'select', id, value });
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(
        () => dispatch({ type: 'advance' }),
        reduce ? 0 : 320,
      );
    },
    [reduce],
  );

  const handleRestart = useCallback(() => {
    clearTimeout(advanceTimer.current);
    dispatch({ type: 'restart' });
  }, []);

  // Le glissement suit le sens de lecture : en arabe, « suivant » entre
  // par la gauche.
  const enterX = reduce ? 0 : 42 * state.direction * (isRtl ? -1 : 1);

  const canGoBack = state.done || state.step > 0;

  return (
    <div ref={topRef} className="scroll-mt-28">
      {!state.done ? (
        <div className="flex flex-col gap-8">
          <ProgressBar
            current={state.step + 1}
            total={totalSteps}
            label={t.nav.progress
              .replace('{current}', String(state.step + 1))
              .replace('{total}', String(totalSteps))}
          />

          <div className="card p-6 sm:p-9">
            {/*
              La clé fait remonter le bloc à chaque question, ce qui rejoue
              l'animation d'entrée. Pas d'AnimatePresence ici : une sortie
              animée obligerait à garder l'ancienne question à l'écran le
              temps de l'animation, et la moindre sortie non terminée bloque
              l'affichage de la suivante. Ici, rien ne peut rester coincé.
            */}
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: enterX }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            >
              <QuestionStep
                question={question}
                locale={locale}
                selected={state.answers[question.id]}
                onSelect={(value) => handleSelect(question.id, value)}
                autoFocus={state.interacted}
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between gap-3">
            {canGoBack ? (
              <Button
                variant="ghost"
                type="button"
                onClick={() => dispatch({ type: 'back' })}
              >
                <BackIcon />
                {t.nav.back}
              </Button>
            ) : (
              <span />
            )}

            {question.optional ? (
              <Button
                variant="ghost"
                type="button"
                onClick={() => dispatch({ type: 'advance' })}
              >
                {t.nav.skip}
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-start">
            <Button
              variant="ghost"
              type="button"
              onClick={() => dispatch({ type: 'back' })}
            >
              <BackIcon />
              {t.nav.back}
            </Button>
          </div>

          <ResultCard
            recommendation={getRecommendation(state.answers)}
            answers={state.answers}
            locale={locale}
            dict={dict}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
}

/** Flèche de retour — retournée en RTL pour pointer dans le bon sens. */
function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 rtl:-scale-x-100"
    >
      <path d="M19 12H6m0 0 5.5-5.5M6 12l5.5 5.5" />
    </svg>
  );
}
