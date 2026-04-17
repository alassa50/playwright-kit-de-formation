# Chapitre 7 — Tests visuels

## Objectifs pédagogiques

- Mettre en place des snapshots visuels.
- Interpréter les diffs d'images.

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 6

## Contenu

### 1. `toHaveScreenshot` — créer et comparer des snapshots visuels

`toHaveScreenshot` capture un élément (ou la page entière) et le compare à une image
de référence. Si les pixels diffèrent au-delà d'un seuil configurable, le test échoue.

**Premier lancement — générer les snapshots de référence :**

```bash
# Première exécution : les images de référence sont créées (aucun snapshot existant)
npm run test:visual

# Mettre à jour les snapshots après un changement intentionnel
npx playwright test --update-snapshots
```

**Syntaxe de base :**

```typescript
import { expect, test } from '@playwright/test';
import { visualHtml } from '../starter/visual-page';

test('snapshot carte produit @visual', async ({ page }) => {
  await page.setContent(visualHtml);

  // Compare l'élément <article> avec le fichier product-card.png
  await expect(page.locator('article')).toHaveScreenshot('product-card.png');
});
```

Ce code correspond à `exercises/advanced-02/tests/visual.spec.ts`. Les images de
référence sont stockées dans `tests/visual.spec.ts-snapshots/` avec un nom incluant
le navigateur et l'OS (ex: `product-card-chromium-linux.png`).

**Snapshot de toute la page :**

```typescript
await expect(page).toHaveScreenshot('page-complete.png');
```

**Localisation des snapshots :**

```
exercises/advanced-02/
└── tests/
    ├── visual.spec.ts
    └── visual.spec.ts-snapshots/
        └── product-card-chromium-linux.png  ← image de référence
```

---

### 2. Paramètres de stabilité visuelle

Les tests visuels peuvent être fragiles si le contenu de la page est dynamique.
Playwright fournit des options pour stabiliser les captures.

**Tolérance aux pixels :**

```typescript
await expect(page.locator('article')).toHaveScreenshot('card.png', {
  // Autoriser jusqu'à 1% de pixels différents (pour les anti-aliasing, polices)
  maxDiffPixelRatio: 0.01,
});
```

**Masquer les zones dynamiques :**

```typescript
await expect(page).toHaveScreenshot('page.png', {
  // Remplace les éléments correspondants par un rectangle gris dans la capture
  mask: [page.locator('[data-testid="timestamp"]')],
});
```

**Attendre la stabilité avant la capture :**

```typescript
// Attendre que les animations soient terminées
await page.evaluate(() => document.fonts.ready);

// Désactiver les animations CSS dans le test
await page.addStyleTag({
  content: `*, *::before, *::after { animation-duration: 0s !important; }`,
});

// Puis capturer
await expect(page.locator('article')).toHaveScreenshot('card.png');
```

**Configurer globalement dans `playwright.config.ts` :**

```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.01,
    animations: 'disabled', // désactive les animations pour tous les snapshots
  },
},
```

---

### 3. Revue des diffs en CI

Quand un snapshot échoue en CI, trois fichiers sont produits dans `test-results/` :

| Fichier | Description |
|---|---|
| `expected.png` | L'image de référence validée |
| `actual.png` | Ce que le test a capturé |
| `diff.png` | La différence pixel par pixel (zones rouges = différences) |

**Interpréter le diff :**

- Zones rouges uniformes → décalage de mise en page ou changement de taille.
- Zones rouges ponctuelles → rendu typographique, anti-aliasing, animation non arrêtée.
- Diff entièrement rouge → contenu complètement différent, probablement une régression.

**Workflow de revue :**

1. Télécharger les artefacts depuis l'interface CI (GitHub Actions → Artefacts).
2. Comparer `expected.png` et `actual.png` côte à côte.
3. **Si c'est une régression** : corriger le code source, ne pas mettre à jour les snapshots.
4. **Si c'est un changement intentionnel** : mettre à jour localement avec
   `npx playwright test --update-snapshots`, valider visuellement, puis commiter les
   nouvelles images de référence.

**Important :** les images de référence sont commitées dans le dépôt git. Elles font
partie du code source et doivent être revues lors des PR comme n'importe quel fichier.

## Cas réel (terrain)

- Une modification CSS détériore l'alignement d'une carte produit sans casser les tests fonctionnels.
- Les snapshots visuels détectent immédiatement la régression.
- La revue d'image en CI accélère la décision "régression vs changement attendu".

## Exercice bonus

- Ajouter un test visuel sur un composant avec état "normal" et "hover".
- Ajuster les paramètres de stabilité (masquage, animation, police) si nécessaire.
- Documenter la règle de mise à jour des snapshots de référence.

## Erreurs fréquentes

- Capturer des zones trop larges avec contenu dynamique non maîtrisé.
- Régénérer les snapshots sans revue humaine.
- Mélanger assertions visuelles et logiques fonctionnelles complexes dans le même test.

## Exercices associés

- exercises/advanced-02
