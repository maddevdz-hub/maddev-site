import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Toutes les pages vivent sous /ar/... ou /fr/....
 * Ce middleware redirige les URL sans préfixe (/, /services, …) vers la
 * bonne langue, en respectant dans l'ordre :
 *   1. le choix mémorisé par l'utilisateur (cookie posé par le LangToggle),
 *   2. l'en-tête Accept-Language du navigateur,
 *   3. l'arabe, langue par défaut.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisse passer les assets, l'API et les fichiers statiques.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  /*
   * Les démonstrations vivent hors de l'arborescence du site et sont en
   * FRANÇAIS SEUL : elles n'ont donc pas de préfixe de langue, et le
   * middleware doit les laisser passer telles quelles. Sans cette branche,
   * /demo/menu serait redirigé vers /ar/demo/menu, qui n'existe pas.
   */
  if (pathname === '/demo' || pathname.startsWith('/demo/')) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

function resolveLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get('maddev_locale')?.value;
  if (cookie && locales.includes(cookie as Locale)) {
    return cookie as Locale;
  }

  const accept = request.headers.get('accept-language')?.toLowerCase() ?? '';
  // Un visiteur francophone arrive directement en français ; tous les autres
  // voient l'arabe, qui reste la langue principale du studio.
  if (accept.includes('fr')) return 'fr';
  if (accept.includes('ar')) return 'ar';

  return defaultLocale;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
