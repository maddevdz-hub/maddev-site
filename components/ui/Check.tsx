import { cn } from '@/lib/utils';

/** Coche utilisée dans les listes de livrables. */
export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn('h-5 w-5 shrink-0', className)}
    >
      <circle cx="10" cy="10" r="9" fill="rgba(255,90,95,.14)" />
      <path
        d="m6 10.4 2.6 2.6L14.2 7.4"
        stroke="#ff8a5f"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Liste de livrables avec coches. */
export function CheckList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckIcon className="mt-0.5" />
          <span className="text-[15px] leading-relaxed text-txt2">{item}</span>
        </li>
      ))}
    </ul>
  );
}
