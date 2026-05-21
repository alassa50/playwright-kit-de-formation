# Chapitre 17 — Playwright Agents natifs : Planner, Generator, Healer

## Objectifs pédagogiques

- Comprendre les trois agents natifs introduits dans Playwright v1.56 et leur rôle dans le cycle de vie d'un test.
- Initialiser les agents dans un projet existant avec `npx playwright init-agents`.
- Rédiger des fichiers de définition `.agent.md` précis et efficaces.
- Enchaîner les agents Planner → Generator → Healer pour un flux test complet.
- Distinguer les agents natifs VS Code (interactifs) du pipeline headless MCP (chapitre 16).

## Durée estimée

- 60 min

## Prérequis

- Chapitres 1 à 16
- VS Code avec l'extension GitHub Copilot (ou équivalent LLM) active
- Un modèle LLM configuré dans le panneau agents de VS Code

## Contenu

### 1. Pourquoi des agents natifs dans Playwright

Le chapitre 16 a introduit les pipelines MCP headless : des agents orchestrés via
l'API Claude, déclenchés par webhook, sans supervision humaine. Ce modèle est
adapté à la CI et aux équipes QA avancées.

**Playwright v1.56 (2026)** introduit une approche complémentaire : trois agents
directement intégrés dans VS Code, conçus pour assister un développeur pendant sa
session de travail — sans infra MCP personnalisée, sans clé API Claude.

| Approche chapitre 16                    | Approche chapitre 17                         |
| --------------------------------------- | -------------------------------------------- |
| Pipeline headless déclenché par webhook | Agents interactifs dans VS Code              |
| API Claude + serveurs MCP personnalisés | LLM configuré dans le panneau agents VS Code |
| Contrôle total du prompt et des outils  | Fichiers `.agent.md` comme points d'entrée   |
| Pour CI et automatisation sans humain   | Pour sessions de travail assistées           |
| Expertise TypeScript/MCP requise        | Accessible dès Playwright v1.56              |

**Ce ne sont pas deux concurrents — ce sont deux niveaux :**

- Pour démarrer avec l'IA dans Playwright : agents natifs (ce chapitre).
- Pour industrialiser et automatiser entièrement : pipeline MCP (chapitre 16).

---

### 2. Les trois agents natifs

Playwright v1.56 embarque trois agents, chacun responsable d'une phase du cycle
de vie d'un test.

| Agent         | Entrée                              | Sortie                       | Rôle                                        |
| ------------- | ----------------------------------- | ---------------------------- | ------------------------------------------- |
| **Planner**   | App en cours + prompt utilisateur   | `test-plan.md`               | Explorer les flux, documenter les scénarios |
| **Generator** | `test-plan.md` + référence scénario | Fichiers `.spec.ts`          | Écrire du code exécutable avec locators     |
| **Healer**    | Output test échoué + logs           | Fichiers `.spec.ts` corrigés | Diagnostiquer et réparer les échecs         |

**Séquence de handoff :**

```
[Planner]
  Prompt : "tester le flux checkout"
  → Ouvre l'app, navigue, documente
  → Produit : test-plan.md (scénarios numérotés)

[Révision humaine : supprimer les scénarios hors scope, ajouter les edge cases]

[Generator]
  Prompt : "générer le scénario 1.1 de test-plan.md"
  → Relit le plan, rejoue les étapes dans un vrai navigateur
  → Capture le DOM à chaque interaction
  → Produit : checkout-valid.spec.ts

[npx playwright test checkout-valid.spec.ts]

  ✅ Succès → suite stable
  ❌ Échec → Healer

[Healer]
  Prompt : "corriger les échecs dans checkout-valid.spec.ts"
  → Analyse le message d'erreur
  → Inspecte le DOM à l'URL échouée
  → Réécrit les locators ambigus
  → Relance jusqu'à succès ou plafond atteint
```

---

### 3. Initialisation des agents

