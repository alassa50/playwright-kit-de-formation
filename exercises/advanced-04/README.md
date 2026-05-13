# Exercice Avancé 04 — Test d'API natif avec Playwright

## Énoncé

Utiliser la fixture `request` de Playwright pour tester directement une API REST,
valider les contrats (statuts, structure JSON, headers), et combiner setup API + test UI.

## Contexte

Le fichier `starter/api-server.ts` exporte un mini-serveur HTTP en mémoire (basé sur
`http` Node.js) qui expose :

- `GET /api/products` → liste de produits `[{ id, name, price }]`
- `POST /api/products` → crée un produit (body JSON `{ name, price }`)
- `DELETE /api/products/:id` → supprime un produit

Le serveur est démarré et arrêté via les fixtures `beforeAll`/`afterAll`.

## Critères d'acceptation

1. `GET /api/products` retourne 200 et un tableau JSON non vide.
2. `POST /api/products` avec `{ name, price }` valides retourne 201 et l'objet créé avec un `id`.
3. `POST /api/products` sans `name` retourne 400 avec un champ `error`.
4. `DELETE /api/products/:id` retourne 204 et la ressource n'est plus accessible.
5. La réponse de `GET` a le header `content-type: application/json`.

## Aide

- La fixture `request` est disponible directement dans `test(...)`.
- Utilise `response.status()` pour le code HTTP.
- Utilise `await response.json()` pour parser le corps.
- Utilise `response.headers()` pour accéder aux headers.
- `test.beforeAll` / `test.afterAll` pour démarrer/arrêter le serveur.
