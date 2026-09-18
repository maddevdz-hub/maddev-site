import Link from 'next/link';

import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/Check';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ShowcaseFigure } from '@/components/services/ShowcaseVisuals';
import { showcaseUi, type Service } from '@/content/services';
import type { Locale } from '@/i18n/config';

/**
 * Un bloc de service.
 *
 * Règle de composition : **l'image domine**. Elle occupe la moitié la plus
 * large sur grand écran et passe en premier sur mobile — un visiteur qui
 * parcourt la page en diagonale doit voir six écrans, pas six paragraphes.
 *
 * Les blocs alternent de côté. Ce n'est pas de la décoration : six blocs
 * identiques empilés se lisent comme une liste, et l'œil décroche au
 * troisième.
 */
export function ShowcaseBlock({
  item,
  index,
  locale,
}: {
  item: Service;
  index: number;
  locale: Locale;
}) {
  // Les blocs pairs mettent l'image en premier dans le sens de lecture.
  const imageFirst = index % 2 === 0;

  return (
    <section
      id={item.slug}
      className="scroll-mt-24 border-t border-line py-16 first:border-t-0 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="grid items-center gap-10 lg:gap-14 xl:gap-16 lg:grid-cols-[1.08fr_.92fr]">
          {/*
            Le visuel. Optionnel dans le type parce que les deux offres
            secondaires n'en ont pas — elles ne passent jamais par ce bloc,
            mais le type reste honnête plutôt que de promettre une image que
            deux services sur huit n'ont pas.
          */}
          {item.visual ? (
            <Reveal
              className={imageFirst ? 'lg:order-1' : 'lg:order-2'}
              delay={0.05}
            >
              <ShowcaseFigure
                visual={item.visual}
                alt={item.benefit[locale]}
                locale={locale}
              />
            </Reveal>
          ) : null}

          {/* Le texte, qui accompagne l'image sans la remplacer */}
          <div className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line2 px-3 py-1 text-[12px] font-semibold uppercase tracking-[.12em] text-txt2">
              {item.realClient ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-coral2" />
                  {showcaseUi.realNote[locale]}
                </>
              ) : item.demoHref ? (
                showcaseUi.demoNote[locale]
              ) : (
                showcaseUi.soon[locale]
              )}
            </p>

            <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-txt">
              {item.benefit[locale]}
            </h2>

            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-txt2 sm:text-[17px]">
              {item.lead[locale]}
            </p>

            {/* Trois points. Jamais plus : au-delà, la liste devient un mur. */}
            <ul className="mt-6 flex flex-col gap-2.5">
              {item.points[locale].map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 h-5 w-5" />
                  <span className="text-[15px] leading-relaxed text-txt">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[14px] text-txt2">
              <span className="font-semibold text-txt">
                {showcaseUi.delayLabel[locale]}
              </span>{' '}
              · {item.timeline[locale]}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {item.demoHref ? (
                <ButtonLink href={item.demoHref} size="lg">
                  {showcaseUi.seeDemo[locale]}
                  <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </ButtonLink>
              ) : null}

              {item.realClient ? (
                <ButtonLink href={item.realClient.url} size="lg" external>
                  {item.realClient.label[locale]}
                </ButtonLink>
              ) : null}

              <Link
                href={`/${locale}/contact?service=${item.slug}`}
                className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-txt2 underline underline-offset-4 transition-colors hover:text-txt"
              >
                {locale === 'ar' ? 'اطلب عرضًا' : 'Demander un devis'}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
