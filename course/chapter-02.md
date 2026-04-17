# Chapitre 2 — Sélecteurs robustes et assertions

## Objectifs pédagogiques

- Utiliser des sélecteurs stables orientés accessibilité.
- Écrire des assertions explicites.

## Durée estimée

- 75 min

## Prérequis

- Chapitre 1

## Contenu

1. `getByRole`, `getByLabel`, `getByTestId`.
2. Erreurs courantes sur sélecteurs CSS fragiles.
3. Assertions de visibilité, texte, état.

## Cas réel (terrain)

- Une refonte UI casse des tests basés sur des classes CSS.
- L'équipe migre vers des sélecteurs orientés accessibilité (`getByRole`, `getByLabel`).
- Le taux de faux positifs baisse lors des évolutions front.

## Exercice bonus

- Remplacer trois sélecteurs CSS fragiles par des sélecteurs Playwright plus stables.
- Ajouter une assertion d'état métier (visible, activé, texte attendu).
- Comparer lisibilité et robustesse avant/après.

## Erreurs fréquentes

- Cibler des éléments via des classes générées ou des index (`nth-child`) instables.
- Utiliser `text=` sans contexte, ce qui rend les tests ambigus.
- Empiler des assertions redondantes au lieu d'exprimer une intention claire.

## Exercices associés

- exercises/beginner-02
