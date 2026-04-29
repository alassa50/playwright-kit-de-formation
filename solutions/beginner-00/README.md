# Solution — Débutant 00

## Choix de conception

- **Interface `Produit`** : typage strict des données de test ; évite les fautes de
  frappe sur les noms de champs et améliore l'autocomplétion.
- **`calculerTotal`** : utilise `filter` + `reduce` pour chaîner les transformations de
  tableau de façon lisible.
- **`formaterLigne`** : template literal pour interpoler le nom, le prix formaté et le
  statut de stock.
- Les tests unitaires (sans navigateur) valident la logique pure avant d'injecter la
  page dans Playwright.

## Alternatives

- Utiliser `Array.reduce` seul avec une condition interne au lieu de `filter` + `reduce`.
- Extraire la logique de formatage du prix dans un helper `formaterPrix(prix: number)`.
