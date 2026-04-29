# Chapitre 5 — Réduction de flakiness

## Objectifs pédagogiques

- Identifier les causes de tests intermittents.
- Appliquer retries ciblés et attentes intelligentes.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 à 4

## Contenu

### 1. Origines de la flakiness

Un test **flaky** (instable) est un test qui passe parfois et échoue d'autres fois sans
que le code ait changé. C'est l'une des causes principales de perte de confiance dans une
suite de tests.

**Les causes les plus fréquentes :**

| Cause                 | Description                                          |
| --------------------- | ---------------------------------------------------- |
| **Race condition**    | Le test agit sur un élément avant qu'il soit prêt    |
| **Dépendance réseau** | L'API externe est lente ou indisponible              |
| **Données partagées** | Un test précédent laisse des données qui interfèrent |

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer au chapitre suivant, vérifie que tu sais :

- Identifier les causes de flakiness dans un test.
- Appliquer des retries ciblés et des attentes intelligentes.
- Rendre un test plus stable.

**Quiz rapide**

1. Quelle est la cause la plus fréquente de flakiness ?
2. Comment éviter les dépendances réseau dans un test ?
3. Quand utiliser les retries Playwright ?

> Si tu bloques sur une question, relis la section correspondante ou expérimente dans le starter kit.
> | **Animations** | Un élément se déplace ou change d'état pendant l'interaction |
> | **Ordre d'exécution** | Les tests fonctionnent seuls mais échouent en parallèle |
> | **Environnement** | Différences de performance entre local et CI |

**Identifier un test flaky :**

```bash
# Relancer un test 5 fois pour confirmer l'instabilité
npx playwright test exercises/intermediate-01/tests/mock-network.spec.ts --repeat-each=5
```

Si le test échoue aléatoirement sur plusieurs exécutions, il est flaky.

---

### 2. `expect.poll`, attentes d'état et isolation

**`expect.poll` — pour les états qui évoluent dans le temps**

```typescript
// Polling : vérifie la condition toutes les 100ms pendant 5s par défaut
await expect
  .poll(async () => {
    const text = await page.getByRole('status').textContent();
    return text;
  })
  .toBe('Terminé');
```

Utile quand le résultat vient d'un appel asynchrone (timer, WebSocket, job en arrière-plan).

**Attentes d'état intégrées (recommandées en priorité) :**

```typescript
// Attendre qu'un élément soit visible
await expect(page.getByRole('status')).toBeVisible();

// Attendre un texte précis (relance automatiquement pendant le timeout)
await expect(page.getByRole('status')).toHaveText('Terminé');

// Attendre qu'une URL soit chargée
await page.waitForURL('**/tableau-de-bord');

// Attendre une réponse réseau précise
const response = await page.waitForResponse('**/api/products');
```

**Isolation par mock réseau :**

Le mock réseau est aussi un outil de stabilité. En remplaçant une vraie API par une
réponse contrôlée, on élimine la variabilité externe :

```typescript
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

Ce pattern vient de `exercises/intermediate-01/tests/mock-network.spec.ts`. L'API
`https://example.test/api/products` est interceptée avant d'être envoyée sur le réseau.

---

### 3. Mock réseau pour stabilité

**`page.route` — intercepter et contrôler les requêtes HTTP**

```typescript
// Intercepter toutes les requêtes qui correspondent au pattern
await page.route('**/api/**', async (route) => {
  // Laisser passer les requêtes GET normalement
  if (route.request().method() === 'GET') {
    await route.continue();
  } else {
    // Bloquer les autres méthodes
    await route.abort();
  }
});
```

**Simuler une erreur réseau :**

```typescript
await page.route('**/api/products', async (route) => {
  await route.fulfill({
    status: 500,
    body: JSON.stringify({ message: 'Erreur interne' }),
  });
});
```

**Simuler une lenteur :**

```typescript
await page.route('**/api/products', async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // délai de 2s
  await route.continue();
});
```

**Annuler un mock en cours de test :**

```typescript
// Enregistrer le handler
const handler = async (route: Route) => route.fulfill({ status: 200, body: '[]' });
await page.route('**/api/products', handler);

// Désactiver après usage
await page.unroute('**/api/products', handler);
```

**Règle d'utilisation des mocks :**

> Mocker uniquement ce qui est nécessaire pour la stabilité ou l'isolation.
> Un test qui mocke tout n'a plus de valeur fonctionnelle.

## Cas réel (terrain)

- La pipeline échoue de façon intermittente sur des appels API lents.
- L'équipe remplace des attentes implicites par des synchronisations explicites et mocks ciblés.
- La stabilité remonte sans masquer de vrais défauts produit.

## Exercice bonus

- Identifier un test instable et formuler l'hypothèse de flakiness.
- Appliquer `expect.poll` ou un mock réseau selon le cas.
- Mesurer la différence de fiabilité sur plusieurs exécutions.

## Erreurs fréquentes

- Activer des retries globaux comme unique réponse à la flakiness.
- Sur-mocker au point de perdre la valeur du test.
- Confondre lenteur applicative réelle et instabilité du test.

## Exercices associés

- exercises/intermediate-01
