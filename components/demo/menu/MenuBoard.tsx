'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DishArt } from './DishArt';
import { ZitounaMark } from './ZitounaMark';
import {
  allergenLabels,
  cafe,
  markerLabels,
  menuUi,
  suggestions,
  type Dish,
  type Marker,
  type MenuCategory,
} from '@/content/demos/menu';

/**
 * La carte du Café Zitouna.
 *
 * Tout ce qui est cliquable fait quelque chose — une démonstration dont les
 * boutons sont morts dessert plus qu'elle ne sert. Concrètement :
 *   1. la barre de catégories suit la lecture et s'y déplace au clic ;
 *   2. les filtres filtrent, et annoncent combien de plats restent ;
 *   3. un plat s'ouvre : illustration en grand, texte complet, allergènes ;
 *   4. la commande s'additionne et se retrouve dans l'appel du serveur ;
 *   5. cet appel aboutit à un état visible, honnêtement signalé comme sans
 *      effet réel.
 *
 * Contexte d'usage assumé : un téléphone tenu d'une main, dans un café
 * bruyant. D'où la barre en haut plutôt qu'en bas, les zones tactiles larges,
 * et le bouton d'appel à portée du pouce.
 *
 * Au défilement, la barre se compacte : elle reprend le nom du café — que
 * l'en-tête n'affiche plus une fois passé — et ne garde que les catégories.
 * Le client est venu voir des plats, pas une présentation.
 */

const MARKERS: Marker[] = ['vegetarien', 'epice', 'nouveau'];

const markerStyle: Record<Marker, string> = {
  vegetarien: 'bg-[#e8eddc] text-[#3f4a2b]',
  epice: 'bg-[#f7e0d6] text-[#8d2f10]',
  nouveau: 'bg-[#f6e7c4] text-[#6f4c07]',
};

/** Au-delà de cette hauteur de défilement, l'en-tête du café est passé. */
const COMPACT_FROM = 150;

