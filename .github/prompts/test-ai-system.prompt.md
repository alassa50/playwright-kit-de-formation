---
version: 1.0.0
date: 2026-05-13
usage: Générer des tests Playwright pour une interface qui consomme un LLM ou un chatbot IA.
---

# Prompt Copilot — Tester un système IA

Tu dois générer des tests Playwright pour une interface web qui intègre un LLM ou un
chatbot. Respecte ces règles impérativement.

## Règles fondamentales

1. **Ne jamais utiliser `toBe()` ou `toEqual()` sur une réponse IA** — les sorties sont
   non-déterministes. Utilise `toContainText()`, `toMatch()`, ou vérifie des propriétés
   structurelles (longueur, format, présence de mots-clés).

2. **Toujours mocker l'API IA** avec `page.route()` pour les tests d'interface — les
   appels réels aux LLMs sont coûteux, lents et non-reproductibles en CI.

3. **Tester les états d'interface** : chargement, succès, erreur. Pas seulement le
   cas nominal.

4. **Inclure au moins un test de sécurité** : vérifier que les guardrails fonctionnent
   (refus de prompt injection, pas de données sensibles exposées).

5. **Tester l'accessibilité** de l'interface chatbot avec `@axe-core/playwright`.

## Structure attendue

```ts
test.describe('Interface [NOM_DU_COMPOSANT]', () => {
  test('affiche la réponse IA après envoi du message', async ({ page }) => {
    /* ... */
  });
  test('affiche un indicateur de chargement', async ({ page }) => {
    /* ... */
  });
  test('gère les erreurs serveur gracieusement', async ({ page }) => {
    /* ... */
  });
  test('résiste à une tentative de prompt injection', async ({ request }) => {
    /* ... */
  });
  test('est accessible (aucune violation axe critique)', async ({ page }) => {
    /* ... */
  });
});
```

## Informations à fournir

Décris :

- L'URL ou le HTML de la page à tester.
- L'endpoint de l'API IA (ex: `POST /api/chat`).
- La structure de la réponse JSON attendue (ex: `{ response: string }`).
- Les comportements à tester (cas nominal, erreur, chargement, sécurité).
