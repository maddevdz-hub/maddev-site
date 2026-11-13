'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { LangToggle } from './LangToggle';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { href, routes, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

type NavItem = { path: string; label: string };

export function Header({
  locale,
  nav,
}: {
  locale: Locale;
  nav: {
    home: string;
    services: string;
    process: string;
    contact: string;
    about: string;
    quiz: string;
    cta: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    skipToContent: string;
  };
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const items: NavItem[] = [
    { path: routes.home, label: nav.home },
    { path: routes.services, label: nav.services },
    { path: routes.process, label: nav.process },
    // La confiance passe par un visage : la page « qui sommes-nous »
    // mérite d'être atteignable depuis n'importe où, pas seulement du footer.
    { path: routes.about, label: nav.about },
    { path: routes.contact, label: nav.contact },
  ];

  // Le header se densifie une fois la page défilée.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Referme le menu mobile après une navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Bloque le défilement de l'arrière-plan quand le menu mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Échap ferme le menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  function isActive(path: string) {
    const full = href(locale, path);
    return path === routes.home ? pathname === full : pathname.startsWith(full);
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-coral px-4 py-2 text-sm font-semibold text-[#1a0c0c] focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60]"
      >
        {nav.skipToContent}
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          scrolled || menuOpen
            ? 'border-b border-line bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
            <Logo locale={locale} />

            <nav
              aria-label={nav.home}
              className="hidden items-center gap-1 lg:flex"
            >
              {items.map((item) => (
                <Link
                  key={item.path}
                  href={href(locale, item.path)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                    isActive(item.path)
                      ? 'text-txt'
                      : 'text-txt2 hover:text-txt',
                  )}
                >
                  {item.label}
                  {isActive(item.path) ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-coral"
                    />
                  ) : null}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <LangToggle locale={locale} label={nav.switchLanguage} />

              {/*
                « Demander un devis », toujours accessible. Volontairement en
                bouton SECONDAIRE : le dégradé est réservé à l'action
                principale de chaque écran. Sous 640 px, l'en-tête n'a pas la
                place — le même bouton vit dans une barre fixe en bas d'écran.
              */}
              <ButtonLink
                href={href(locale, routes.contact)}
                variant="secondary"
                size="md"
                className="hidden sm:inline-flex"
              >
                {nav.cta}
              </ButtonLink>

              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/[.04] text-txt transition-colors hover:border-coral/40 lg:hidden"
              >
                <BurgerIcon open={menuOpen} />
              </button>
            </div>
          </div>
        </Container>

        {/* Navigation mobile — panneau déroulant sous le header */}
        <div
          id="mobile-nav"
          hidden={!menuOpen}
          className="border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
        >
          <Container>
            <nav aria-label={nav.home} className="flex flex-col py-4">
              {items.map((item) => (
                <Link
                  key={item.path}
                  href={href(locale, item.path)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium transition-colors',
                    isActive(item.path)
                      ? 'bg-white/[.05] text-txt'
                      : 'text-txt2 hover:bg-white/[.03] hover:text-txt',
                  )}
                >
                  {item.label}
                  {isActive(item.path) ? (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-coral"
                    />
                  ) : null}
                </Link>
              ))}
              {/* Le configurateur, atteignable aussi depuis le menu mobile. */}
              <Link
                href={href(locale, routes.quiz)}
                className="mt-2 flex items-center gap-2.5 rounded-xl border border-coral/25 bg-coral/[.07] px-3 py-3.5 text-base font-medium text-txt"
              >
                <SparkGlyph />
                {nav.quiz}
              </Link>

            </nav>
          </Container>
        </div>
      </header>

      {/*
        Barre fixe du devis, mobile seulement. Absente sur la page contact
        (on y est déjà) et quand le menu est ouvert.
      */}
      {!menuOpen && !isActive(routes.contact) ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl sm:hidden">
          <ButtonLink
            href={href(locale, routes.contact)}
            variant="secondary"
            size="md"
            className="w-full"
          >
            {nav.cta}
          </ButtonLink>
        </div>
      ) : null}
    </>
  );
}

/** Étincelle du raccourci configurateur. */
function SparkGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-coral2"
    >
      <path d="M12 2.5 13.7 8.3 19.5 10 13.7 11.7 12 17.5 10.3 11.7 4.5 10 10.3 8.3 12 2.5Z" />
      <path d="M18.5 15.5 19.3 18 21.5 18.8 19.3 19.6 18.5 22 17.7 19.6 15.5 18.8 17.7 18Z" />
    </svg>
  );
}

/** Icône hamburger qui se transforme en croix. */
function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-5">
      <span
        className={cn(
          'absolute inset-x-0 top-0.5 h-[1.6px] rounded bg-current transition-transform duration-300 motion-reduce:transition-none',
          open && 'translate-y-[6px] rotate-45',
        )}
      />
      <span
        className={cn(
          'absolute inset-x-0 top-[7px] h-[1.6px] rounded bg-current transition-opacity duration-200',
          open && 'opacity-0',
        )}
      />
      <span
        className={cn(
          'absolute inset-x-0 top-[13.5px] h-[1.6px] rounded bg-current transition-transform duration-300 motion-reduce:transition-none',
          open && '-translate-y-[6.5px] -rotate-45',
        )}
      />
    </span>
  );
}