#### Prérequis : LLM configuré dans VS Code

Les agents s'exécutent dans le panneau agents de VS Code. Un LLM doit être actif
avant de lancer la moindre commande.

- Installer l'extension GitHub Copilot ou toute extension LLM compatible VS Code.
- S'authentifier et vérifier qu'un modèle est actif dans le panneau agents.
- Choisir un modèle capable : les modèles plus performants produisent de meilleurs
  locators et des assertions plus complètes.

#### Étape 1 — Vérifier le projet Playwright

Les agents étendent un projet Playwright existant. Si le projet n'a pas encore de
`playwright.config.ts`, l'initialiser d'abord :

```bash
npm init playwright@latest
```

#### Étape 2 — Initialiser les agents

Depuis la racine du projet :

```bash
npx playwright init-agents --loop=vscode
```

Cette commande crée un dossier `agents/` avec trois fichiers de définition :

```
agents/
├── playwright-test-planner.agent.md
├── playwright-test-generator.agent.md
└── playwright-test-healer.agent.md
```

> **Important** : ne pas renommer ni supprimer ces fichiers. Le flag `--loop=vscode`
> connecte les agents au panneau VS Code et permet de les chaîner automatiquement.

#### Étape 3 — Ouvrir le projet dans VS Code

Les trois agents apparaissent immédiatement dans le panneau agents par leur nom.
Aucune configuration supplémentaire n'est requise.

**Avant de lancer le Planner ou le Generator : démarrer l'application localement.**
Ces deux agents ouvrent un vrai navigateur et interagissent avec l'app en cours.
Sans app disponible, ils ne peuvent rien produire.

---

### 4. Les fichiers `.agent.md` — définition du comportement

