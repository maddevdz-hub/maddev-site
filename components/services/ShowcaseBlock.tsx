import Link from 'next/link';

import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/Check';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ShowcaseFigure } from '@/components/services/ShowcaseVisuals';
import { DemoEmbed } from '@/components/services/DemoEmbed';
import { ShowcaseSteps } from '@/components/services/ShowcaseSteps';
import { ServiceJourney } from '@/components/services/ServiceJourney';
import { showcaseUi, type Service } from '@/content/services';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

/**
 * Un bloc de service.
 *
 * Règle de composition : **l'image domine**. Elle occupe la moitié la plus
 * large sur grand écran et passe en premier sur mobile — un visiteur qui
 * parcourt la page en diagonale doit voir six écrans, pas six paragraphes.
 *
 * Rythme : chaque bloc est un écran à lui seul. L'espace au-dessus et
 * au-dessous est large, et l'écart entre l'image et le texte reste nettement
 * plus petit que l'écart entre deux blocs — sans quoi l'image semble
 * appartenir au bloc précédent.
 *
 * Les fonds alternent eux aussi, ink et ink2 : six blocs sur un même fond
 * se lisent comme un seul bloc très long. Le filigrane DD ne court que sur
 * les sections à fond ink — répété sur chaque section, il cesse d'être un
 * fond pour devenir une texture.
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
  // …et portent le fond sombre, donc le filigrane.
  const fondSombre = index % 2 === 0;

  return (
    <section
      id={item.slug}
      className={cn(
        'relative isolate scroll-mt-24 overflow-hidden border-t border-line py-20 first:border-t-0 sm:py-24 lg:py-36',
        fondSombre ? null : 'bg-ink2',
      )}
    >
      {fondSombre ? (
        <AmbientBackground patternId={`dd-${item.slug}`} intensity="soft" />
      ) : null}

      <Container>
        <div className="grid items-center gap-12 sm:gap-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-20 xl:gap-24">
          {/*
            Le visuel. Optionnel dans le type parce que les deux offres
            secondaires n'en ont pas — elles ne passent jamais par ce bloc,
            mais le type reste honnête plutôt que de promettre une image que
            deux services sur huit n'ont pas.
          */}
          {item.journey ? (
            <Reveal
              className={imageFirst ? 'lg:order-1' : 'lg:order-2'}
              delay={0.05}
            >
              <ServiceJourney
                glyph={item.glyph}
                steps={item.journey}
                locale={locale}
                note={showcaseUi.demoOnRequest[locale]}
              />
            </Reveal>
          ) : item.visual ? (
            <Reveal
              className={imageFirst ? 'lg:order-1' : 'lg:order-2'}
              delay={0.05}
            >
              {/*
                Service avec démo : la démo elle-même, essayable dans la page
                sur grand écran ; la capture sur mobile.
              */}
              {item.demoHref ? (
                <DemoEmbed
                  src={item.demoHref}
                  title={`${showcaseUi.demoFrameTitle[locale]} — ${item.name[locale]}`}
                  tryLabel={showcaseUi.tryHere[locale]}
                  openLabel={showcaseUi.openFull[locale]}
                  fallback={
                    <ShowcaseFigure
                      visual={item.visual}
                      alt={item.benefit[locale]}
                    />
                  }
                />
              ) : (
                <ShowcaseFigure
                  visual={item.visual}
                  alt={item.benefit[locale]}
                />
              )}
            </Reveal>
          ) : null}

          {/* Le texte, qui accompagne l'image sans la remplacer */}
          <div className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
            {/*
              Le badge ne dit que ce qui existe : un client réel, ou une
              démonstration qu'on peut ouvrir. Il annonçait aussi
              « Démonstration en préparation » — souligner ce qui manque,
              c'est exactement ce qui a fait supprimer /realisations. Le
              visuel dessiné suffit.
            */}
            {item.realClient || item.demoHref ? (
              <p className="mb-5 inline-flex items-center gap-2 rounded-xl border border-line2 px-3 py-1.5 text-[12px] font-semibold uppercase leading-snug tracking-[.12em] text-txt2 sm:rounded-full sm:py-1">
                {item.realClient ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-coral2" />
                    {showcaseUi.realNote[locale]}
                  </>
                ) : (
                  showcaseUi.demoNote[locale]
                )}
              </p>
            ) : null}

            <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-txt">
              {item.benefit[locale]}
            </h2>

            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-txt2 sm:text-[17px]">
              {item.lead[locale]}
            </p>

            {/* Trois points. Jamais plus : au-delà, la liste devient un mur. */}
            <ul className="mt-7 flex flex-col gap-3">
              {item.points[locale].map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 h-5 w-5" />
                  <span className="text-[15px] leading-relaxed text-txt">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-7 text-[14px] text-txt2">
              <span className="font-semibold text-txt">
                {showcaseUi.delayLabel[locale]}
              </span>{' '}
              · {item.timeline[locale]}
            </p>

            {/*
              Sur mobile : le bouton principal prend toute la largeur, le
              devis reste un lien souligné, centré dessous — une action
              principale, une secondaire, jamais deux boutons de même poids.
            */}
            <div className="mt-9 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {item.demoHref ? (
                <ButtonLink
                  href={item.demoHref}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {showcaseUi.seeDemo[locale]}
                  <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </ButtonLink>
              ) : null}

              {item.realClient ? (
                <ButtonLink
                  href={item.realClient.url}
                  size="lg"
                  // Une ancre reste dans la page : ni nouvel onglet, ni
                  // composant Link, qui refuserait un href commençant par #.
                  external={!item.realClient.url.startsWith('#')}
                  raw={item.realClient.url.startsWith('#')}
                  className="w-full sm:w-auto"
                >
                  {item.realClient.label[locale]}
                </ButtonLink>
              ) : null}

              <Link
                href={`/${locale}/contact?service=${item.slug}`}
                className="inline-flex min-h-[44px] items-center justify-center text-[15px] font-semibold text-txt2 underline underline-offset-4 transition-colors hover:text-txt"
              >
                {showcaseUi.quote[locale]}
              </Link>
            </div>
          </div>
        </div>

        {item.steps ? <ShowcaseSteps steps={item.steps} locale={locale} /> : null}
      </Container>
    </section>
  );
}
