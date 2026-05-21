/**
 * normalize-ticket.ts — Stub à compléter (exercice advanced-05)
 *
 * Cette fonction reçoit la description brute d'un ticket Jira et retourne
 * un objet structuré contenant les informations nécessaires à la génération
 * d'un test Playwright.
 *
 * Dans un vrai pipeline MCP, cette fonction appelle l'API Claude.
 * Dans cet exercice, elle doit parser la description localement
 * pour valider la logique de structuration.
 */

export interface NormalizedTicket {
  /** Ce que le test doit vérifier (critères d'acceptation) */
  assertions: string[];
  /** État initial requis avant d'exécuter le test */
  preconditions: string[];
  /** Profil utilisateur concerné par le test */
  userRole: string;
  /** Module ou fonctionnalité testée */
  feature: string;
}

/**
 * Normalise la description d'un ticket Jira en un objet structuré.
 *
 * @param description - Description brute du ticket (prose, Gherkin ou bullet points).
 * @returns Un objet NormalizedTicket avec assertions, preconditions, userRole et feature.
 * @throws Error si la description est vide ou ne contient pas d'informations exploitables.
 *
 * TODO: Implémenter cette fonction.
 *
 * Comportements attendus :
 * 1. Retourne un NormalizedTicket avec au moins une assertion.
 * 2. Lève une Error("Description vide ou invalide") si description est vide ou whitespace.
 * 3. Détecte userRole depuis des phrases comme "En tant que [rôle]" ou "As a [role]".
 * 4. Extrait les assertions depuis "Alors", "Then", "Doit", "Should", ou des bullet "- ".
 * 5. Extrait les preconditions depuis "Étant donné", "Given", "Prérequis".
 * 6. Déduit feature depuis les mots-clés du titre ou de la description.
 *
 * Exemple d'entrée :
 * ```
 * En tant qu'utilisateur connecté,
 * je veux ajouter un produit au panier
 * afin de pouvoir passer commande.
 *
 * Critères d'acceptation :
 * - Le compteur panier affiche 1 après ajout
 * - Un toast de confirmation est visible
 * - Le bouton est désactivé si le stock est 0
 * ```
 *
 * Exemple de sortie attendue :
 * ```json
 * {
 *   "assertions": [
 *     "Le compteur panier affiche 1 après ajout",
 *     "Un toast de confirmation est visible",
 *     "Le bouton est désactivé si le stock est 0"
 *   ],
 *   "preconditions": ["utilisateur connecté"],
 *   "userRole": "utilisateur connecté",
 *   "feature": "panier"
 * }
 * ```
 */
export async function normalizeTicket(description: string): Promise<NormalizedTicket> {
  // TODO: Implémenter la normalisation
  throw new Error('normalizeTicket() non implémentée');
}
