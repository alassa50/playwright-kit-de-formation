/**
 * orchestrator.ts — Mini-orchestrateur MCP QA (illustration pédagogique)
 *
 * Ce fichier illustre la structure d'un pipeline QA autonome complet.
 * Il ne s'exécute pas sans les variables d'environnement et les serveurs MCP réels.
 *
 * Pour comprendre chaque étape, lire course/chapter-16.md.
 *
 * Usage (avec les variables d'environnement configurées) :
 *   npx ts-node examples/mcp-agent/orchestrator.ts PROJ-123
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NormalizedTicket {
  assertions: string[];
  preconditions: string[];
  userRole: string;
  feature: string;
}

interface TestResult {
  passed: boolean;
  error?: string;
  failingUrl?: string;
  failingSelector?: string;
}

// ---------------------------------------------------------------------------
// Étape 1 — Normalisation du ticket Jira
// ---------------------------------------------------------------------------

/**
 * Convertit la description libre d'un ticket en JSON structuré.
 * Dans un vrai pipeline, appelle l'API Claude avec un system prompt strict.
 * Voir course/chapter-16.md section 5 pour le code de l'API call.
 */
async function normalizeTicket(description: string): Promise<NormalizedTicket> {
  // Ici : appel réel à l'API Claude
  // const claude = new Anthropic();
  // const response = await claude.messages.create({ ... });
  // return JSON.parse(response.content[0].text);

  // Version stub pour illustration
  return {
    assertions: [`Le comportement décrit dans : "${description.slice(0, 60)}..."`],
    preconditions: [],
    userRole: 'utilisateur',
    feature: 'fonctionnalité',
  };
}

// ---------------------------------------------------------------------------
// Étape 2 — Inspection DOM via Playwright MCP
// ---------------------------------------------------------------------------

/**
 * Cartographie les sélecteurs data-testid disponibles sur une page.
 * L'agent appelle cet outil AVANT d'écrire le moindre sélecteur.
 */
async function inspectDom(stagingUrl: string): Promise<Record<string, string>> {
  // Appel réel via Playwright MCP :
  // await mcpClient.call('playwright_navigate', { url: stagingUrl });
  // const dom = await mcpClient.call('playwright_get_dom', { selector: 'body' });
  // → parser dom pour extraire les data-testid

  console.log(`[MCP] Navigation vers ${stagingUrl}`);
  // Stub : retourne une carte sélecteur → description
  return {
    'submit-btn': 'Bouton de soumission du formulaire',
    'cart-count': "Compteur d'articles dans le panier",
    'product-card': 'Carte produit dans le catalogue',
  };
}

// ---------------------------------------------------------------------------
// Étape 3 — Génération du spec Playwright
// ---------------------------------------------------------------------------

/**
 * Génère le contenu d'un fichier .spec.ts à partir du ticket normalisé
 * et de la carte des sélecteurs réels.
 */
