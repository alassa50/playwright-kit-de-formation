# Chapitre 4 — Débogage, traces et rapports

## Objectifs pédagogiques

- Diagnostiquer un échec de test.
- Exploiter traces, screenshots et rapport HTML.

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 3

## Contenu

1. Traces Playwright.
2. Screenshots et vidéos d'échec.
3. Stratégies de correction rapide.

## Cas réel (terrain)

- Un test échoue uniquement en CI sans reproduction locale immédiate.
- L'analyse combinée trace + screenshot + vidéo permet d'identifier un timing asynchrone.
- La correction cible le bon point de synchronisation au lieu d'ajouter un `wait` arbitraire.

## Exercice bonus

- Forcer un échec contrôlé sur un test pour générer des artefacts.
- Ouvrir la trace et retrouver l'action exacte qui diverge.
- Proposer une correction minimale basée sur le diagnostic.

## Erreurs fréquentes

- Ajouter des temporisations fixes (`waitForTimeout`) au lieu de diagnostiquer.
- Ne consulter qu'un seul artefact (ex: screenshot) et ignorer la trace.
- Corriger "au hasard" sans hypothèse vérifiable.

## Exercices associés

- exercises/intermediate-02
