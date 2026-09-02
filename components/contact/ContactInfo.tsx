import { Badge } from '@/components/ui/Badge';
import { site, whatsappLink } from '@/content/site';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { withNumerals } from '@/components/ui/Numerals';

/** Coordonnées directes, à côté du formulaire. */
export function ContactInfo({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.contact.direct;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="eyebrow-label text-txt2">{t.title}</h2>

      {/* WhatsApp : le canal le plus utilisé par nos clients, donc en premier */}
      <a
        href={whatsappLink(locale)}
        target="_blank"
        rel="noopener noreferrer"
        className="card group flex items-center gap-4 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-coral/30 motion-reduce:hover:transform-none"
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-[#1a0c0c]">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.2 1.26-1.96 1.42-.52.11-1.2.2-3.5-.75-2.94-1.22-4.83-4.2-4.98-4.4-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.59.83 2.02.9 2.17.07.14.12.31.02.5-.1.2-.15.32-.29.49-.15.17-.3.38-.44.51-.14.14-.29.3-.12.58.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.39-.24.65-.14.27.09 1.69.8 1.98.94.29.15.48.22.55.34.07.12.07.68-.17 1.36Z" />
          </svg>
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-txt">{t.whatsapp}</span>
          <span className="numerals text-sm text-txt2">{site.phoneDisplay}</span>
          <span className="text-xs text-txt2">{t.whatsappHint}</span>
        </span>
      </a>

      {/* Email */}
      <a
        href={`mailto:${site.email}`}
        className="card group flex items-center gap-4 p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-coral/30 motion-reduce:hover:transform-none"
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-coral/25 bg-brand-soft text-coral2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m3.5 7 8.5 6 8.5-6" />
          </svg>
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-txt">{t.email}</span>
          <span className="text-sm text-txt2" dir="ltr">
            {site.email}
          </span>
          <span className="text-xs text-txt2">{t.emailHint}</span>
        </span>
      </a>

      <p className="text-sm leading-relaxed text-txt2">
        {withNumerals(t.hours)}
      </p>

      <Badge tone="brand" className="w-fit">
        {dict.contact.freeBadge}
      </Badge>
    </div>
  );
}
