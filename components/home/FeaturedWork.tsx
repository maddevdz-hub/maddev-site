import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { Badge, Eyebrow } from '@/components/ui/Badge';
import { ProjectVisual } from '@/components/ui/Visuals';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { projects } from '@/content/projects';
import { href, routes, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/**
 * Réalisation mise en avant sur l'accueil.
 *
 * Le contenu vient de content/projects.ts, pas des fichiers de traduction :
 * la vedette est toujours le premier projet de la liste, donc ajouter une
 * réalisation devant suffit à changer l'accueil.
 */
export function FeaturedWork({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.home.featured;
  const project = projects[0];
  if (!project) return null;

  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col items-start gap-5">
          <Eyebrow>{t.eyebrow}</Eyebrow>

          <h2 className="text-[clamp(1.6rem,4.2vw,2.4rem)] font-bold leading-tight tracking-tight text-txt">
            {project.title[locale]}
          </h2>

          <Badge tone="brand">{project.kind[locale]}</Badge>

          <p className="text-base leading-relaxed text-txt2 sm:text-lg">
            {project.result[locale]}
          </p>

          {/* Chiffres mesurés */}
          <dl className="flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-5">
            {project.stats.map((stat) => (
              <div key={stat.value} className="flex flex-col gap-0.5">
                <dt className="sr-only">{stat.label[locale]}</dt>
                <dd
                  className="numerals text-xl font-bold text-gradient"
                  dir="ltr"
                >
                  {stat.value}
                </dd>
                <dd className="text-xs text-txt2">{stat.label[locale]}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            {project.demoUrl ? (
              <ButtonLink href={project.demoUrl} external>
                {dict.work.labels.visit}
              </ButtonLink>
            ) : null}
            <ButtonLink href={href(locale, routes.services)} variant="secondary">
              {t.cta}
              <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <ProjectVisual project={project} locale={locale} />
        </Reveal>
      </div>
    </Section>
  );
}
