import Image from 'next/image';

import type { ServiceVisualSpec } from '@/content/services';
import type { Locale } from '@/i18n/config';

/**
 * Les visuels de la page /services.
 *
 * Deux familles, et une seule règle : **jamais un cadre vide avec une icône
 * au milieu**. C'est ce que la page faisait avant, et un visiteur qui ne voit
 * rien n'a aucune raison de croire ce qu'il lit.
 *
 *   1. `capture` — une capture RÉELLE de la démonstration, cadrée dans un
 *      téléphone ou un écran. Produite par `node scripts/captures.mjs`, donc
 *      toujours conforme à la démo en ligne.
 *   2. `drawn` — une composition dessinée, pour les services dont la
 *      démonstration n'existe pas encore. Chacune montre le BÉNÉFICE du
 *      service, pas une icône décorative : le message WhatsApp complet pour
 *      la boutique, les filtres pour les annonces, l'entonnoir pour la
 *      campagne. Un prospect doit comprendre en regardant.
 */

export function ShowcaseFigure({
  visual,
  alt,
  locale,
}: {
  visual: ServiceVisualSpec;
  alt: string;
  /**
   * Les visuels dessinés portent du texte. Ils appartiennent au site MADDEV,
   * qui est bilingue — un message WhatsApp en français au milieu d'une page
   * arabe se remarque immédiatement.
   */
  locale: Locale;
}) {
  if (visual.kind === 'capture') {
    return visual.frame === 'phone' ? (
      <PhoneFrame>
        <Image
          src={visual.src}
          alt={alt}
          width={visual.width}
          height={visual.height}
          sizes="(max-width: 1024px) 60vw, 300px"
          className="h-auto w-full"
        />
      </PhoneFrame>
    ) : (
      <ScreenFrame>
        <Image
          src={visual.src}
          alt={alt}
          width={visual.width}
          height={visual.height}
          sizes="(max-width: 1024px) 92vw, 620px"
          className="h-auto w-full"
        />
      </ScreenFrame>
    );
  }

  if (visual.figure === 'boutique') return <BoutiqueFigure locale={locale} />;
  if (visual.figure === 'annonces') return <AnnoncesFigure locale={locale} />;
  return <CampagneFigure locale={locale} />;
}

/* ------------------------------------------------------------------ cadres */

/**
 * Cadre de téléphone.
 *
 * Dessiné en CSS et non en image : il se teinte avec la charte, reste net à
 * toutes les densités, et pèse zéro octet de plus.
 */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[280px]">
      {/*
        Pas d'encoche : posée sur la capture, elle recouvrait le nom du café.
        Le biseau arrondi et l'ombre portée suffisent à faire lire
        « téléphone » — un détail de mockup ne doit jamais manger le contenu
        qu'il est censé mettre en valeur.
      */}
      <div className="rounded-[2.2rem] border border-line2 bg-ink3 p-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,.75)]">
        <div className="overflow-hidden rounded-[1.7rem]">{children}</div>
      </div>
    </div>
  );
}

/** Cadre d'écran : une barre de navigateur sobre, sans URL inventée. */
function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line2 bg-ink3 shadow-[0_30px_60px_-28px_rgba(0,0,0,.8)]">
      <div className="flex items-center gap-1.5 border-b border-line px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------- visuels dessinés (SVG) */

