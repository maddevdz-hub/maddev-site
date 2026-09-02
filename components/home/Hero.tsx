import Link from 'next/link';
import { DDMark } from '@/components/brand/DDMark';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { ArrowIcon, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Badge';
import { href, routes, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';
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
      <AmbientBackground patternId="dd-hero" />

      <Container>
        <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:gap-10 lg:py-28">
          {/* Colonne texte */}
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>{t.eyebrow}</Eyebrow>

            <h1
              className="text-[clamp(2.3rem,7.5vw,4.2rem)] font-bold leading-[1.08] tracking-tight text-txt"
            >
              {t.titleLine1}
              <br />
              <span className="text-gradient">{t.titleAccent}</span>
            </h1>

            <p
              className="max-w-xl text-base leading-relaxed text-txt2 sm:text-lg"
            >
              {t.subtitle}
            </p>

            <div
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <ButtonLink href={href(locale, routes.contact)} size="lg">
                {t.ctaPrimary}
                <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </ButtonLink>
              <ButtonLink
                href={href(locale, routes.services)}
                variant="secondary"
                size="lg"
              >
                {t.ctaSecondary}
              </ButtonLink>
            </div>

            {/*
              Porte d'entrée pour le visiteur qui ne sait pas encore ce qu'il
              cherche : quatre questions valent mieux qu'un formulaire vide.

              Traitée en carte, pas en pilule : elle doit accrocher l'œil sans
              rivaliser avec les deux CTA principaux. D'où un fond corail
              translucide plutôt que le dégradé plein, réservé à l'action
              principale. La lueur qui respire attire le regard ; elle n'anime
              qu'une ombre, donc rien à recalculer dans la mise en page.
            */}
            <div className="w-full pt-2 sm:w-auto">
              <Link
                href={href(locale, routes.quiz)}
                className="group flex w-full animate-glow-pulse items-center gap-3.5 rounded-2xl border border-coral/30 bg-coral/[.09] px-4 py-3.5 transition-[transform,background-color,border-color] duration-300 hover:scale-[1.02] hover:border-coral/60 hover:bg-coral/[.15] motion-reduce:hover:transform-none sm:w-auto"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-coral/30 bg-brand-soft transition-colors duration-300 group-hover:border-coral/55">
                  <SparkGlyph className="h-5 w-5 animate-twinkle" />
                </span>

                <span className="flex flex-1 flex-col gap-0.5 text-start">
                  <span className="text-[15px] font-bold leading-snug text-txt sm:text-base">
                    {dict.quiz.heroCtaTitle}
                  </span>
                  <span className="text-[13px] leading-snug text-txt2 transition-colors duration-300 group-hover:text-txt sm:text-sm">
                    {dict.quiz.heroCtaText}
                  </span>
                </span>

                <ArrowIcon className="h-4 w-4 shrink-0 text-coral2 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </Link>
            </div>

            {/* Mini-statistiques */}
            <dl
              className="mt-2 flex flex-wrap items-stretch gap-x-8 gap-y-4 border-t border-line pt-6"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-xl font-bold text-txt" dir="ltr">
                    {stat.value}
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

/** Petite étincelle décorative devant l'entrée du configurateur. */
function SparkGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('h-4 w-4 shrink-0 text-coral2', className)}
    >
      <path d="M12 2.5 13.7 8.3 19.5 10 13.7 11.7 12 17.5 10.3 11.7 4.5 10 10.3 8.3 12 2.5Z" />
      <path d="M18.5 15.5 19.3 18 21.5 18.8 19.3 19.6 18.5 22 17.7 19.6 15.5 18.8 17.7 18Z" />
    </svg>
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
        gradientId="dd-hero-mark"
        title={alt}
        className="relative w-[38%] drop-shadow-[0_0_28px_rgba(255,90,95,.35)]"
      />
    </div>
  );
}
