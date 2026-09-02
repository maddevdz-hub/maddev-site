import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckList } from '@/components/ui/Check';
import { ServiceVisual } from '@/components/ui/Visuals';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceIconBadge } from '@/components/ui/ServiceIcon';
import type { Service } from '@/content/services';
import { href, routes, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

/**
 * Bloc détaillé d'un service — le cœur de la page Services.
 *
 * Les blocs alternent : le visuel passe d'un côté puis de l'autre.
 * En RTL, l'alternance suit le sens de lecture puisqu'elle repose sur
 * l'ordre du flux (order-*) et non sur des positions gauche/droite figées.
 */
export function ServiceBlock({
  service,
  locale,
  dict,
  index,
}: {
  service: Service;
  locale: Locale;
  dict: Dictionary;
  /** Sert à alterner la disposition. */
  index: number;
}) {
  const labels = dict.services.labels;
  const reversed = index % 2 === 1;

  return (
    <article
      id={service.slug}
      // scroll-mt compense le header fixe quand on arrive par une ancre.
      className="scroll-mt-28 border-t border-line py-14 first:border-t-0 lg:py-20"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Colonne contenu */}
        <Reveal
          className={cn(
            'flex flex-col items-start gap-6',
            reversed && 'lg:order-2',
          )}
        >
          <div className="flex items-center gap-4">
            <ServiceIconBadge name={service.icon} size="lg" />
            {/*
              Le titre porte le bénéfice, pas le nom du produit : le client
              cherche ce qu'il obtient, pas ce qu'on fabrique. L'étiquette
              « Site vitrine » survit dans la navigation et le formulaire,
              là où il faut un nom court.
            */}
            <h2 className="text-[clamp(1.6rem,4vw,2.35rem)] font-bold leading-tight tracking-tight text-txt">
              {service.benefit[locale]}
            </h2>
          </div>

          {/* La ligne concrète, juste sous le bénéfice */}
          <p className="border-s-2 border-coral/60 ps-4 text-lg font-semibold leading-snug text-txt sm:text-xl">
            {service.promise[locale]}
          </p>

          <p className="text-[15px] leading-relaxed text-txt2 sm:text-base">
            {service.description[locale]}
          </p>

          {/* Ce que vous obtenez */}
          <div className="w-full">
            <h3 className="eyebrow-label mb-4 text-txt2">
              {labels.deliverables}
            </h3>
            <CheckList items={service.deliverables[locale]} />
          </div>

          {/* Pour qui ? */}
          <div className="w-full rounded-2xl border border-line bg-white/[.02] p-5">
            <h3 className="eyebrow-label mb-2 text-txt2">{labels.audience}</h3>
            <p className="text-[15px] leading-relaxed text-txt2">
              {service.audience[locale]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="brand">
              <ClockIcon />
              <span className="text-txt2">{labels.timeline} :</span>
              <span className="font-bold text-coral2">
                {service.timeline[locale]}
              </span>
            </Badge>
          </div>

          {/*
            Le devis arrive sur /contact avec le service déjà sélectionné
            dans le menu déroulant du formulaire.
          */}
          <ButtonLink
            href={`${href(locale, routes.contact)}?service=${service.slug}`}
            size="lg"
          >
            {labels.quote}
            <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </ButtonLink>
        </Reveal>

        {/* Colonne visuelle : visuel de marque + phrase de résultat */}
        <Reveal
          delay={0.1}
          className={cn(
            'flex flex-col gap-5',
            reversed && 'lg:order-1',
          )}
        >
          <ServiceVisual icon={service.icon} id={service.slug} />

          <div className="rounded-2xl border border-coral/20 bg-brand-soft p-5">
            <h3 className="eyebrow-label mb-2 text-coral2">{labels.result}</h3>
            <p className="text-[15px] font-medium leading-relaxed text-txt">
              {service.result[locale]}
            </p>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-3.5 w-3.5 text-coral2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}
