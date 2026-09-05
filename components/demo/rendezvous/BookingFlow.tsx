'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  months,
  opening,
  practitioners,
  reasons,
  rdvUi,
  SLOT_MINUTES,
  slotTaken,
  weekdays,
  type Practitioner,
  type Reason,
} from '@/content/demos/rendezvous';
import { AmelMark, CheckMark, WhatsAppGlyph } from './AmelMarks';

/**
 * Le parcours de prise de rendez-vous.
 *
 * Ce que la démonstration doit prouver n'est PAS qu'on peut réserver en
 * ligne — tout le monde sait le faire. C'est ce qui vient après :
 *
 *   1. le rappel WhatsApp de la veille, montré tel qu'il arrivera ;
 *   2. l'annulation autonome, qui REND vraiment le créneau à l'agenda.
 *
 * L'annulation est donc écrite pour de bon : le créneau annulé disparaît de
 * la liste des créneaux pris et redevient cliquable. Un bouton « Annuler »
 * qui se contenterait d'afficher un message serait précisément la démo creuse
 * qu'on ne veut pas.
 *
 * Les dates sont calculées après le montage, jamais au rendu serveur : le
 * serveur ignore le fuseau du visiteur, et un calendrier construit deux fois
 * de deux façons produit une erreur d'hydratation. D'où le squelette de même
 * hauteur pendant le premier rendu — aucun saut de mise en page.
 */

type Step = 'practitioner' | 'reason' | 'slot' | 'details' | 'done';

type Booking = {
  practitioner: Practitioner;
  reason: Reason;
  isoDate: string;
  minutes: number;
  name: string;
  phone: string;
};

const DAYS_AHEAD = 14;

