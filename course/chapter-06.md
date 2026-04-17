# Chapitre 6 — Page Object Model (POM)

## Objectifs pédagogiques

- Refactoriser des tests vers un POM maintenable.
- Réduire la duplication.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 à 5

## Contenu

1. Principes POM.
2. Architecture de pages.
3. Arbitrages lisibilité vs abstraction.

## Cas réel (terrain)

- Après plusieurs sprints, les tests du checkout deviennent difficiles à maintenir.
- Un POM est introduit pour centraliser les interactions et clarifier les intentions métier.
- Les changements d'UI nécessitent moins de retouches dans les specs.

## Exercice bonus

- Refactoriser un test existant vers un objet page dédié.
- Extraire les actions clés en méthodes métier nommées.
- Vérifier que le test final reste lisible pour un nouveau membre d'équipe.

## Erreurs fréquentes

- Créer des POM "god object" trop larges.
- Cacher les assertions dans les classes de page.
- Sur-abstraire trop tôt au lieu de factoriser des duplications avérées.

## Exercices associés

- examples/pom/
