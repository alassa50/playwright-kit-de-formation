# Chapitre 1 — Introduction à Playwright Test

## Objectifs pédagogiques

- Comprendre l'écosystème Playwright + TypeScript.
- Exécuter un premier test fiable.

## Durée estimée

- 60 min

## Prérequis

- Bases JavaScript/TypeScript
- Terminal Git/Node

## Contenu

1. Rôle de Playwright dans une stratégie qualité.
2. Anatomie d'un test (`test`, `expect`, fixtures).
3. Lancer un test et lire les rapports.

## Cas réel (terrain)

- Une équipe e-commerce découvre trop tard des régressions sur la connexion en production.
- Un premier test Playwright "smoke" est ajouté sur le parcours login pour valider chaque build.
- Le gain attendu est une alerte rapide en CI avant mise en ligne.

## Exercice bonus

- Créer un test "smoke" minimal sur la page d'accueil avec un nom de test explicite.
- Exécuter le test en local puis lire le rapport HTML généré.
- Identifier une amélioration de lisibilité à apporter au test (nommage, structure, assertion).

## Erreurs fréquentes

- Mélanger objectif fonctionnel et détails techniques dans un même test.
- Oublier de nommer clairement le scénario, ce qui rend les rapports difficiles à exploiter.
- Lancer les tests sans relire les traces/rapports en cas d'échec.

## Exercices associés

- exercises/beginner-01
