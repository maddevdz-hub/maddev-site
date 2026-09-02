import { CheckList } from '@/components/ui/Check';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/i18n/dictionaries';

/**
 * Les deux formules mensuelles, présentées comme des options de suivi
 * et non comme des services principaux — d'où le fond alterné et la
 * position en bas de page.
 */
export function RecurringServices({ dict }: { dict: Dictionary }) {
  const t = dict.services.recurring;

  const plans = [
    { key: 'maintenance', icon: <ShieldIcon />, ...t.maintenance },
    { key: 'ads', icon: <TrendIcon />, ...t.ads },
  ];

  return (
    <Section tone="alt" bordered>
      <div className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow={t.eyebrow}
            title={t.title}
            subtitle={t.subtitle}
          />
        </Reveal>

        <RevealGroup as="ul" className="grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <RevealItem
              as="li"
              key={plan.key}
              className="card flex flex-col gap-5 p-7 transition-colors duration-300 hover:border-coral/25"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-coral/25 bg-brand-soft text-coral2">
                {plan.icon}
              </span>
              <h3 className="text-lg font-bold text-txt">{plan.title}</h3>
              <p className="text-[15px] leading-relaxed text-txt2">{plan.text}</p>
              <CheckList items={plan.items} className="mt-1" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className: 'h-5 w-5',
};

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 8.1 7 9.5 4.1-1.4 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3.5 16.5 9 11l3.5 3.5L20 7" />
      <path d="M15.5 7H20v4.5" />
    </svg>
  );
}
