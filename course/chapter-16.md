# Chapitre 16 — MCP & Agents IA pour l'automatisation QA

## Objectifs pédagogiques

- Comprendre le protocole MCP (Model Context Protocol) et son rôle dans l'automatisation QA.
- Rédiger un `AGENTS.md` comme contrat strict pour un agent IA.
- Utiliser Playwright MCP pour l'inspection DOM live avant et après génération de tests.
- Intégrer Jira MCP pour lire des tickets et mettre à jour le statut automatiquement.
- Orchestrer un agent headless avec l'API Claude pour un pipeline QA de bout en bout.
- Implémenter une boucle auto-debug : test → inspect → fix → retry.
- Identifier les limites de l'agent et savoir quand reprendre la main.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 à 15
- Notions d'API REST et promesses JavaScript
- (Optionnel) Accès à une clé API Claude et une instance Jira pour les exercices réels

## Contenu

### 1. Pourquoi MCP change la donne pour le QA

Jusqu'ici, l'IA générait du code sur la base d'un contexte textuel statique : on lui
donnait des instructions et des exemples, elle produisait un test. Le problème : elle
ne voyait pas le DOM réel, ne savait pas si les sélecteurs existaient, et ne pouvait pas
vérifier elle-même si le test passait.

**MCP (Model Context Protocol)** change cette équation. C'est un protocole standardisé
qui permet à un LLM d'appeler des **outils externes** (le DOM d'un navigateur, une base
de données Jira, un dépôt GitHub) de la même façon qu'un développeur appelle une API.

| Approche classique (chapitre 13)   | Approche MCP (chapitre 16)                  |
| ---------------------------------- | ------------------------------------------- |
| Prompt statique + exemples de code | Agent avec accès live aux outils            |
| L'agent invente les sélecteurs     | L'agent inspecte le DOM réel avant d'écrire |
| L'humain debug les échecs          | L'agent navigue, screenshot et corrige seul |
| Pipeline déclenché à la main       | Pipeline déclenché par webhook (Jira → PR)  |
| Revue de code uniquement           | Revue de code + traces + commentaires Jira  |

L'article de référence de ce chapitre est le pipeline décrit par Mykola Nesvitii :
_MCP + Playwright + Jira : How I Automated My Entire QA Workflow End-to-End_ (2026).

---

### 2. Architecture d'un pipeline MCP

Un pipeline MCP minimal pour la QA se compose de trois couches :

```
Déclencheur (webhook Jira / CI)
        │
        ▼
Claude API (orchestrateur)
        ├── Jira MCP ──────── lire ticket, poster commentaire, transition de statut
        ├── Playwright MCP ── inspecter DOM, exécuter tests, capturer traces
        └── GitHub MCP ────── créer branche, committer, ouvrir PR
        │
        ▼
Test Playwright commité → PR ouverte → Jira mis à jour
```

**Les trois composants MCP utilisés :**

| Serveur MCP      | Rôle dans le pipeline                                                          |
| ---------------- | ------------------------------------------------------------------------------ |
| `playwright-mcp` | Naviguer, inspecter le DOM, prendre des screenshots, lancer les tests          |
| `jira-mcp`       | Lire les tickets, extraire les critères d'acceptation, écrire des commentaires |
| `github-mcp`     | Créer des branches, committer des fichiers, ouvrir des PR                      |

---

### 3. AGENTS.md — le contrat strict de l'agent

Le problème principal identifié dans les pipelines MCP en production n'est pas la
génération de code — c'est la **conformité aux conventions du projet**.

Un LLM suit fidèlement des règles **explicites et sans ambiguïté**. Il interprète
(souvent mal) les règles vagues. La solution : un fichier `AGENTS.md` versionné dans
le dépôt, injecté tel quel dans le system prompt.

**Règle de rédaction :** Ne pas décrire — prescrire. Pas "préférer `data-testid`"
mais "UNIQUEMENT `data-testid`. Tout autre sélecteur sera rejeté en revue."

**Exemple de `AGENTS.md` :**

