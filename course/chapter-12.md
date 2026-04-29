# Chapitre 12 — Industrialisation et dette technique

## Objectifs pédagogiques

- Mettre en place une stratégie de maintenance durable.
- Mesurer la qualité dans le temps.

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 11

## Contenu

### 1. KPIs de qualité pour une suite de tests

Les KPIs permettent de mesurer objectivement la santé d'une suite de tests dans le
temps. Sans indicateurs, il est difficile de justifier les efforts de maintenance ou de
détecter une dégradation progressive.

**Les trois KPIs essentiels :**

| KPI                           | Définition                              | Cible           |
| ----------------------------- | --------------------------------------- | --------------- |
| **Taux de succès CI**         | % de runs sans aucun test échoué        | > 95%           |
| **Nombre de tests flaky**     | Tests qui échouent < 100% du temps      | 0 en production |
| **Temps moyen de résolution** | Durée entre premier échec et correction | < 2 jours       |

---

## 🟢 Checkpoint — Auto-évaluation

Après avoir terminé la formation, vérifie que tu sais :

- Mettre en place une stratégie de maintenance durable.
- Mesurer la qualité d’une suite de tests dans le temps.
- Suivre les KPIs essentiels pour la fiabilité.

**Quiz rapide**

1. Quel KPI surveiller pour détecter une dégradation ?
2. Comment réduire le nombre de tests flaky ?
3. Que faire si le taux de succès CI chute ?

> Si tu bloques sur une question, relis la section correspondante ou expérimente dans le starter kit.

**KPIs complémentaires :**

- **Durée totale de la pipeline** : surveiller la tendance, pas la valeur absolue.
- **Couverture des parcours critiques** : chaque flux métier (connexion, commande,
  paiement) doit avoir au moins un test end-to-end.
- **Fréquence de mise à jour des dépendances** : des dépendances obsolètes créent de la
  dette.

**Mesurer le taux de succès CI avec GitHub Actions :**

```bash
# Lister les 30 derniers runs et leur statut
gh run list --limit 30 --json status,conclusion
```

**Surveiller les tests flaky :**

Playwright enregistre les retries dans les rapports. Un test qui nécessite un retry pour
passer est **déjà flaky**.

```bash
# Identifier les tests qui ont nécessité des retries
grep -r "retry" playwright-report/ --include="*.json"
```

---

### 2. Gestion des flaky tests

Ce dépôt inclut un guide de maintenance dans `MAINTENANCE.md`. En voici les points clés
traduits en pratique :

**Workflow recommandé :**

```
1. Test échoue pour la 2e fois de façon intermittente
        ↓
2. Tagger le test @flaky temporairement
        ↓
3. Isoler la cause (sélecteur, réseau, données, parallélisme)
        ↓
4. Corriger (mock, fixture, sélecteur stable, attente explicite)
        ↓
5. Retirer le tag @flaky — valider sur 5 exécutions consécutives
```

**Tagger un test temporairement :**

```typescript
// Marquer comme flaky pour l'investiguer sans bloquer la CI
test('@flaky — chargement catalogue', async ({ page }) => {
  // ...
});
```

**Exclure les tests @flaky du pipeline principal :**

```yaml
# Dans le workflow CI
- run: npx playwright test --grep-invert @flaky
```

**Retry ciblé sur un test précis :**

```typescript
// playwright.config.ts
export default defineConfig({
  retries: 1, // global (recommandé en CI seulement)
});

// Ou ciblé dans le test
test.describe('groupe instable', () => {
  test.describe.configure({ retries: 2 });
  // tests du groupe
});
```

**Analyser les causes récurrentes :**

Consolider les types d'échecs observés sur 1 mois :

- 60% liés à des sélecteurs ? → Revoir les conventions de sélection.
- 30% liés au réseau ? → Systématiser les mocks réseau.
- 10% liés aux données ? → Renforcer l'isolation des fixtures.

---

### 3. Plan d'amélioration continue

L'amélioration continue s'organise autour de rituels réguliers et de décisions explicites.

**Rituel mensuel (30 minutes d'équipe) :**

1. Consulter le dashboard CI : taux de succès, durée, nombre de flaky tests.
2. Prioriser les 2-3 tests les plus problématiques.
3. Assigner une correction avant la prochaine réunion.
4. Vérifier que les dépendances majeures (Playwright, axe-core) sont à jour.

**Checklist trimestrielle :**

- [ ] Revoir les scénarios qui ne correspondent plus aux parcours produit actuels.
- [ ] Supprimer les tests obsolètes (fonctionnalité supprimée, couverture redondante).
- [ ] Auditer les snapshots visuels (certains peuvent être périmés après une refonte).
- [ ] Mettre à jour Playwright : `npx playwright install && npm update @playwright/test`.
- [ ] Relire `CHECKLIST_FUTURE_PROOF.md` et ajuster selon l'évolution du projet.

**Gestion de la dette technique :**

```
Détecter (test qui passe de justesse ou contournement)
        ↓
Documenter (issue GitHub avec label "tech-debt:tests")
        ↓
Prioriser (impact CI + fréquence d'échec)
        ↓
Corriger (sprint ou backlog selon urgence)
        ↓
Valider (5 runs consécutifs réussis avant fermeture de l'issue)
```

**Métriques de maturité d'une suite de tests :**

| Niveau       | Caractéristiques                                |
| ------------ | ----------------------------------------------- |
| **Niveau 1** | Tests qui passent, peu ou pas de flakiness      |
| **Niveau 2** | Rapports exploitables, CI multi-navigateur      |
| **Niveau 3** | Fixtures réutilisables, POM, aucun test flaky   |
| **Niveau 4** | KPIs suivis, rituel de maintenance, dette gérée |

L'objectif de cette formation est d'atteindre le niveau 3 et de poser les bases du
niveau 4.

## Cas réel (terrain)

- Après 6 mois, la suite grossit et la confiance dans les résultats diminue.
- L'équipe met en place des indicateurs (temps, flakiness, couverture des parcours critiques).
- Une routine de maintenance réduit progressivement la dette de tests.

## Exercice bonus

- Définir trois KPIs simples à suivre chaque mois pour la suite Playwright.
- Proposer un rituel d'équipe pour traiter les tests instables.
- Prioriser un backlog de dette technique test sur un prochain trimestre.

## Erreurs fréquentes

- Mesurer uniquement le nombre de tests au lieu de leur valeur.
- Reporter systématiquement la maintenance de la suite.
- Corriger les flaky tests sans analyser leur cause racine.

## Exercices associés

- Rétrospective sur les 6 exercices du parcours.
