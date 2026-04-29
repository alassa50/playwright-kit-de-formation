# Chapitre 2 — Sélecteurs robustes et assertions

## Objectifs pédagogiques

- Utiliser des sélecteurs stables orientés accessibilité.
- Écrire des assertions explicites.

## Durée estimée

- 75 min

## Prérequis

- Chapitre 1

## Contenu

### 1. `getByRole`, `getByLabel`, `getByTestId` — les sélecteurs recommandés

Playwright propose plusieurs façons de cibler un élément dans la page. Les plus robustes
sont celles orientées **accessibilité** : elles s'appuient sur la sémantique HTML plutôt
que sur des détails d'implémentation comme les classes CSS.

**`getByRole` — cible un élément par son rôle ARIA**

```typescript
// Cible un bouton dont le texte accessible est "Se connecter"
page.getByRole('button', { name: 'Se connecter' });

// Cible un lien
page.getByRole('link', { name: 'Accueil' });

// Cible une case à cocher
page.getByRole('checkbox', { name: 'Accepter les CGU' });
```

Les rôles correspondent aux balises HTML sémantiques :
`button`, `link`, `heading`, `textbox`, `checkbox`, `listitem`, `status`, etc.

**`getByLabel` — cible un champ de formulaire par son label**

```typescript
// Cible l'input associé au label "Email"
await page.getByLabel('Email').fill('utilisateur@example.com');

// Cible l'input associé au label "Mot de passe"
await page.getByLabel('Mot de passe').fill('secret');
```

Cela fonctionne quand le HTML utilise correctement `<label for="id">` ou que le label
enveloppe le champ.

**`getByTestId` — cible un élément via un attribut `data-testid`**

```typescript
// HTML : <span data-testid="cart-count">0</span>
await expect(page.getByTestId('cart-count')).toHaveText('1');
```

À utiliser quand aucun label ou rôle sémantique n'est disponible. Nécessite d'ajouter
l'attribut dans le code source de l'application.

**`getByText` et `getByPlaceholder` — pour compléter**

```typescript
// Cible un élément dont le texte visible est exactement "Bienvenue"
page.getByText('Bienvenue');

// Cible un input via son placeholder
page.getByPlaceholder('Entrez votre email');
```

---

### 2. Pourquoi les sélecteurs CSS sont fragiles

Un sélecteur CSS fonctionne en ciblant un élément via ses attributs HTML :
classe, id, position dans le DOM. Le problème : ces détails changent souvent lors des
évolutions de l'interface.

**Exemple fragile :**

```typescript
// ⚠️  Si la classe CSS change ou si l'ordre des boutons change, ce test casse.
page.locator('.btn-primary:nth-child(2)');
```

**Même intention, version robuste :**

```typescript
// ✅ Recherche par rôle + texte : stable même si les classes changent.
page.getByRole('button', { name: 'Ajouter au panier' });
```

**Règle pratique :**

> Préférer `getByRole` > `getByLabel` > `getByTestId` > `getByText` > sélecteur CSS.
> N'utiliser un sélecteur CSS que si aucune autre option n'est disponible.

---

### 3. Assertions de visibilité, texte et état

Une assertion Playwright est toujours **auto-attendue** : si la condition n'est pas
encore vraie, Playwright réessaie pendant le délai d'attente configuré (5 secondes par
défaut) avant d'échouer.

**Visibilité :**

```typescript
// L'élément est visible dans la page
await expect(page.getByRole('status')).toBeVisible();

// L'élément est masqué (display:none, visibility:hidden, opacity:0…)
await expect(page.getByText('clavier mécanique')).toBeHidden();
```

**Texte :**

```typescript
// Texte exact
await expect(page.getByRole('status')).toHaveText('Connexion réussie');

// Contient la chaîne (sous-chaîne)
await expect(page.getByRole('heading')).toContainText('Bienvenue');
```

**Comptage :**

```typescript
// Vérifie qu'il y a exactement 3 produits dans la liste
await expect(page.locator('#products li')).toHaveCount(3);
```

**État d'un champ :**

```typescript
// Un bouton est désactivé
await expect(page.getByRole('button', { name: 'Valider' })).toBeDisabled();

// Un champ a la valeur attendue
await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
```

Ces assertions sont tirées directement du code des exercices de ce dépôt. Vous pouvez
les retrouver dans `exercises/beginner-02/tests/filter.spec.ts` :

```typescript
await page.getByLabel('Recherche').fill('livre');
await expect(page.getByText('livre TypeScript')).toBeVisible();
await expect(page.getByText('clavier mécanique')).toBeHidden();
```

## Cas réel (terrain)

- Une refonte UI casse des tests basés sur des classes CSS.
- L'équipe migre vers des sélecteurs orientés accessibilité (`getByRole`, `getByLabel`).
- Le taux de faux positifs baisse lors des évolutions front.

## Exercice bonus

- Remplacer trois sélecteurs CSS fragiles par des sélecteurs Playwright plus stables.
- Ajouter une assertion d'état métier (visible, activé, texte attendu).
- Comparer lisibilité et robustesse avant/après.

## Erreurs fréquentes

- Cibler des éléments via des classes générées ou des index (`nth-child`) instables.
- Utiliser `text=` sans contexte, ce qui rend les tests ambigus.
- Empiler des assertions redondantes au lieu d'exprimer une intention claire.

## Exercices associés

- exercises/beginner-02
