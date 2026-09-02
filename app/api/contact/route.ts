import { NextResponse } from 'next/server';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { budgetLabels, isBudget } from '@/lib/configurator';

export const runtime = 'nodejs';
/** Jamais mis en cache : chaque envoi doit atteindre le serveur. */
export const dynamic = 'force-dynamic';

type Payload = {
  name?: string;
  contact?: string;
  service?: string;
  message?: string;
  locale?: string;
  source?: string;
  recommendation?: string;
  budget?: string;
  /** Champ piège : invisible pour un humain, rempli par les robots. */
  company?: string;
  /** Horodatage de l'affichage du formulaire, posé côté client. */
  formLoadedAt?: number;
};

// ---------------------------------------------------------------------------
// Limitation de débit
// ---------------------------------------------------------------------------

const RATE_LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Compteur en mémoire, par IP.
 *
 * ⚠️ Limite connue : sur un hébergement sans état (Vercel), chaque instance
 * a sa propre mémoire et le compteur repart à zéro après une mise en veille.
 * C'est un garde-fou contre les envois répétés, pas une protection contre
 * une attaque distribuée. Pour cela il faudrait un stockage partagé
 * (Upstash Redis, Vercel KV).
 */
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() || 'inconnue';
}

/** Retourne le nombre de secondes à attendre, ou 0 si la requête passe. */
function rateLimit(ip: string): number {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    const oldest = Math.min(...recent);
    return Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
  }

  recent.push(now);
  hits.set(ip, recent);

  // Évite que la table grossisse indéfiniment sur un serveur de longue durée.
  if (hits.size > 5000) {
    Array.from(hits.entries()).forEach(([key, times]) => {
      if (times.every((t: number) => now - t >= WINDOW_MS)) hits.delete(key);
    });
  }

  return 0;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
/** Numéro algérien ou international : chiffres, espaces, tirets, points, +. */
const PHONE = /^\+?[\d\s().-]{8,20}$/;

const LIMITS = {
  name: { min: 2, max: 120 },
  contact: { min: 5, max: 160 },
  message: { min: 5, max: 4000 },
} as const;

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  // Supprime les caractères de contrôle, qui n'ont rien à faire dans un
  // champ de formulaire et servent à casser les en-têtes d'email.
  return value
    .replace(new RegExp("[\\u0000-\\u001F\\u007F]", "g"), " ")
    .trim()
    .slice(0, max);
}

function withinRange(value: string, range: { min: number; max: number }) {
  return value.length >= range.min && value.length <= range.max;
}

/** Un contact valide est soit un email, soit un numéro de téléphone. */
function isValidContact(value: string): boolean {
  return EMAIL.test(value) || PHONE.test(value);
}

// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const ip = clientIp(request);

  const retryAfter = rateLimit(ip);
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // 1. Champ piège. Un humain ne le voit pas, donc ne le remplit jamais.
  //    On répond 200 sans rien envoyer : inutile d'apprendre au robot
  //    qu'il a été repéré.
  if (typeof payload.company === 'string' && payload.company.trim() !== '') {
    return NextResponse.json({ ok: true, delivered: false });
  }

  // 2. Délai de remplissage. Le compteur part de l'affichage du formulaire,
  //    pas de la première frappe : un humain qui lit la page dépasse
  //    largement trois secondes.
  const loadedAt = payload.formLoadedAt;
  if (typeof loadedAt === 'number' && Number.isFinite(loadedAt)) {
    const elapsed = Date.now() - loadedAt;
    // Un écart négatif ou délirant vient d'une horloge client décalée :
    // on ne pénalise pas le visiteur pour ça.
    if (elapsed >= 0 && elapsed < 3000) {
      return NextResponse.json({ error: 'too_fast' }, { status: 400 });
    }
  }

  // 3. Validation stricte.
  const name = clean(payload.name, LIMITS.name.max);
  const contact = clean(payload.contact, LIMITS.contact.max);
  const message = clean(payload.message, LIMITS.message.max);
  const locale = payload.locale === 'fr' ? 'fr' : 'ar';
  const fromConfigurator = payload.source === 'configurator';

  const errors: string[] = [];
  if (!withinRange(name, LIMITS.name)) errors.push('name');
  if (!withinRange(contact, LIMITS.contact) || !isValidContact(contact)) {
    errors.push('contact');
  }
  // Le configurateur est une capture douce : nom et contact suffisent.
  if (!fromConfigurator && !withinRange(message, LIMITS.message)) {
    errors.push('message');
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'invalid_fields', fields: errors },
      { status: 400 },
    );
  }

  // On ne fait confiance qu'aux slugs connus.
  const service =
    services.find((s) => s.slug === payload.service)?.name.fr ??
    (payload.service === 'autre' ? 'Autre / non défini' : 'Non précisé');

  const budget = isBudget(payload.budget)
    ? budgetLabels[payload.budget]
    : 'Non renseigné';

  const origin = fromConfigurator ? 'Configurateur' : 'Formulaire de contact';
  const subject = fromConfigurator
    ? `MADDEV — lead configurateur : ${service}`
    : `MADDEV — nouvelle demande : ${service}`;

  const body = [
    `Origine  : ${origin}`,
    `Nom      : ${name}`,
    `Contact  : ${contact}`,
    `Service  : ${service}`,
    `Budget   : ${budget}`,
    `Langue   : ${locale}`,
    ...(fromConfigurator
      ? [
          `Reco     : ${clean(payload.recommendation, 120) || service}`,
          '',
          'Ce visiteur a terminé le configurateur et demande le détail de sa recommandation.',
        ]
      : ['', 'Message :', message]),
  ].join('\n');

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? 'MADDEV <onboarding@resend.dev>';

  if (!apiKey) {
    console.info('[contact] RESEND_API_KEY absent — demande non envoyée\n' + body);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: body,
        // Réponse directe au prospect quand il a laissé un email.
        reply_to: EMAIL.test(contact) ? contact : undefined,
      }),
    });

    if (!res.ok) {
      console.error('[contact] Resend a répondu', res.status, await res.text());
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error('[contact] envoi impossible', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}