/** Fond commun aux visuels dessinés : dégradé de la charte, pas un aplat gris. */
function DrawnStage({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line2 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,90,95,.22),transparent_58%),linear-gradient(150deg,#1c1f28,#14161c)] p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,.8)] sm:p-8">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full text-coral"
        style={{ opacity: 0.09 }}
      >
        <defs>
          <pattern id={id} width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Boutique — le message WhatsApp complet.
 *
 * Le bénéfice vendu n'est pas « une boutique » mais « la commande arrive
 * complète ». On dessine donc le message tel qu'il arrive, avec ses cinq
 * lignes : c'est l'argument, montré plutôt qu'affirmé.
 */
function BoutiqueFigure({ locale }: { locale: Locale }) {
  const t = {
    fr: {
      titre: 'Nouvelle commande',
      produit: 'Canapé Alger 3 places',
      detail: 'Velours sable · 4 coloris · en stock',
      lignes: [
        ['Produit', 'Canapé Alger 3 places'],
        ['Tissu', 'Velours sable'],
        ['Quantité', '1'],
        ['Wilaya', 'Béjaïa — livraison'],
      ],
    },
    ar: {
      titre: 'طلب جديد',
      produit: 'أريكة الجزائر 3 مقاعد',
      detail: 'قطيفة رملية · 4 ألوان · متوفّرة',
      lignes: [
        ['المنتج', 'أريكة الجزائر 3 مقاعد'],
        ['القماش', 'قطيفة رملية'],
        ['الكمّية', '1'],
        ['الولاية', 'بجاية — مع التوصيل'],
      ],
    },
  }[locale];
  const lignes = t.lignes;

  return (
    <DrawnStage id="fig-boutique">
      <div className="flex flex-col gap-4">
        {/*
          La fiche produit, écrite. Des barres grises à la place du texte
          seraient un rectangle vide déguisé — exactement ce que cette page
          doit cesser de faire.
        */}
        <div className="flex items-center gap-3.5 rounded-xl border border-line bg-ink/70 p-3.5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
            <SofaGlyph className="h-8 w-8 text-coral2" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-[15px] font-bold text-txt">{t.produit}</span>
            <span className="text-[13px] text-txt2">{t.detail}</span>
          </span>
        </div>

        {/* Le message, écrit : c'est lui qu'on vend */}
        <div className="ms-auto w-full max-w-[290px] rounded-2xl rounded-se-md bg-[#dcf8c6] p-3.5 text-[13px] leading-relaxed text-[#0b2e13] shadow-lg">
          <p className="mb-2 font-bold">{t.titre}</p>
          <dl className="flex flex-col gap-1">
            {lignes.map(([cle, valeur]) => (
              <div key={cle} className="flex justify-between gap-3">
                <dt className="opacity-70">{cle}</dt>
                <dd className="text-end font-semibold">{valeur}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </DrawnStage>
  );
}

/**
 * Annonces — les filtres et leur résultat.
 *
 * Trois filtres actifs en haut, des fiches qui se réduisent en dessous : le
 * dessin dit « la recherche fonctionne » sans une ligne de texte.
 */
function AnnoncesFigure({ locale }: { locale: Locale }) {
  const t = {
    fr: {
      filtres: ['Béjaïa', 'F3', 'Jusqu’à 12 M'],
      autres: '+ 4 autres',
      biens: [
        ['F3 · 92 m²', 'Ihaddaden'],
        ['F3 · 88 m²', 'Aamriw'],
        ['F4 · 110 m²', 'Sidi Ahmed'],
        ['F3 · 95 m²', 'Targa Ouzemour'],
      ],
    },
    ar: {
      filtres: ['بجاية', 'F3', 'حتى 12 مليون'],
      autres: '+ 4 أخرى',
      biens: [
        ['F3 · 92 م²', 'إحدادن'],
        ['F3 · 88 م²', 'عمريو'],
        ['F4 · 110 م²', 'سيدي أحمد'],
        ['F3 · 95 م²', 'تارقة وزمور'],
      ],
    },
  }[locale];
  return (
    <DrawnStage id="fig-annonces">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {t.filtres.map((filtre) => (
            <span
              key={filtre}
              className="rounded-full border border-coral/45 bg-brand-soft px-3 py-1.5 text-[13px] font-semibold text-coral2"
            >
              {filtre}
            </span>
          ))}
          <span className="rounded-full border border-line2 px-3 py-1.5 text-[13px] text-txt2">
            {t.autres}
          </span>
        </div>

        {/* Des annonces écrites, pas des barres : on montre un résultat. */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {t.biens.map(([titre, quartier], i) => (
            <div
              key={titre}
              className="flex gap-2.5 rounded-xl border border-line bg-ink/70 p-2.5"
              style={{ opacity: 1 - i * 0.14 }}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/[.05]">
                <PlanGlyph className="h-7 w-7 text-coral2/70" />
              </span>
              <span className="flex flex-1 flex-col justify-center">
                <span className="text-[13px] font-bold text-txt">{titre}</span>
                <span className="text-[12px] text-txt2">{quartier}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </DrawnStage>
  );
}

/**
 * Campagne — l'entonnoir.
 *
 * De la publicité au client, en trois paliers qui rétrécissent. C'est la
 * seule figure abstraite des trois, parce que le service l'est aussi : ce
 * qu'on vend, c'est le chemin, pas un écran.
 */
function CampagneFigure({ locale }: { locale: Locale }) {
  const paliers =
    locale === 'ar'
      ? [
          { label: 'إعلان شوهد', largeur: '100%' },
          { label: 'صفحة الوصول', largeur: '72%' },
          { label: 'اتصال وصل', largeur: '44%' },
        ]
      : [
          { label: 'Publicité vue', largeur: '100%' },
          { label: 'Page d’arrivée', largeur: '72%' },
          { label: 'Contact reçu', largeur: '44%' },
        ];
  const legende =
    locale === 'ar'
      ? 'كل خطوة مقيسة، من الدينار المصروف إلى الزبون'
      : 'Chaque étape mesurée, du dinar dépensé au client';

  return (
    <DrawnStage id="fig-campagne">
      <div className="flex flex-col items-center gap-3 py-2">
        {paliers.map((palier, i) => (
          <div
            key={palier.label}
            className="flex items-center justify-center rounded-xl border border-coral/30 px-4 py-3 text-[14px] font-semibold text-txt"
            style={{
              width: palier.largeur,
              background: `linear-gradient(120deg, rgba(255,90,95,${0.2 + i * 0.16}), rgba(255,138,95,${0.12 + i * 0.14}))`,
            }}
          >
            {palier.label}
          </div>
        ))}
        <p className="mt-1 text-[13px] text-txt2">{legende}</p>
      </div>
    </DrawnStage>
  );
}

/* ------------------------------------------------------------- pictogrammes */

function SofaGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
      <path d="M3 11a2 2 0 0 1 2 2v3h14v-3a2 2 0 1 1 4 0v5H1v-5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function PlanGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 10h9M12 3v18M12 15h9" />
    </svg>
  );
}
