import { Site } from "@/components/demo/rendezvous/Site";

// Chaque visite part de l’heure réelle : la page est calculée à la demande.
export const dynamic = "force-dynamic";

export default function Page() {
  return <Site maintenant={Date.now()} />;
}
