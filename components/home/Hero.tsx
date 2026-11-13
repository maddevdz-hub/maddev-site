import Link from 'next/link';
import { DDMark } from '@/components/brand/DDMark';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Badge';
import { withNumerals } from '@/components/ui/Numerals';
import { ServiceIconGlyph } from '@/components/ui/ServiceIcon';
import { primaryServices } from '@/content/services';
import { href, routes, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/**
 * Hero de l'accueil.
 *
 * AUCUNE animation d'entrée, volontairement. Le titre du hero est l'élément
 * LCP de la page : orchestré, il partait à `opacity: 0` et n'apparaissait
 * qu'une fois React hydraté — le Render Delay représentait alors plus de
 * 80 % du LCP. Le contenu visible au chargement s'affiche donc directement ;
 * `Reveal` est réservé à ce qui apparaît au défilement.
 *
 * Les seules animations qui restent ici sont décoratives et différées
 * (halo, anneaux) : elles ne retiennent aucun texte.
 */
export function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.home.hero;

  const stats = [t.stats.stack, t.stats.response, t.stats.ratio];

  return (
    <section className="relative isolate overflow-hidden">
      <AmbientBackground />

      <Container>
        <div className="grid items-center gap-12 py-10 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-10 lg:py-20">
          {/* Colonne texte */}
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <Eyebrow>{t.eyebrow}</Eyebrow>

            <h1
              className="text-[clamp(2.3rem,7.5vw,4.2rem)] font-bold leading-[1.08] tracking-tight text-txt"
            >
              {t.titleLine1}
              <br />
              <span className="text-coral">{t.titleAccent}</span>
            </h1>

            <p
              className="max-w-xl text-base leading-relaxed text-txt2 sm:text-lg"
            >
              {t.subtitle}
            </p>

            {/*
              UN bouton principal. L'action secondaire permanente est
              « Demander un devis », dans l'en-tête (barre fixe sur mobile) :
              le premier écran porte donc une action principale et une
              secondaire, pas cinq appels à l'action.
            */}
            <ButtonLink
              href={href(locale, routes.contact)}
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.ctaPrimary}
              <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </ButtonLink>

            {/*
              Les six services, visibles sans défiler. Ce sont des liens de
              navigation, pas des boutons : chacun mène à son bloc de
              /services. Un visiteur doit savoir ce qu'on vend avant de
              toucher à la molette.
            */}
            <nav aria-label={dict.nav.services} className="w-full">
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {primaryServices.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`${href(locale, routes.services)}#${service.slug}`}
                      className="flex min-h-[48px] items-center gap-2.5 rounded-xl border border-line bg-white/[.03] px-3 py-2 text-[14px] font-semibold leading-tight text-txt transition-colors duration-200 hover:border-coral/45 hover:bg-white/[.06]"
                    >
                      <ServiceIconGlyph
                        name={service.glyph}
                        className="h-[18px] w-[18px] shrink-0 text-coral2"
                      />
                      {service.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mini-statistiques */}
            <dl
              className="flex w-full flex-wrap items-stretch gap-x-8 gap-y-4 border-t border-line pt-6"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <dt className="sr-only">{stat.label}</dt>
                  {/*
                    Seuls les chiffres sont isolés, pas la valeur entière : en
                    arabe, « 24 س » mis tout entier de gauche à droite plaçait
                    l'unité avant le nombre à la lecture.
                  */}
                  <dd className="font-display text-xl font-bold text-txt">
                    {withNumerals(stat.value)}
                  </dd>
                  <dd className="text-xs text-txt2">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Colonne visuelle : symbole DD, anneaux rotatifs, halo pulsant */}
          <div
                        className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center lg:max-w-none"
          >
            <HeroEmblem alt={t.logoAlt} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Le symbole de marque mis en scène : halo, anneaux, points orbitaux. */
function HeroEmblem({ alt }: { alt: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Halo pulsant */}
      <div
        aria-hidden="true"
        className="absolute h-[62%] w-[62%] rounded-full blur-2xl animate-halo"
        style={{
          background:
            'radial-gradient(circle, rgba(255,90,95,.55) 0%, rgba(255,138,95,.18) 55%, transparent 72%)',
        }}
      />

      {/* Anneau extérieur — tourne dans un sens */}
      <div
        aria-hidden="true"
        className="absolute inset-[4%] rounded-full border border-line2 animate-spin-slow"
      >
        <span className="absolute -top-1 start-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-coral shadow-glow-sm" />
      </div>

      {/* Anneau intermédiaire — tourne dans l'autre sens */}
      <div
        aria-hidden="true"
        className="absolute inset-[16%] rounded-full border border-dashed border-white/[.09] animate-spin-reverse"
      >
        <span className="absolute -bottom-1 start-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-coral2" />
      </div>

      {/* Anneau intérieur, statique */}
      <div
        aria-hidden="true"
        className="absolute inset-[28%] rounded-full border border-line bg-ink3/40 backdrop-blur-sm"
      />

      <DDMark
        title={alt}
        className="relative w-[38%] drop-shadow-[0_0_28px_rgba(255,90,95,.35)]"
      />
    </div>
  );
}