Chaque agent est défini par un fichier Markdown dans `agents/`. Quand on l'appelle
dans VS Code, Playwright injecte ce fichier, le prompt utilisateur et le contexte
courant (snapshot DOM ou logs d'erreur) dans le LLM. Le LLM décide alors quoi faire :
ouvrir un navigateur, cliquer, écrire un fichier ou corriger un locator.

**Structure type d'un fichier `.agent.md` :**

```markdown
# Playwright Test Planner

## Description

Tu es le Planner. Ton rôle : explorer l'application et produire un plan de test structuré.

## Règles

- Naviguer vers chaque URL indiquée dans le prompt.
- Documenter chaque interaction clé (formulaire, bouton, navigation).
- Numéroter les scénarios (1.1, 1.2, 2.1, …) pour que le Generator puisse les référencer.
- Écrire le plan dans `test-plan.md` à la racine du projet.
- Ne PAS écrire de code de test — c'est le rôle du Generator.

## Format de sortie

`test-plan.md` avec : titre du scénario, steps numérotés, résultat attendu.
```

Les règles des fichiers `.agent.md` suivent le même principe que `AGENTS.md` du
chapitre 16 : **prescriptif, pas descriptif**.

| ❌ Vague                              | ✅ Précis                                                              |
| ------------------------------------- | ---------------------------------------------------------------------- |
| "Essayer d'utiliser des data-testid"  | "UNIQUEMENT `getByTestId()`. CSS et XPath INTERDIT."                   |
| "Préférer les sélecteurs sémantiques" | "Ordre : `getByRole` > `getByLabel` > `getByTestId`. Jamais `.class`." |
| "Écrire des assertions raisonnables"  | "Toujours asserter l'état observable final, pas uniquement l'URL."     |

---

### 5. Utilisation pas à pas — exemple complet

L'exemple suivant utilise la démo e-commerce [playwright.dev/todoapp](https://demo.playwright.dev/todomvc) (une app stable sans authentification, idéale pour les exercices).

#### 5.1 Créer le plan de test (Planner)

Dans le panneau agents VS Code, sélectionner `playwright-test-planner` et saisir :

```
Utilise le Planner pour créer un plan de test et le sauvegarder dans test-plan.md.
Sur https://demo.playwright.dev/todomvc :
- Ajouter une tâche
- Marquer la tâche comme terminée
- Filtrer par "Active" et "Completed"
- Supprimer une tâche
```

Le Planner ouvre un navigateur, navigue l'app et produit `test-plan.md` :

```markdown
# Test Plan — TodoMVC

## 1. Gestion des tâches

### 1.1 Ajouter une tâche

Steps :

1. Naviguer vers https://demo.playwright.dev/todomvc
2. Cliquer sur le champ "What needs to be done?"
3. Saisir "Acheter du pain"
4. Appuyer sur Entrée
   Résultat attendu : La tâche "Acheter du pain" apparaît dans la liste

### 1.2 Marquer une tâche comme terminée

Steps :

1. [Prérequis : une tâche existe dans la liste]
2. Cliquer sur le cercle à gauche de la tâche
   Résultat attendu : La tâche est barrée et affiche un style "completed"

### 1.3 Filtrer les tâches

Steps :

1. Cliquer sur le lien "Active"
   Résultat attendu : Seules les tâches non terminées sont visibles
2. Cliquer sur le lien "Completed"
   Résultat attendu : Seules les tâches terminées sont visibles
```

> **Révision avant de passer au Generator** : supprimer les scénarios hors scope,
> préciser les données de test, ajouter les edge cases que le Planner a manqués.
> Ne pas passer un plan non relu au Generator.

#### 5.2 Générer le test (Generator)

Sélectionner `playwright-test-generator` et saisir :

```
Crée un script Playwright pour le scénario 1.1 de test-plan.md avec le Generator.
```

Le Generator relit `test-plan.md`, rejoue les étapes dans un navigateur, capture
le DOM à chaque étape et produit le fichier de test :

```typescript
import { test, expect } from '@playwright/test';

test.describe('1.1 Ajouter une tâche', () => {
  test('ajoute une tâche et la rend visible dans la liste', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // Le Generator observe le DOM : le champ a le placeholder "What needs to be done?"
    await page.getByPlaceholder('What needs to be done?').fill('Acheter du pain');
    await page.getByPlaceholder('What needs to be done?').press('Enter');

    // Assertion sur l'état observable final
    await expect(
      page.getByTestId('todo-title').filter({ hasText: 'Acheter du pain' }),
    ).toBeVisible();
    await expect(page.getByText('1 item left')).toBeVisible();
  });
});
```

#### 5.3 Exécuter le test

```bash
npx playwright test tests/todo/todo-add.spec.ts
```

En cas d'échec de type `strict mode violation` (locator résolvant vers plusieurs
éléments), ne pas corriger manuellement — passer au Healer.

#### 5.4 Corriger les échecs (Healer)

Sélectionner `playwright-test-healer` et saisir :

```
Identifie la cause de l'échec dans tests/todo/todo-add.spec.ts et corrige-la avec le Healer.
```

Le Healer :

1. Lit les logs d'erreur.
2. Navigue vers l'URL échouée.
3. Prend un screenshot.
4. Extrait l'état DOM au point d'échec.
5. Réécrit le locator ambigu.
6. Relance le test pour valider.

**Ce que le Healer corrige :**

- Violations strict mode (`getByText('Login')` → 3 éléments)
- Ambiguïté de sélecteurs
- Problèmes de timing d'éléments

**Ce que le Healer ne corrige pas :**

- Bugs côté application (comportement réellement cassé)
- Race conditions dans le JavaScript de l'app
- Réponses API incohérentes
- Tests cassés par une régression visuelle

#### 5.5 Valider la suite

```bash
npx playwright test
```

Sortie attendue après Healer :

```
Running 3 tests using 1 worker

  ✓  tests/todo/todo-add.spec.ts (2.1s)
  ✓  tests/todo/todo-complete.spec.ts (1.8s)
  ✓  tests/todo/todo-filter.spec.ts (3.2s)

  3 passed (7s)
```

