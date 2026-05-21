import { expect, test } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { HealingContext } from '../starter/healer-utils';
import { healSpec } from '../starter/healer-utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AGENTS_DIR = path.join(__dirname, '../starter/agents');

function readAgentFile(name: string): string {
  return fs.readFileSync(path.join(AGENTS_DIR, name), 'utf-8');
}

// ---------------------------------------------------------------------------
// 1. Structure des fichiers .agent.md
// ---------------------------------------------------------------------------

test.describe('Structure des fichiers .agent.md', () => {
  const agentFiles = [
    'playwright-test-planner.agent.md',
    'playwright-test-generator.agent.md',
    'playwright-test-healer.agent.md',
  ] as const;

  for (const file of agentFiles) {
    test(`${file} contient les trois sections obligatoires`, () => {
      const content = readAgentFile(file);

      // Section Description
      expect(content, `${file} doit contenir ## Description`).toMatch(/^## Description/m);

      // Section Règles
      expect(content, `${file} doit contenir ## Règles`).toMatch(/^## Règles/m);

      // Section Format de sortie
      expect(content, `${file} doit contenir ## Format de sortie`).toMatch(/^## Format de sortie/m);
    });

    test(`${file} contient au moins 3 règles prescriptives`, () => {
      const content = readAgentFile(file);

      // Extraire la section Règles
      const reglesMatch = content.match(/## Règles([\s\S]*?)(?=##|$)/);
      expect(reglesMatch, `Section ## Règles introuvable dans ${file}`).not.toBeNull();
      const reglesSection = reglesMatch?.[1] ?? '';

      // Compter les items de liste (lignes commençant par "- ")
      const ruleLines = reglesSection.split('\n').filter((l) => l.trim().startsWith('- '));
      expect(
        ruleLines.length,
        `${file} doit contenir au moins 3 règles dans la section ## Règles`,
      ).toBeGreaterThanOrEqual(3);
    });

    test(`${file} utilise des verbes d'obligation (pas de "préférer" ni "essayer")`, () => {
      const content = readAgentFile(file);
      const reglesMatch = content.match(/## Règles([\s\S]*?)(?=##|$)/);
      const reglesSection = reglesMatch?.[1] ?? '';

      // Vérifier la présence d'au moins un verbe prescriptif
      const prescriptivePattern =
        /UNIQUEMENT|INTERDIT|TOUJOURS|JAMAIS|NE PAS|OBLIGATOIRE|SEULEMENT/i;
      expect(
        prescriptivePattern.test(reglesSection),
        `${file} : les règles doivent contenir au moins un verbe prescriptif (UNIQUEMENT, INTERDIT, TOUJOURS, JAMAIS…)`,
      ).toBe(true);

      // Vérifier l'absence de formulations vagues
      const vaguePattern = /préférer|essayer de|de préférence|si possible|idéalement/i;
      expect(
        vaguePattern.test(reglesSection),
        `${file} : les règles ne doivent pas contenir de formulations vagues (préférer, essayer de…)`,
      ).toBe(false);
    });
  }

  test("playwright-test-planner.agent.md interdit explicitement l'écriture de code de test", () => {
    const content = readAgentFile('playwright-test-planner.agent.md');
    // Le planner ne doit pas écrire de code → doit mentionner cette interdiction
    expect(content).toMatch(/\.spec\.ts|code de test|test code/i);
    // Doit indiquer que c'est interdit ou réservé au Generator
    expect(content).toMatch(/INTERDIT|Generator|ne pas écrire|NOT write/i);
  });

  test('playwright-test-generator.agent.md spécifie une stratégie de locators', () => {
    const content = readAgentFile('playwright-test-generator.agent.md');
    // Doit mentionner getByRole, getByLabel ou getByTestId
    expect(content).toMatch(/getByRole|getByLabel|getByTestId/);
    // Doit interdire CSS ou XPath
    expect(content).toMatch(/CSS|XPath|INTERDIT/i);
  });

  test('playwright-test-healer.agent.md mentionne un plafond de tentatives', () => {
    const content = readAgentFile('playwright-test-healer.agent.md');
    // Doit mentionner un nombre maximum de tentatives
    expect(content).toMatch(/\d+\s*(tentatives|attempts|fois|essais)/i);
  });
});

// ---------------------------------------------------------------------------
// 2. Structure d'un test-plan.md valide
// ---------------------------------------------------------------------------

test.describe('Structure du test-plan-example.md', () => {
  const PLAN_PATH = path.join(__dirname, '../starter/test-plan-example.md');

  test('le plan contient au moins deux scénarios numérotés', () => {
    const content = fs.readFileSync(PLAN_PATH, 'utf-8');
    // Scénarios au format "### 1.1", "### 1.2", etc.
    const scenarios = content.match(/^### \d+\.\d+/gm) ?? [];
    expect(
      scenarios.length,
      'Le test-plan-example.md doit contenir au moins 2 scénarios numérotés (### X.Y)',
    ).toBeGreaterThanOrEqual(2);
  });

  test('chaque scénario contient des steps et un résultat attendu', () => {
    const content = fs.readFileSync(PLAN_PATH, 'utf-8');
    // Chaque bloc scénario doit avoir "Steps" et "Résultat attendu"
    const scenarioBlocks = content.split(/^### \d+\.\d+/m).slice(1);

    for (const block of scenarioBlocks) {
      expect(block, 'Chaque scénario doit contenir "Steps"').toMatch(/Steps?\s*:/i);
      expect(block, 'Chaque scénario doit contenir "Résultat attendu"').toMatch(
        /Résultat attendu|Expected result/i,
      );
    }
  });
});

// ---------------------------------------------------------------------------
// 3. healSpec() — corrections locales
// ---------------------------------------------------------------------------

test.describe('healSpec() — strict mode violation', () => {
  test('remplace getByText ambigu par getByRole button quand le DOM contient un <button>', () => {
    const context: HealingContext = {
      specContent: `
        await page.getByText('Connexion').click();
      `,
      error: "strict mode violation: getByText('Connexion') resolved to 3 elements",
      domSnapshot: `<button data-testid="login-btn" class="btn-primary">Connexion</button>`,
    };

    const result = healSpec(context);

    expect(result.fixed).toBe(true);
    expect(result.specContent).toContain("getByRole('button'");
    expect(result.specContent).toContain('Connexion');
    expect(result.specContent).not.toContain("getByText('Connexion')");
    expect(result.diagnosis).toBeTruthy();
  });

  test('remplace getByText ambigu par getByRole link quand le DOM contient un <a>', () => {
    const context: HealingContext = {
      specContent: `
        await page.getByText('Accueil').click();
      `,
      error: "strict mode violation: getByText('Accueil') resolved to 2 elements",
      domSnapshot: `<a href="/home" data-testid="nav-home">Accueil</a>`,
    };

    const result = healSpec(context);

    expect(result.fixed).toBe(true);
    expect(result.specContent).toContain("getByRole('link'");
    expect(result.specContent).toContain('Accueil');
    expect(result.diagnosis).toBeTruthy();
  });
});

test.describe('healSpec() — sélecteur CSS détecté', () => {
  test('remplace un sélecteur CSS par getByTestId quand data-testid est dans le snapshot', () => {
    const context: HealingContext = {
      specContent: `
        await page.locator('.product-card').first().click();
      `,
      error: 'Test failed: element not found',
      domSnapshot: `<div data-testid="product-card" class="product-card">Laptop</div>`,
    };

    const result = healSpec(context);

    expect(result.fixed).toBe(true);
    expect(result.specContent).toContain('getByTestId(');
    expect(result.specContent).not.toContain("locator('.");
    expect(result.diagnosis).toBeTruthy();
  });

  test('remplace un sélecteur CSS par getByRole quand pas de data-testid dans le snapshot', () => {
    const context: HealingContext = {
      specContent: `
        await page.locator('#submit-form').click();
      `,
      error: 'Test failed: element not found',
      domSnapshot: `<button type="submit" aria-label="Envoyer le formulaire">Envoyer</button>`,
    };

    const result = healSpec(context);

    expect(result.fixed).toBe(true);
    expect(result.specContent).toContain('getByRole(');
    expect(result.diagnosis).toBeTruthy();
  });
});

test.describe('healSpec() — cas inconnus', () => {
  test("retourne fixed: false si l'erreur ne correspond à aucune règle", () => {
    const context: HealingContext = {
      specContent: `
        await expect(page.getByTestId('order-total')).toHaveText('42,00 €');
      `,
      error: 'expect(received).toHaveText(expected) - Expected: "42,00 €" Received: "41,99 €"',
      domSnapshot: `<span data-testid="order-total">41,99 €</span>`,
    };

    const result = healSpec(context);

    expect(result.fixed).toBe(false);
    // Le spec ne doit pas être modifié
    expect(result.specContent).toBe(context.specContent);
    expect(result.diagnosis).toBeTruthy();
  });

  test('retourne toujours une diagnosis non vide', () => {
    const context: HealingContext = {
      specContent: `await page.goto('/');`,
      error: 'Network error: connection refused',
      domSnapshot: '',
    };

    const result = healSpec(context);

    expect(result.diagnosis.trim().length).toBeGreaterThan(0);
  });
});
