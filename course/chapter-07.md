# Chapitre 7 — Tests visuels

## Objectifs pédagogiques

- Mettre en place des snapshots visuels.
- Interpréter les diffs d'images.

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 6

## Contenu

1. `toHaveScreenshot`.
2. Paramètres de stabilité visuelle.
3. Revue des diffs en CI.

## Cas réel (terrain)

- Une modification CSS détériore l'alignement d'une carte produit sans casser les tests fonctionnels.
- Les snapshots visuels détectent immédiatement la régression.
- La revue d'image en CI accélère la décision "régression vs changement attendu".

## Exercice bonus

- Ajouter un test visuel sur un composant avec état "normal" et "hover".
- Ajuster les paramètres de stabilité (masquage, animation, police) si nécessaire.
- Documenter la règle de mise à jour des snapshots de référence.

## Erreurs fréquentes

- Capturer des zones trop larges avec contenu dynamique non maîtrisé.
- Régénérer les snapshots sans revue humaine.
- Mélanger assertions visuelles et logiques fonctionnelles complexes dans le même test.

## Exercices associés

- exercises/advanced-02
