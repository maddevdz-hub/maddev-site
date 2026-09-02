'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Eyebrow } from '@/components/ui/Badge';
import { ArrowIcon, Button, ButtonLink } from '@/components/ui/Button';
import { CheckList } from '@/components/ui/Check';
import { ProjectVisual, ServiceVisual } from '@/components/ui/Visuals';
import { ServiceIconBadge } from '@/components/ui/ServiceIcon';
import { LeadCapture } from './LeadCapture';
import { projects } from '@/content/projects';
import { whatsappQuizLink } from '@/content/site';
import {
  conclusions,
  situations,
  type Answers,
  type Recommendation,
} from '@/lib/configurator';
import { href, routes, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { EASE } from '@/lib/motion';

/**
 * Écran de résultat du configurateur.
 *
 * L'apparition est orchestrée de haut en bas pour donner la sensation d'une
 * révélation : le nom du service d'abord, puis le raisonnement, puis les
 * preuves, puis l'action. Sous prefers-reduced-motion, tout s'affiche d'un
 * coup, sans décalage ni délai.
 */
export function ResultCard({
  recommendation,
  answers,
  locale,
  dict,
  onRestart,
}: {
  recommendation: Recommendation;
  /** Réponses brutes — le budget doit suivre le prospect jusqu'à nous. */
  answers: Answers;
  locale: Locale;
  dict: Dictionary;
  onRestart: () => void;
}) {
  const reduce = useReducedMotion();
  const t = dict.quiz.result;
  const {
    service,
    secondary,
    isRedesign,
    situationKey,
    conclusionKey,
    exampleProjectSlug,
  } = recommendation;

  const serviceName = service.name[locale];

  // Le budget voyage dans l'URL vers /contact pour arriver dans la demande,
  // sans jamais être réaffiché au visiteur.
  const contactHref =
    `${href(locale, routes.contact)}?service=${service.slug}` +
    (answers.budget ? `&budget=${answers.budget}` : '');
  const exampleProject = exampleProjectSlug
    ? projects.find((p) => p.slug === exampleProjectSlug)
    : undefined;

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.09 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.55, ease: EASE },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      {/* Annonce du résultat aux lecteurs d'écran, qui ne « voient » pas
          la transition visuelle. */}
      <p className="sr-only" role="status">
        {t.announce.replace('{service}', serviceName)}
      </p>

      {/* 1 — Le verdict */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl border border-coral/25 bg-ink3/70 p-7 sm:p-9"
      >
        <div
          aria-hidden="true"
          className="absolute -top-24 start-1/4 h-56 w-56 rounded-full bg-coral/20 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-5">
          <Eyebrow>{t.eyebrow}</Eyebrow>

          <div className="flex items-start gap-4">
            <ServiceIconBadge name={service.icon} size="lg" />
            <div className="flex flex-col gap-2">
              <h2 className="text-[clamp(1.5rem,4.5vw,2.3rem)] font-bold leading-tight tracking-tight text-txt">
                {t.titlePrefix}{' '}
                <span className="text-gradient">{serviceName}</span>
              </h2>
              {isRedesign ? (
                <Badge tone="brand" className="w-fit">
                  {t.redesignBadge}
                </Badge>
              ) : null}
            </div>
          </div>

          <p className="text-lg font-semibold leading-snug text-txt">
            {service.promise[locale]}
          </p>
        </div>
      </motion.div>

      {/* 2 — Pourquoi, à partir de SES réponses */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-line bg-ink2/70 p-6"
      >
        <h3 className="eyebrow-label mb-3 text-txt2">{t.whyTitle}</h3>
        <p className="text-[15px] leading-relaxed text-txt sm:text-base">
          {situations[situationKey][locale]}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-txt2 sm:text-base">
          {conclusions[conclusionKey][locale]}
        </p>
      </motion.div>

      {/* 3 — Livrables */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-line bg-ink2/70 p-6"
      >
        <h3 className="eyebrow-label mb-4 text-txt2">{t.deliverablesTitle}</h3>
        <CheckList items={service.deliverables[locale]} />
      </motion.div>

      {/* 4 — Exemple concret */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-line bg-ink2/70 p-6"
      >
        <h3 className="eyebrow-label mb-4 text-txt2">{t.exampleTitle}</h3>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="sm:w-1/2">
            {exampleProject ? (
              <ProjectVisual project={exampleProject} locale={locale} />
            ) : (
              <ServiceVisual icon={service.icon} id={`quiz-${service.slug}`} />
            )}
          </div>

          <div className="flex flex-col items-start gap-3 sm:w-1/2">
            {exampleProject ? (
              <>
                <p className="text-lg font-bold leading-snug text-txt">
                  {exampleProject.title[locale]}
                </p>
                <p className="text-[15px] leading-relaxed text-txt2">
                  {exampleProject.result[locale]}
                </p>
                <Link
                  href={`${href(locale, routes.work)}#${exampleProject.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral2 hover:text-coral"
                >
                  {t.seeProject}
                  <ArrowIcon className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <p className="text-[15px] leading-relaxed text-txt2">
                {t.exampleNoProject}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/*
        5 — Délai et suite.
        Aucun montant n'est affiché : le budget déclaré part dans notre
        message et sert à préparer une proposition, il ne revient jamais
        à l'écran sous forme de prix.
      */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-ink2/70 p-6">
          <h3 className="eyebrow-label mb-2 text-txt2">{t.timelineTitle}</h3>
          <p className="text-xl font-bold text-txt">{service.timeline[locale]}</p>
        </div>

        <div className="rounded-2xl border border-coral/20 bg-brand-soft p-6">
          <h3 className="eyebrow-label mb-2 text-coral2">{t.nextStepTitle}</h3>
          <p className="text-[15px] font-medium leading-relaxed text-txt">
            {t.nextStep}
          </p>
        </div>
      </motion.div>

      {/* Service complémentaire */}
      {secondary ? (
        <motion.div
          variants={item}
          className="rounded-2xl border border-line bg-ink2/70 p-6"
        >
          <h3 className="eyebrow-label mb-3 text-txt2">{t.alsoTitle}</h3>
          <p className="mb-4 text-sm leading-relaxed text-txt2">{t.alsoIntro}</p>

          <div className="flex items-start gap-4">
            <ServiceIconBadge name={secondary.icon} />
            <div className="flex flex-col gap-1.5">
              <p className="text-base font-bold text-txt">
                {secondary.name[locale]}
              </p>
              <p className="text-sm leading-relaxed text-txt2">
                {secondary.promise[locale]}
              </p>
              <Link
                href={`${href(locale, routes.services)}#${secondary.slug}`}
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-coral2 hover:text-coral"
              >
                {dict.home.services.cardCta}
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* 6 — Double appel à l'action */}
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={contactHref} size="lg" className="w-full sm:w-auto">
          {t.ctaPrimary}
          <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </ButtonLink>

        <ButtonLink
          href={whatsappQuizLink(locale, serviceName)}
          external
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
        >
          {t.ctaWhatsapp}
        </ButtonLink>
      </motion.div>

      {/* 7 — Capture de lead, facultative */}
      <motion.div variants={item}>
        <LeadCapture
          locale={locale}
          dict={dict}
          serviceSlug={service.slug}
          serviceName={serviceName}
          budget={answers.budget}
        />
      </motion.div>

      {/* 8 — Recommencer */}
      <motion.div variants={item} className="flex justify-center pt-2">
        <Button variant="ghost" type="button" onClick={onRestart}>
          <RestartIcon />
          {t.restart}
        </Button>
      </motion.div>
    </motion.div>
  );
}

function RestartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 rtl:-scale-x-100"
    >
      <path d="M4 12a8 8 0 1 1 2.3 5.6" />
      <path d="M4 7.5V12h4.5" />
    </svg>
  );
}
