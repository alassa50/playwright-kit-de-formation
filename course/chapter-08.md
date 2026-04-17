# Chapitre 8 — Accessibilité automatisée

## Objectifs pédagogiques

- Détecter des violations a11y avec axe-core.
- Corriger les problèmes les plus fréquents.

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 7

## Contenu

### 1. Principes WCAG utiles pour les tests automatisés

Les **WCAG** (Web Content Accessibility Guidelines) sont les standards internationaux
d'accessibilité du web. Pour les tests automatisés, les critères les plus pertinents
sont ceux qui peuvent être vérifiés par un outil comme axe-core.

**Les 4 grands principes (POUR) :**

| Principe | Signification | Exemple de règle testable |
|---|---|---|
| **P**erceptible | L'information est accessible aux sens | Contraste texte/fond suffisant, alternative texte |
| **O**pérable | L'interface est utilisable sans souris | Navigation au clavier, focus visible |
| **U**nderstandable | Le contenu est compréhensible | Labels de formulaire présents et clairs |
| **R**obuste | Compatible avec les technologies d'assistance | Structure HTML valide, rôles ARIA corrects |

**Ce qu'axe-core peut détecter automatiquement :**

- Absence de label sur un champ de formulaire.
- Contraste de couleur insuffisant (ratio < 4.5:1 pour texte normal).
- Image sans texte alternatif.
- Bouton sans texte accessible.
- Structure de titres incorrecte (`h3` sans `h2` parent).
- Attributs ARIA invalides.

**Ce qu'axe-core ne peut pas détecter (test manuel requis) :**

- Logique de navigation au clavier complexe.
- Compréhensibilité du contenu.
- Comportement des lecteurs d'écran en contexte réel.

---

### 2. Intégration `@axe-core/playwright`

La bibliothèque `@axe-core/playwright` est déjà installée dans ce dépôt.
Elle s'utilise directement dans un test Playwright.

**Test d'accessibilité minimal :**

```typescript
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { accessibleHtml } from '../starter/a11y-page';

test.describe('Exercice avancé 01 @a11y', () => {
  test('valide l\'absence de violation critique', async ({ page }) => {
    await page.setContent(accessibleHtml);

    // Analyser toute la page
    const results = await new AxeBuilder({ page }).analyze();

    // Ne retenir que les violations critiques
    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });
});
```

Ce code est tiré de `exercises/advanced-01/tests/accessibility.spec.ts`.

**Comprendre le résultat d'`analyze()` :**

```typescript
const results = await new AxeBuilder({ page }).analyze();

// Violations : règles WCAG enfreintes
console.log(results.violations);
// [{ id: 'color-contrast', impact: 'serious', nodes: [...] }]

// Passes : règles validées
console.log(results.passes.length);

// Incomplete : règles que axe-core n'a pas pu vérifier automatiquement
console.log(results.incomplete);
```

**Niveaux d'impact :**

| Impact | Signification |
|---|---|
| `critical` | Bloque complètement l'accès à certains utilisateurs |
| `serious` | Crée de grandes difficultés |
| `moderate` | Gêne significative |
| `minor` | Inconfort limité |

**Analyser une zone spécifique :**

```typescript
const results = await new AxeBuilder({ page })
  .include('#formulaire-contact') // analyser seulement ce sélecteur
  .exclude('#bandeau-cookies')   // ignorer ce sélecteur
  .analyze();
```

**Lancer uniquement les tests a11y :**

```bash
npm run test:a11y
```

---

### 3. Workflow de correction

Quand axe-core détecte des violations, voici comment les traiter.

**Étape 1 — Afficher les détails des violations :**

```typescript
const results = await new AxeBuilder({ page }).analyze();

results.violations.forEach((violation) => {
  console.log(`[${violation.impact}] ${violation.id}: ${violation.description}`);
  violation.nodes.forEach((node) => {
    console.log('  Élément concerné:', node.html);
    console.log('  Correction suggérée:', node.failureSummary);
  });
});
```

**Étape 2 — Prioriser selon l'impact :**

> Commencer par les violations `critical` et `serious`.
> Les violations `moderate` et `minor` peuvent être planifiées dans un backlog.

**Étape 3 — Corriger dans le HTML :**

Exemple de violation courante — label manquant :

```html
<!-- ⚠️  Pas de label associé -->
<input type="text" placeholder="Votre nom" />

<!-- ✅ Label explicite -->
<label for="nom">Nom</label>
<input id="nom" type="text" />

<!-- ✅ ou aria-label si le label visuel n'est pas souhaité -->
<input type="text" aria-label="Votre nom" />
```

**Étape 4 — Relancer le test :**

```bash
npm run test:a11y
```

**Désactiver temporairement une règle non prioritaire :**

```typescript
const results = await new AxeBuilder({ page })
  .disableRules(['color-contrast']) // à utiliser avec justification documentée
  .analyze();
```

> Ne désactiver une règle que si elle est hors périmètre ou acceptée délibérément.
> Documenter la raison dans un commentaire de code ou un ticket.

## Cas réel (terrain)

- Un audit tardif révèle des contrastes insuffisants et des labels absents sur un formulaire critique.
- L'équipe intègre des contrôles a11y automatisés dans la suite de non-régression.
- Les défauts récurrents sont détectés plus tôt dans le cycle.

## Exercice bonus

- Ajouter un test axe-core sur une page formulaire.
- Filtrer et prioriser les violations selon impact utilisateur.
- Proposer une action de correction pour les deux violations les plus critiques.

## Erreurs fréquentes

- Considérer l'a11y comme un audit ponctuel au lieu d'un contrôle continu.
- Ignorer le contexte métier et la gravité des violations.
- Bloquer toutes les PR sans stratégie de priorisation progressive.

## Exercices associés

- exercises/advanced-01
