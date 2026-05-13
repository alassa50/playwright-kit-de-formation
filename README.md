---

## Formation asynchrone et checkpoints

Cette formation est conçue pour être suivie à ton rythme, en autonomie complète et 100% localement.

- **Checkpoints** : À la fin de chaque chapitre et exercice, tu trouveras une section "Checkpoint — Auto-évaluation" avec des questions ou une checklist pour valider tes acquis avant de poursuivre.
- **Quiz/Checklist** : Prends le temps d’y répondre honnêtement, c’est un outil d’auto-évaluation, pas de contrôle.
- **Rythme libre** : Avance à ton rythme, reviens sur les chapitres si besoin, expérimente dans le code.

> Objectif : garantir que tu maîtrises chaque étape avant d’aller plus loin.

# Playwright Kit de Formation (TypeScript)

Formation complète et pratique Playwright (débutant → avancé), prête pour le présentiel et l'asynchrone.

## Objectif

- Monter en compétence sur Playwright Test avec TypeScript strict.
- Pratiquer via exercices automatisés, solutions commentées et exemples réutilisables.
- Exécuter la formation en local, en devcontainer et en CI multi-OS/multi-navigateurs.

## Public cible

- QA, développeurs front/fullstack, SDET, formateurs.

## Prérequis

1. Node.js 20+
2. npm 10+
3. Git
4. Docker (optionnel, pour devcontainer)

## Démarrage rapide

1. `npm install`
2. `npx playwright install --with-deps`
3. `npm run lint`
4. `npm test`
5. `npm run test:visual`

> **Note Husky** : Si tu veux activer les hooks git (lint-staged), lance manuellement `npx husky install` après l'installation des dépendances. Le script `prepare` a été retiré car la commande `husky install` est désormais dépréciée dans les scripts npm.

## Scripts utiles

- `npm test` : suite Playwright (Chromium)
- `npm run test:headed` : exécution locale avec UI
- `npm run test:visual` : snapshots visuels
- `npm run test:all` : Chromium + Firefox + WebKit
- `npm run test:api` : tests d'API natifs (advanced-04 + solutions)
- `npm run lint` : lint TypeScript
- `npm run format` : formatage Prettier
- `npm run bdd` : exemple Cucumber

## Plan de formation (16 chapitres)

Voir `course/chapter-00.md` à `course/chapter-15.md`.

0. Bases JavaScript/TypeScript _(prérequis)_
1. Introduction Playwright Test
2. Sélecteurs robustes et assertions
3. Fixtures et idempotence
4. Debug, traces, rapports
5. Réduction de flakiness
6. Page Object Model
7. Visual testing
8. Accessibilité automatisée
9. BDD Cucumber
10. CI/CD multi-plateforme
11. Sécurité et secrets
12. Industrialisation et dette technique
13. Testing assisté par l'IA (2026)
14. Test d'API natif avec Playwright
15. Tester les systèmes IA (LLMs, chatbots)

## Exercices

- Débutant : `exercises/beginner-00`, `exercises/beginner-01`, `exercises/beginner-02`
- Intermédiaire : `exercises/intermediate-01`, `exercises/intermediate-02`
- Avancé : `exercises/advanced-01`, `exercises/advanced-02`, `exercises/advanced-03`, `exercises/advanced-04`

## IA (Copilot / ChatGPT)

Consulter:

- `.github/prompts/` — 5 prompts versionnés (génération, refactoring, revue qualité, test IA, création d'exercice)
- `course/chapter-13.md` — Workflow IA intégré au cycle de test
- `course/chapter-15.md` — Tester les LLMs et chatbots
- `TEACHING_GUIDE.md` (workflow IA + revue humaine)
- `MAINTENANCE.md` (flaky tests et dette technique)

## Arborescence

Voir `TREE.md`.

## Sécurité

- Aucune clé/secrets dans le code.
- Utiliser GitHub Secrets pour CI.
- Consulter `CHECKLIST_FUTURE_PROOF.md` pour la politique de maintenance.
- Consulter `SECURITY.md` pour les règles opérationnelles.
