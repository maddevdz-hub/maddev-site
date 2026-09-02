import type { Config } from 'tailwindcss';

/**
 * Design tokens "Dark Studio" — la charte MADDEV.
 * Les familles de police pointent vers des variables CSS qui sont
 * réaffectées selon la langue active (voir app/globals.css).
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0e0f14',
        ink2: '#14161c',
        ink3: '#1c1f28',
        line: 'rgba(255,255,255,.08)',
        line2: 'rgba(255,255,255,.14)',
        coral: '#ff5a5f',
        coral2: '#ff8a5f',
        txt: '#f4f2ef',
        txt2: '#a8a4ad',
        /*
         * Il n'y a volontairement pas de troisième niveau de gris.
         * L'ancien token txt3 (#6a6874) donnait 3,5:1 sur le fond ink,
         * sous le seuil AA de 4,5:1 : tout texte qui l'utilisait échouait.
         * La hiérarchie se fait désormais par la taille et la graisse,
         * jamais en descendant le contraste.
         */
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        brand: 'linear-gradient(120deg,#ff5a5f,#ff8a5f)',
        'brand-soft':
          'linear-gradient(120deg,rgba(255,90,95,.16),rgba(255,138,95,.16))',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,.04) inset, 0 20px 50px -30px rgba(0,0,0,.9)',
        glow: '0 0 60px -12px rgba(255,90,95,.55)',
        'glow-sm': '0 0 28px -8px rgba(255,90,95,.5)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        content: '1180px',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        halo: {
          '0%, 100%': { opacity: '.45', transform: 'scale(1)' },
          '50%': { opacity: '.85', transform: 'scale(1.08)' },
        },
        breathe: {
          '0%, 100%': { opacity: '.6', transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { opacity: '1', transform: 'translate3d(0,-2%,0) scale(1.06)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        /*
         * Lueur qui respire autour de l'entrée du configurateur.
         * Uniquement box-shadow : aucune incidence sur la mise en page,
         * donc aucun reflow pendant l'animation.
         */
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,90,95,0)' },
          '50%': { boxShadow: '0 0 22px 2px rgba(255,90,95,.18)' },
        },
        /* Scintillement de l'étincelle — discret, jamais clignotant. */
        twinkle: {
          '0%, 100%': { opacity: '.75', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.14) rotate(8deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 26s linear infinite',
        'spin-reverse': 'spin-reverse 34s linear infinite',
        halo: 'halo 6s ease-in-out infinite',
        breathe: 'breathe 14s ease-in-out infinite',
        'fade-in': 'fade-in .45s ease-out both',
        'glow-pulse': 'glow-pulse 3.6s ease-in-out infinite',
        twinkle: 'twinkle 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
