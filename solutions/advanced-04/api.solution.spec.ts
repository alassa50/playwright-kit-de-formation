import { expect, test } from '@playwright/test';
import type http from 'http';
import { createServer, resetProducts } from '../../exercises/advanced-04/starter/api-server';

let server: http.Server;
const BASE_URL = 'http://localhost:4321';

// Un seul serveur pour toute la suite (performances)
test.beforeAll(() => {
  server = createServer();
  return new Promise<void>((resolve) => server.listen(4321, resolve));
});

test.afterAll(() => {
  return new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

// Réinitialiser les données entre chaque test (isolation)
test.beforeEach(() => {
  resetProducts();
});

test.describe('Solution commentée — API REST (avancé 04)', () => {
  test('GET /api/products retourne la liste des produits', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/products`);

    // Valider le contrat HTTP : statut + header
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    // Valider la structure : tableau non vide
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    // Valider la forme d'un élément
    expect(body[0]).toMatchObject({ id: expect.any(Number), name: expect.any(String) });
  });

  test('POST /api/products crée un produit valide', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/products`, {
      data: { name: 'Écran', price: 299 },
    });

    expect(response.status()).toBe(201);
    const created = await response.json();
    // Valider l'objet retourné : toMatchObject ignore les champs supplémentaires
    expect(created).toMatchObject({ name: 'Écran', price: 299 });
    // L'id doit être assigné par le serveur
    expect(created.id).toBeDefined();
    expect(typeof created.id).toBe('number');
  });

  test('POST /api/products sans name retourne 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/products`, {
      data: { price: 10 }, // name manquant intentionnellement
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    // Valider que l'erreur est exploitable (champ 'error' présent)
    expect(body).toHaveProperty('error');
    expect(typeof body.error).toBe('string');
  });

  test('DELETE /api/products/:id supprime le produit', async ({ request }) => {
    // Supprimer le produit id=1
    const deleteResponse = await request.delete(`${BASE_URL}/api/products/1`);
    expect(deleteResponse.status()).toBe(204);

    // Vérifier l'effet de bord : le produit n'est plus dans la liste
    const listResponse = await request.get(`${BASE_URL}/api/products`);
    const products = await listResponse.json();
    const ids = products.map((p: { id: number }) => p.id);
    expect(ids).not.toContain(1);
  });
});
