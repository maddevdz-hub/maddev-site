import Image from 'next/image';
import { DDPattern } from '@/components/brand/DDPattern';
import { ServiceIconGlyph } from '@/components/ui/ServiceIcon';
import type { Project } from '@/content/projects';
import type { ServiceGlyphName } from '@/content/services';
import type { Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/**
 * Visuels du site.
 *
 * Aucune reconstitution d'interface ici, et c'est un choix : dessiner de
 * faux écrans avec de faux prix et de fausses statistiques se repère
 * immédiatement et décrédibilise tout le reste. Tant qu'une capture réelle
 * n'existe pas, on assume un visuel de marque — jamais un simulacre de
 * produit.
 */

/**
 * Visuel d'une réalisation.
 *
 * Dès que `project.image` est renseigné, la vraie capture remplace le
 * placeholder sans autre modification. En attendant : un cadre navigateur
 * portant l'URL réelle du projet, le dégradé de la charte et le monogramme
 * DD en filigrane.
 */
export function ProjectVisual({
  project,
  locale,
  className,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  className?: string;
  priority?: boolean;
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.title[locale]} — ${project.kind[locale]}`}
        width={1280}
        height={800}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 640px"
        className={cn(
          'h-auto w-full rounded-2xl border border-line',
          className,
        )}
      />
    );
  }

  // L'URL affichée est celle du site en ligne, pas une invention.
  const displayUrl = project.demoUrl
    ? project.demoUrl.replace(/^https?:\/\//, '')
    : undefined;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-line bg-ink3/80 shadow-card',
        className,
      )}
    >
      {/* Chrome du navigateur */}
      <div className="flex items-center gap-2 border-b border-line bg-white/[.03] px-3.5 py-2.5">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/15" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/15" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/15" />
        {displayUrl ? (
          <span
            dir="ltr"
            className="ms-2 truncate rounded-md bg-white/[.05] px-2.5 py-1 text-[11px] text-txt2"
          >
            {displayUrl}
          </span>
        ) : null}
      </div>

      {/*
        Aplat neutre, sans monogramme : ce cadre présente le site d'un client,
        y poser notre logo laisserait croire qu'il s'agit du nôtre. Il tient
        la place de la capture réelle, qui le remplacera sans autre changement.
      */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink2">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[.05] via-transparent to-white/[.02]" />
      </div>
    </div>
  );
}

/**
 * Visuel abstrait d'un service : dégradé de la charte, pictogramme du
 * service et filigrane DD. Purement décoratif — il n'imite aucun écran.
 */
export function ServiceVisual({
  icon,
  id,
  className,
}: {
  icon: ServiceGlyphName;
  /** Identifiant unique pour les dégradés SVG de la page. */
  id: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-coral/[.12] via-transparent to-coral2/[.08]',
        className,
      )}
    >
      <DDPattern id={`dd-svc-${id}`} opacity={0.018} scale={110} />

      <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-coral/25 bg-ink3/70 text-coral2 backdrop-blur-sm">
        <ServiceIconGlyph name={icon} className="h-10 w-10" />
      </span>
    </div>
  );
}
