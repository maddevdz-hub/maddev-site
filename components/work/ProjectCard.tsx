import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectVisual } from '@/components/ui/Visuals';
import { RevealItem } from '@/components/ui/Reveal';
import type { Project } from '@/content/projects';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/** Carte d'une réalisation. */
export function ProjectCard({
  project,
  locale,
  dict,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
}) {
  const labels = dict.work.labels;

  return (
    <RevealItem
      as="article"
      // scroll-mt compense le header fixe : le configurateur renvoie ici
      // par une ancre depuis l'écran de résultat.
      id={project.slug}
      className="card flex scroll-mt-28 flex-col overflow-hidden"
    >
      <div className="border-b border-line bg-ink2/70 p-5 sm:p-7">
        <ProjectVisual project={project} locale={locale} priority />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-xl font-bold leading-snug text-txt sm:text-2xl">
            {project.title[locale]}
          </h2>
          <Badge className="w-fit">{project.kind[locale]}</Badge>
        </div>

        {/* Chiffres mesurés uniquement */}
        <dl className="grid grid-cols-3 gap-3 border-y border-line py-4">
          {project.stats.map((stat) => (
            <div key={stat.value} className="flex flex-col gap-1">
              <dt className="sr-only">{stat.label[locale]}</dt>
              <dd
                className="numerals text-lg font-bold text-gradient sm:text-xl"
                dir="ltr"
              >
                {stat.value}
              </dd>
              <dd className="text-xs leading-snug text-txt2">
                {stat.label[locale]}
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <h3 className="eyebrow-label mb-1.5 text-txt2">{labels.result}</h3>
          <p className="text-[15px] leading-relaxed text-txt2">
            {project.result[locale]}
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {project.highlights[locale].map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-txt2"
            >
              <span
                aria-hidden="true"
                className="mt-[.5rem] h-1 w-1 shrink-0 rounded-full bg-coral2"
              />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-1">
          {project.demoUrl ? (
            <ButtonLink
              href={project.demoUrl}
              external
              size="lg"
              className="w-full sm:w-auto"
            >
              {labels.visit}
              <ExternalIcon />
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </RevealItem>
  );
}

/** Indique explicitement que le lien s'ouvre dans un nouvel onglet. */
function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </svg>
  );
}
