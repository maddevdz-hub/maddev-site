'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ZitounaMark } from './ZitounaMark';
import {
  markerLabels,
  menuUi,
  type Dish,
  type Marker,
  type MenuCategory,
} from '@/content/demos/menu';

/**
 * La carte du Café Zitouna.
 *
 * Trois choses doivent réellement fonctionner — une démonstration dont les
 * boutons ne font rien dessert plus qu'elle ne sert :
 *   1. la barre de catégories suit la lecture (et s'y déplace au clic) ;
 *   2. les filtres filtrent, et les catégories vidées disparaissent ;
 *   3. l'appel du serveur aboutit à un état visible, honnêtement signalé
 *      comme sans effet réel.
 *
 * Contexte d'usage assumé : un téléphone tenu d'une main, dans un café
 * bruyant. D'où la barre en haut plutôt qu'en bas de l'écran, les zones
 * tactiles larges, et le bouton d'appel à portée du pouce.
 */

const MARKERS: Marker[] = ['vegetarien', 'epice', 'nouveau'];

const markerStyle: Record<Marker, string> = {
  vegetarien: 'bg-[#e8eddc] text-[#3f4a2b]',
  epice: 'bg-[#f7e0d6] text-[#8d2f10]',
  nouveau: 'bg-[#f6e7c4] text-[#6f4c07]',
};

