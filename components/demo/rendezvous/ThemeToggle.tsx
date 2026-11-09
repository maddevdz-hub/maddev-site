"use client";

import { useEffect, useState } from "react";

const CLE = "el-yasmine-theme";
type Theme = "light" | "dark";

function appliquer(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

    // Tant que le visiteur n'a rien choisi, on suit le système.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const suivre = (e: MediaQueryListEvent) => {
      let memo: string | null = null;
      try {
        memo = localStorage.getItem(CLE);
      } catch {
        memo = null;
      }
      if (memo === "dark" || memo === "light") return;
      const suivant: Theme = e.matches ? "dark" : "light";
      appliquer(suivant);
      setTheme(suivant);
    };
    mq.addEventListener("change", suivre);
    return () => mq.removeEventListener("change", suivre);
  }, []);

  function basculer() {
    const suivant: Theme = theme === "dark" ? "light" : "dark";
    appliquer(suivant);
    setTheme(suivant);
    try {
      localStorage.setItem(CLE, suivant);
    } catch {
      /* stockage indisponible : le choix vaut pour la visite */
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={theme === "dark"}
      aria-label="Thème sombre"
      title="Thème sombre"
      className="bouton-discret"
    >
      <svg
        className="icone-lune"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" />
      </svg>
      <svg
        className="icone-soleil"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
      </svg>
    </button>
  );
}
