import { expect, test } from '@playwright/test';
import type { McpTools, TestResult } from '../../exercises/advanced-05/starter/agent-runner';
import { MAX_ATTEMPTS, runWithAutoDebug } from './agent-runner.solution';
import { normalizeTicket } from './normalize-ticket.solution';

// ---------------------------------------------------------------------------
// Helpers de mock réutilisables
// ---------------------------------------------------------------------------

function makeMcpTools(overrides: Partial<McpTools> = {}): McpTools & {
  calls: Record<string, number>;
} {
  const calls: Record<string, number> = {
    playwright_navigate: 0,
    playwright_screenshot: 0,
    playwright_get_dom: 0,
    playwright_run_test: 0,
    generate_fix: 0,
  };

  return {
    playwright_navigate: async (_url: string) => {
      calls['playwright_navigate']++;
    },
    playwright_screenshot: async () => {
      calls['playwright_screenshot']++;
      return '/tmp/screenshot.png';
    },
    playwright_get_dom: async (_selector: string) => {
      calls['playwright_get_dom']++;
      return '<button data-testid="submit-btn">Envoyer</button>';
    },
    playwright_run_test: async (_specPath: string): Promise<TestResult> => {
      calls['playwright_run_test']++;
      return { passed: true };
    },
    generate_fix: async () => {
      calls['generate_fix']++;
      return '// fix généré';
    },
    ...overrides,
    calls,
  };
}

// ---------------------------------------------------------------------------
// Solution commentée — normalizeTicket()
// ---------------------------------------------------------------------------

test.describe('Solution commentée — normalizeTicket()', () => {
  test('extrait les assertions depuis une description en prose avec critères bullet', async () => {
    const description = `
      En tant qu'utilisateur connecté,
      je veux ajouter un produit au panier.

      Critères d'acceptation :
      - Le compteur panier affiche 1 après ajout
      - Un toast de confirmation est visible
      - Le bouton est désactivé si le stock est 0
    `;

    const result = await normalizeTicket(description);

    // Trois bullet points → trois assertions
    expect(result.assertions).toHaveLength(3);
    expect(result.assertions[0]).toContain('compteur panier');

    // Rôle extrait depuis "en tant qu'utilisateur connecté"
    expect(result.userRole.toLowerCase()).toContain('utilisateur');

    // Feature déduite depuis le mot-clé "panier"
    expect(result.feature).toBe('panier');
  });

  test('extrait les preconditions depuis la syntaxe Gherkin', async () => {
    const description = `
      Given l'utilisateur est connecté en tant qu'admin
      And le catalogue contient au moins un produit
      When l'admin supprime un produit
      Then le produit n'est plus visible dans la liste
    `;

    const result = await normalizeTicket(description);

    // "Given" et "And" → preconditions
    expect(result.preconditions.length).toBeGreaterThanOrEqual(1);
    // "Then" → assertion
    expect(result.assertions.some((a) => a.toLowerCase().includes('produit'))).toBe(true);
  });

  test('lève une erreur si la description est vide', async () => {
    // Validation à la frontière : entrée vide = erreur explicite
    await expect(normalizeTicket('')).rejects.toThrow('Description vide ou invalide');
    await expect(normalizeTicket('   ')).rejects.toThrow('Description vide ou invalide');
  });

  test('retourne au moins une assertion même pour une description minimale', async () => {
    const description =
      'Le formulaire de connexion doit afficher une erreur si le mot de passe est incorrect.';

    const result = await normalizeTicket(description);

    // Heuristique de fallback : "doit" → assertion
    expect(result.assertions.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Solution commentée — runWithAutoDebug() : succès immédiat
// ---------------------------------------------------------------------------

test.describe('Solution commentée — runWithAutoDebug() : succès immédiat', () => {
  test('retourne passed=true et attempts=1 quand le test passe au premier essai', async () => {
    const tools = makeMcpTools();

    const result = await runWithAutoDebug('test.spec.ts', tools);

    expect(result.passed).toBe(true);
    expect(result.attempts).toBe(1);
    // Pas d'échec → pas d'observation nécessaire
    expect(tools.calls['playwright_screenshot']).toBe(0);
    expect(tools.calls['playwright_get_dom']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Solution commentée — runWithAutoDebug() : boucle auto-debug
// ---------------------------------------------------------------------------

test.describe('Solution commentée — runWithAutoDebug() : boucle auto-debug', () => {
  test('appelle screenshot et get_dom avant generate_fix sur un échec', async () => {
    let callCount = 0;
    const tools = makeMcpTools({
      playwright_run_test: async (): Promise<TestResult> => {
        callCount++;
        if (callCount === 1) {
          return {
            passed: false,
            error: 'Locator not found: [data-testid="submit"]',
            failingUrl: 'https://staging.example.com/checkout',
            failingSelector: '[data-testid="submit"]',
          };
        }
        return { passed: true };
      },
    });

    const result = await runWithAutoDebug('test.spec.ts', tools);

    expect(result.passed).toBe(true);
    expect(result.attempts).toBe(2);
    // Observation avant correction : screenshot et DOM capturés avant le fix
    expect(tools.calls['playwright_screenshot']).toBe(1);
    expect(tools.calls['playwright_get_dom']).toBe(1);
    expect(tools.calls['generate_fix']).toBe(1);
  });

  test('ne dépasse pas MAX_ATTEMPTS tentatives', async () => {
    let runTestCalls = 0;
    const tools = makeMcpTools({
      playwright_run_test: async (): Promise<TestResult> => {
        runTestCalls++;
        return {
          passed: false,
          error: 'Timeout exceeded',
          failingUrl: 'https://staging.example.com/page',
          failingSelector: '[data-testid="missing"]',
        };
      },
    });

    const result = await runWithAutoDebug('test.spec.ts', tools);

    expect(result.passed).toBe(false);
    // Plafonnement strict : protège contre les boucles infinies
    expect(result.attempts).toBe(MAX_ATTEMPTS);
    expect(runTestCalls).toBe(MAX_ATTEMPTS);
    expect(MAX_ATTEMPTS).toBe(3);
  });

  test('observe avant de corriger : navigate est appelé avec failingUrl', async () => {
    const navigatedUrls: string[] = [];
    const tools = makeMcpTools({
      playwright_navigate: async (url: string) => {
        navigatedUrls.push(url);
      },
      playwright_run_test: async (): Promise<TestResult> => ({
        passed: false,
        error: 'Element not found',
        failingUrl: 'https://staging.example.com/dashboard',
        failingSelector: '[data-testid="header"]',
      }),
    });

    await runWithAutoDebug('test.spec.ts', tools);

    // L'agent navigue vers la page en échec pour observer l'état réel
    expect(navigatedUrls).toContain('https://staging.example.com/dashboard');
  });
});
