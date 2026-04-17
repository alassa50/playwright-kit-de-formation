---
version: 1.0.0
date: 2026-04-17
usage: Créer un exercice complet (énoncé + tests + solution).
---

# Prompt Copilot — Créer un exercice complet

Génère:

1. `exercises/<niveau>-XX/README.md` (énoncé, critères d'acceptation)
2. `exercises/<niveau>-XX/tests/*.spec.ts` (tests Playwright)
3. `solutions/<niveau>-XX/` (solution commentée)

Contraintes:

- TypeScript strict
- Tests idempotents
- Selectors accessibles
- Mentionner alternatives (timeouts, retries, mock réseau)

## Exemple entrée

"Exercice intermédiaire sur interception réseau d'une API produits."

## Exemple sortie

Arborescence complète + snippets de code exécutables.
