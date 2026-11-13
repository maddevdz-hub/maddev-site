import Image from 'next/image';

import type { ServiceStep } from '@/content/services';
import type { Locale } from '@/i18n/config';

/**
 * Le parcours d'une démo en trois écrans légendés.
 *
 * Une capture seule montre un écran ; trois montrent ce qui se passe. Chaque
 * image est un état réel de la démo, produit par `npm run captures` — jamais
 * une recomposition.
 *
 * Sur mobile, la bande défile horizontalement à l'intérieur de son cadre
 * (la page, elle, ne dépasse jamais) : trois téléphones côte à côte dans
 * 390 px seraient illisibles.
 *
 * `sizes` annonce 640 px sur grand écran alors que l'image en occupe moins :
 * c'est voulu. Sans cela, Next sert la variante de 256 ou 384 px, et un
 * écran de téléphone réduit à cette taille devient flou — le texte de la
 * démo doit rester lisible.
 */
export function ShowcaseSteps({
  steps,
  locale,
}: {
  steps: ServiceStep[];
  locale: Locale;
}) {
  return (
    <ol className="-mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-20 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-10">
      {steps.map((step, i) => (
        <li
          key={step.src}
          className="flex w-[68%] shrink-0 snap-center flex-col items-center gap-4 sm:w-auto"
        >
          <div className="w-full max-w-[260px] rounded-[1.8rem] border border-line2 bg-ink3 p-1.5 shadow-[0_24px_50px_-24px_rgba(0,0,0,.75)]">
            <div className="overflow-hidden rounded-[1.4rem]">
              <Image
                src={step.src}
                alt={step.caption[locale]}
                width={780}
                height={1520}
                sizes="(min-width: 640px) 640px, 80vw"
                className="h-auto w-full"
              />
            </div>
          </div>
          <p className="text-center text-[15px] font-semibold leading-snug text-txt">
            <span className="numerals text-coral2">{i + 1}.</span>{' '}
            {step.caption[locale]}
          </p>
        </li>
      ))}
    </ol>
  );
}
