/**
 * Configuration Tailwind de la démonstration « prise de rendez-vous ».
 *
 * Elle est séparée de celle du site, et c'est voulu : la clinique a sa propre
 * palette (ivoire, encre, vert sapin), ses propres polices, son thème sombre.
 * Rien de cela ne doit migrer dans tailwind.config.ts — les démonstrations
 * prouvent qu'on dessine une identité par métier, pas qu'on repeint un
 * gabarit. Le bandeau commun, lui, n'utilise que des valeurs arbitraires et
 * vit au-dessus de n'importe quelle identité.
 *
 * Elle est chargée par la directive `@config` en tête de
 * app/demo/rendezvous/rendezvous.css.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  /*
   * Seuls les fichiers de la démo, et le bandeau commun des démonstrations.
   * Balayer tout le dépôt produirait ici les utilitaires du site entier, dans
   * la palette de la clinique.
   */
  content: [
    "./app/demo/rendezvous/**/*.{ts,tsx}",
    "./components/demo/rendezvous/**/*.{ts,tsx}",
    "./content/demos/rendezvous/**/*.{ts,tsx}",
    "./lib/demos/rendezvous/**/*.{ts,tsx}",
    "./components/demo/DemoBanner.tsx",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        trait: "var(--trait)",
        accent: "var(--accent)",
        "accent-fort": "var(--accent-fort)",
        "accent-ink": "var(--accent-ink)",
        "accent-soft": "var(--accent-soft)",
        alerte: "var(--alerte)",
        "alerte-vif": "var(--alerte-vif)",
        "alerte-soft": "var(--alerte-soft)",
        "bandeau-fond": "var(--bandeau-fond)",
        "bandeau-texte": "var(--bandeau-texte)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        carte: "0 1px 2px rgba(19, 33, 58, 0.04), 0 16px 40px -24px rgba(19, 33, 58, 0.18)",
      },
      transitionTimingFunction: {
        calme: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
