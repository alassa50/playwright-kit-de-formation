/**
 * agent-runner.solution.ts — Solution commentée (exercice advanced-05)
 *
 * Implémentation de la boucle auto-debug :
 * test → (si échec) navigate + screenshot + get_dom → generate_fix → retry
 */

import type {
  McpTools,
  RunResult,
  TestResult,
} from '../../exercises/advanced-05/starter/agent-runner';
import { MAX_ATTEMPTS } from '../../exercises/advanced-05/starter/agent-runner';

export { MAX_ATTEMPTS } from '../../exercises/advanced-05/starter/agent-runner';

export async function runWithAutoDebug(specPath: string, tools: McpTools): Promise<RunResult> {
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;

    const result: TestResult = await tools.playwright_run_test(specPath);

    if (result.passed) {
      // Succès : on sort immédiatement, pas besoin d'observer
      return { passed: true, attempts };
    }

    if (attempts >= MAX_ATTEMPTS) {
      // Plafond atteint : rendre la main à l'humain
      break;
    }

    // --- Phase d'observation : voir avant de corriger ---
    // L'ordre est intentionnel : navigate → screenshot → dom → fix
    // Corriger sans observer = halluciner une solution depuis le message d'erreur seul
    await tools.playwright_navigate(result.failingUrl ?? '');
    const screenshotPath = await tools.playwright_screenshot();
    const domState = await tools.playwright_get_dom(result.failingSelector ?? 'body');

    // Génération du correctif à partir des preuves observées
    await tools.generate_fix({
      error: result.error ?? 'Unknown error',
      domState,
      screenshotPath,
      specPath,
    });

    // La prochaine itération exécutera le test avec le spec corrigé
  }

  return { passed: false, attempts: MAX_ATTEMPTS };
}
