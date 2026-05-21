# Exercice Avancé 05 — Pipeline MCP & Agent IA pour la QA

## Énoncé

Mettre en place les briques d'un pipeline QA autonome basé sur MCP :
rédiger un `AGENTS.md` comme contrat agent, implémenter la normalisation de tickets,
et tester la boucle de génération + retry avec des mocks.

## Contexte

Ce dépôt simule l'infrastructure d'un pipeline MCP minimal. Les fichiers fournis dans
`starter/` représentent les artefacts que tu produirais avant d'activer un vrai agent :

- `starter/agents.md` — template `AGENTS.md` à compléter.
- `starter/mcp-config.json` — configuration MCP Playwright à compléter.
- `starter/normalize-ticket.ts` — stub de la fonction de normalisation à implémenter.
- `starter/agent-runner.ts` — mini-orchestrateur simulé (appels MCP mockés).

Les tests dans `tests/mcp-agent.spec.ts` vérifient ces briques de manière **locale et
sans clé API** : les appels à l'API Claude et aux serveurs MCP sont mockés.

## Critères d'acceptation

1. `AGENTS.md` contient au minimum une section SÉLECTEURS, une section PAGE OBJECTS
   et une section ASSERTIONS, chacune avec des règles explicites (prescriptives, pas descriptives).
2. `normalizeTicket()` extrait correctement `assertions`, `preconditions`, `userRole`
   et `feature` depuis une description de ticket en prose ou en Gherkin.
3. `normalizeTicket()` retourne une erreur explicite si la description est vide ou invalide.
4. La boucle retry dans `agent-runner.ts` s'arrête dès le premier succès et ne dépasse
   pas 3 tentatives.
5. La boucle retry appelle bien `playwright_screenshot` et `playwright_get_dom` avant
   de générer le correctif (observation avant correction).

## Aide

- `normalizeTicket()` reçoit une `string` (description brute du ticket) et retourne
  `Promise<NormalizedTicket>` — voir l'interface dans `normalize-ticket.ts`.
- Pour le test de la boucle retry, utilise `jest.fn()` / `vi.fn()` ou des stubs
  simples — pas besoin d'une vraie connexion MCP.
- Un `AGENTS.md` efficace utilise des verbes d'obligation : UNIQUEMENT, INTERDIT,
  TOUJOURS, JAMAIS — pas "privilégier" ni "de préférence".
- Voir `course/chapter-16.md` section 3 pour un exemple de `AGENTS.md` complet.
