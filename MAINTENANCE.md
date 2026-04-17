# Guide de maintenance: flaky tests et dette technique

## Gestion des flaky tests

1. Tagguer les tests intermittents (`@flaky`) temporairement.
2. Isoler la cause: sélecteur, donnée, latence réseau, état partagé.
3. Corriger d'abord (mock réseau, selectors stables, fixtures), ne pas masquer avec retries globaux.
4. Conserver un retry ciblé uniquement si justifié.

## Dette technique

- Ouvrir une issue dédiée dès qu'un contournement est ajouté.
- Prioriser selon impact CI et fréquence d'échec.
- Revue trimestrielle du backlog dette.

## KPI de suivi

- Taux de succès CI.
- Nombre de tests marqués flaky.
- Temps moyen de résolution d'un test cassé.
