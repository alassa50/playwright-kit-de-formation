# Chapitre 5 — Réduction de flakiness

## Objectifs pédagogiques

- Identifier les causes de tests intermittents.
- Appliquer retries ciblés et attentes intelligentes.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 à 4

## Contenu

1. Origines de flakiness.
2. `expect.poll`, attentes d'état, isolation.
3. Mock réseau pour stabilité.

## Cas réel (terrain)

- La pipeline échoue de façon intermittente sur des appels API lents.
- L'équipe remplace des attentes implicites par des synchronisations explicites et mocks ciblés.
- La stabilité remonte sans masquer de vrais défauts produit.

## Exercice bonus

- Identifier un test instable et formuler l'hypothèse de flakiness.
- Appliquer `expect.poll` ou un mock réseau selon le cas.
- Mesurer la différence de fiabilité sur plusieurs exécutions.

## Erreurs fréquentes

- Activer des retries globaux comme unique réponse à la flakiness.
- Sur-mocker au point de perdre la valeur du test.
- Confondre lenteur applicative réelle et instabilité du test.

## Exercices associés

- exercises/intermediate-01