export function MenuBoard({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? '');
  const [filters, setFilters] = useState<Marker[]>([]);
  const navRef = useRef<HTMLDivElement>(null);

  // Un plat doit porter TOUS les marqueurs demandés : « végétarien + nouveau »
  // signifie bien la nouveauté végétarienne, pas l'une ou l'autre.
  const visible = useMemo(() => {
    if (filters.length === 0) return categories;
    return categories
      .map((category) => ({
        ...category,
        dishes: category.dishes.filter((dish) =>
          filters.every((marker) => dish.markers.includes(marker)),
        ),
      }))
      .filter((category) => category.dishes.length > 0);
  }, [categories, filters]);

  // Suivi de lecture : la catégorie active est la dernière dont le titre est
  // passé sous la barre. Une simple intersection ne suffit pas — deux titres
  // peuvent être visibles en même temps sur un grand écran.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-category]'),
    );
    if (sections.length === 0) return;

    const onScroll = () => {
      const limit = (navRef.current?.offsetHeight ?? 0) + 24;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= limit) current = section;
      }
      setActive(current.dataset.category ?? '');
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible]);

  function toggle(marker: Marker) {
    setFilters((current) =>
      current.includes(marker)
        ? current.filter((m) => m !== marker)
        : [...current, marker],
    );
  }

  return (
    <>
      <div
        ref={navRef}
        className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--cream)]/95 backdrop-blur"
      >
        {/* Catégories — défilement horizontal, sens de lecture respecté */}
        <nav aria-label={'Catégories'}>
          <ul className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visible.map((category) => {
              const isActive = category.slug === active;
              return (
                <li key={category.slug}>
                  <a
                    href={`#cat-${category.slug}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={[
                      'inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-4 text-[15px] font-bold transition-colors',
                      isActive
                        ? 'bg-[var(--clay)] text-white'
                        : 'bg-[var(--cream-2)] text-[var(--ink-2)] hover:bg-[var(--cream-3)]',
                    ].join(' ')}
                  >
                    {category.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Filtres */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-[var(--line)] px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-[13px] font-bold text-[var(--ink-2)]">
            {menuUi.filtersLabel}
          </span>
          {MARKERS.map((marker) => {
            const on = filters.includes(marker);
            return (
              <button
                key={marker}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(marker)}
                className={[
                  'inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 text-[14px] font-bold transition-colors',
                  on
                    ? 'border-[var(--clay)] bg-[var(--clay)] text-white'
                    : 'border-[var(--line)] bg-white text-[var(--ink-2)] hover:border-[var(--clay)]',
                ].join(' ')}
              >
                {markerLabels[marker]}
              </button>
            );
          })}
          {filters.length > 0 ? (
            <button
              type="button"
              onClick={() => setFilters([])}
              className="inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap px-2 text-[14px] font-bold text-[var(--clay-ink)] underline underline-offset-4"
            >
              {menuUi.filtersClear}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-6">
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--line)] px-5 py-10 text-center text-[var(--ink-2)]">
            {menuUi.empty}
          </p>
        ) : (
          visible.map((category) => (
            <section
              key={category.slug}
              id={`cat-${category.slug}`}
              data-category={category.slug}
              className="mb-10 scroll-mt-[var(--nav-height)]"
            >
              <h2 className="mb-4 flex items-center gap-3 text-[26px] font-bold leading-tight">
                {category.name}
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-[var(--line)]"
                />
              </h2>

              <ul className="grid gap-3 md:grid-cols-2">
                {category.dishes.map((dish) => (
                  <li key={dish.slug} className="h-full">
                    <DishRow dish={dish} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <CallWaiter />
    </>
  );
}

/** Une ligne de plat : photo, nom, description, marqueurs, prix. */
function DishRow({ dish }: { dish: Dish }) {
  return (
    <article className="zt-card flex h-full gap-3.5 p-3">
      <DishPhoto dish={dish} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-bold leading-snug">
            {dish.name}
          </h3>
          <p className="shrink-0 font-bold text-[var(--clay-ink)]">
            <span className="numerals">{dish.price}</span>{' '}
            <span className="text-[13px] font-bold">
              {menuUi.currency}
            </span>
          </p>
        </div>

        <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">
          {dish.description}
        </p>

        {dish.markers.length > 0 ? (
          <ul className="mt-0.5 flex flex-wrap gap-1.5">
            {dish.markers.map((marker) => (
              <li key={marker} className={`zt-tag ${markerStyle[marker]}`}>
                {markerLabels[marker]}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Emplacement de la photo du plat.
 *
 * Tant que la photo n'est pas fournie, on n'affiche NI rectangle vide, NI
 * image générique : une tuile de la couleur du café, avec l'initiale du plat.
 * Dès que le fichier existe, il suffit de renseigner `image` dans les données.
 */
function DishPhoto({ dish }: { dish: Dish }) {
  if (dish.image) {
    return (
      <Image
        src={dish.image}
        alt={dish.name}
        width={160}
        height={160}
        sizes="80px"
        className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
      />
    );
  }

  return (
    <div
      className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--cream-2)] sm:h-20 sm:w-20"
      aria-hidden="true"
      title={menuUi.photoSoon}
    >
      <ZitounaMark className="absolute -bottom-3 -end-2 h-14 w-14 text-[var(--olive)] opacity-[.18]" />
      <span
        className="relative text-[26px] font-bold text-[var(--clay)]/55"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {dish.name.trim().charAt(0)}
      </span>
    </div>
  );
}

/**
 * Appel du serveur.
 *
 * Le bouton flotte au pouce, la fenêtre demande le numéro de table, et la
 * confirmation dit explicitement qu'aucun message n'est envoyé : une démo ne
 * doit jamais laisser croire qu'elle a déclenché quelque chose de réel.
 */
function CallWaiter() {
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState('4');
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.querySelector('select')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [sent]);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[var(--clay)] px-6 text-[17px] font-bold text-white shadow-[0_10px_28px_rgba(42,29,22,.28)] transition-transform hover:scale-[1.02] active:scale-[.99]"
        >
          <BellGlyph />
          {menuUi.call}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(42,29,22,.45)] p-4 sm:items-center">
          <button
            type="button"
            aria-label={menuUi.callCancel}
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={menuUi.callTitle}
            className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
          >
            {sent ? (
              <div className="flex flex-col gap-2 py-2 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eddc] text-[#3f4a2b]">
                  <CheckGlyph />
                </span>
                <p className="text-[17px] font-bold">
                  {menuUi.callDone}
                </p>
                <p className="text-[13px] text-[var(--ink-2)]">
                  {menuUi.callDemo}
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-3 text-[20px] font-bold">
                  {menuUi.callTitle}
                </h2>

                <label
                  htmlFor="table"
                  className="mb-1.5 block text-[14px] font-bold text-[var(--ink-2)]"
                >
                  {menuUi.callTable}
                </label>
                <select
                  id="table"
                  value={table}
                  onChange={(event) => setTable(event.target.value)}
                  className="mb-4 min-h-[48px] w-full rounded-xl border border-[var(--line)] bg-white px-3 text-[16px] font-bold"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ),
                  )}
                </select>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSent(true)}
                    className="min-h-[48px] flex-1 rounded-xl bg-[var(--clay)] px-4 text-[16px] font-bold text-white"
                  >
                    {menuUi.callSend}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="min-h-[48px] rounded-xl border border-[var(--line)] px-4 text-[16px] font-bold text-[var(--ink-2)]"
                  >
                    {menuUi.callCancel}
                  </button>
                </div>

                <p className="mt-3 text-[12px] leading-snug text-[var(--ink-2)]">
                  {menuUi.callDemo}
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function BellGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
