# Guide d'animation de formation

## Modalités

- Présentiel : 2 à 3 jours.
- Asynchrone : 3 à 4 semaines.

## Méthode

1. Expliquer le chapitre (20%).
2. Live coding guidé (30%).
3. Exercices autonomes (50%).

## Évaluation des apprenants

- KPI: taux de réussite des exercices.
- KPI: temps moyen de résolution.
- KPI: nombre de tests flakys observés.

## Workflow IA (Copilot/ChatGPT/Agents MCP)

1. Générer un brouillon avec un prompt versionné.
2. Vérifier selectors, robustesse, sécurité.
3. Exiger une revue humaine avant merge.

## Chapitre 16 — MCP & Agents (notes formateur)

- Chapitre théorique + illustratif : pas de vrai agent nécessaire en salle.
- Démonstration recommandée : montrer `examples/mcp-agent/orchestrator.ts` en live coding commenté.
- Insister sur `AGENTS.md` : faire rédiger les apprenants en groupe avant de montrer la solution.
- Exercice `advanced-05` : pas de clé API requise — tout est mocké localement.
- Point de discussion : dans quels cas l’agent ne remplace PAS le jugement humain ?

## Grille rapide

- ✅ Critères d'acceptation couverts.
- ✅ Tests stables sur 3 exécutions.
- ✅ Accessibilité vérifiée si applicable.
- ✅ Traces/artefacts lisibles.
