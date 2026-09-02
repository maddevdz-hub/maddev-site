import { FaqAccordion } from './FaqAccordion';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/**
 * Bloc FAQ réutilisé sur l'accueil et sur la page contact.
 * Les questions viennent de content/faq.ts — un seul endroit à modifier.
 */
export function FaqSection({
  locale,
  dict,
  tone = 'default',
}: {
  locale: Locale;
  dict: Dictionary;
  tone?: 'default' | 'alt';
}) {
  const t = dict.faq;

  return (
    <Section tone={tone} bordered={tone === 'alt'}>
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow={t.eyebrow}
            title={t.title}
            subtitle={t.subtitle}
            align="center"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <FaqAccordion locale={locale} />
        </Reveal>
      </div>
    </Section>
  );
}
