/**
 * agent-runner.ts — Mini-orchestrateur simulé (exercice advanced-05)
 *
 * Ce module simule la boucle agentic d'un pipeline MCP QA.
 * Les appels aux outils MCP (Playwright, Claude) sont représentés par
 * des fonctions injectées (pattern dependency injection) pour permettre
 * les tests locaux sans infrastructure réelle.
 */

export interface McpTools {
  /** Navigue vers une URL dans le navigateur contrôlé par l'agent */
  playwright_navigate: (url: string) => Promise<void>;
  /** Prend une capture d'écran de l'état actuel */
  playwright_screenshot: () => Promise<string>;
  /** Extrait le DOM d'une région */
  playwright_get_dom: (selector: string) => Promise<string>;
  /** Exécute un fichier spec Playwright et retourne le résultat */
  playwright_run_test: (specPath: string) => Promise<TestResult>;
  /** Génère un correctif à partir du contexte fourni (simule l'API Claude) */
  generate_fix: (context: FixContext) => Promise<string>;
}

export interface TestResult {
  passed: boolean;
  error?: string;
  failingUrl?: string;
  failingSelector?: string;
}

export interface FixContext {
  error: string;
  domState: string;
  screenshotPath: string;
  specPath: string;
}

export interface RunResult {
  passed: boolean;
  attempts: number;
}

/**
 * Exécute un test et, en cas d'échec, lance une boucle auto-debug.
 *
 * La boucle observe l'état réel (screenshot + DOM) avant de générer un correctif.
 * Elle s'arrête dès le premier succès ou après MAX_ATTEMPTS tentatives.
 *
 * @param specPath - Chemin vers le fichier spec Playwright à exécuter.
 * @param tools - Outils MCP injectés (réels ou mockés).
 * @returns Un objet indiquant si le test passe et le nombre de tentatives effectuées.
 *
 * TODO: Implémenter cette fonction.
 *
 * Comportements attendus :
 * 1. Appelle `playwright_run_test(specPath)` pour exécuter le test.
 * 2. Si le test passe, retourne `{ passed: true, attempts: 1 }`.
 * 3. Si le test échoue :
 *    a. Appelle `playwright_navigate(result.failingUrl)`.
 *    b. Appelle `playwright_screenshot()`.
 *    c. Appelle `playwright_get_dom(result.failingSelector)`.
 *    d. Appelle `generate_fix({ error, domState, screenshotPath, specPath })`.
 *    e. Relance le test.
 * 4. Ne dépasse pas 3 tentatives (MAX_ATTEMPTS = 3).
 * 5. Retourne `{ passed: false, attempts: MAX_ATTEMPTS }` si toutes les tentatives échouent.
 */
export const MAX_ATTEMPTS = 3;

export async function runWithAutoDebug(specPath: string, tools: McpTools): Promise<RunResult> {
  // TODO: Implémenter la boucle auto-debug
  throw new Error('runWithAutoDebug() non implémentée');
}
