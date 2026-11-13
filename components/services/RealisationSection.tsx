import Image from 'next/image';

import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/Check';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { realisationUi, type Project } from '@/content/projects';
import type { Locale } from '@/i18n/config';

/**
 * La réalisation : le seul client réel du studio.
 *
 * Elle a sa section à elle, hors de la liste des services. Traité comme un
 * septième bloc, le seul travail livré se lisait comme une offre de plus,
 * au milieu de démonstrations fictives — alors que c'est la seule preuve
 * que quelque chose a été livré à quelqu'un.
 *
 * Aucune bande « projet fictif » ici : ce serait mentir dans l'autre sens.
 * Aucun chiffre de résultat non plus, et aucun témoignage : nous n'en avons
 * pas.
 */
export function RealisationSection({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  if (!project.context || !project.delivered || !project.shots) return null;

  return (
    <section
      id="realisation"
      className="scroll-mt-24 border-t border-line bg-ink2 py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>{realisationUi.eyebrow[locale]}</Eyebrow>

            <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-txt">
              {project.title[locale]}
            </h2>

            <p className="text-[16px] leading-relaxed text-txt2 sm:text-[17px]">
              {project.context[locale]}
            </p>

            <ButtonLink href={project.demoUrl ?? '#'} size="lg" external>
              {realisationUi.visit[locale]}
              <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </ButtonLink>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-[.14em] text-txt2">
              {realisationUi.deliveredLabel[locale]}
            </h3>
            <ul className="flex flex-col gap-3">
              {project.delivered[locale].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 h-5 w-5" />
                  <span className="text-[15px] leading-relaxed text-txt">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/*
          Trois vues du site en ligne. Les deux premières sont des écrans
          larges, la troisième un téléphone : elle garde donc sa proportion
          au lieu d'être étirée.
        */}
        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-[1fr_1fr_.52fr] sm:items-start sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
          {project.shots.map((shot) => {
            const telephone = shot.src.includes('produit');
            return (
              <li
                key={shot.src}
                className="flex w-[78%] shrink-0 snap-center flex-col gap-3 sm:w-auto"
              >
                <div
                  className={
                    telephone
                      ? 'overflow-hidden rounded-[1.4rem] border border-line2 bg-ink3'
                      : 'overflow-hidden rounded-xl border border-line2 bg-ink3'
                  }
                >
                  <Image
                    src={shot.src}
                    alt={`${project.title[locale]} — ${shot.caption[locale]}`}
                    width={telephone ? 780 : 2560}
                    height={telephone ? 1520 : 1600}
                    sizes="(min-width: 640px) 640px, 80vw"
                    className="h-auto w-full"
                  />
                </div>
                <p className="text-[14px] leading-snug text-txt2">
                  {shot.caption[locale]}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
