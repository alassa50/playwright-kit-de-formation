# Chapitre 3 — Fixtures, données et idempotence

## Objectifs pédagogiques

- Organiser les données de test.
- Rendre les tests répétables.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 et 2

## Contenu

### 1. Fixtures Playwright

Une **fixture** est une ressource préparée avant le test et nettoyée après.
Dans Playwright, la fixture la plus connue est `page`, mais vous pouvez en créer des
personnalisées pour injecter des données ou des objets partagés.

**Utiliser les fixtures de base :**

```typescript
// page    : onglet navigateur isolé par test
// context : contexte navigateur (cookies, storage)
// browser : instance navigateur complète
test('exemple', async ({ page, context }) => {
  ---

  ## 🟢 Checkpoint — Auto-évaluation

  Avant de passer au chapitre suivant, vérifie que tu sais :

  - Expliquer le rôle d’une fixture dans Playwright.
  - Organiser des données de test pour la répétabilité.
  - Écrire un test idempotent (répétable sans effet de bord).

  **Quiz rapide**

  1. Quelle différence entre `page`, `context` et `browser` ?
  2. Pourquoi isoler les données de test ?
  3. Comment garantir qu’un test reste idempotent ?

  > Si tu bloques sur une question, relis la section correspondante ou expérimente dans le starter kit.
  // ...
});
```

**Créer une fixture personnalisée avec `test.extend` :**

```typescript
import { test as base, expect } from '@playwright/test';

// Définir le type de la fixture
type Fixtures = {
  loggedInPage: Page;
};

// Étendre le test de base avec la fixture
const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    // Setup : actions exécutées avant chaque test
    await page.setContent(loginHtml);
    await page.getByLabel('Email').fill('apprenant@example.com');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole('status')).toHaveText('Connexion réussie');

    // Passer la ressource au test
    await use(page);

    // Teardown : actions exécutées après chaque test (optionnel)
    // ex : appel API pour supprimer les données créées
  },
});

// Utiliser la fixture dans un test
test('accès au tableau de bord', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible();
});
```

**Avantage clé :** le code de setup est écrit une seule fois et réutilisé dans tous les
tests qui en ont besoin, sans copier-coller.

---

### 2. Données déterministes

Un test est **déterministe** quand il produit le même résultat à chaque exécution,
quelle que soit l'heure, l'ordre ou l'environnement.

**Problème courant — données dynamiques non maîtrisées :**

```typescript
// ⚠️  La date d'aujourd'hui change chaque jour : le test peut échouer.
await expect(page.getByText(new Date().toLocaleDateString())).toBeVisible();
```

**Solution — ancrer les données dans le test :**

```typescript
// ✅ Date fixée : le test est répétable à l'infini.
await expect(page.getByText('01/01/2025')).toBeVisible();
```

**Utiliser `page.route` pour contrôler les données réseau :**

```typescript
// Intercepte l'appel API et retourne des données fixes
await page.route('**/api/products', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { name: 'Livre', price: 10 },
      { name: 'Souris', price: 20 },
      { name: 'Écran', price: 30 },
    ]),
  });
});
```

Ce pattern est utilisé dans `exercises/intermediate-01/tests/mock-network.spec.ts`.
Le mock garantit que les tests ne dépendent pas d'une API externe qui pourrait être
lente, indisponible, ou retourner des données variables.

**Règle des données de test :**

- Utiliser des valeurs **fixes** et **explicites** (pas de `Math.random()`, pas de date
  dynamique non contrôlée).
- Préférer des données qui ont une signification métier claire.
- Documenter l'origine des données si elles viennent d'un seed ou d'une fixture externe.

---

### 3. Nettoyage et isolation de scénario

Chaque test doit partir d'un état propre et ne pas laisser de traces qui pourraient
perturber les tests suivants.

**Isolation automatique avec Playwright :**

Playwright crée un nouveau contexte navigateur pour chaque test. Cela signifie que les
cookies, le localStorage et les sessions sont réinitialisés entre les tests.

**Nettoyage explicite avec `test.afterEach` :**

```typescript
test.afterEach(async ({ page }) => {
  // Exécuté après chaque test, même en cas d'échec
  // Utile pour supprimer des données créées via l'UI ou une API
  await page.evaluate(() => localStorage.clear());
});
```

**Nettoyage dans une fixture personnalisée :**

```typescript
const test = base.extend<{ cleanUser: void }>({
  cleanUser: async ({}, use) => {
    const userId = await createUserViaAPI(); // setup

    await use(); // exécution du test

    await deleteUserViaAPI(userId); // teardown automatique
  },
});
```

**Principe d'idempotence :**

> Un test idempotent peut être exécuté plusieurs fois de suite sans changer le résultat
> et sans effet de bord. C'est l'objectif à viser pour chaque scénario.

**Checklist d'isolation :**

- [ ] Le test ne dépend pas de l'état laissé par un autre test.
- [ ] Les données créées pendant le test sont supprimées après.
- [ ] Le test peut être lancé seul (`npx playwright test <fichier>`) et passer.

## Cas réel (terrain)

- Des tests passent seuls mais échouent en suite complète à cause de données partagées.
- Une stratégie de fixtures et de seed déterministe est introduite.
- Les scénarios deviennent répétables en local comme en CI.

## Exercice bonus

- Créer une fixture dédiée à un utilisateur de test réutilisable.
- Isoler les données pour exécuter le même test deux fois de suite sans effet de bord.
- Documenter brièvement la règle d'idempotence appliquée.

## Erreurs fréquentes

- Réutiliser des comptes de test globaux entre scénarios.
- Dépendre d'un ordre d'exécution implicite des tests.
- Oublier le nettoyage des données créées pendant le test.

## Exercices associés

- exercises/intermediate-01