```markdown
# AGENTS.md — Contrat agent QA

## SÉLECTEURS

- UNIQUEMENT `page.getByTestId('id')` pour les éléments interactifs.
- Sélecteurs CSS : INTERDIT.
- XPath : INTERDIT.
- Sélecteurs textuels : autorisés uniquement pour les composants tiers sans data-testid.

## PAGE OBJECTS

- Toute interaction avec la page DOIT passer par un Page Object dans `/pages/`.
- Ne jamais appeler `page.click()` directement dans un fichier spec.
- Signature du constructeur : `constructor(readonly page: Page) {}`

## FIXTURES

- Étendre la fixture de base dans `/fixtures/base.ts`.
- Ne jamais utiliser `test.beforeEach()` pour l'authentification — utiliser la fixture `authed`.
- La création de données de test va dans `/fixtures/data-factory.ts`.

## ASSERTIONS

- Utiliser `expect(locator).toBeVisible()`, pas `expect(locator).not.toBeHidden()`.
- Ne jamais utiliser `waitForTimeout`. Utiliser des assertions avec timeout explicite.
- Toujours attendre un état observable, jamais un délai arbitraire.

## NOMMAGE

- Nom du test : décrire le comportement observable, pas l'implémentation.
  ✅ "affiche un message de confirmation après la soumission du formulaire"
  ❌ "test du bouton submit"
- Fichier spec : `[feature].spec.ts` dans le dossier du module.
```

> **Principe clé** : Quand l'agent viole une règle, ne pas corriger le prompt — rendre
> la règle dans `AGENTS.md` plus explicite. L'agent suit un contrat précis mieux qu'une
> description nuancée.

---

### 4. Playwright MCP — inspection avant écriture

**Rôle 1 : Cartographier le DOM avant de générer un test**

Avant d'écrire une seule ligne, l'agent utilise Playwright MCP pour :

1. Naviguer vers la page concernée.
2. Extraire tous les attributs `data-testid` de la région UI pertinente.
3. Construire une carte sélecteur → rôle.

Le test est alors écrit à partir d'**observations**, pas de suppositions.

```typescript
// Ce que l'agent fait sous le capot via Playwright MCP
await agent.call('playwright_navigate', { url: 'https://staging.example.com/checkout' });
const domSnapshot = await agent.call('playwright_get_dom', {
  selector: '[data-section="checkout-form"]',
});
// domSnapshot contient tous les data-testid réels présents dans le DOM
// L'agent les utilise pour générer les sélecteurs du test
```

**Rôle 2 : Auto-debug sur échec**

Quand un test échoue, au lieu de corriger depuis le message d'erreur seul :

```typescript
let attempts = 0;
while (attempts < 3) {
  const result = await runPlaywrightTest(specPath);
  if (result.passed) break;

  // L'agent observe avant de corriger
  await agent.call('playwright_navigate', { url: result.failingUrl });
  await agent.call('playwright_screenshot', {});
  const domState = await agent.call('playwright_get_dom', {
    selector: result.failingSelector,
  });

  const fix = await claude.messages.create({
    messages: [
      {
        role: 'user',
        content:
          `Échec du test : ${result.error}\n` +
          `État DOM : ${domState}\n` +
          `Corriger le spec. Respecter AGENTS.md.`,
      },
    ],
  });
  applyFix(fix);
  attempts++;
}
```

Le fix produit par cette boucle est quasi-systématiquement correct au premier essai,
car il repose sur l'état DOM observé, pas sur une inférence.

---

### 5. Jira MCP — lecture et mise à jour de tickets

**Séquence complète pour un ticket :**

