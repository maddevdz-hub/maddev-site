import { ServiceGlyph } from '@/components/services/ServiceGlyphs';
import type { ServiceGlyphName, ServiceJourneyStep } from '@/content/services';
import type { Locale } from '@/i18n/config';

/**
 * Le parcours d'un service qui n'a pas encore de démonstration.
 *
 * Trois étapes : ce que fait le client, ce que fait le site, ce que reçoit
 * le commerçant. Elles remplacent les compositions qui imitaient une
 * capture d'écran — une interface dessinée se lit comme une interface, et
 * le visiteur croit voir un produit qui n'existe pas encore.
 *
 * Ici rien n'imite : des mots, un glyphe, un ordre. On montre le mécanisme,
 * pas un faux écran.
 */
export function ServiceJourney({
  glyph,
  steps,
  locale,
  note,
}: {
  glyph: ServiceGlyphName;
  steps: ServiceJourneyStep[];
  locale: Locale;
  /** « Démonstration sur demande » — ce service n'en a pas encore. */
  note: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line2 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,90,95,.14),transparent_58%),linear-gradient(150deg,#1c1f28,#14161c)] p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,.8)] sm:p-8">
      <ol className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <li key={step.title[locale]}>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-coral/25 bg-brand-soft">
                {i === 0 ? (
                  <PersonGlyph className="h-5 w-5 text-coral2" />
                ) : i === 1 ? (
                  <ServiceGlyph name={glyph} className="h-5 w-5 text-coral2" />
                ) : (
                  <InboxGlyph className="h-5 w-5 text-coral2" />
                )}
              </span>

              <div className="flex min-w-0 flex-col gap-1 pt-0.5">
                <p className="text-[15px] font-bold leading-snug text-txt">
                  {step.title[locale]}
                </p>
                <p className="text-[14px] leading-relaxed text-txt2">
                  {step.text[locale]}
                </p>
              </div>
            </div>

            {/* Le trait qui relie une étape à la suivante. */}
            {i < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="my-2 ms-[1.3rem] block h-6 w-px bg-line2"
              />
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-7 border-t border-line pt-5 text-[13px] font-semibold uppercase tracking-[.12em] text-txt2">
        {note}
      </p>
    </div>
  );
}

/** Le client. */
function PersonGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

/** Ce qui arrive au commerçant. */
function InboxGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 13.5h4l1.5 2.5h6l1.5-2.5h4" />
      <path d="M5.5 5.5h13l2 8v4a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 17.5v-4Z" />
    </svg>
  );
}
