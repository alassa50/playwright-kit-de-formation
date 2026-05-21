/**
 * normalize-ticket.solution.ts — Solution commentée (exercice advanced-05)
 *
 * Parsing local sans API Claude : heuristiques simples sur la structure du texte.
 * Dans un vrai pipeline, on appellerait l'API Claude avec un system prompt strict.
 */

export interface NormalizedTicket {
  assertions: string[];
  preconditions: string[];
  userRole: string;
  feature: string;
}

/**
 * Normalise la description d'un ticket Jira en un objet structuré.
 * Supporte la prose, le Gherkin (Given/When/Then) et les bullet points.
 */
export async function normalizeTicket(description: string): Promise<NormalizedTicket> {
  // Validation à la frontière du système : fail fast sur entrée invalide
  if (!description || !description.trim()) {
    throw new Error('Description vide ou invalide');
  }

  const lines = description
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // Extraction du userRole depuis "En tant que X" / "As a X" / "utilisateur connecté"
  const roleMatch =
    description.match(/en tant qu[e']\s+([^,\n]+)/i) ?? description.match(/as an?\s+([^,\n]+)/i);
  const userRole = roleMatch ? roleMatch[1].trim() : 'utilisateur';

  // Extraction des preconditions depuis Gherkin (Given/Étant donné/And) ou prérequis
  const preconditions = lines
    .filter((l) => /^(given|étant donné|prérequis|and\s)/i.test(l))
    .map((l) => l.replace(/^(given|étant donné|prérequis|and)\s*/i, '').trim())
    .filter(Boolean);

  // Extraction des assertions depuis :
  // - Gherkin : Then / Alors
  // - Bullet points : "- " ou "* "
  // - Critères numérotés : "1. " ou "1) "
  const assertions = lines
    .filter((l) => /^(then|alors)\s/i.test(l) || /^[-*]\s/.test(l) || /^\d+[.)]\s/.test(l))
    .map((l) =>
      l
        .replace(/^(then|alors)\s*/i, '')
        .replace(/^[-*]\s+/, '')
        .replace(/^\d+[.)]\s+/, '')
        .trim(),
    )
    .filter(Boolean);

  // Si aucune assertion extraite par les heuristiques, utiliser les phrases
  // contenant des verbes d'obligation ("doit", "should", "must")
  if (assertions.length === 0) {
    const fallbackAssertions = lines
      .filter((l) => /\b(doit|should|must|affich|valid|vérifie)\b/i.test(l))
      .map((l) => l.trim());
    assertions.push(...fallbackAssertions);
  }

  // Déduction de la feature depuis les mots-clés les plus fréquents
  const featureKeywords = [
    'panier',
    'cart',
    'login',
    'connexion',
    'checkout',
    'commande',
    'profil',
    'dashboard',
    'search',
    'recherche',
    'catalogue',
    'product',
    'produit',
  ];
  const lowerDescription = description.toLowerCase();
  const feature = featureKeywords.find((kw) => lowerDescription.includes(kw)) ?? 'fonctionnalité';

  return { assertions, preconditions, userRole, feature };
}