function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function formatTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(
    minutes % 60,
  ).padStart(2, '0')}`;
}

export function BookingFlow() {
  const [days, setDays] = useState<Date[] | null>(null);
  const [step, setStep] = useState<Step>('practitioner');
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [reason, setReason] = useState<Reason | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: boolean; phone?: 'empty' | 'format' }>({});
  const [booking, setBooking] = useState<Booking | null>(null);
  const [cancelled, setCancelled] = useState(false);
  /**
   * Les créneaux réservés PENDANT la visite.
   *
   * C'est ce qui rend l'annulation démontrable : un créneau réservé devient
   * visiblement « Pris » dans l'agenda, et l'annulation l'y rend. Sans cette
   * liste, on annulerait un créneau qui n'a jamais cessé d'être libre — le
   * bouton existerait, mais il ne prouverait rien.
   */
  const [booked, setBooked] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDays(
      Array.from({ length: DAYS_AHEAD }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
      }),
    );
  }, []);

  const openReasons = useMemo(
    () => reasons.filter((r) => !r.only || r.only === practitioner?.id),
    [practitioner],
  );

  const day = days?.[dayIndex];
  const hours = day ? opening[day.getDay()] : null;

  const slots = useMemo(() => {
    if (!day || !hours || !practitioner) return [];
    const list: { minutes: number; taken: boolean }[] = [];
    for (let m = hours.from * 60; m < hours.to * 60; m += SLOT_MINUTES) {
      const key = `${toIso(day)}|${m}|${practitioner.id}`;
      list.push({
        minutes: m,
        taken: slotTaken(toIso(day), m, practitioner.id) || booked.includes(key),
      });
    }
    return list;
  }, [day, hours, practitioner, booked]);

  function submit() {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = true;
    const digits = phone.replace(/\s/g, '');
    if (!digits) nextErrors.phone = 'empty';
    else if (!/^0\d{9}$/.test(digits)) nextErrors.phone = 'format';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!practitioner || !reason || !day || slot === null) return;
    // Le créneau part de l'agenda : il apparaîtra « Pris » si l'on revient.
    setBooked((current) => [...current, `${toIso(day)}|${slot}|${practitioner.id}`]);
    setBooking({
      practitioner,
      reason,
      isoDate: toIso(day),
      minutes: slot,
      name: name.trim(),
      phone: digits,
    });
    setStep('done');
  }

  function cancelBooking() {
    if (!booking) return;
    // L'annulation rend le créneau à l'agenda : c'est l'argument de la page.
    const key = `${booking.isoDate}|${booking.minutes}|${booking.practitioner.id}`;
    setBooked((current) => current.filter((k) => k !== key));
    setCancelled(true);
  }

  function restart() {
    setStep('practitioner');
    setPractitioner(null);
    setReason(null);
    setDayIndex(0);
    setSlot(null);
    setName('');
    setPhone('');
    setErrors({});
    setBooking(null);
    setCancelled(false);
  }

  // Premier rendu : la place est réservée, rien ne saute à l'hydratation.
  if (!days) {
    return (
      <div
        className="am-card min-h-[560px] animate-pulse bg-[var(--wash)]"
        aria-hidden="true"
      />
    );
  }

  if (step === 'done' && booking) {
    return (
      <Confirmation
       
        booking={booking}
        cancelled={cancelled}
        onCancel={cancelBooking}
        onRestart={restart}
      />
    );
  }

  const stepIndex = { practitioner: 1, reason: 2, slot: 3, details: 4, done: 4 }[step];

  return (
    <div className="am-card overflow-hidden">
      <Progress index={stepIndex} />

      <div className="p-5 sm:p-7">
        {step === 'practitioner' ? (
          <fieldset>
            <legend className="mb-4 text-[19px] font-semibold">
              {rdvUi.stepPractitioner}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {practitioners.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPractitioner(p);
                    setReason(null);
                    setSlot(null);
                    setStep('reason');
                  }}
                  className="group flex items-center gap-4 rounded-[var(--radius)] border border-[var(--line)] p-4 text-start transition-colors hover:border-[var(--teal)] hover:bg-[var(--wash)]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--mint)] text-[15px] font-bold tracking-wide text-[var(--teal-ink)]">
                    {p.initials}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[14px] text-[var(--ink-2)]">
                      {p.role}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 'reason' ? (
          <fieldset>
            <legend className="mb-4 text-[19px] font-semibold">
              {rdvUi.stepReason}
            </legend>
            <div className="flex flex-col gap-2">
              {openReasons.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setReason(r);
                    setSlot(null);
                    setStep('slot');
                  }}
                  className="flex min-h-[56px] items-center justify-between gap-4 rounded-[var(--radius)] border border-[var(--line)] px-4 text-start transition-colors hover:border-[var(--teal)] hover:bg-[var(--wash)]"
                >
                  <span className="font-medium">{r.label}</span>
                  <span className="shrink-0 text-[14px] text-[var(--ink-2)]">
                    <span className="numerals">{r.duration}</span>{' '}
                    {rdvUi.minutes}
                  </span>
                </button>
              ))}
            </div>
            <BackButton onClick={() => setStep('practitioner')} />
          </fieldset>
        ) : null}

        {step === 'slot' && day ? (
          <div>
            <h3 className="mb-4 text-[19px] font-semibold">{rdvUi.stepSlot}</h3>

            {/* Les jours — le vendredi apparaît fermé plutôt que caché */}
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {days.map((d, i) => {
                const isOpen = opening[d.getDay()] !== null;
                const active = i === dayIndex;
                return (
                  <button
                    key={toIso(d)}
                    type="button"
                    disabled={!isOpen}
                    onClick={() => {
                      setDayIndex(i);
                      setSlot(null);
                    }}
                    aria-pressed={active}
                    className={[
                      'flex min-h-[68px] w-[76px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[var(--radius)] border text-[13px] transition-colors',
                      active
                        ? 'border-[var(--teal)] bg-[var(--teal)] text-white'
                        : isOpen
                          ? 'border-[var(--line)] hover:border-[var(--teal)]'
                          : 'cursor-not-allowed border-dashed border-[var(--line)] text-[var(--ink-2)]',
                    ].join(' ')}
                  >
                    <span className="font-medium">
                      {i === 0
                        ? rdvUi.today
                        : i === 1
                          ? rdvUi.tomorrow
                          : weekdays[d.getDay()]}
                    </span>
                    <span className="numerals text-[17px] font-bold">
                      {d.getDate()}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {isOpen
                        ? months[d.getMonth()]
                        : rdvUi.closed}
                    </span>
                  </button>
                );
              })}
            </div>

            {hours ? (
              slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((s) => (
                    <button
                      key={s.minutes}
                      type="button"
                      disabled={s.taken}
                      aria-pressed={slot === s.minutes}
                      aria-label={
                        s.taken
                          ? `${formatTime(s.minutes)} — ${rdvUi.taken}`
                          : formatTime(s.minutes)
                      }
                      onClick={() => setSlot(s.minutes)}
                      className="am-slot numerals"
                    >
                      {formatTime(s.minutes)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--ink-2)]">{rdvUi.noSlot}</p>
              )
            ) : (
              <p className="text-[var(--ink-2)]">{rdvUi.noSlot}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="am-btn"
                disabled={slot === null}
                onClick={() => setStep('details')}
              >
                {rdvUi.confirm}
              </button>
              <BackButton onClick={() => setStep('reason')} inline />
            </div>
          </div>
        ) : null}

        {step === 'details' && day && slot !== null ? (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <h3 className="mb-1 text-[19px] font-semibold">
              {rdvUi.stepDetails}
            </h3>

            <p className="mb-5 text-[14px] text-[var(--ink-2)]">
              {reason?.label} · {practitioner?.name} ·{' '}
              <span className="numerals">
                {day.getDate()} {months[day.getMonth()]} {formatTime(slot)}
              </span>
            </p>

            <div className="flex flex-col gap-4">
              <Field
                id="rdv-name"
                label={rdvUi.fieldName}
                value={name}
                onChange={setName}
                invalid={errors.name}
                error={rdvUi.required}
              />
              <Field
                id="rdv-phone"
                label={rdvUi.fieldPhone}
                hint={rdvUi.fieldPhoneHint}
                value={phone}
                onChange={setPhone}
                dir="ltr"
                inputMode="tel"
                placeholder="0X XX XX XX XX"
                invalid={Boolean(errors.phone)}
                error={
                  errors.phone === 'format'
                    ? rdvUi.invalidPhone
                    : rdvUi.required
                }
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" className="am-btn">
                {rdvUi.confirm}
              </button>
              <BackButton onClick={() => setStep('slot')} inline />
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

/** Fil des quatre étapes. */
function Progress({ index }: { index: number }) {
  const labels = [
    rdvUi.stepPractitioner,
    rdvUi.stepReason,
    rdvUi.stepSlot,
    rdvUi.stepDetails,
  ];

  return (
    <ol className="flex border-b border-[var(--line)] bg-[var(--wash)]">
      {labels.map((label, i) => {
        const done = i + 1 < index;
        const current = i + 1 === index;
        return (
          <li
            key={label}
            aria-current={current ? 'step' : undefined}
            className={[
              'flex flex-1 items-center justify-center gap-2 px-2 py-3 text-center text-[13px] font-medium',
              current
                ? 'text-[var(--teal-ink)]'
                : done
                  ? 'text-[var(--ink-2)]'
                  : 'text-[var(--ink-2)] opacity-55',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                current
                  ? 'bg-[var(--teal)] text-white'
                  : done
                    ? 'bg-[var(--mint-2)] text-[var(--teal-ink)]'
                    : 'border border-[var(--line-2)]',
              ].join(' ')}
            >
              {done ? <CheckMark className="h-3.5 w-3.5" /> : <span className="numerals">{i + 1}</span>}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BackButton({
  onClick,
  inline = false,
}: {
  onClick: () => void;
  inline?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--ink-2)] underline underline-offset-4 transition-colors hover:text-[var(--teal-ink)]',
        inline ? '' : 'mt-5',
      ].join(' ')}
    >
      {rdvUi.back}
    </button>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  invalid,
  error,
  dir,
  inputMode,
  placeholder,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  error: string;
  dir?: 'ltr' | 'rtl';
  inputMode?: 'text' | 'tel';
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
      </label>
      {hint ? <p className="text-[13px] text-[var(--ink-2)]">{hint}</p> : null}
      <input
        id={id}
        dir={dir}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={[
          'min-h-[52px] w-full rounded-[var(--radius)] border bg-white px-4 text-[16px] transition-colors focus:border-[var(--teal)]',
          invalid ? 'border-[var(--rose)]' : 'border-[var(--line-2)]',
        ].join(' ')}
      />
      {invalid ? (
        <p id={`${id}-error`} className="text-[13px] font-medium text-[var(--rose)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * L'écran de confirmation — le vrai sujet de la démonstration.
 *
 * Il montre le rendez-vous, puis le message qui arrivera la veille, puis le
 * bouton d'annulation. C'est dans cet ordre que le gérant du cabinet comprend
 * ce qu'il achète.
 */
function Confirmation({
  booking,
  cancelled,
  onCancel,
  onRestart,
}: {
  booking: Booking;
  cancelled: boolean;
  onCancel: () => void;
  onRestart: () => void;
}) {
  const [y, m, d] = booking.isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dateLabel = `${weekdays[date.getDay()]} ${d} ${months[m - 1]}`;

  return (
    <div className="am-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--mint)] px-5 py-4 sm:px-7">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--teal)] text-white">
          <CheckMark className="h-5 w-5" />
        </span>
        <h3 className="text-[20px] font-semibold">
          {cancelled ? rdvUi.cancel : rdvUi.doneTitle}
        </h3>
      </div>

      <div className="p-5 sm:p-7">
        {cancelled ? (
          <>
            <p className="text-[17px] leading-relaxed">{rdvUi.cancelled}</p>
            <button type="button" className="am-btn mt-6" onClick={onRestart}>
              {rdvUi.restart}
            </button>
          </>
        ) : (
          <>
            {/* Le rendez-vous */}
            <dl className="mb-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Row label={rdvUi.stepSlot}>
                <span className="numerals">{formatTime(booking.minutes)}</span>
                {' — '}
                {dateLabel}
              </Row>
              <Row label={rdvUi.stepPractitioner}>
                {booking.practitioner.name}
              </Row>
              <Row label={rdvUi.stepReason}>
                {booking.reason.label}
              </Row>
              <Row label={rdvUi.fieldPhone}>
                <span className="numerals">{booking.phone}</span>
              </Row>
            </dl>

            {/* Le rappel de la veille — le cœur de l'argument */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--wash)] p-5">
              <p className="mb-3 flex items-center gap-2 text-[15px] font-semibold">
                <WhatsAppGlyph className="h-5 w-5 text-[#25a366]" />
                {rdvUi.reminderTitle}
              </p>

              {/* La bulle, dessinée : aucune capture d'écran empruntée */}
              <div className="max-w-md rounded-[14px] rounded-ss-[4px] bg-[#dcf8c6] p-3.5 text-[15px] leading-relaxed text-[#0b2e13] shadow-sm">
                <p className="mb-1 font-semibold">
                  {'Cabinet dentaire Amel'}
                </p>
                <p>
                  Rappel : votre rendez-vous est demain à{' '}
                  <span className="numerals font-semibold">
                    {formatTime(booking.minutes)}
                  </span>{' '}
                  avec {booking.practitioner.name}. Pour annuler, répondez
                  « annuler ».
                </p>

                <p className="mt-1.5 text-end text-[11px] text-[#4a6b52]">
                  <span className="numerals">18:00</span>
                </p>
              </div>

              <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
                {rdvUi.reminderText}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" className="am-btn-ghost" onClick={onCancel}>
                {rdvUi.cancel}
              </button>
              <button
                type="button"
                className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--ink-2)] underline underline-offset-4"
                onClick={onRestart}
              >
                {rdvUi.restart}
              </button>
            </div>

            <p className="mt-4 text-[13px] text-[var(--ink-2)]">
              {rdvUi.demoNote}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[13px] font-medium uppercase tracking-wide text-[var(--ink-2)]">
        {label}
      </dt>
      <dd className="text-[17px] font-semibold">{children}</dd>
    </div>
  );
}

export { AmelMark };
