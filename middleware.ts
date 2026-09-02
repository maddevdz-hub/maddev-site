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
   * Les démonstrations vivent hors de l'arborescence du site : leur langue
   * est le DERNIER segment (/demo/menu/fr), pas le premier. Sans cette
   * branche, /demo/menu/fr serait redirigé vers /ar/demo/menu/fr.
   *
   * Une adresse courte — /demo/menu, celle que porte le QR code imprimé —
   * est complétée par la langue du visiteur. C'est volontairement la seule
   * forme communiquée : elle survit à un changement de langue par défaut.
   */
  if (pathname === '/demo' || pathname.startsWith('/demo/')) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 2) {
      const url = request.nextUrl.clone();
      url.pathname = `${pathname}/${resolveLocale(request)}`;
      return NextResponse.redirect(url);
    }
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
