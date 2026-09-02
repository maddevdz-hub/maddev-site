'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { HoneypotField } from '@/components/ui/Honeypot';
import type { Budget } from '@/lib/configurator';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Capture de lead « douce » sous le résultat.
 *
 * Non bloquante par construction : la recommandation est déjà affichée
 * au-dessus, ce bloc ne fait que proposer de recevoir le détail. Il poste
 * sur la même route que le formulaire de contact, avec source
 * « configurator » et le service recommandé.
 */
export function LeadCapture({
  locale,
  dict,
  serviceSlug,
  serviceName,
  budget,
}: {
  locale: Locale;
  dict: Dictionary;
  serviceSlug: string;
  serviceName: string;
  /** Tranche déclarée au quiz — transmise avec le lead, jamais affichée. */
  budget?: Budget;
}) {
  const t = dict.quiz.lead;
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState(false);
  const formLoadedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('lead-name') ?? '').trim();
    const contact = String(data.get('lead-contact') ?? '').trim();
    const company = String(data.get('company') ?? '');

    if (!name || !contact) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          service: serviceSlug,
          source: 'configurator',
          recommendation: serviceName,
          budget,
          locale,
          company,
          formLoadedAt: formLoadedAt.current,
        }),
      });
      if (!res.ok) throw new Error(`Réponse ${res.status}`);
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-coral/25 bg-brand-soft p-6"
      >
        <h3 className="text-base font-bold text-txt">{t.successTitle}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-txt2">
          {t.successText}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative flex flex-col gap-4 rounded-2xl border border-line bg-ink2/70 p-6"
    >
      <HoneypotField />

      <div>
        <h3 className="text-base font-bold text-txt">{t.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-txt2">{t.text}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="lead-name" className="text-sm font-medium text-txt">
            {t.name}
          </label>
          <input
            id="lead-name"
            name="lead-name"
            type="text"
            placeholder={t.namePlaceholder}
            aria-invalid={invalid || undefined}
            className={cn(
              'w-full rounded-xl border bg-ink px-4 py-3 text-[15px] text-txt placeholder:text-txt2 transition-colors focus:border-coral/50',
              invalid ? 'border-coral' : 'border-line',
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lead-contact" className="text-sm font-medium text-txt">
            {t.contact}
          </label>
          <input
            id="lead-contact"
            name="lead-contact"
            type="text"
            dir="ltr"
            placeholder={t.contactPlaceholder}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? 'lead-error' : undefined}
            className={cn(
              'w-full rounded-xl border bg-ink px-4 py-3 text-[15px] text-txt placeholder:text-txt2 transition-colors focus:border-coral/50',
              invalid ? 'border-coral' : 'border-line',
            )}
          />
        </div>
      </div>

      {invalid ? (
        <p id="lead-error" className="text-xs text-coral">
          {t.required}
        </p>
      ) : null}

      {status === 'error' ? (
        <p role="alert" className="text-sm text-coral">
          {t.errorText}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="secondary"
        disabled={status === 'sending'}
        className="w-full sm:w-fit"
      >
        {status === 'sending' ? t.sending : t.submit}
      </Button>
    </form>
  );
}
