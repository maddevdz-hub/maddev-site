import Image from 'next/image';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
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
 *
 * ⚠️ Le texte vient entièrement de content/projects.ts, qui ne décrit que
 * ce qui est VÉRIFIABLE sur le site en ligne : l'activité, la ville, ce qui
 * a été livré, le lien. Une première version racontait ici comment le
 * client vendait avant — Facebook, téléphone, messages — information que
 * personne ne nous avait donnée. Ne rien ajouter qui ne se constate pas en
 * ouvrant le site.
 */
export function RealisationSection({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  if (!project.shots) return null;

  return (
    <section
      id="realisation"
      // Fond sombre, comme les blocs pairs : la section arrive après le
      // sixième service, qui porte le fond clair.
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-line py-20 sm:py-24 lg:py-28"
    >
      <AmbientBackground patternId="dd-realisation" intensity="soft" />

      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>{realisationUi.eyebrow[locale]}</Eyebrow>

            <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-txt">
              {project.title[locale]}
            </h2>

            <p className="text-[16px] leading-relaxed text-txt2 sm:text-[17px]">
              {project.result[locale]}
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
              {project.highlights[locale].map((item) => (
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

          Une colonne sous 640 px : en bande défilante, la première vue était
          coupée sans rien pour l'annoncer.
        */}
        <ul className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-[1fr_1fr_.52fr] sm:items-start sm:gap-6">
          {project.shots.map((shot) => {
            const telephone = shot.src.includes('produit');
            return (
              <li
                key={shot.src}
                className="flex flex-col gap-3"
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
