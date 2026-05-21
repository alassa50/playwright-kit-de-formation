# AGENTS.md — Contrat agent QA (référence complète)

> Ce fichier est la version de référence pour le projet.
> Il est injecté tel quel dans le system prompt de l'agent Claude.
> Modifier ce fichier quand l'agent viole une convention — pas le prompt.
> Versionné dans le dépôt, relu en équipe à chaque sprint.

## SÉLECTEURS

- UNIQUEMENT `page.getByTestId('id')` pour tous les éléments interactifs.
- Sélecteurs CSS : INTERDIT.
- XPath : INTERDIT.
- `getByRole()` : autorisé pour les composants tiers sans data-testid.
- `getByLabel()` : autorisé pour les champs de formulaire sans data-testid.
- `getByText()` : INTERDIT sauf pour les éléments de contenu statique (titres, labels).
- Avant d'écrire un sélecteur, appeler `playwright_get_dom` pour vérifier que
  l'attribut `data-testid` existe réellement dans le DOM courant.

## PAGE OBJECTS

- Toute interaction avec la page DOIT passer par un Page Object dans `/pages/`.
- Ne jamais appeler `page.click()` directement dans un fichier spec.
- Ne jamais appeler `page.fill()` directement dans un fichier spec.
- Signature du constructeur : `constructor(readonly page: Page) {}`
- Un Page Object par domaine fonctionnel (pas par URL).
- Chaque méthode effectue une action atomique et retourne `Promise<void>` ou une
  valeur observable.

## FIXTURES

- Étendre la fixture de base dans `/fixtures/base.ts`.
- Ne jamais utiliser `test.beforeEach()` pour l'authentification.
- Utiliser la fixture `authed` pour tout test nécessitant une session utilisateur.
- La création de données de test va dans `/fixtures/data-factory.ts`.
- Ne jamais partager d'état mutable entre tests via des variables de module.
- Chaque test doit pouvoir s'exécuter dans n'importe quel ordre.

## ASSERTIONS

- Utiliser `expect(locator).toBeVisible()`.
- `waitForTimeout()` : INTERDIT sans exception.
- `page.waitForTimeout()` : INTERDIT sans exception.
- Toujours attendre un état observable, jamais un délai.
- Pour les sorties non déterministes (LLM) : `toContainText()`, pas `toHaveText()`.
- Chaque assertion inclut un message d'erreur lisible via le second argument :
  `expect(el, 'Le bouton Envoyer doit être visible').toBeVisible()`

## STRUCTURE DES TESTS

- Un fichier spec par fonctionnalité : `[feature].spec.ts`.
- Grouper avec `test.describe('[Fonctionnalité]', () => { ... })`.
- Chaque test est indépendant (pas de `test.step()` inter-tests).
- Les tests d'erreur et de cas limites sont dans le même fichier que le happy path.

## NOMMAGE

- Nom du test : décrire le comportement observable.
  ✅ "affiche un message de confirmation après la soumission du formulaire"
  ❌ "test du bouton submit"
  ❌ "submitForm works"
- `test.describe()` : nommer d'après la fonctionnalité métier.
  ✅ `test.describe('Panier — ajout de produit', ...)`
  ❌ `test.describe('CartComponent', ...)`

## SÉCURITÉ

- JAMAIS de secrets, tokens ou mots de passe dans le code ou les tests.
- Utiliser `process.env.VARIABLE` pour toute valeur sensible.
- Ne pas logguer de données personnelles dans les traces.
