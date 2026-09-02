import { AmbientBackground } from './AmbientBackground';
import { ArrowIcon, ButtonLink } from './Button';
import { Container } from './Container';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

/**
 * Bloc d'appel à l'action réutilisé en bas de chaque page.
 * Un seul composant : le message change, la mise en forme reste identique
 * d'une page à l'autre.
 */
export function CtaSection({
  title,
  text,
  primary,
  secondary,
  patternId = 'dd-cta',
  className,
}: {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  patternId?: string;
  className?: string;
}) {
  return (
    <section className={cn('relative isolate overflow-hidden py-20 lg:py-28', className)}>
      <AmbientBackground patternId={patternId} intensity="soft" />

      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold leading-tight tracking-tight text-txt">
            {title}
          </h2>
          <p className="text-base leading-relaxed text-txt2 sm:text-lg">{text}</p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
              <ArrowIcon className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="secondary" size="lg">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
