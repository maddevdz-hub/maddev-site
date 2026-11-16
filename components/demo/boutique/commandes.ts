'use client';

/**
 * Les commandes de la démo, stockées dans le navigateur.
 *
 * La vitrine les écrit, le tableau de bord du marchand (même navigateur) les
 * lit. Rien ne part sur un serveur : c'est une démonstration, et elle le dit.
 * Lecture et écriture en try/catch — stockage bloqué, navigation privée :
 * la démo continue, sans mémoire.
 */
export const CLE_COMMANDES = 'nada-demo-orders';
export const CLE_FORMULAIRE = 'nada-demo-formulaire';

export type Statut =
  | 'nouvelle'
  | 'a-rappeler'
  | 'confirmee'
  | 'annulee'
  | 'expediee'
  | 'livree'
  | 'retournee';

export type Ligne = {
  slug: string;
  nom: string;
  contenance: string;
  prixUnitaire: number;
  quantite: number;
  /** Remise en %, sur cette ligne (offre jointe). */
  remise?: number;
};

export type Commande = {
  id: string;
  /** Identifiant d'envoi : un double clic ne crée jamais deux commandes. */
  jeton: string;
  date: string;
  client: { nom: string; telephone: string };
  livraison: {
    codeWilaya: number;
    wilaya: string;
    commune: string;
    mode: 'domicile' | 'bureau';
    adresse?: string;
    lieuBureau?: string;
    frais: number;
    delai: string;
  };
  lignes: Ligne[];
  codePromo?: string;
  sousTotal: number;
  remise: number;
  total: number;
  statut: Statut;
  historique: { statut: Statut; date: string; note?: string }[];
  /** Commande d'exemple pré-remplie dans le tableau de bord. */
  exemple?: boolean;
};

export function lireCommandes(): Commande[] {
  try {
    const brut = window.localStorage.getItem(CLE_COMMANDES);
    return brut ? (JSON.parse(brut) as Commande[]) : [];
  } catch {
    return [];
  }
}

export function ecrireCommandes(commandes: Commande[]): boolean {
  try {
    window.localStorage.setItem(CLE_COMMANDES, JSON.stringify(commandes));
    window.dispatchEvent(new Event('nada-commandes'));
    return true;
  } catch {
    return false;
  }
}

/** Ajoute une commande. Même jeton = même commande : renvoie l'existante. */
export function ajouterCommande(c: Commande): Commande {
  const toutes = lireCommandes();
  const deja = toutes.find((x) => x.jeton === c.jeton);
  if (deja) return deja;
  ecrireCommandes([c, ...toutes]);
  return c;
}

export function trouverCommande(id: string): Commande | undefined {
  return lireCommandes().find((c) => c.id === id);
}

/** « ND-7K3QF » : court, lisible au téléphone, sans 0/O ni 1/I. */
export function nouveauNumero(): string {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += a[Math.floor(Math.random() * a.length)];
  return `ND-${s}`;
}

export function nouveauJeton(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