---

### 6. Bonnes pratiques

**Choisir le bon modèle LLM**

Les modèles moins capables ignorent les règles de locators et génèrent des assertions
superficielles. Tester deux modèles sur le même prompt et retenir celui qui produit
systématiquement des locators sémantiques et des assertions sur l'état observable.

**Écrire des prompts spécifiques**

Inclure dans chaque prompt : l'URL cible, chaque étape, les données de test et le
résultat attendu. Un prompt vague produit des assertions génériques qui passent en
local mais manquent les vraies régressions en CI.

**Spécifier la stratégie de locators**

Dans le prompt du Generator, demander explicitement `getByRole()`, `getByLabel()`,
`getByTestId()`. Sinon le Generator peut fallback sur des sélecteurs CSS fragiles
quand l'app manque d'attributs ARIA.

**Relire chaque spec avant de le committer**

Les agents ne peuvent pas vérifier que les assertions capturent la bonne intention
métier. Un test qui vérifie uniquement que l'URL a changé après soumission d'un
formulaire est techniquement valide mais métier incorrect.

**Pointer le Healer sur un seul fichier à la fois**

Le Healer est plus précis sur un seul spec. Sur une suite entière, il peut introduire
des corrections collatérales involontaires.

**Versionner les fichiers `.agent.md`**

Ces fichiers définissent le comportement des agents pour toute l'équipe. Les modifier
via code review, pas en modifiant le prompt à la main. Un changement de règle dans
`.agent.md` s'applique à toutes les futures exécutions.

**Relancer le Planner après chaque release majeure**

Le Planner sur les nouvelles UIs livraisons détecte les gaps de couverture : les
nouveaux scénarios dans `test-plan.md` sans spec correspondant signalent ce qui
manque.

---

### 7. Limites et relation avec le chapitre 16

| Limitation agents natifs                         | Solution recommandée                           |
| ------------------------------------------------ | ---------------------------------------------- |
| Nécessite VS Code + LLM actif                    | Non utilisable en CI sans IDE → chapitre 16    |
| Session interactive uniquement                   | Pas de déclenchement par webhook → chapitre 16 |
| Pas d'intégration Jira/GitHub native             | Construire le pipeline MCP → chapitre 16       |
| TypeScript/JavaScript uniquement                 | Python, Java : pas de support nativement       |
| App authentifiée : session à établir en amont    | `storageState` ou `globalSetup` nécessaires    |
| App instable : plans et specs de moindre qualité | Utiliser un environnement staging stable       |

**Règle pratique** : utiliser les agents natifs pour l'exploration rapide et la
génération assistée pendant le développement ; passer au pipeline MCP (chapitre 16)
pour l'automatisation CI continue.

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer à l'exercice, vérifie que tu sais :

- Nommer les trois agents natifs de Playwright v1.56 et leur rôle respectif.
- Expliquer la différence entre un agent natif VS Code et un pipeline MCP headless.
- Décrire ce que contient un fichier `.agent.md` et pourquoi les règles doivent être prescriptives.
- Identifier ce que le Healer peut et ne peut pas corriger.
- Citer deux cas où le pipeline MCP du chapitre 16 est préférable aux agents natifs.

**Quiz rapide**

1. Quelle commande crée les fichiers de définition des agents dans un projet Playwright ?
2. Quel agent produit `test-plan.md` ? Quel agent lit ce fichier ?
3. Pourquoi la révision humaine de `test-plan.md` est-elle une étape obligatoire ?
4. Quelle est la différence entre `--loop=vscode` et un appel d'agent individuel ?
5. Un test échoue avec `strict mode violation: getByRole('button') resolved to 4 elements`.
   Quel agent appelles-tu, et quel prompt utilises-tu ?

> Si tu bloques sur une question, relis les sections 2, 4 et 5 ou consulte
> `exercises/advanced-06/` pour la mise en pratique.
