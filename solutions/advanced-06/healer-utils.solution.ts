/**
 * healer-utils.solution.ts — Solution commentée (exercice advanced-06)
 *
 * Implémentation locale des règles de correction du Healer natif Playwright.
 * Pas de LLM requis : les heuristiques sont codées explicitement pour forcer
 * la compréhension de ce que le Healer fait sous le capot.
 *
 * Deux types de corrections sont gérés :
 * 1. Violation strict mode : getByText() ambigu → getByRole() ciblé
 * 2. Sélecteur CSS : locator('.class') ou locator('#id') → getByTestId() ou getByRole()
 */

export interface HealingContext {
  specContent: string;
  error: string;
  domSnapshot: string;
}

export interface HealingResult {
  fixed: boolean;
  specContent: string;
  diagnosis: string;
}

/**
 * Tente de corriger un fichier spec Playwright à partir du contexte d'échec.
 *
 * Principe du Healer : corriger depuis des preuves (DOM observé), pas depuis
 * le message d'erreur seul. Cette implémentation locale mime ce comportement
 * en utilisant le domSnapshot comme source de vérité.
 */
export function healSpec(context: HealingContext): HealingResult {
  const { specContent, error, domSnapshot } = context;

  // --- Règle 1 : Strict mode violation sur getByText() ---
  // Détection : l'erreur signale une ambiguïté sur getByText('X')
  const strictModeMatch = error.match(/strict mode violation.*?getByText\(['"](.+?)['"]\)/i);
  if (strictModeMatch) {
    const text = strictModeMatch[1];

    // Regex pour détecter le rôle ARIA depuis le DOM snapshot (correspondance souple)
    const buttonPattern = new RegExp(
      `<button[^>]*>[\\s\\S]*?${escapeRegex(text)}[\\s\\S]*?</button>`,
      'i',
    );
    const linkPattern = new RegExp(`<a[^>]*>[\\s\\S]*?${escapeRegex(text)}[\\s\\S]*?</a>`, 'i');

    if (buttonPattern.test(domSnapshot)) {
      const fixed = specContent.replace(
        new RegExp(`getByText\\(['"]${escapeRegex(text)}['"]\\)`, 'g'),
        `getByRole('button', { name: '${text}' })`,
      );
      return {
        fixed: true,
        specContent: fixed,
        diagnosis:
          `Strict mode violation : getByText('${text}') résolvait vers plusieurs éléments. ` +
          `DOM snapshot indique un <button> → remplacé par getByRole('button', { name: '${text}' }).`,
      };
    }

    if (linkPattern.test(domSnapshot)) {
      const fixed = specContent.replace(
        new RegExp(`getByText\\(['"]${escapeRegex(text)}['"]\\)`, 'g'),
        `getByRole('link', { name: '${text}' })`,
      );
      return {
        fixed: true,
        specContent: fixed,
        diagnosis:
          `Strict mode violation : getByText('${text}') résolvait vers plusieurs éléments. ` +
          `DOM snapshot indique un <a> → remplacé par getByRole('link', { name: '${text}' }).`,
      };
    }
  }

  // --- Règle 2 : Sélecteur CSS détecté dans le spec ---
  // Détection : locator('.class') ou locator('#id') présent dans le spec
  const cssLocatorMatch = specContent.match(/locator\(['"]([.#][^'"]+)['"]\)/);
  if (cssLocatorMatch) {
    const cssSelector = cssLocatorMatch[1];

    // Chercher un data-testid correspondant dans le DOM snapshot
    const testIdMatch = domSnapshot.match(/data-testid=["']([^"']+)["']/);
    if (testIdMatch) {
      const testId = testIdMatch[1];
      const fixed = specContent.replace(
        new RegExp(`locator\\(['"]${escapeRegex(cssSelector)}['"]\\)`, 'g'),
        `getByTestId('${testId}')`,
      );
      return {
        fixed: true,
        specContent: fixed,
        diagnosis:
          `Sélecteur CSS détecté : locator('${cssSelector}') est fragile. ` +
          `DOM snapshot contient data-testid="${testId}" → remplacé par getByTestId('${testId}').`,
      };
    }

    // Pas de data-testid → chercher un rôle ARIA
    const ariaRoleMatch = domSnapshot.match(/<(button|a|input|select|textarea|heading|checkbox)/i);
    if (ariaRoleMatch) {
      const role = ariaRoleMatch[1].toLowerCase();
      // Normaliser certains rôles HTML → ARIA
      const ariaRole = role === 'a' ? 'link' : role === 'input' ? 'textbox' : role;
      const fixed = specContent.replace(
        new RegExp(`locator\\(['"]${escapeRegex(cssSelector)}['"]\\)`, 'g'),
        `getByRole('${ariaRole}')`,
      );
      return {
        fixed: true,
        specContent: fixed,
        diagnosis:
          `Sélecteur CSS détecté : locator('${cssSelector}') est fragile. ` +
          `Pas de data-testid dans le DOM snapshot. ` +
          `Élément <${ariaRoleMatch[1]}> détecté → remplacé par getByRole('${ariaRole}').`,
      };
    }
  }

  // --- Cas inconnu : aucune règle applicable ---
  return {
    fixed: false,
    specContent,
    diagnosis:
      `Aucune règle de correction automatique applicable. ` +
      `Erreur : "${error.slice(0, 120)}". ` +
      `Intervention humaine requise : vérifier si l'échec est dû à un bug applicatif, ` +
      `une régression visuelle ou un changement de contrat API.`,
  };
}

/** Échappe les caractères spéciaux d'une chaîne pour usage dans une RegExp. */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
