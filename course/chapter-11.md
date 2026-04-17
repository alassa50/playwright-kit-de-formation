# Chapitre 11 — Sécurité et secrets

## Objectifs pédagogiques

- Éviter fuite de secrets dans tests/CI.
- Appliquer un minimum de tests sécurité.

## Durée estimée

- 60 min

## Prérequis

- Chapitres 1 à 10

## Contenu

1. GitHub Secrets.
2. Bonnes pratiques variables d'environnement.
3. Checklist de revue sécurité.

## Cas réel (terrain)

- Une clé d'API est accidentellement exposée dans un log de pipeline.
- L'équipe renforce la gestion des secrets et le masquage des sorties sensibles.
- Les revues de PR incluent désormais une vérification sécurité explicite.

## Exercice bonus

- Auditer un scénario de test pour repérer les zones de fuite potentielle de secrets.
- Définir quelles variables doivent être injectées uniquement via CI.
- Ajouter une mini-checklist de revue sécurité avant fusion.

## Erreurs fréquentes

- Commiter des valeurs de test qui ressemblent à de vrais secrets.
- Afficher des tokens dans les logs pour "debug rapide".
- Confondre variable de configuration publique et secret sensible.

## Exercices associés

- Revue de CHECKLIST_FUTURE_PROOF.md
