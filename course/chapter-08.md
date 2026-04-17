# Chapitre 8 — Accessibilité automatisée

## Objectifs pédagogiques

- Détecter des violations a11y avec axe-core.
- Corriger les problèmes les plus fréquents.

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 7

## Contenu

1. Principes WCAG utiles pour tests.
2. Intégration `@axe-core/playwright`.
3. Workflow de correction.

## Cas réel (terrain)

- Un audit tardif révèle des contrastes insuffisants et des labels absents sur un formulaire critique.
- L'équipe intègre des contrôles a11y automatisés dans la suite de non-régression.
- Les défauts récurrents sont détectés plus tôt dans le cycle.

## Exercice bonus

- Ajouter un test axe-core sur une page formulaire.
- Filtrer et prioriser les violations selon impact utilisateur.
- Proposer une action de correction pour les deux violations les plus critiques.

## Erreurs fréquentes

- Considérer l'a11y comme un audit ponctuel au lieu d'un contrôle continu.
- Ignorer le contexte métier et la gravité des violations.
- Bloquer toutes les PR sans stratégie de priorisation progressive.

## Exercices associés

- exercises/advanced-01
