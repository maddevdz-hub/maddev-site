/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Produit par `npm run photos` (scripts/photos.mjs).
 *
 * Dimensions réelles et vignette floue de chaque photographie de la
 * démonstration. Les composants les lisent ici : une image recadrée ne doit
 * jamais obliger à corriger un nombre dans un JSX.
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  /** Aplat flou de 16 px, affiché le temps que la photo arrive. */
  blur: string;
};

export const photos = {
  "entete.webp": {
    "src": "/demo/menu/entete.webp",
    "width": 2400,
    "height": 704,
    "blur": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAUAA4BaJZQCsADv9YX/wAD+5fVYsOhNcwfHloC4xnitUUqXkyzJ1AZ6hO08pht6K4xiAAA="
  },
  "bandeau-cafes.webp": {
    "src": "/demo/menu/bandeau-cafes.webp",
    "width": 1800,
    "height": 810,
    "blur": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAcAA4BaJQBOgB9TX6dMMgAA/pt+bN2siRgjxdZP0BektIOCw6buD6FmqR7zI35dwXeMoMvMSaqxntWvz5LJQncIAA=="
  }
} satisfies Record<string, Photo>;
