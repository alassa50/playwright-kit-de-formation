# Chapitre 10 — CI/CD multi-plateforme

## Objectifs pédagogiques

- Comprendre matrice OS + navigateurs.
- Exploiter les artefacts de CI.

## Durée estimée

- 60 min

## Prérequis

- Chapitres 1 à 9

## Contenu

1. Workflow GitHub Actions.
2. Stratégie de cache.
3. Publication des rapports.

## Cas réel (terrain)

- Les tests passent en local mais échouent aléatoirement selon l'OS en CI.
- Une matrice multi-plateforme révèle des écarts d'environnement.
- Les artefacts (traces, rapports) accélèrent le diagnostic à distance.

## Exercice bonus

- Proposer une matrice CI minimale pertinente pour ce dépôt.
- Identifier quels artefacts conserver pour faciliter le triage.
- Définir un critère simple de "pipeline prête pour merge".

## Erreurs fréquentes

- Exécuter toute la suite sur chaque commit sans stratégie de coût.
- Négliger la rétention des artefacts utiles au débogage.
- Ajouter un cache non maîtrisé qui masque des problèmes de reproductibilité.

## Exercices associés

- Analyse workflow .github/workflows/ci.yml