async function generateSpec(
  ticket: NormalizedTicket,
  selectorMap: Record<string, string>,
  agentsContract: string,
): Promise<string> {
  // Appel réel à l'API Claude avec :
  // - system prompt : agentsContract (AGENTS.md complet)
  // - user message : ticket normalisé + carte des sélecteurs
  // → génère un spec Playwright conforme aux conventions

  console.log('[Claude API] Génération du spec...');
  console.log('[Contexte] Sélecteurs disponibles :', Object.keys(selectorMap));
  console.log('[Contrat] AGENTS.md injecté :', agentsContract.slice(0, 80), '...');

  // Stub : spec minimal illustratif
  return `import { expect, test } from '@playwright/test';
import { ${ticket.feature.charAt(0).toUpperCase() + ticket.feature.slice(1)}Page } from '../pages/${ticket.feature}.page';

test.describe('${ticket.feature} — ${ticket.userRole}', () => {
  test('${ticket.assertions[0] ?? 'comportement attendu'}', async ({ page }) => {
    const featurePage = new ${ticket.feature.charAt(0).toUpperCase() + ticket.feature.slice(1)}Page(page);
    await featurePage.goto();
    // Assertions générées depuis les critères d'acceptation
    ${ticket.assertions.map((a) => `// TODO: ${a}`).join('\n    ')}
  });
});
`;
}

// ---------------------------------------------------------------------------
// Étape 4 — Boucle auto-debug
// ---------------------------------------------------------------------------

/**
 * Exécute le test et, en cas d'échec, observe puis corrige.
 * Maximum MAX_ATTEMPTS tentatives.
 */
async function runWithAutoDebug(specPath: string): Promise<boolean> {
  const MAX_ATTEMPTS = 3;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    console.log(`[Test] Tentative ${attempts}/${MAX_ATTEMPTS} : ${specPath}`);

    // Appel réel : await mcpClient.call('playwright_run_test', { specPath });
    const result: TestResult = { passed: attempts >= 2 }; // stub : réussit à la 2e tentative

    if (result.passed) {
      console.log(`[Test] ✅ Succès en ${attempts} tentative(s)`);
      return true;
    }

    if (attempts >= MAX_ATTEMPTS) break;

    // Observation avant correction
    console.log('[MCP] Navigation vers la page en échec...');
    // await mcpClient.call('playwright_navigate', { url: result.failingUrl });

    console.log("[MCP] Capture d'écran...");
    // const screenshot = await mcpClient.call('playwright_screenshot', {});

    console.log("[MCP] Extraction du DOM au point d'échec...");
    // const domState = await mcpClient.call('playwright_get_dom', { selector: result.failingSelector });

    console.log('[Claude API] Génération du correctif depuis les observations...');
    // const fix = await claude.messages.create({ ... domState, screenshot ... });
    // applyFix(fix, specPath);
  }

  console.log('[Test] ❌ Échec après', MAX_ATTEMPTS, 'tentatives → intervention humaine requise');
  return false;
}

// ---------------------------------------------------------------------------
// Pipeline principal
// ---------------------------------------------------------------------------

async function runQaAgent(ticketId: string): Promise<void> {
  console.log(`\n=== Pipeline QA MCP — Ticket ${ticketId} ===\n`);

  // Charger le contrat agent
  const agentsContract = readFileSync(join(__dirname, 'agents.md'), 'utf-8');

  // 1. Lire et normaliser le ticket Jira
  console.log('[Jira MCP] Lecture du ticket...');
  // const ticketData = await mcpClient.call('jira_get_issue', { issueKey: ticketId });
  const mockDescription = `
    En tant qu'utilisateur connecté,
    je veux ajouter un produit au panier.
    - Le compteur panier affiche 1 après ajout
    - Un toast de confirmation est visible
  `;

  const ticket = await normalizeTicket(mockDescription);
  console.log('[Normalisé]', JSON.stringify(ticket, null, 2));

  // 2. Poster un commentaire Jira : démarrage de la génération
  console.log('[Jira MCP] Commentaire : "Génération de tests démarrée..."');
  // await mcpClient.call('jira_add_comment', { issueKey: ticketId, body: '...' });

  // 3. Transition Jira : À faire → En cours
  console.log('[Jira MCP] Transition : "En cours"');
  // await mcpClient.call('jira_transition_issue', { issueKey: ticketId, status: 'In Progress' });

  // 4. Inspecter le DOM de la page concernée
  const stagingUrl = `https://staging.example.com/${ticket.feature}`;
  const selectorMap = await inspectDom(stagingUrl);

  // 5. Générer le spec Playwright
  const specContent = await generateSpec(ticket, selectorMap, agentsContract);
  const specPath = `tests/${ticket.feature}-generated.spec.ts`;
  console.log(`[Spec généré]\n${specContent}`);

  // 6. Boucle auto-debug
  const passed = await runWithAutoDebug(specPath);

  if (!passed) {
    // Échec persistant : notifier et arrêter
    console.log('[Jira MCP] Commentaire : "Génération échouée. Intervention manuelle requise."');
    return;
  }

  // 7. Créer la branche et committer
  const branchName = `qa/auto-${ticketId.toLowerCase()}`;
  console.log(`[GitHub MCP] Création branche : ${branchName}`);
  // await mcpClient.call('create_branch', { branch: branchName });
  // await mcpClient.call('create_or_update_file', { path: specPath, content: specContent });

  // 8. Ouvrir la PR
  console.log('[GitHub MCP] Ouverture de la PR...');
  const prUrl = `https://github.com/owner/repo/pull/999`; // stub
  // const pr = await mcpClient.call('create_pull_request', { ... });

  // 9. Poster le lien PR et transitionner Jira
  console.log(`[Jira MCP] Commentaire : "PR prête : ${prUrl}"`);
  console.log('[Jira MCP] Transition : "En revue"');

  console.log('\n=== Pipeline terminé ===\n');
}

// ---------------------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------------------

const ticketId = process.argv[2] ?? 'PROJ-123';
runQaAgent(ticketId).catch((err: Error) => {
  console.error('[Erreur pipeline]', err.message);
  process.exit(1);
});
