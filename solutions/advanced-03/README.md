# Solution — Avancé 03

## Choix de conception

- Mocker `/api/ai/chat` avec `page.route()` pour garantir des tests reproductibles
  sans appel réel au LLM (coût zéro, déterminisme total).
- Validation sémantique via `toContainText` : teste la présence du contenu important,
  pas la formulation exacte.
- Simulation du délai de chargement via `Promise` dans le handler de route pour tester
  l'état intermédiaire `role="status"`.
- Test de l'état d'erreur avec `route.fulfill({ status: 500 })`.
- Audit a11y intégré : l'interface chatbot doit être accessible (ARIA live region,
  role="article", role="alert").

## Alternatives

- Utiliser `page.routeFromHAR()` pour enregistrer et rejouer des échanges API réels.
- Intégrer `@axe-core/playwright` dans un fixture global pour auditer chaque test.
