---
version: 1.0.0
date: 2026-04-17
usage: Refactoriser un test Playwright vers un pattern Page Object Model.
---

# Prompt Copilot — Refactor vers POM

Prends le test fourni et:

1. Crée des classes Page Object (`pages/`).
2. Isole les sélecteurs dans les classes.
3. Expose des méthodes métier (`addToCart`, `checkout`).
4. Garde les assertions dans le test.
5. Ajoute des commentaires expliquant les choix de design.

## Exemple entrée

Un test unique avec sélecteurs inline.

## Exemple sortie

- `pages/catalog.page.ts`
- `pages/cart.page.ts`
- `tests/cart.spec.ts` refactorisé
