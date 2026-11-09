"use client";

import { useEffect, useId, useRef, useState } from "react";
import { liensNavigation } from "@/content/demos/rendezvous/navigation";
import { reglages } from "@/content/demos/rendezvous/reglages";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  const [ouvert, setOuvert] = useState(false);
  const bouton = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Échap referme le menu et rend le focus au bouton.
  useEffect(() => {
    if (!ouvert) return;
    const clavier = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOuvert(false);
        bouton.current?.focus();
      }
    };
    const large = window.matchMedia("(min-width: 1024px)");
    const fermerSiLarge = () => large.matches && setOuvert(false);
    document.addEventListener("keydown", clavier);
    large.addEventListener("change", fermerSiLarge);
    return () => {
      document.removeEventListener("keydown", clavier);
      large.removeEventListener("change", fermerSiLarge);
    };
  }, [ouvert]);

  return (
    <nav aria-label="Navigation principale" className="relative border-b border-line bg-bg">
      <div className="conteneur flex h-16 items-center justify-between gap-4">
        <a
          href="#accueil"
          className="-ml-2 flex min-h-11 flex-col justify-center rounded-lg px-2"
          aria-label={`${reglages.cabinet.nom}, retour à l'accueil`}
        >
          <span className="font-serif text-[1.35rem] leading-none tracking-[-0.01em] text-ink">
            {reglages.cabinet.nomCourt}
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-ink-2">
            {reglages.cabinet.designation}
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {liensNavigation.map((l) => (
            <li key={l.ancre}>
              <a
                href={l.ancre}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] text-ink-2 transition-colors hover:text-ink"
              >
                {l.libelle}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <a href="#reservation" className="bouton-primaire hidden min-h-11 px-5 sm:inline-flex">
            Réserver
          </a>
          <button
            ref={bouton}
            type="button"
            className="bouton-discret gap-2 px-3 lg:hidden"
            aria-expanded={ouvert}
            aria-controls={menuId}
            onClick={() => setOuvert((o) => !o)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {ouvert ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6.5h14M3 13.5h14" />
              )}
            </svg>
            <span className="text-[15px]">Menu</span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!ouvert}
        className="absolute inset-x-0 top-full z-30 border-b border-line bg-surface shadow-carte lg:hidden"
      >
        <div className="conteneur py-3">
          <ul className="divide-y divide-line">
            {liensNavigation.map((l) => (
              <li key={l.ancre}>
                <a
                  href={l.ancre}
                  onClick={() => setOuvert(false)}
                  className="flex min-h-12 items-center text-base text-ink"
                >
                  {l.libelle}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#reservation"
            onClick={() => setOuvert(false)}
            className="bouton-primaire mt-3 w-full sm:hidden"
          >
            Réserver un rendez-vous
          </a>
        </div>
      </div>
    </nav>
  );
}
