# Contribuer

## Flux recommandé

1. Créer une branche de travail.
2. Implémenter une modification ciblée.
3. Exécuter `npm run lint` puis les tests pertinents.
4. Ouvrir une PR avec contexte + captures + risques.

## Standards

- TypeScript strict obligatoire.
- Selectors robustes (`getByRole`, `getByLabel`) privilégiés.
- Tests idempotents, pas de dépendance à l'ordre d'exécution.

## Hooks

Le hook pre-commit exécute lint + format via Husky/lint-staged.

## Sécurité

- Ne jamais committer de secret.
- Utiliser `process.env` + GitHub Secrets.
