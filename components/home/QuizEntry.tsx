import Link from 'next/link';
import { ArrowIcon } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { href, routes, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/**
 * Porte d'entrée vers le configurateur, pour le visiteur qui ne sait pas
 * encore ce qu'il cherche.
 *
 * Elle vivait dans le hero. Elle en est sortie : le premier écran porte un
 * bouton principal et un secondaire, pas davantage. Elle arrive juste
 * dessous, en bandeau discret — un lien, sans dégradé ni lueur.
 */
export function QuizEntry({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Container>
      <Link
        href={href(locale, routes.quiz)}
        className="group mb-12 mt-6 flex min-h-[64px] w-full items-center gap-3.5 rounded-2xl border border-line2 bg-white/[.03] px-4 py-3.5 transition-colors duration-300 hover:border-coral/45 hover:bg-white/[.06] sm:mb-16"
      >
        <span className="flex flex-1 flex-col gap-0.5 text-start sm:flex-row sm:items-baseline sm:gap-3">
          <span className="text-[15px] font-bold leading-snug text-txt sm:text-base">
            {dict.quiz.heroCtaTitle}
          </span>
          <span className="text-[13px] leading-snug text-txt2 sm:text-sm">
            {dict.quiz.heroCtaText}
          </span>
        </span>
        <ArrowIcon className="h-4 w-4 shrink-0 text-coral2 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      </Link>
    </Container>
  );
}
