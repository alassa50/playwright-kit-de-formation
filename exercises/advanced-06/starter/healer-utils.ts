/**
 * healer-utils.ts — Stub à implémenter (exercice advanced-06)
 *
 * Simule localement le comportement du Healer natif Playwright :
 * prend un spec avec des locators problématiques et retourne une version corrigée.
 *
 * Le Healer réel utilise un LLM ; ici les règles de correction sont codées
 * explicitement — ce qui te force à comprendre ce que le Healer fait sous le capot.
 */

export interface HealingContext {
  /** Contenu du fichier `.spec.ts` à corriger. */
  specContent: string;
  /** Message d'erreur Playwright (ex. "strict mode violation: ..."). */
  error: string;
  /** Snapshot HTML du DOM au point d'échec (ex. "<button data-testid='login-btn'>Login</button>"). */
  domSnapshot: string;
}

export interface HealingResult {
  /** true si une correction a été appliquée, false sinon. */
  fixed: boolean;
  /** Contenu du fichier corrigé (identique à l'entrée si fixed === false). */
  specContent: string;
  /** Description de la cause identifiée et de la correction appliquée. */
  diagnosis: string;
}

/**
 * Tente de corriger un fichier spec Playwright à partir du contexte d'échec.
 *
 * Règles à implémenter :
 *
 * 1. **Strict mode violation**
 *    - Détection : `error` contient "strict mode violation" et un locator `getByText('X')`
 *    - Si `domSnapshot` contient un `<button>` avec le texte X → remplacer par `getByRole('button', { name: 'X' })`
 *    - Si `domSnapshot` contient un `<a>` avec le texte X → remplacer par `getByRole('link', { name: 'X' })`
 *
 * 2. **Sélecteur CSS détecté**
 *    - Détection : `specContent` contient `locator('.')` ou `locator('#')` (sélecteur CSS)
 *    - Si `domSnapshot` contient un `data-testid` sur l'élément → remplacer par `getByTestId('id')`
 *    - Sinon → remplacer par `getByRole()`  avec le rôle ARIA approprié
 *
 * 3. **Cas inconnu**
 *    - Si aucune règle ne s'applique → retourner `{ fixed: false, specContent, diagnosis: '...' }`
 *
 * @param context - Contexte d'échec avec spec, erreur et DOM snapshot
 * @returns Résultat de la tentative de correction
 */
export function healSpec(context: HealingContext): HealingResult {
  // TODO: Implémenter les règles de correction ci-dessus
  throw new Error('healSpec() non implémenté');
}
