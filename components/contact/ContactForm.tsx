'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { HoneypotField } from '@/components/ui/Honeypot';
import { services } from '@/content/services';
import { isBudget } from '@/lib/configurator';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Formulaire de contact.
 *
 * Soumission réelle vers /api/contact. Le champ « service » est pré-rempli
 * quand l'utilisateur arrive depuis un bouton « Demander un devis »
 * (/contact?service=boutique-en-ligne).
 *
 * La liste déroulante se construit depuis content/services.ts, la source
 * unique. Elle a compté quatre entrées pendant que /services en montrait
 * six : le visiteur ne retrouvait pas dans le formulaire le service sur
 * lequel il venait de cliquer.
 */
export function ContactForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.contact.form;
  const searchParams = useSearchParams();
  const preselected = searchParams.get('service') ?? '';
  // Budget déclaré au configurateur : transmis avec la demande, jamais
  // affiché ni redemandé au visiteur.
  const budgetParam = searchParams.get('budget');
  const budget = isBudget(budgetParam) ? budgetParam : undefined;

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Horodatage de l'affichage du formulaire : le serveur refuse les envois
  // en moins de trois secondes, signature d'un robot.
  const formLoadedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get('name') ?? '').trim(),
      contact: String(data.get('contact') ?? '').trim(),
      service: String(data.get('service') ?? ''),
      message: String(data.get('message') ?? '').trim(),
      budget,
      locale,
      company: String(data.get('company') ?? ''),
      formLoadedAt: formLoadedAt.current,
    };

    // Validation côté client — l'API revalide de son côté.
    const nextErrors: Record<string, boolean> = {};
    if (!payload.name) nextErrors.name = true;
    if (!payload.contact) nextErrors.contact = true;
    if (!payload.message) nextErrors.message = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      <div className="card flex flex-col items-start gap-4 p-8" role="status">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-coral/25 bg-brand-soft">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff8a5f"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-6 w-6"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h2 className="text-xl font-bold text-txt">{t.successTitle}</h2>
        <p className="text-[15px] leading-relaxed text-txt2">{t.successText}</p>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setStatus('idle')}
        >
          {t.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card relative flex flex-col gap-5 p-6 sm:p-8"
    >
      <HoneypotField />

      <Field
        id="name"
        label={t.name}
        placeholder={t.namePlaceholder}
        required
        invalid={errors.name}
        errorText={t.required}
      />

      <Field
        id="contact"
        label={t.contact}
        placeholder={t.contactPlaceholder}
        required
        invalid={errors.contact}
        errorText={t.required}
        /* Numéros et adresses email s'écrivent de gauche à droite,
           y compris dans une page arabe. */
        dir="ltr"
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="service" className="text-sm font-medium text-txt">
          {t.service}
        </label>
        <div className="relative">
          <select
            id="service"
            name="service"
            defaultValue={preselected}
            className="w-full appearance-none rounded-xl border border-line bg-ink2 px-4 py-3 pe-10 text-[15px] text-txt transition-colors focus:border-coral/50"
          >
            <option value="">{t.servicePlaceholder}</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name[locale]}
              </option>
            ))}
            <option value="autre">{t.serviceOther}</option>
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-txt2"
          >
            <path d="m6 9.5 6 6 6-6" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-txt">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={t.messagePlaceholder}
          aria-invalid={errors.message || undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(
            'w-full resize-y rounded-xl border bg-ink2 px-4 py-3 text-[15px] text-txt placeholder:text-txt2 transition-colors focus:border-coral/50',
            errors.message ? 'border-coral' : 'border-line',
          )}
        />
        {errors.message ? (
          <p id="message-error" className="text-xs text-coral">
            {t.required}
          </p>
        ) : null}
      </div>

      {status === 'error' ? (
        <div
          role="alert"
          className="rounded-xl border border-coral/40 bg-coral/10 p-4"
        >
          <p className="text-sm font-semibold text-txt">{t.errorTitle}</p>
          <p className="mt-1 text-sm text-txt2">{t.errorText}</p>
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.submit}
      </Button>

      {/*
        La seule réassurance qui manque à la page : le délai de réponse est
        déjà dans l'introduction, le mois de corrections dans la FAQ en bas.
      */}
      <p className="text-sm leading-relaxed text-txt2">{t.ownershipNote}</p>
    </form>
  );
}

/** Champ texte à une ligne, avec libellé lié et message d'erreur accessible. */
function Field({
  id,
  label,
  placeholder,
  required,
  invalid,
  errorText,
  dir,
}: {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  invalid?: boolean;
  errorText: string;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-txt">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        dir={dir}
        placeholder={placeholder}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn(
          'w-full rounded-xl border bg-ink2 px-4 py-3 text-[15px] text-txt placeholder:text-txt2 transition-colors focus:border-coral/50',
          invalid ? 'border-coral' : 'border-line',
        )}
      />
      {invalid ? (
        <p id={`${id}-error`} className="text-xs text-coral">
          {errorText}
        </p>
      ) : null}
    </div>
  );
}
