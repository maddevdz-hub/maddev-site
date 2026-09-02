'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowIcon } from '@/components/ui/Button';
import { faq } from '@/content/faq';
import { href, routes, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/**
 * Accordéon des questions fréquentes.
 *
 * Plusieurs réponses peuvent rester ouvertes en même temps : sur une FAQ,
 * refermer la précédente oblige à revenir en arrière pour comparer deux
 * réponses.
 *
 * L'ouverture est animée par une grille passant de 0fr à 1fr, ce qui
 * anime une hauteur inconnue sans JavaScript de mesure et sans à-coup.
 * La règle prefers-reduced-motion de globals.css la neutralise.
 */
export function FaqAccordion({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    );

  return (
    <ul className="flex flex-col gap-3">
      {faq.map((item) => {
        const isOpen = open.includes(item.id);

        return (
          <li
            key={item.id}
            className={cn(
              'overflow-hidden rounded-2xl border transition-colors duration-300',
              isOpen
                ? 'border-coral/30 bg-ink3/70'
                : 'border-line bg-ink2/70 hover:border-coral/25',
            )}
          >
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-${item.id}`}
                className="flex w-full items-center justify-between gap-4 p-5 text-start sm:p-6"
              >
                <span className="text-[15px] font-semibold leading-snug text-txt sm:text-base">
                  {item.question[locale]}
                </span>
                <PlusIcon open={isOpen} />
              </button>
            </h3>

            <div
              id={`faq-${item.id}`}
              role="region"
              hidden={!isOpen}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col items-start gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
                  <p className="text-[15px] leading-relaxed text-txt2">
                    {item.answer[locale]}
                  </p>

                  {item.link ? (
                    <Link
                      href={href(locale, routes[item.link.route])}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-coral2 hover:text-coral"
                    >
                      {item.link.label[locale]}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Croix qui pivote : fermée elle forme un +, ouverte un −. */
function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
        open ? 'border-coral/50 bg-brand-soft' : 'border-line',
      )}
    >
      <span className="absolute h-[1.5px] w-3.5 rounded bg-coral2" />
      <span
        className={cn(
          'absolute h-[1.5px] w-3.5 rounded bg-coral2 transition-transform duration-300 motion-reduce:transition-none',
          open ? 'rotate-0' : 'rotate-90',
        )}
      />
    </span>
  );
}
