# Sécurité et gestion des secrets

## Règles

1. Ne jamais stocker de token, clé API ou mot de passe dans le dépôt.
2. Utiliser GitHub Secrets pour la CI.
3. Préférer des comptes de test dédiés et révocables.

## Contrôles basiques

- Revue PR: rechercher les chaînes sensibles.
- Rotation des secrets en cas de suspicion.
- Journaliser les incidents sécurité dans les issues privées.
