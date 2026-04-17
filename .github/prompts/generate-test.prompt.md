---
version: 1.0.0
date: 2026-04-17
usage: Générer un test Playwright robuste à partir d'un énoncé métier.
---

# Prompt Copilot — Générer un test Playwright

## Entrée attendue

- Contexte produit
- Critères d'acceptation
- Données de test

## Instruction

Écris un fichier `.spec.ts` en TypeScript avec Playwright Test:

1. Utilise `test.describe` et des noms explicites.
2. Préfère `getByRole`/`getByLabel`.
3. Ajoute assertions stables et commentaires courts.
4. Prévois gestion d'attente sans `waitForTimeout`.

## Exemple entrée

"Valider qu'un utilisateur peut ajouter un article au panier et voir le total mis à jour."

## Exemple sortie (extrait)

```ts
test('ajout panier met à jour le total', async ({ page }) => {
  // ...
});
```
