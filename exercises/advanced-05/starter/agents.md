# AGENTS.md — Contrat agent QA

> Ce fichier est injecté tel quel dans le system prompt de l'agent.
> Chaque règle doit être explicite et prescriptive (pas descriptive).
> Complète les sections marquées `TODO` avec les conventions de ton projet.

## SÉLECTEURS

<!-- TODO: Définir les règles de sélecteurs autorisés et interdits -->
<!-- Exemple de règle prescriptive : "UNIQUEMENT page.getByTestId('id'). CSS : INTERDIT." -->

## PAGE OBJECTS

<!-- TODO: Définir les règles de structure et d'utilisation des Page Objects -->
<!-- Rappel : toute interaction avec la page doit passer par un Page Object dans /pages/ -->

## FIXTURES

<!-- TODO: Définir les règles de fixtures (auth, données de test, nommage) -->
<!-- Rappel : ne jamais utiliser test.beforeEach() pour l'auth -->

## ASSERTIONS

<!-- TODO: Définir les règles d'assertions (méthodes autorisées, timeouts, waitForTimeout interdit) -->

## NOMMAGE

<!-- TODO: Définir la convention de nommage des tests, fichiers spec et describe blocks -->
<!-- Rappel : décrire le comportement observable, pas l'implémentation -->
