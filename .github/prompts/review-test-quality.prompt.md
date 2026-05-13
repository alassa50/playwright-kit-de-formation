---
version: 1.0.0
date: 2026-05-13
usage: Auditer la qualité d'un test Playwright existant sur 5 axes.
---

# Prompt Copilot — Revue qualité d'un test

Analyse le test Playwright fourni et évalue-le sur les 5 axes suivants.
Pour chaque axe, donne une note (✅ OK / ⚠️ À améliorer / ❌ Problème) et une suggestion concrète si nécessaire.

## Axe 1 — Sélecteurs

- Utilise-t-il `getByRole`, `getByLabel`, `getByTestId` en priorité ?
- Y a-t-il des sélecteurs CSS fragiles (`locator('.btn')`, `nth()`, XPath) ?
- Les sélecteurs sont-ils couplés à l'implémentation (classes CSS, IDs générés) ?

## Axe 2 — Assertions

- Les assertions sont-elles précises (pas de `toBeTruthy()` à la place de `toHaveText()`) ?
- Les messages d'erreur sont-ils exploitables en cas d'échec ?
- Y a-t-il des faux positifs possibles (assertion trop large) ?

## Axe 3 — Isolation

- Le test dépend-il de l'ordre d'exécution des autres tests ?
- Y a-t-il des appels à des API externes non mockées ?
- Le test laisse-t-il un état persistant (données en base, fichiers, cookies) ?

## Axe 4 — Lisibilité

- Le nom du test décrit-il un comportement métier (pas une implémentation) ?
- Le code est-il auto-documenté sans commentaires excessifs ?
- La structure `describe/test` est-elle logique ?

## Axe 5 — Maintenabilité

- Y a-t-il de la duplication que POM ou fixtures pourraient réduire ?
- Le test sera-t-il fragile après un refactoring UI mineur ?
- Les timeouts sont-ils hardcodés (`waitForTimeout`) ?

## Rapport attendu

Fournis un tableau récapitulatif puis les suggestions détaillées par axe.
