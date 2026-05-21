# Exercice Avancé 06 — Playwright Agents natifs : Planner, Generator, Healer

## Énoncé

Configurer et utiliser les trois agents natifs de Playwright v1.56 pour produire
une suite de tests sur l'application TodoMVC :

1. Compléter les fichiers de définition des agents (`*.agent.md`) dans `starter/agents/`.
2. Comprendre la structure d'un plan de test (`test-plan.md`) produit par le Planner.
3. Implémenter une fonction utilitaire `healSpec()` qui applique localement les mêmes
   règles de correction qu'utilise le Healer (sans LLM requis).
4. Valider les tests automatisés dans `tests/playwright-agents.spec.ts`.

## Contexte

Les fichiers dans `starter/` représentent l'état initial d'un projet après
`npx playwright init-agents`. Les fichiers `.agent.md` sont des templates
incomplets : à toi de les rédiger selon les règles du chapitre 17.

La fonction `healSpec()` dans `starter/healer-utils.ts` simule localement le
comportement du Healer : elle prend un spec avec des locators problématiques et
retourne une version corrigée. C'est ce que fait le Healer, sauf qu'il utilise
un LLM ; ici on code les règles explicitement — ce qui te force à les comprendre.

Les tests dans `tests/playwright-agents.spec.ts` vérifient :

- La structure des fichiers `.agent.md` (sections obligatoires, règles prescriptives).
- La structure d'un `test-plan.md` valide (scénarios numérotés, steps, résultats attendus).
- Le comportement de `healSpec()` sur des cas d'échec typiques du Generator.

## Critères d'acceptation

1. Chaque fichier `.agent.md` contient une section `## Description`, une section
   `## Règles` (avec au moins 3 règles prescriptives) et une section `## Format de sortie`.
2. Les règles utilisent des verbes d'obligation : UNIQUEMENT, INTERDIT, TOUJOURS,
   JAMAIS — pas "essayer de", "préférer", "de préférence".
3. `healSpec()` corrige une violation strict mode : un locator `getByText('X')`
   ambigu est remplacé par `getByRole('button', { name: 'X' })` quand le DOM snapshot
   indique un `<button>`.
4. `healSpec()` corrige un sélecteur CSS (`.class-name`) en `getByTestId()` ou
   `getByRole()` selon le DOM snapshot fourni.
5. `healSpec()` retourne `{ fixed: false }` si l'erreur ne correspond à aucune règle
   de correction connue.
6. `healSpec()` retourne une propriété `diagnosis` (string non vide) décrivant
   la cause identifiée.

## Aide

- Le fichier `starter/test-plan-example.md` est un exemple de sortie du Planner :
  utilise-le pour comprendre le format attendu avant de créer le tien.
- Pour `healSpec()`, concentre-toi sur deux types d'erreur fréquents :
  - `strict mode violation: locator resolved to N elements` → ambiguïté de locator
  - Sélecteur CSS détecté dans le spec → mauvaise stratégie de locator
- Un `.agent.md` efficace suit la même logique que `AGENTS.md` (chapitre 16,
  section 3) : chaque règle est une contrainte absolue, pas une recommandation.
- Voir `course/chapter-17.md` section 4 pour des exemples de règles prescriptives.
