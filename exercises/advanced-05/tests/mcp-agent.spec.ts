import { expect, test } from '@playwright/test';
import type { McpTools, TestResult } from '../starter/agent-runner';
import { MAX_ATTEMPTS } from '../starter/agent-runner';

// ---------------------------------------------------------------------------
// Helpers de mock réutilisables
// ---------------------------------------------------------------------------

/** Crée un mock d'outils MCP qui simule un test réussi dès la première tentative. */
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
// Exercice avancé 05 — normalizeTicket()
// ---------------------------------------------------------------------------

test.describe('Exercice avancé 05 — normalizeTicket()', () => {
  test('extrait les assertions depuis une description en prose avec critères bullet', async () => {
    const description = `
      En tant qu'utilisateur connecté,
      je veux ajouter un produit au panier.

      Critères d'acceptation :
      - Le compteur panier affiche 1 après ajout
      - Un toast de confirmation est visible
      - Le bouton est désactivé si le stock est 0
    `;

    // TODO: Appeler normalizeTicket(description)
    // TODO: Vérifier que assertions est un tableau avec 3 éléments
    // TODO: Vérifier que userRole contient 'utilisateur'
    // TODO: Vérifier que feature est une chaîne non vide
  });

  test('extrait les preconditions depuis la syntaxe Gherkin', async () => {
    const description = `
      Given l'utilisateur est connecté en tant qu'admin
      And le catalogue contient au moins un produit
      When l'admin supprime un produit
      Then le produit n'est plus visible dans la liste
    `;

    // TODO: Appeler normalizeTicket(description)
    // TODO: Vérifier que preconditions contient au moins un élément
    // TODO: Vérifier que assertions contient l'assertion liée au Then
  });

  test('lève une erreur si la description est vide', async () => {
    // TODO: Vérifier que normalizeTicket('') lève une Error
    // TODO: Vérifier que normalizeTicket('   ') lève aussi une Error
    // Astuce : await expect(promise).rejects.toThrow('...')
  });

  test('retourne au moins un assertion même pour une description minimale', async () => {
    const description =
      'Le formulaire de connexion doit afficher une erreur si le mot de passe est incorrect.';

    // TODO: Appeler normalizeTicket(description)
    // TODO: Vérifier que assertions.length >= 1
  });
});

// ---------------------------------------------------------------------------
// Exercice avancé 05 — runWithAutoDebug() : cas succès
// ---------------------------------------------------------------------------

test.describe('Exercice avancé 05 — runWithAutoDebug() : succès immédiat', () => {
  test('retourne passed=true et attempts=1 quand le test passe au premier essai', async () => {
    const tools = makeMcpTools();

    // TODO: Appeler runWithAutoDebug('test.spec.ts', tools)
    // TODO: Vérifier que result.passed === true
    // TODO: Vérifier que result.attempts === 1
    // TODO: Vérifier que playwright_screenshot n'a pas été appelé (pas d'échec)
  });
});

// ---------------------------------------------------------------------------
// Exercice avancé 05 — runWithAutoDebug() : boucle auto-debug
// ---------------------------------------------------------------------------

test.describe('Exercice avancé 05 — runWithAutoDebug() : boucle auto-debug', () => {
  test('appelle screenshot et get_dom avant generate_fix sur un échec', async () => {
    let callCount = 0;
    const tools = makeMcpTools({
      playwright_run_test: async (): Promise<TestResult> => {
        callCount++;
        // Échoue une fois, puis réussit
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

    // TODO: Appeler runWithAutoDebug('test.spec.ts', tools)
    // TODO: Vérifier que result.passed === true
    // TODO: Vérifier que result.attempts === 2
    // TODO: Vérifier que playwright_screenshot a été appelé une fois
    // TODO: Vérifier que playwright_get_dom a été appelé une fois
    // TODO: Vérifier que generate_fix a été appelé une fois
  });

  test('ne dépasse pas MAX_ATTEMPTS tentatives', async () => {
    const tools = makeMcpTools({
      playwright_run_test: async (): Promise<TestResult> => ({
        passed: false,
        error: 'Timeout exceeded',
        failingUrl: 'https://staging.example.com/page',
        failingSelector: '[data-testid="missing"]',
      }),
    });

    // TODO: Appeler runWithAutoDebug('test.spec.ts', tools)
    // TODO: Vérifier que result.passed === false
    // TODO: Vérifier que result.attempts === MAX_ATTEMPTS
    // TODO: Vérifier que playwright_run_test a été appelé exactement MAX_ATTEMPTS fois
    expect(MAX_ATTEMPTS).toBe(3); // cette ligne doit rester — elle documente le contrat
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

    // TODO: Appeler runWithAutoDebug('test.spec.ts', tools)
    // TODO: Vérifier que navigatedUrls contient 'https://staging.example.com/dashboard'
  });
});