export function MenuBoard({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? '');
  const [filters, setFilters] = useState<Marker[]>([]);
  const [compact, setCompact] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openDish, setOpenDish] = useState<Dish | null>(null);
  const [order, setOrder] = useState<Record<string, number>>({});
  const navRef = useRef<HTMLDivElement>(null);

  const byslug = useMemo(() => {
    const map = new Map<string, Dish>();
    for (const category of categories) {
      for (const dish of category.dishes) map.set(dish.slug, dish);
    }
    return map;
  }, [categories]);

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

  const shown = visible.reduce((n, c) => n + c.dishes.length, 0);

  // Suivi de lecture : la catégorie active est la dernière dont le titre est
  // passé sous la barre. Une simple intersection ne suffit pas — deux titres
  // peuvent être visibles en même temps sur un grand écran.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-category]'),
    );

    const onScroll = () => {
      setCompact(window.scrollY > COMPACT_FROM);
      if (sections.length === 0) return;
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

  function addToOrder(slug: string) {
    setOrder((current) => ({ ...current, [slug]: (current[slug] ?? 0) + 1 }));
  }

  function removeFromOrder(slug: string) {
    setOrder((current) => {
      const next = { ...current };
      delete next[slug];
      return next;
    });
  }

  /*
   * La rangée de filtres disparaît une fois l'en-tête passé — mais jamais
   * quand un filtre est actif : masquer un filtre en cours, c'est laisser le
   * client devant une carte amputée sans lui dire pourquoi.
   */
  const showFilters = !compact || filtersOpen || filters.length > 0;

  return (
    <>
      <div
        ref={navRef}
        className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--cream)]/95 backdrop-blur"
      >
        {/* Le nom du café, repris quand l'en-tête n'est plus à l'écran */}
        <div
          className="zt-collapse grid transition-[grid-template-rows] duration-300 ease-[var(--ease)]"
          data-open={compact}
          style={{ gridTemplateRows: compact ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 pt-2.5">
              <p className="flex min-w-0 items-center gap-2 text-[15px] font-bold">
                <ZitounaMark className="h-4 w-4 shrink-0 text-[var(--olive)]" />
                <span className="truncate">{cafe.name}</span>
              </p>

              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={showFilters}
                className="shrink-0 rounded-full px-2 py-1 text-[13px] font-bold text-[var(--clay-ink)] underline underline-offset-4"
              >
                {menuUi.filtersLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Catégories — défilement horizontal */}
        <nav aria-label="Catégories">
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
        <div
          className="zt-collapse grid transition-[grid-template-rows] duration-300 ease-[var(--ease)]"
          data-open={showFilters}
          style={{ gridTemplateRows: showFilters ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto border-t border-[var(--line)] px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/*
                Le compte prend la place du libellé, en TÊTE de rangée.
                Placé après les puces, il tombait hors de l'écran sur un
                téléphone : une réassurance qu'il faut aller chercher n'en est
                plus une.
              */}
              <span
                aria-live="polite"
                className={[
                  'shrink-0 whitespace-nowrap text-[13px] font-bold',
                  filters.length > 0
                    ? 'text-[var(--clay-ink)]'
                    : 'text-[var(--ink-2)]',
                ].join(' ')}
              >
                {filters.length > 0 ? (
                  <>
                    <span className="numerals">{shown}</span>{' '}
                    {shown > 1 ? menuUi.dishes : menuUi.dish}
                  </>
                ) : (
                  menuUi.filtersLabel
                )}
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

              {/*
                Le compte des plats restants. Un filtre muet inquiète : on ne
                sait pas si la carte est courte ou si le filtre a tout mangé.
              */}
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
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6">
        {/* Les suggestions du jour — seulement sur la carte entière */}
        {filters.length === 0 ? (
          <SuggestionStrip byslug={byslug} onOpen={setOpenDish} />
        ) : null}

        {/*
          `key` sur les filtres : la liste se rejoue en fondu à chaque
          changement. Sans cela, les plats sautent d'un coup sec et l'œil ne
          suit pas ce qui vient de se passer.
        */}
        <div key={filters.join('|')} className="zt-fade">
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--line)] px-5 py-10 text-center text-[var(--ink-2)]">
              {menuUi.empty}
            </p>
          ) : (
            visible.map((category, i) => (
              <section
                key={category.slug}
                id={`cat-${category.slug}`}
                data-category={category.slug}
                className="scroll-mt-[var(--nav-height)]"
              >
                {i > 0 ? <OliveDivider /> : null}

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
                      <DishRow
                        dish={dish}
                        fallback={category.art}
                        onOpen={() => setOpenDish(dish)}
                        count={order[dish.slug] ?? 0}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>

      {openDish ? (
        <DishPanel
          dish={openDish}
          fallback={
            categories.find((c) => c.dishes.some((d) => d.slug === openDish.slug))
              ?.art ?? 'tasse'
          }
          count={order[openDish.slug] ?? 0}
          onAdd={() => addToOrder(openDish.slug)}
          onClose={() => setOpenDish(null)}
        />
      ) : null}

      <CallWaiter
        compact={compact}
        order={order}
        byslug={byslug}
        onRemove={removeFromOrder}
      />
    </>
  );
}

/* ------------------------------------------------------------ suggestions */

/**
 * Les suggestions du jour, en tête de carte.
 *
 * Format volontairement différent des lignes de plat — grande illustration,
 * fond teinté, défilement horizontal : mises au même format, elles se
 * fondraient dans la liste et ne mettraient plus rien en avant.
 */
function SuggestionStrip({
  byslug,
  onOpen,
}: {
  byslug: Map<string, Dish>;
  onOpen: (dish: Dish) => void;
}) {
  const items = suggestions
    .map((s) => ({ ...s, dish: byslug.get(s.slug) }))
    .filter((s): s is { slug: string; note: string; dish: Dish } => !!s.dish);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="zt-suggestions" className="mb-9">
      <h2
        id="zt-suggestions"
        className="mb-3 flex items-center gap-2 text-[20px] font-bold"
      >
        <ZitounaMark className="h-5 w-5 text-[var(--olive)]" />
        {menuUi.suggestionsTitle}
      </h2>

      {/*
        `items-stretch` et `h-full` : sans eux, une note plus longue que les
        autres allonge sa carte et la rangée se déforme.
      */}
      <ul className="-mx-4 flex items-stretch gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map(({ dish, note }) => (
          <li key={dish.slug} className="shrink-0">
            <button
              type="button"
              onClick={() => onOpen(dish)}
              aria-haspopup="dialog"
              className="zt-card zt-lift flex h-full w-[172px] flex-col items-start gap-1.5 border-[var(--cream-3)] bg-[var(--cream-2)] p-3 text-start"
            >
              <span className="zt-tag bg-[var(--clay)] text-white">{note}</span>
              <DishArt
                name={dish.art ?? 'tasse'}
                className="mx-auto my-0.5 h-[76px] w-[76px]"
              />
              <span className="text-[15.5px] font-bold leading-snug">
                {dish.name}
              </span>
              <Price value={dish.price} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ plats */

/** Une ligne de plat : illustration, nom, description, marqueurs, prix. */
function DishRow({
  dish,
  fallback,
  onOpen,
  count,
}: {
  dish: Dish;
  fallback: Dish['art'];
  onOpen: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="zt-card zt-lift flex h-full w-full gap-3.5 p-3 text-start"
    >
      <DishThumb dish={dish} fallback={fallback} />

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-[17px] font-bold leading-snug">{dish.name}</span>
          <Price value={dish.price} />
        </span>

        <span className="text-[14px] leading-relaxed text-[var(--ink-2)]">
          {dish.description}
        </span>

        {dish.markers.length > 0 || count > 0 ? (
          <span className="mt-0.5 flex flex-wrap gap-1.5">
            {count > 0 ? (
              <span className="zt-tag bg-[var(--clay)] text-white">
                <span className="numerals">{count}</span> commandé
                {count > 1 ? 's' : ''}
              </span>
            ) : null}
            {dish.markers.map((marker) => (
              <span key={marker} className={`zt-tag ${markerStyle[marker]}`}>
                {markerLabels[marker]}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/**
 * La vignette du plat.
 *
 * Une photo si le client en fournit une ; sinon l'illustration du plat ;
 * sinon celle de sa catégorie. Jamais une initiale dans un carré — sur une
 * carte, l'image est ce qui décide de la commande.
 */
function DishThumb({ dish, fallback }: { dish: Dish; fallback: Dish['art'] }) {
  if (dish.image) {
    return (
      <Image
        src={dish.image}
        alt=""
        width={160}
        height={160}
        sizes="80px"
        className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
      />
    );
  }

  return (
    <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-[var(--cream-2)] sm:h-20 sm:w-20">
      <DishArt
        name={dish.art ?? fallback ?? 'tasse'}
        className="h-[62px] w-[62px] sm:h-[68px] sm:w-[68px]"
      />
    </span>
  );
}

/**
 * Le prix.
 *
 * Le nombre porte le poids, la devise s'efface — mais les deux partagent la
 * même ligne de base : c'est le seul alignement qui tienne quand deux corps
 * de texte se côtoient. Aligner sur le milieu ferait flotter le « DA ».
 */
function Price({ value }: { value: number }) {
  return (
    <span className="flex shrink-0 items-baseline gap-[3px] text-[var(--clay-ink)]">
      <span className="numerals text-[18px] font-bold leading-none">{value}</span>
      <span className="text-[12px] font-bold leading-none opacity-70">
        {menuUi.currency}
      </span>
    </span>
  );
}

/**
 * Le panneau d'un plat.
 *
 * Une carte où rien ne s'ouvre se ressent comme une image imprimée. Ici le
 * plat s'agrandit, se raconte, dit ses allergènes et s'ajoute à la commande.
 */
function DishPanel({
  dish,
  fallback,
  count,
  onAdd,
  onClose,
}: {
  dish: Dish;
  fallback: Dish['art'];
  count: number;
  onAdd: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    /*
     * On donne le focus au panneau lui-même, pas au bouton de fermeture :
     * un lecteur d'écran annonce alors le nom du plat, et non « Fermer » —
     * ce qui laissait croire que le panneau n'avait rien à dire.
     */
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(42,29,22,.45)] sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={menuUi.close}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dish.name}
        tabIndex={-1}
        className="zt-sheet relative max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-2xl bg-[var(--cream-2)]">
            <DishArt
              name={dish.art ?? fallback ?? 'tasse'}
              className="h-[118px] w-[118px]"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={menuUi.close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--cream-2)] text-[var(--ink-2)]"
          >
            <CloseGlyph />
          </button>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h2 className="text-[24px] font-bold leading-tight">{dish.name}</h2>
          <Price value={dish.price} />
        </div>

        {dish.markers.length > 0 ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {dish.markers.map((marker) => (
              <li key={marker} className={`zt-tag ${markerStyle[marker]}`}>
                {markerLabels[marker]}
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-3.5 text-[15px] leading-relaxed text-[var(--ink-2)]">
          {dish.detail}
        </p>

        <div className="mt-4 rounded-xl bg-[var(--cream)] p-3.5">
          <p className="text-[13px] font-bold uppercase tracking-[.1em] text-[var(--ink-2)]">
            {menuUi.allergensTitle}
          </p>
          <p className="mt-1 text-[15px] font-bold">
            {dish.allergens.length === 0
              ? menuUi.allergensNone
              : dish.allergens.map((a) => allergenLabels[a]).join(' · ')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onAdd();
            setJustAdded(true);
          }}
          className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--clay)] px-4 text-[17px] font-bold text-white transition-colors"
        >
          {justAdded ? (
            <>
              <CheckGlyph />
              {menuUi.added}
            </>
          ) : (
            menuUi.add
          )}
        </button>

        {count > 0 ? (
          <p className="mt-2 text-center text-[13px] text-[var(--ink-2)]">
            <span className="numerals font-bold">{count}</span> dans votre
            commande
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- le serveur */

/**
 * Appel du serveur, et récapitulatif de la commande.
 *
 * Le bouton d'appel porte la commande en cours : dans un café, on ne
 * « valide » pas un panier, on appelle quelqu'un et on lui montre ce qu'on a
 * choisi. La confirmation dit explicitement qu'aucun message n'est envoyé —
 * une démonstration ne doit jamais laisser croire qu'elle a déclenché
 * quelque chose de réel.
 *
 * Au défilement, le bouton se réduit en pastille ronde : à taille pleine il
 * recouvrait une ligne de plat sur les petits écrans.
 */
function CallWaiter({
  compact,
  order,
  byslug,
  onRemove,
}: {
  compact: boolean;
  order: Record<string, number>;
  byslug: Map<string, Dish>;
  onRemove: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState('4');
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const lines = Object.entries(order)
    .map(([slug, qty]) => ({ dish: byslug.get(slug), qty }))
    .filter((l): l is { dish: Dish; qty: number } => !!l.dish);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.dish.price, 0);

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
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={compact ? menuUi.call : undefined}
          className={[
            'zt-call pointer-events-auto relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--clay)] font-bold text-white shadow-[0_10px_28px_rgba(42,29,22,.28)]',
            compact ? 'h-14 w-14' : 'min-h-[52px] px-6 text-[17px]',
          ].join(' ')}
        >
          <BellGlyph />
          {compact ? null : menuUi.call}

          {count > 0 ? (
            <span className="numerals absolute -end-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[var(--cream)] bg-[var(--ink)] px-1 text-[12px] font-bold text-white">
              {count}
            </span>
          ) : null}
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
            className="zt-sheet relative max-h-[88dvh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
          >
            {sent ? (
              <div className="flex flex-col gap-2 py-2 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eddc] text-[#3f4a2b]">
                  <CheckGlyph />
                </span>
                <p className="text-[17px] font-bold">{menuUi.callDone}</p>
                <p className="text-[13px] text-[var(--ink-2)]">
                  {menuUi.callDemo}
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-3 text-[20px] font-bold">{menuUi.callTitle}</h2>

                {/* Le récapitulatif : ce qu'on montrera au serveur */}
                <div className="mb-4 rounded-xl bg-[var(--cream)] p-3.5">
                  <p className="mb-2 text-[13px] font-bold uppercase tracking-[.1em] text-[var(--ink-2)]">
                    {menuUi.order}
                  </p>

                  {lines.length === 0 ? (
                    <p className="text-[14px] text-[var(--ink-2)]">
                      {menuUi.orderEmpty}
                    </p>
                  ) : (
                    <>
                      <ul className="flex flex-col gap-1.5">
                        {lines.map(({ dish, qty }) => (
                          <li
                            key={dish.slug}
                            className="flex items-baseline gap-2 text-[14px]"
                          >
                            <span className="numerals font-bold">{qty}×</span>
                            <span className="flex-1">{dish.name}</span>
                            <span className="numerals font-bold">
                              {qty * dish.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemove(dish.slug)}
                              aria-label={`${menuUi.orderRemove} ${dish.name}`}
                              className="text-[var(--ink-2)] underline underline-offset-2"
                            >
                              <CloseGlyph className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2.5 flex items-baseline justify-between border-t border-[var(--line)] pt-2.5 text-[15px] font-bold">
                        {menuUi.orderTotal}
                        <Price value={total} />
                      </p>
                    </>
                  )}
                </div>

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

/* -------------------------------------------------------------- ornements */

/**
 * Le filet entre deux sections.
 *
 * Une branche d'olivier réduite à trois feuilles — le même motif que la
 * marque du café, à une taille où il ne se lit plus comme un logo mais comme
 * une respiration.
 */
function OliveDivider() {
  return (
    <div aria-hidden="true" className="my-11 flex items-center gap-3">
      <span className="h-px flex-1 bg-[var(--line)]" />
      <svg
        viewBox="0 0 44 16"
        className="h-4 w-11 shrink-0 text-[var(--olive)]"
        fill="none"
      >
        <path d="M4 8h36" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".45" />
        <path d="M22 8c0-3.4 2.4-5.6 6.4-6-.2 3.8-2.4 5.8-6.4 6Z" fill="currentColor" opacity=".7" />
        <path d="M22 8c0 3.4-2.4 5.6-6.4 6 .2-3.8 2.4-5.8 6.4-6Z" fill="currentColor" opacity=".7" />
        <ellipse cx="22" cy="8" rx="2.1" ry="2.6" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-[var(--line)]" />
    </div>
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
      className="h-5 w-5 shrink-0"
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

function CloseGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
