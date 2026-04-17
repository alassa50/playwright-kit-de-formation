# Chapitre 9 — BDD avec Cucumber

## Objectifs pédagogiques

- Écrire un scénario Gherkin.
- Mapper Given/When/Then sur Playwright.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 à 8

## Contenu

### 1. Structure feature/steps

Le BDD (Behavior Driven Development) avec Cucumber repose sur deux types de fichiers :
les **features** (scénarios en langage naturel) et les **steps** (implémentation des
actions).

**Fichier feature — le scénario en Gherkin :**

```gherkin
# examples/bdd-cucumber/features/cart.feature
Feature: Panier e-commerce
  Scenario: Ajouter un produit met à jour le total
    Given un panier vide
    When j'ajoute un produit à 25 euros
    Then le total du panier doit être 25 euros
```

Le langage Gherkin utilise des mots-clés précis :

| Mot-clé       | Rôle                                |
| ------------- | ----------------------------------- |
| `Feature`     | Nom de la fonctionnalité testée     |
| `Scenario`    | Un cas de test précis               |
| `Given`       | L'état initial avant l'action       |
| `When`        | L'action réalisée par l'utilisateur |
| `Then`        | Le résultat attendu                 |
| `And` / `But` | Extension d'un Given/When/Then      |

**Fichier steps — l'implémentation :**

```typescript
// examples/bdd-cucumber/steps/cart.steps.ts
import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert';

type CartWorld = { total: number };
const world: CartWorld = { total: 0 };

Given('un panier vide', () => {
  world.total = 0;
});

When("j'ajoute un produit à {int} euros", (price: number) => {
  world.total += price;
});

Then('le total du panier doit être {int} euros', (expectedTotal: number) => {
  assert.equal(world.total, expectedTotal);
});
```

Les paramètres `{int}`, `{string}`, `{float}` dans les steps sont automatiquement
extraits du texte Gherkin.

**Exécuter les tests BDD :**

```bash
npm run bdd
```

---

### 2. Gestion des données en BDD

**Paramétrer un scénario avec des exemples (`Scenario Outline`) :**

```gherkin
Feature: Remise panier
  Scenario Outline: Remise selon le montant
    Given un panier avec un total de <montant> euros
    When j'applique le code promo "<code>"
    Then le prix final doit être <prix_final> euros

    Examples:
      | montant | code     | prix_final |
      | 100     | PROMO10  | 90         |
      | 50      | PROMO10  | 45         |
      | 200     | PROMO20  | 160        |
```

Chaque ligne du tableau `Examples` génère un scénario distinct.

**Passer des données entre étapes avec le `world` :**

```typescript
import { World } from '@cucumber/cucumber';

class CartWorld extends World {
  total = 0;
  items: string[] = [];
}

Given('un panier vide', function (this: CartWorld) {
  this.total = 0;
  this.items = [];
});

When("j'ajoute un produit à {int} euros", function (this: CartWorld, price: number) {
  this.total += price;
});

Then('le total doit être {int} euros', function (this: CartWorld, expected: number) {
  assert.equal(this.total, expected);
});
```

**Règle importante :** les données de scénario doivent être explicites dans le Gherkin.
Éviter les valeurs codées en dur dans les steps — cela rend les scénarios illisibles
pour les profils non techniques.

---

### 3. Génération de rapport

**Le rapport HTML Cucumber est configuré dans `package.json` :**

```json
"bdd": "cucumber-js examples/bdd-cucumber/features
  --require-module ts-node/register
  --require examples/bdd-cucumber/steps/**/*.ts
  --format html:examples/bdd-cucumber/reports/cucumber-report.html"
```

**Générer et ouvrir le rapport :**

```bash
npm run bdd
# Ouvrir le fichier généré
open examples/bdd-cucumber/reports/cucumber-report.html
```

Le rapport affiche :

- Toutes les features et leurs scénarios.
- Le résultat de chaque étape (Given/When/Then) avec son statut.
- Les erreurs avec le message complet en cas d'échec.

**Ajouter d'autres formats en parallèle :**

```bash
cucumber-js features \
  --format html:reports/rapport.html \
  --format json:reports/rapport.json \
  --format @cucumber/pretty-formatter
```

**Partager le rapport avec l'équipe produit :**

Le format HTML est lisible sans outil particulier. Il peut être publié comme artefact
GitHub Actions pour que les parties prenantes non techniques puissent y accéder :

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: bdd-report
    path: examples/bdd-cucumber/reports/cucumber-report.html
```

## Cas réel (terrain)

- Produit, QA et dev peinent à partager une compréhension commune des règles métier.
- Des scénarios Gherkin alignent langage métier et automatisation Playwright.
- Les revues de scénarios deviennent un point d'entrée pour affiner les exigences.

## Exercice bonus

- Écrire un scénario Gherkin avec un exemple nominal et un cas d'erreur.
- Mapper chaque étape sur des steps Playwright réutilisables.
- Générer un rapport BDD et vérifier sa lisibilité pour un profil non technique.

## Erreurs fréquentes

- Écrire des steps trop techniques au lieu d'un langage métier.
- Dupliquer les steps avec des variations mineures.
- Créer des scénarios trop longs qui mélangent plusieurs intentions.

## Exercices associés

- examples/bdd-cucumber/
