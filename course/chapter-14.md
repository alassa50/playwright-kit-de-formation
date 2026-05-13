# Chapitre 14 — Test d'API natif avec Playwright

## Objectifs pédagogiques

- Utiliser le contexte `request` de Playwright pour tester des API REST.
- Combiner tests API et tests UI dans la même suite.
- Préparer l'état via API avant un test UI (setup programmatique).
- Valider les contrats d'API (structure, statuts, headers).

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 5

## Contenu

### 1. Pourquoi tester les API avec Playwright

Playwright embarque un client HTTP complet (`APIRequestContext`) qui partage la session
avec le navigateur. Cela ouvre deux cas d'usage majeurs :

| Cas d'usage                        | Valeur ajoutée                                                       |
| ---------------------------------- | -------------------------------------------------------------------- |
| **Test API pur**                   | Plus rapide qu'E2E, teste le contrat sans UI                         |
| **Setup via API avant test UI**    | Crée des données en ~10 ms au lieu de naviguer dans l'UI             |
| **Teardown via API après test UI** | Nettoie sans laisser d'état parasite                                 |
| **Assertion croisée UI/API**       | Vérifie cohérence entre ce que l'UI affiche et ce que l'API retourne |

---

### 2. Requêtes HTTP avec `request`

La fixture `request` est disponible dans tous les tests Playwright sans configuration
supplémentaire.

**GET — lire une ressource :**

```ts
test('GET /api/products retourne une liste', async ({ request }) => {
  const response = await request.get('https://example.test/api/products');

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});
```

**POST — créer une ressource :**

```ts
test('POST /api/products crée un produit', async ({ request }) => {
  const response = await request.post('https://example.test/api/products', {
    data: { name: 'Clavier', price: 79 },
  });

  expect(response.status()).toBe(201);
  const created = await response.json();
  expect(created).toMatchObject({ name: 'Clavier', price: 79 });
  expect(created.id).toBeDefined();
});
```

**Validation des headers :**

```ts
test('la réponse a les bons headers', async ({ request }) => {
  const response = await request.get('https://example.test/api/products');

  expect(response.headers()['content-type']).toContain('application/json');
});
```

---

### 3. Setup programmatique via API avant un test UI

C'est l'usage le plus puissant : créer les données de test **via API** au lieu de
naviguer dans l'interface, ce qui rend les tests bien plus rapides et stables.

```ts
test('affiche le produit créé via API', async ({ page, request }) => {
  // 1. Setup : créer la donnée via API (rapide, déterministe)
  const response = await request.post('https://example.test/api/products', {
    data: { name: 'Moniteur', price: 349 },
  });
  const { id } = await response.json();

  // 2. Test UI : naviguer directement sur la ressource créée
  await page.goto(`https://example.test/products/${id}`);
  await expect(page.getByRole('heading')).toContainText('Moniteur');
  await expect(page.getByText('349€')).toBeVisible();

  // 3. Teardown : supprimer la donnée via API
  await request.delete(`https://example.test/api/products/${id}`);
});
```

---

### 4. Contexte API partagé avec `APIRequestContext`

Pour des scénarios plus complexes (authentification, réutilisation de session), créer un
contexte partagé :

```ts
import { test as base, APIRequestContext } from '@playwright/test';

type ApiFixtures = { apiContext: APIRequestContext };

const test = base.extend<ApiFixtures>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://example.test',
      extraHTTPHeaders: {
        Authorization: `Bearer ${process.env.API_TOKEN ?? 'test-token'}`,
      },
    });
    await use(context);
    await context.dispose();
  },
});

test('crée et vérifie un produit (authentifié)', async ({ apiContext }) => {
  const res = await apiContext.post('/api/products', {
    data: { name: 'Tablette', price: 299 },
  });
  expect(res.status()).toBe(201);
});
```

---

### 5. Combinaison avec le mock réseau

La fixture `request` et `page.route()` sont complémentaires :

- **`request`** : teste l'API réelle (contrat, intégration).
- **`page.route()`** : simule l'API pour isoler le front-end.

```ts
// Test d'intégration (API réelle)
test('contrat API — statut 400 sur données invalides', async ({ request }) => {
  const res = await request.post('https://example.test/api/products', {
    data: { price: -10 }, // nom manquant
  });
  expect(res.status()).toBe(400);
  const error = await res.json();
  expect(error.field).toBe('name');
});
```

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer au chapitre suivant, vérifie que tu sais :

- Écrire un test GET/POST avec la fixture `request`.
- Utiliser l'API pour préparer un état avant un test UI.
- Distinguer les cas où utiliser `request` vs `page.route()`.

**Quiz rapide**

1. Quelle fixture Playwright donne accès à un client HTTP ?
2. Pourquoi le setup via API est-il plus fiable que le setup via UI ?
3. Quand préférer `page.route()` plutôt que `request` ?

> Si tu bloques, consulte la [documentation Playwright API testing](https://playwright.dev/docs/api-testing).
