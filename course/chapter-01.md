# Chapitre 1 — Introduction à Playwright Test

## Objectifs pédagogiques

- Comprendre l'écosystème Playwright + TypeScript.
- Exécuter un premier test fiable.

## Durée estimée

- 60 min

## Prérequis

- Bases JavaScript/TypeScript
- Terminal Git/Node

## Contenu

### 1. Rôle de Playwright dans une stratégie qualité

Playwright est un framework d'automatisation de navigateurs développé par Microsoft.
Il permet d'écrire des tests de bout en bout (end-to-end) qui simulent les actions d'un
utilisateur réel : clic, saisie, navigation, soumission de formulaire.

**Pourquoi Playwright plutôt qu'une autre solution ?**

- **Multi-navigateur natif** : Chromium, Firefox et WebKit dans un seul outil.
- **Auto-wait intégré** : Playwright attend automatiquement que les éléments soient
  prêts avant d'agir (plus besoin de `sleep` ou de temporisations manuelles).
- **Isolation par défaut** : chaque test reçoit un contexte navigateur propre.
- **TypeScript first** : typage strict, autocomplétion et détection d'erreurs à la compilation.

Dans une stratégie qualité, les tests Playwright couvrent la couche haute de la pyramide
de tests : ils valident des parcours utilisateurs complets là où les tests unitaires et
d'intégration ne peuvent pas aller.

```
        ┌───────────┐
        │   E2E     │  ← Playwright (cette formation)
        ├───────────┤
        │Integration│
        ├───────────┤
        │  Unitaire │
        └───────────┘
```

**À retenir** : les tests E2E ne remplacent pas les tests unitaires ; ils les complètent
en validant que le tout fonctionne ensemble du point de vue de l'utilisateur.

---

### 2. Anatomie d'un test Playwright

Un fichier de test Playwright minimal ressemble à ceci :

```typescript
import { test, expect } from '@playwright/test';

test('valide le parcours de connexion', async ({ page }) => {
  // 1. Préparer la page (ici on injecte du HTML local)
  await page.setContent(`<button>Cliquez</button>`);

  // 2. Agir sur la page
  await page.getByRole('button', { name: 'Cliquez' }).click();

  // 3. Vérifier le résultat attendu
  await expect(page.getByRole('button')).toBeVisible();
});
```

**Les blocs essentiels :**

| Élément | Rôle |
|---|---|
| `test('nom', async ({ page }) => {})` | Définit un scénario avec son nom et sa fonction asynchrone |
| `page` | Objet qui représente l'onglet navigateur ; toutes les interactions passent par lui |
| `await` | Nécessaire devant toute action Playwright (elles sont toutes asynchrones) |
| `expect(locator)` | Crée une assertion ; Playwright attend automatiquement que la condition soit vraie |

**Structurer plusieurs tests avec `test.describe` :**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Exercice débutant 01', () => {
  test('valide le parcours de connexion', async ({ page }) => {
    await page.setContent(loginHtml);
    await page.getByLabel('Email').fill('apprenant@example.com');
    await page.getByLabel('Mot de passe').fill('MotDePasse!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole('status')).toHaveText('Connexion réussie');
  });
});
```

Ce code correspond exactement à `exercises/beginner-01/tests/login.spec.ts` dans ce
dépôt. Ouvrez-le pour voir le contexte complet.

**Les fixtures :** une fixture est une valeur ou une ressource injectée automatiquement
par Playwright dans chaque test. `page` est la fixture la plus utilisée. On verra les
fixtures personnalisées au chapitre 3.

---

### 3. Lancer un test et lire les rapports

**Lancer la suite complète (Chromium) :**

```bash
npm test
```

**Lancer un seul fichier :**

```bash
npx playwright test exercises/beginner-01/tests/login.spec.ts
```

**Lancer avec l'interface graphique (utile en développement) :**

```bash
npm run test:headed
```

**Ouvrir le rapport HTML interactif après exécution :**

```bash
npx playwright show-report
```

Le rapport HTML affiche :
- la liste de tous les tests avec leur statut (✓ réussi / ✗ échoué / △ ignoré),
- pour chaque test échoué : un screenshot, une vidéo et une trace cliquable,
- le temps d'exécution par test.

**Comprendre la sortie console :**

```
Running 1 test using 1 worker

  ✓ 1 [chromium] › beginner-01 › valide le parcours de connexion (120ms)

  1 passed (2.3s)
```

Si un test échoue, la console affiche le message d'assertion :

```
Error: expect(locator).toHaveText(expected)
Expected: "Connexion réussie"
Received: ""
```

Cela indique exactement ce qui était attendu et ce qui a été reçu.

## Cas réel (terrain)

- Une équipe e-commerce découvre trop tard des régressions sur la connexion en production.
- Un premier test Playwright "smoke" est ajouté sur le parcours login pour valider chaque build.
- Le gain attendu est une alerte rapide en CI avant mise en ligne.

## Exercice bonus

- Créer un test "smoke" minimal sur la page d'accueil avec un nom de test explicite.
- Exécuter le test en local puis lire le rapport HTML généré.
- Identifier une amélioration de lisibilité à apporter au test (nommage, structure, assertion).

## Erreurs fréquentes

- Mélanger objectif fonctionnel et détails techniques dans un même test.
- Oublier de nommer clairement le scénario, ce qui rend les rapports difficiles à exploiter.
- Lancer les tests sans relire les traces/rapports en cas d'échec.

## Exercices associés

- exercises/beginner-01
