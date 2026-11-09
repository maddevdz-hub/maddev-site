"use client";

import { useEffect, useRef } from "react";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { Navigation } from "./Navigation";

/**
 * Bandeau de démonstration et navigation.
 * Mobile : seul le bandeau reste fixé, pour laisser l'écran au contenu.
 * À partir de 768 px : bandeau et navigation restent fixés ensemble.
 * La hauteur fixée est mesurée pour que les ancres s'arrêtent dessous.
 */
export function EnteteFixe() {
  const bandeau = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const large = window.matchMedia("(min-width: 768px)");
    const mesurer = () => {
      const hb = bandeau.current?.offsetHeight ?? 0;
      const hn = large.matches ? (nav.current?.offsetHeight ?? 0) : 0;
      document.documentElement.style.setProperty("--hauteur-fixe", `${hb + hn}px`);
    };
    mesurer();
    const obs = new ResizeObserver(mesurer);
    if (bandeau.current) obs.observe(bandeau.current);
    if (nav.current) obs.observe(nav.current);
    large.addEventListener("change", mesurer);
    return () => {
      obs.disconnect();
      large.removeEventListener("change", mesurer);
    };
  }, []);

  return (
    <div className="contents md:sticky md:top-0 md:z-40 md:block">
      <div ref={bandeau} className="sticky top-0 z-40 md:static">
        <DemoBanner />
      </div>
      <div ref={nav}>
        <Navigation />
      </div>
    </div>
  );
}