1. **Lire** les champs du ticket (titre, description, critères d'acceptation, labels, story points, tickets liés).
2. **Poster un commentaire** : "Génération de tests automatisée démarrée. Mise à jour à suivre."
3. **Transition de statut** : "À faire" → "En cours".
4. Après création de la PR : **poster le lien** en commentaire.
5. **Transition** : "En cours" → "En revue".
6. En cas d'échec CI : **poster le résumé d'erreur**, transition retour "En cours".

**Normalisation des critères d'acceptation**

Les descriptions de tickets Jira sont hétérogènes (prose, Gherkin, bullet points).
Avant d'envoyer au pipeline de génération, une étape de normalisation transforme la
description en JSON structuré :

```typescript
interface NormalizedTicket {
  assertions: string[]; // ce que le test doit vérifier
  preconditions: string[]; // état initial requis
  userRole: string; // qui effectue l'action
  feature: string; // quel module/fonctionnalité
}

async function normalizeTicket(description: string): Promise<NormalizedTicket> {
  const response = await claude.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: `Tu extrais les assertions testables d'un ticket Jira.
             Retourne UNIQUEMENT du JSON valide. Pas de préambule. Pas de markdown.`,
    messages: [
      {
        role: 'user',
        content:
          `Description du ticket :\n${description}\n\n` +
          `Retourne JSON : { assertions: string[], preconditions: string[], ` +
          `userRole: string, feature: string }`,
      },
    ],
  });
  return JSON.parse(response.content[0].text) as NormalizedTicket;
}
```

Cette sortie structurée alimente l'agent principal avec des exigences de test claires
et sans ambiguïté.

---

### 6. Agent headless — orchestration complète

**Pourquoi l'API directe plutôt qu'un IDE (Cursor, Cline) ?**

Les agents dans un IDE sont optimisés pour des sessions interactives avec un humain
dans la boucle. Un pipeline QA autonome nécessite :

- Exécution **headless** (déclenchée par webhook, sans supervision).
- Contrôle complet du system prompt, des définitions d'outils, de la logique de retry.
- **Intégration dans la CI** existante, pas sur le poste d'un développeur.

**Structure d'un agent headless minimal :**

```typescript
import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic(); // ANTHROPIC_API_KEY via variable d'environnement

// Les outils MCP disponibles pour l'agent
const tools = [
  { name: 'playwright_navigate', description: 'Naviguer vers une URL' /* ... */ },
  { name: 'playwright_get_dom', description: "Extraire le DOM d'une région" /* ... */ },
  { name: 'playwright_screenshot', description: "Prendre une capture d'écran" /* ... */ },
  { name: 'jira_read_ticket', description: 'Lire un ticket Jira' /* ... */ },
  { name: 'jira_post_comment', description: 'Poster un commentaire' /* ... */ },
  { name: 'github_create_pr', description: 'Ouvrir une Pull Request' /* ... */ },
];

async function runQaAgent(ticketId: string): Promise<void> {
  // 1. Lire et normaliser le ticket
  const ticket = await normalizeTicket(ticketId);

  // 2. Injecter AGENTS.md + ticket normalisé dans le contexte
  const agentsContract = await fs.readFile('./AGENTS.md', 'utf-8');

  // 3. Lancer l'agent avec accès aux outils MCP
  const response = await claude.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: `Tu es un agent QA. Tu génères des tests Playwright conformes au contrat suivant :\n\n${agentsContract}`,
    tools,
    messages: [
      {
        role: 'user',
        content:
          `Ticket normalisé : ${JSON.stringify(ticket)}\n\n` +
          `Étapes : inspecte le DOM, génère le test, exécute-le, corrige si nécessaire.`,
      },
    ],
  });

  // 4. Traiter les appels d'outils dans une boucle agentic
  await processToolCalls(response, tools);
}
```

**Boucle agentic (tool use loop) :**

L'agent Claude renvoie des `tool_use` blocks. L'orchestrateur les exécute et renvoie
les résultats jusqu'à ce que l'agent signale `end_turn` :

```typescript
async function processToolCalls(response: Anthropic.Message, tools: Tool[]): Promise<void> {
  let messages = [/* messages initiaux */];

  while (response.stop_reason === 'tool_use') {
    const toolResults = [];
    for (const block of response.content) {
      if (block.type === 'tool_use') {
        const result = await executeTool(block.name, block.input);
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result });
      }
    }
    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResults });

    response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: /* ... */,
      tools,
      messages,
    });
  }
}
```

---

### 7. Pipeline complet — du ticket à la PR

**Déclencheur** : règle d'automatisation Jira — quand un ticket avec le label
`needs-e2e` passe en "En cours" et est assigné à l'utilisateur bot QA, un webhook se déclenche.

```
[Webhook Jira] ──► runQaAgent(ticketId)
                       │
                       ├─ jira_read_ticket(ticketId)
                       ├─ normalizeTicket(description)  ← étape de normalisation
                       ├─ jira_post_comment("Démarrage...")
                       ├─ jira_transition("En cours")
                       │
                       ├─ playwright_navigate(stagingUrl)
                       ├─ playwright_get_dom(region)    ← cartographie des sélecteurs
                       │
                       ├─ [générer le spec avec les sélecteurs réels]
                       │
                       ├─ playwright_run_test(specPath)
                       │   └─ Si échec : boucle auto-debug (max 3 tentatives)
                       │
                       ├─ github_create_branch(ticketId)
                       ├─ github_commit(specPath)
                       ├─ github_create_pr(...)
                       │
                       ├─ jira_post_comment(prUrl)
                       └─ jira_transition("En revue")
```

**Temps constatés en production (référence de l'article) :**

| Étape                   | Avant (humain) | Après (agent) |
| ----------------------- | -------------- | ------------- |
| Lecture ticket + design | ~1h30          | < 30 s        |
| Écriture du test        | ~1h            | ~5 min        |
| Debug sélecteurs        | ~30 min        | ~2 min        |
| Mise à jour Jira + PR   | ~30 min        | < 1 min       |
| **Revue humaine**       | —              | **10–15 min** |
| **Total**               | **~3h30**      | **~15 min**   |

---

### 8. Limites et bonnes pratiques

**Ce que l'agent ne gère pas bien (encore) :**

| Cas                                       | Problème                                            | Solution recommandée                         |
| ----------------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| Flux multi-acteurs                        | Setup fixture multi-session souvent incorrect       | Template de fixture à fournir manuellement   |
| Tickets avec critères ambigus             | Test superficiel ("la page se charge")              | Ticket quality gate avant d'assigner au bot  |
| Tests de régression visuelle              | Pas de notion de "ça a l'air bon"                   | Garder `advanced-02` (visual testing) humain |
| Composants tiers sans `data-testid`       | Sélecteurs de fallback fragiles                     | Ajouter les testids manuellement en amont    |
| Première exécution sur environnement neuf | L'agent ne connaît pas les données de test requises | Fournir `data-factory.ts` en contexte        |

**Checklist avant d'activer le pipeline en production :**

```
[ ] AGENTS.md rédigé, relu et validé par l'équipe
[ ] Au moins 5 tests existants conformes comme exemples few-shot
[ ] Environnement staging stable avec données de test reproductibles
[ ] Tous les éléments interactifs ont un data-testid
[ ] Webhook Jira testé manuellement (mode dry-run)
[ ] Boucle auto-debug plafonnée (max 3 tentatives)
[ ] Secret ANTHROPIC_API_KEY dans GitHub Secrets (jamais dans le code)
[ ] Revue humaine obligatoire avant merge (branch protection)
```

**Principe de responsabilité :**

> L'agent gère le pipeline. L'humain gère le jugement.
>
> Ce que l'agent ne remplace pas : évaluer si le test capture _la bonne intention_,
> détecter les edge cases que le ticket ne mentionne pas, décider si un échec signifie
> "corriger le test" ou "corriger le produit".

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer à l'exercice, vérifie que tu sais :

- Expliquer en une phrase ce que MCP apporte par rapport à un prompt statique.
- Nommer les trois serveurs MCP utilisés dans le pipeline QA et leur rôle.
- Rédiger une règle `AGENTS.md` qui soit suffisamment précise pour être suivie sans ambiguïté.
- Décrire les deux rôles de Playwright MCP (avant écriture et auto-debug).
- Identifier deux cas où l'agent nécessite une intervention humaine.

**Quiz rapide**

1. Quelle est la différence entre un pipeline MCP headless et un agent dans un IDE (Cursor/Cline) ?
2. Pourquoi normaliser un ticket Jira avant de le passer à l'agent ?
3. Quel est le risque de plafonnement à 3 tentatives dans la boucle auto-debug ?
4. Que doit contenir le `AGENTS.md` pour que l'agent génère des sélecteurs fiables ?
5. Dans quels cas la revue humaine est-elle indispensable même avec un agent en production ?

> Si tu bloques sur une question, relis la section correspondante ou consulte
> `examples/mcp-agent/` pour une implémentation illustrative complète.
