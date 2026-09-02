import { Container } from '@/components/ui/Container';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import type { Dictionary } from '@/i18n/dictionaries';

/** Quatre arguments de réassurance, juste sous le hero. */
export function TrustBar({ dict }: { dict: Dictionary }) {
  const t = dict.home.trust;
  const points = [
    { key: 'fast', icon: <BoltIcon />, ...t.fast },
    { key: 'ownership', icon: <KeyIcon />, ...t.ownership },
    { key: 'quality', icon: <SparkIcon />, ...t.quality },
    { key: 'direct', icon: <ChatIcon />, ...t.direct },
  ];

  return (
    <section
      aria-labelledby="trust-title"
      className="border-y border-line bg-ink2/60"
    >
      <Container>
        {/*
          Titre visuellement absent — la maquette ne prévoit pas de titre ici,
          mais il maintient la hiérarchie h1 → h2 → h3 et nomme la section
          pour les lecteurs d'écran.
        */}
        <h2 id="trust-title" className="sr-only">
          {t.title}
        </h2>
        <RevealGroup
          as="ul"
          className="grid gap-x-8 gap-y-8 py-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {points.map((point) => (
            <RevealItem as="li" key={point.key} className="flex flex-col gap-2.5">
              <span className="text-coral2">{point.icon}</span>
              <h3 className="text-[15px] font-semibold text-txt">{point.title}</h3>
              <p className="text-sm leading-relaxed text-txt2">{point.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
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
  className: 'h-6 w-6',
};

function BoltIcon() {
  return (
    <svg {...iconProps}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
    </svg>
  );
}

/** Une clé : le site change de mains à la livraison. */
function KeyIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="8" cy="14" r="4.2" />
      <path d="m11 11 8.5-8.5M17 5l2.2 2.2M14.6 7.4l2.2 2.2" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3.5 13.9 9 19.5 10.9 13.9 12.8 12 18.3 10.1 12.8 4.5 10.9 10.1 9 12 3.5Z" />
      <path d="M18.5 16.5 19.3 18.7 21.5 19.5 19.3 20.3 18.5 22.5 17.7 20.3 15.5 19.5 17.7 18.7 18.5 16.5Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20.5 11.8c0 4-3.8 7.2-8.5 7.2a9.8 9.8 0 0 1-2.6-.35L4 21l1.2-3.6A6.9 6.9 0 0 1 3.5 11.8C3.5 7.8 7.3 4.6 12 4.6s8.5 3.2 8.5 7.2Z" />
      <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
    </svg>
  );
}
