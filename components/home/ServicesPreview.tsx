import Link from 'next/link';
import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceIconBadge } from '@/components/ui/ServiceIcon';
import { primaryServices } from '@/content/services';
import { href, routes, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/**
 * Aperçu des services — chaque carte mène à son bloc détaillé.
 *
 * Seuls les six services principaux : les deux offres secondaires ont leur
 * carte en bas de /services, les mettre ici en ferait des égales des six
 * autres alors qu'elles se commandent rarement.
 */
export function ServicesPreview({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.home.services;

  return (
    <Section tone="alt">
      <div className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow={t.eyebrow}
            title={t.title}
            subtitle={t.subtitle}
          />
        </Reveal>

        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {primaryServices.map((service) => (
            <RevealItem key={service.slug}>
              <Link
                href={`${href(locale, routes.services)}#${service.slug}`}
                className="card group flex h-full flex-col gap-4 p-6 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-coral/30 hover:bg-ink3 motion-reduce:hover:transform-none"
              >
                <ServiceIconBadge name={service.glyph} />
                {/* Le bénéfice en titre, le concret dessous. */}
                <h3 className="text-lg font-bold leading-snug text-txt">
                  {service.benefit[locale]}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-txt2">
                  {service.lead[locale]}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral2">
                  {t.cardCta}
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="flex justify-center">
          <ButtonLink
            href={href(locale, routes.services)}
            variant="secondary"
            size="lg"
          >
            {t.cta}
            <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
