'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { locales, otherLocale, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/**
 * Bascule AR ⇄ FR.
 *
 * Le site étant servi sous /ar/... et /fr/..., changer de langue revient à
 * remplacer le premier segment de l'URL. On garde donc la page courante :
 * /fr/services devient /ar/services, et non un retour à l'accueil.
 *
 * `useTransition` marque la navigation comme non urgente : React garde
 * l'ancienne page à l'écran pendant le chargement de la nouvelle, ce qui
 * évite le clignotement. Le fondu est piloté par l'attribut data-switching.
 */
export function LangToggle({
  locale,
  label,
  className,
}: {
  locale: Locale;
  /** Libellé accessible : « Passer en arabe » / « التبديل إلى الفرنسية ». */
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const target = otherLocale(locale);

  function switchTo(next: Locale) {
    if (next === locale) return;

    // Remplace le segment de langue en tête de chemin.
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const nextPath = segments.join('/') || `/${next}`;

    // Mémorise le choix pour les visites suivantes (lu par la page racine).
    try {
      document.cookie = `maddev_locale=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      // Cookies bloqués : sans conséquence, la navigation fonctionne quand même.
    }

    startTransition(() => {
      router.push(nextPath);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-full border border-line bg-white/[.04] p-0.5',
        isPending && 'opacity-70',
        className,
      )}
      role="group"
      aria-label={label}
      data-switching={isPending ? 'true' : undefined}
    >
      {/* Le curseur glissant : un seul élément animé en transform,
          positionné avec des propriétés logiques pour suivre le sens du texte. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0.5 start-0.5 w-[calc(50%-0.125rem)] rounded-full bg-brand',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          locale === 'ar' ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
        )}
      />
      {(['ar', 'fr'] as const).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-pressed={active}
            aria-label={active ? undefined : label}
            disabled={isPending}
            className={cn(
              // min-h : zone tactile confortable, comme les autres contrôles.
              'relative z-10 inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-full px-2.5 text-xs font-bold transition-colors duration-300',
              active ? 'text-[#1a0c0c]' : 'text-txt2 hover:text-txt',
            )}
          >
            {/* Chaque libellé s'écrit dans sa propre langue. */}
            <span dir={code === 'ar' ? 'rtl' : 'ltr'}>
              {code === 'ar' ? 'ع' : 'FR'}
            </span>
          </button>
        );
      })}
      <span className="sr-only" aria-live="polite">
        {isPending ? label : ''}
      </span>
      {/* Cible de repli si JavaScript est indisponible. */}
      <noscript>
        <a href={`/${target}`} className="ms-2 text-xs underline">
          {label}
        </a>
      </noscript>
    </div>
  );
}
