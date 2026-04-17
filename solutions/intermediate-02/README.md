# Solution — Intermédiaire 02

## Choix de conception

- Assertion `toHaveText` pour attendre l'état final.
- Test court, lisible, sans `waitForTimeout`.

## Alternatives

- Utiliser `expect.poll` pour une API externe lente.
