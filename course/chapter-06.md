# Chapitre 6 — Page Object Model (POM)

## Objectifs pédagogiques

- Refactoriser des tests vers un POM maintenable.
- Réduire la duplication.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 à 5

## Contenu

### 1. Principes du Page Object Model

Le **Page Object Model (POM)** est un patron de conception qui consiste à encapsuler
les interactions avec une page dans une classe dédiée.

**Sans POM — duplication et fragilité :**

```typescript
// Test A
await page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
await expect(page.getByTestId('cart-count')).toHaveText('1');

// Test B — même code dupliqué

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer au chapitre suivant, vérifie que tu sais :

- Expliquer le principe du Page Object Model.
- Refactoriser un test pour réduire la duplication.
- Créer une classe POM pour une page donnée.

**Quiz rapide**

1. Quels sont les avantages du POM ?
2. Comment factoriser les actions répétées dans un test ?
3. Que faire si la page évolue ?

> Si tu bloques sur une question, relis la section correspondante ou expérimente dans le starter kit.
await page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
await expect(page.getByTestId('cart-count')).toHaveText('1');
```

Si le sélecteur change, il faut modifier chaque test.

**Avec POM — centralisé et lisible :**

```typescript
// catalog.page.ts
export class CatalogPage {
  constructor(private readonly page: Page) {}

  async addFirstItemToCart(): Promise<void> {
    await this.page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
  }
}

// cart.page.ts
export class CartPage {
  constructor(private readonly page: Page) {}

  async expectCount(expected: number): Promise<void> {
    await expect(this.page.getByTestId('cart-count')).toHaveText(String(expected));
  }
}
```

Ces deux classes correspondent exactement à `examples/pom/pages/catalog.page.ts` et
`examples/pom/pages/cart.page.ts` dans ce dépôt.

**Règles de base d'un bon POM :**

- Chaque classe représente **une page ou un composant** de l'application.
- Les méthodes expriment des **actions métier** (`addToCart`, `login`, `submitForm`),
  pas des actions techniques (`clickButton`, `fillInput`).
- Les **assertions** restent dans les specs, pas dans les classes de page.

---

### 2. Architecture de pages

**Structure recommandée :**

```
examples/pom/
├── pages/
│   ├── catalog.page.ts   ← Interactions avec la page catalogue
│   └── cart.page.ts      ← Interactions avec le panier
└── tests/
    └── pom.spec.ts       ← Tests qui utilisent les pages
```

**Utiliser les pages dans un test :**

```typescript
import { test } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { CatalogPage } from '../pages/catalog.page';

test('POM: ajout au panier', async ({ page }) => {
  const catalog = new CatalogPage(page);
  const cart = new CartPage(page);

  await catalog.openWithContent(html); // ouvrir la page
  await catalog.addFirstItemToCart(); // action métier
  await cart.expectCount(1); // assertion via cart
});
```

Ce test se lit comme une description métier, sans détail technique.

**Partager des éléments communs avec une BasePage :**

```typescript
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}

export class CatalogPage extends BasePage {
  async addFirstItemToCart(): Promise<void> {
    await this.page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
  }
}
```

---

### 3. Arbitrages lisibilité vs abstraction

Le POM doit faciliter la maintenance, pas la compliquer. Il y a un équilibre à trouver.

**Quand introduire un POM ?**

- Quand au moins **deux tests** dupliquent les mêmes interactions.
- Quand un changement d'UI nécessiterait de modifier plusieurs spec files.

**Quand ne pas abstraire ?**

- Pour un test unique ou un scénario spécifique.
- Quand l'abstraction rend le test moins lisible qu'avant.

**Ce qu'il ne faut pas faire :**

```typescript
// ⚠️  POM "god object" : trop de responsabilités dans une seule classe
export class AppPage {
  async login() { ... }
  async addToCart() { ... }
  async checkout() { ... }
  async cancelOrder() { ... }
  async changePassword() { ... }
  // ... 30 méthodes
}
```

**Version correcte — une classe par domaine :**

```typescript
export class LoginPage { async login() { ... } }
export class CatalogPage { async addToCart() { ... } }
export class CheckoutPage { async checkout() { ... } }
```

**Résumé :**

> Un bon POM rend les tests lisibles à une personne qui ne connaît pas Playwright.
> Si vous devez expliquer ce que fait le test, le POM n'est pas assez expressif.

## Cas réel (terrain)

- Après plusieurs sprints, les tests du checkout deviennent difficiles à maintenir.
- Un POM est introduit pour centraliser les interactions et clarifier les intentions métier.
- Les changements d'UI nécessitent moins de retouches dans les specs.

## Exercice bonus

- Refactoriser un test existant vers un objet page dédié.
- Extraire les actions clés en méthodes métier nommées.
- Vérifier que le test final reste lisible pour un nouveau membre d'équipe.

## Erreurs fréquentes

- Créer des POM "god object" trop larges.
- Cacher les assertions dans les classes de page.
- Sur-abstraire trop tôt au lieu de factoriser des duplications avérées.

## Exercices associés

- examples/pom/
