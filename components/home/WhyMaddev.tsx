import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/i18n/dictionaries';

/** Les trois piliers différenciants du studio. */
export function WhyMaddev({ dict }: { dict: Dictionary }) {
  const t = dict.home.why;
  const pillars = [
    { key: 'builders', ...t.pillars.builders },
    { key: 'validation', ...t.pillars.validation },
    { key: 'clarity', ...t.pillars.clarity },
  ];

  return (
    <Section tone="alt" bordered>
      <div className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        </Reveal>

        <RevealGroup as="ul" className="grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <RevealItem
              as="li"
              key={pillar.key}
              className="card flex flex-col gap-3 p-6 transition-colors duration-300 hover:border-coral/25"
            >
              <span
                aria-hidden="true"
                className="font-display text-sm font-bold text-coral2"
                dir="ltr"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-bold leading-snug text-txt">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-txt2">{pillar.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
