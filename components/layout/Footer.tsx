import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/Container';
import { DDPattern } from '@/components/brand/DDPattern';
import { services } from '@/content/services';
import { site, whatsappLink } from '@/content/site';
import { href, routes, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();
  const nav = dict.nav;
  const t = dict.footer;

  const navItems = [
    { path: routes.home, label: nav.home },
    { path: routes.services, label: nav.services },
    { path: routes.process, label: nav.process },
    { path: routes.about, label: nav.about },
    { path: routes.compare, label: nav.compare },
    { path: routes.contact, label: nav.contact },
    { path: routes.quiz, label: nav.quiz },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink2">
      <DDPattern opacity={0.014} scale={150} id="dd-footer" />

      <Container className="relative">
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-8">
          {/* Marque */}
          <div className="flex flex-col gap-4">
            <Logo locale={locale} gradientId="dd-footer-logo" />
            <p className="max-w-xs text-sm leading-relaxed text-txt2">
              {t.tagline}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-labelledby="footer-nav">
            <h2
              id="footer-nav"
              className="eyebrow-label mb-4 text-txt2"
            >
              {t.navTitle}
            </h2>
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={href(locale, item.path)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center text-sm text-txt2 transition-colors hover:text-txt"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="eyebrow-label mb-4 text-txt2"
            >
              {t.servicesTitle}
            </h2>
            <ul className="flex flex-col">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`${href(locale, routes.services)}#${service.slug}`}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center text-sm text-txt2 transition-colors hover:text-txt"
                  >
                    {service.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="eyebrow-label mb-4 text-txt2">{t.contactTitle}</h2>
            <ul className="flex flex-col">
              <li>
                <a
                  href={whatsappLink(locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center text-sm text-txt2 transition-colors hover:text-txt"
                >
                  {/* Le numéro reste en écriture latine, même en arabe. */}
                  <span className="numerals inline-block">
                    {site.phoneDisplay}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center text-sm text-txt2 transition-colors hover:text-txt"
                  dir="ltr"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline h-px" />

        <div className="flex flex-col gap-2 py-6 text-xs text-txt2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="numerals">© {year}</span> {site.name} — {t.rights}
          </p>
          <p>{t.builtWith}</p>
        </div>
      </Container>
    </footer>
  );
}
