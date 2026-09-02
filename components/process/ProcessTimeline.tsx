import { Reveal } from '@/components/ui/Reveal';
import { processSteps } from '@/content/process';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/**
 * Timeline du process.
 *
 * Sur mobile : verticale, avec un filet continu à gauche (à droite en RTL).
 * Sur desktop : les étapes restent empilées mais alternent de part et
 * d'autre d'un axe central — la séquence reste lisible d'un coup d'œil
 * sans imposer un défilement horizontal, qui se prête mal au RTL.
 *
 * Toute la géométrie utilise des propriétés logiques (start/end), donc le
 * miroir arabe est automatique.
 */
export function ProcessTimeline({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const labels = dict.process.labels;

  return (
    <ol className="relative flex flex-col gap-10 lg:gap-0">
      {/* Axe : collé au bord en mobile, centré en desktop */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 start-[15px] w-px bg-gradient-to-b from-transparent via-line2 to-transparent lg:start-1/2 lg:-translate-x-px"
      />

      {processSteps.map((step, index) => {
        const alignEnd = index % 2 === 1;

        return (
          <li
            key={step.slug}
            className="relative ps-12 lg:grid lg:grid-cols-2 lg:gap-16 lg:ps-0"
          >
            {/* Pastille numérotée sur l'axe */}
            <span
              aria-hidden="true"
              className="absolute start-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-coral/30 bg-ink3 font-display text-[11px] font-bold text-coral2 lg:start-1/2 lg:top-10 lg:-translate-x-1/2"
              dir="ltr"
            >
              {step.number}
            </span>

            <div
              className={
                alignEnd
                  ? 'lg:col-start-2 lg:ps-4 lg:py-10'
                  : 'lg:col-start-1 lg:pe-4 lg:py-10'
              }
            >
              <Reveal
                className="card flex flex-col gap-3 p-6"
                delay={index * 0.05}
              >
                <span className="eyebrow-label text-txt2">
                  {labels.step} <span dir="ltr">{step.number}</span>
                </span>

                <h2 className="text-xl font-bold text-txt">
                  {step.title[locale]}
                </h2>

                <p className="text-[15px] leading-relaxed text-txt2">
                  {step.summary[locale]}
                </p>

                <div className="mt-1 border-t border-line pt-4">
                  <h3 className="eyebrow-label mb-3 text-txt2">
                    {labels.whatHappens}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {step.details[locale].map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-txt2"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-coral2"
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
