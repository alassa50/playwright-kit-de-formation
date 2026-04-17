# Exercice Intermédiaire 02 — Retry ciblé

## Énoncé

Tester un bouton asynchrone qui termine avec un statut final.

## Critères d'acceptation

1. Le statut passe de `Chargement...` à `Terminé`.
2. Le test reste stable sans timeout arbitraire.
3. Utiliser une assertion d'attente Playwright.
