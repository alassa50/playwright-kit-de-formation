# Chapitre 3 — Fixtures, données et idempotence

## Objectifs pédagogiques

- Organiser les données de test.
- Rendre les tests répétables.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 et 2

## Contenu

1. Fixtures Playwright.
2. Données déterministes.
3. Nettoyage et isolation de scénario.

## Cas réel (terrain)

- Des tests passent seuls mais échouent en suite complète à cause de données partagées.
- Une stratégie de fixtures et de seed déterministe est introduite.
- Les scénarios deviennent répétables en local comme en CI.

## Exercice bonus

- Créer une fixture dédiée à un utilisateur de test réutilisable.
- Isoler les données pour exécuter le même test deux fois de suite sans effet de bord.
- Documenter brièvement la règle d'idempotence appliquée.

## Erreurs fréquentes

- Réutiliser des comptes de test globaux entre scénarios.
- Dépendre d'un ordre d'exécution implicite des tests.
- Oublier le nettoyage des données créées pendant le test.

## Exercices associés

- exercises/intermediate-01
