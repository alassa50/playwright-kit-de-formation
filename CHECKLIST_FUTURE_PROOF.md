# Checklist Future Proof (12–24 mois)

- [x] **Modularité**: chapitres découplés (`course/`) et exercices indépendants.
- [x] **Prompts versionnés**: métadonnées version/date/usage dans `.github/prompts`.
- [x] **CI matrix**: OS + navigateur pour réduire risques de régression.
- [x] **Observabilité**: upload traces, screenshots, report HTML, visual diffs.
- [x] **Dépendances**: Dependabot + workflow Renovate.
- [x] **Sécurité**: politique secrets + principes minimaux.
- [x] **Accessibilité**: test automatisé axe-core et exercice dédié.
- [x] **Portabilité**: devcontainer + scripts locaux.
- [x] **Résilience**: exemples anti-flaky (fixtures, retries ciblés, selectors stables).
- [x] **Dette technique**: section dédiée dans la gouvernance de cours.

## Actions recommandées

1. Revoir les prompts tous les trimestres.
2. Mettre à jour Playwright mensuellement.
3. Monitorer les tests instables et ouvrir un ticket après 2 échecs intermittents.
4. Réévaluer le contenu pédagogique tous les 6 mois (outils IA + nouveautés Playwright).
