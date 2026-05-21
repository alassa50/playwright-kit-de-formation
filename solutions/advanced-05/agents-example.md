# AGENTS.md — Contrat agent QA (exemple complet)

> Ce fichier est injecté tel quel dans le system prompt de l'agent.
> Chaque règle est explicite et prescriptive. Voir course/chapter-16.md section 3.

## SÉLECTEURS

- UNIQUEMENT `page.getByTestId('id')` pour les éléments interactifs.
- Sélecteurs CSS : INTERDIT.
- XPath : INTERDIT.
- `getByRole()` / `getByLabel()` : autorisés pour les composants tiers sans data-testid.
- `getByText()` : autorisé uniquement comme dernier recours, jamais pour les boutons
  ou champs de formulaire.

## PAGE OBJECTS

- Toute interaction avec la page DOIT passer par un Page Object dans `/pages/`.
- Ne jamais appeler `page.click()` directement dans un fichier spec.
- Ne jamais appeler `page.fill()` directement dans un fichier spec.
- Signature du constructeur : `constructor(readonly page: Page) {}`
- Chaque méthode du Page Object effectue une et une seule action atomique.

## FIXTURES

- Étendre la fixture de base dans `/fixtures/base.ts`.
- Ne jamais utiliser `test.beforeEach()` pour l'authentification — utiliser la fixture `authed`.
- La création de données de test va dans `/fixtures/data-factory.ts`.
- Ne jamais partager d'état mutable entre tests via des variables de module.

## ASSERTIONS

- Utiliser `expect(locator).toBeVisible()`, pas `expect(locator).not.toBeHidden()`.
- `waitForTimeout()` : INTERDIT. Utiliser des assertions avec timeout explicite.
- Toujours attendre un état observable, jamais un délai arbitraire.
- Toute assertion sur du texte non déterministe utilise `toContainText()`, pas `toHaveText()`.

## NOMMAGE

- Nom du test : décrire le comportement observable, pas l'implémentation.
  ✅ "affiche un message de confirmation après la soumission du formulaire"
  ❌ "test du bouton submit"
- Fichier spec : `[feature].spec.ts` dans le dossier du module concerné.
- `test.describe()` : nommer d'après la fonctionnalité, pas le composant technique.
