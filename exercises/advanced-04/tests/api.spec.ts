import { test } from '@playwright/test';
import type http from 'http';
import { createServer, resetProducts } from '../starter/api-server';

let server: http.Server;
const BASE_URL = 'http://localhost:4321';

test.beforeAll(() => {
  server = createServer();
  return new Promise<void>((resolve) => server.listen(4321, resolve));
});

test.afterAll(() => {
  return new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

test.beforeEach(() => {
  resetProducts();
});

test.describe('Exercice avancé 04 — API REST', () => {
  test('GET /api/products retourne la liste des produits', async ({ request }) => {
    // TODO: Faire un GET sur `${BASE_URL}/api/products`
    // TODO: Vérifier que le statut est 200
    // TODO: Vérifier que le body est un tableau non vide
    // TODO: Vérifier que le header content-type contient 'application/json'
  });

  test('POST /api/products crée un produit valide', async ({ request }) => {
    // TODO: Faire un POST sur `${BASE_URL}/api/products` avec { name: 'Écran', price: 299 }
    // TODO: Vérifier que le statut est 201
    // TODO: Vérifier que le corps contient name, price et un id défini
  });

  test('POST /api/products sans name retourne 400', async ({ request }) => {
    // TODO: Faire un POST avec un body sans le champ name (ex: { price: 10 })
    // TODO: Vérifier que le statut est 400
    // TODO: Vérifier que le champ 'error' est présent dans la réponse
  });

  test('DELETE /api/products/:id supprime le produit', async ({ request }) => {
    // TODO: Faire un DELETE sur `${BASE_URL}/api/products/1`
    // TODO: Vérifier que le statut est 204
    // TODO: Faire un GET et vérifier que le produit supprimé n'est plus dans la liste
  });
});
