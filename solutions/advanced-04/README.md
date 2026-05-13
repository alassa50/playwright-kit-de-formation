# Solution — Avancé 04

## Choix de conception

- Serveur HTTP en mémoire (`http` Node.js) : aucune dépendance externe, démarrage
  rapide, parfaitement reproductible en local et en CI.
- `test.beforeAll` / `test.afterAll` pour le cycle de vie du serveur : un seul serveur
  pour toute la suite, pas un par test.
- `resetProducts()` dans `test.beforeEach` : isolation entre tests sans redémarrage.
- `request.delete` → vérification via `request.get` : tester l'effet de bord, pas
  seulement le code de statut.

## Alternatives

- Utiliser `msw` (Mock Service Worker) pour mocker les API avec plus de flexibilité.
- Tester une vraie API avec `playwright.request.newContext({ baseURL })` et un token
  stocké dans `process.env`.
