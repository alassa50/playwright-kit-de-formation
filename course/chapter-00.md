# Chapitre 0 — Bases JavaScript/TypeScript

## Objectifs pédagogiques

- Maîtriser les constructions JavaScript/TypeScript essentielles utilisées dans Playwright.
- Comprendre la gestion asynchrone avec `async/await`.
- Tirer parti du système de types TypeScript pour sécuriser les tests.

## Durée estimée

- 90 min

## Prérequis

- Environnement Node.js 20+ installé
- Notions de base en programmation (variables, fonctions)

## Contenu

### 1. Variables : `const`, `let` et inférence de types

**`const` vs `let` :**

```typescript
// const : valeur non réassignable (à privilégier)
const url = 'https://example.com';

// let : valeur réassignable si nécessaire
let tentatives = 0;
tentatives += 1;
```

> Règle pratique : commencer par `const` ; passer à `let` uniquement si la réassignation
> est réellement nécessaire.

**Inférence de types :** TypeScript déduit le type à partir de la valeur initiale.

```typescript
const titre = 'Playwright'; // TypeScript infère : string
const version = 1.55; // TypeScript infère : number
const actif = true; // TypeScript infère : boolean
```

**Annotation explicite :** utile quand l'inférence est insuffisante.

```typescript
let message: string;
let compteur: number = 0;
const labels: string[] = ['a11y', 'visual', 'e2e'];
```

---

### 2. Fonctions : déclaration, flèche et typage

**Fonction classique :**

```typescript
function additionner(a: number, b: number): number {
  return a + b;
}
```

**Fonction fléchée (arrow function) :**

```typescript
const multiplier = (a: number, b: number): number => a * b;
```

**Paramètres optionnels et valeurs par défaut :**

```typescript
function saluer(nom: string, titre: string = 'Apprenant'): string {
  return `Bonjour, ${titre} ${nom} !`;
}

saluer('Dupont'); // "Bonjour, Apprenant Dupont !"
saluer('Martin', 'Dr'); // "Bonjour, Dr Martin !"
```

**Template literals** (gabarits de chaînes) : syntaxe `` ` `` pour interpoler des
variables ou des expressions.

```typescript
const produit = 'clavier';
const prix = 49.9;
const ligne = `${produit} : ${prix.toFixed(2)} €`; // "clavier : 49.90 €"
```

---

### 3. Tableaux et objets : destructuring, spread et méthodes utiles

**Destructuring sur objet :**

```typescript
const utilisateur = { nom: 'Alice', role: 'QA', actif: true };
const { nom, role } = utilisateur;
console.log(nom); // "Alice"
```

**Destructuring sur tableau :**

```typescript
const couleurs = ['rouge', 'vert', 'bleu'];
const [premiere, deuxieme] = couleurs;
console.log(premiere); // "rouge"
```

**Opérateur spread (`...`) :**

```typescript
const base = { langue: 'fr', timeout: 30_000 };
const config = { ...base, timeout: 60_000 }; // surcharge timeout
```

**Méthodes de tableau essentielles :**

```typescript
const notes = [12, 18, 9, 15, 7];

// filter : garder les éléments qui satisfont la condition
const reçus = notes.filter((note) => note >= 10); // [12, 18, 15]

// map : transformer chaque élément
const doubles = notes.map((n) => n * 2); // [24, 36, 18, 30, 14]

// find : premier élément qui satisfait la condition
const premierReçu = notes.find((n) => n >= 10); // 12

// every / some
const tousReçus = notes.every((n) => n >= 10); // false
const auMoinsUnReçu = notes.some((n) => n >= 10); // true
```

---

### 4. Interfaces et types TypeScript

**Interface** : décrit la forme d'un objet.

```typescript
interface Produit {
  id: number;
  nom: string;
  prix: number;
  enStock: boolean;
}

const clavier: Produit = { id: 1, nom: 'clavier mécanique', prix: 89, enStock: true };
```

**Type alias** : équivalent pour des unions, intersections ou formes simples.

```typescript
type StatutCommande = 'en_attente' | 'expédiée' | 'livrée' | 'annulée';

const statut: StatutCommande = 'expédiée';
```

**Générique basique** : abstraction sur le type.

```typescript
function premier<T>(tableau: T[]): T | undefined {
  return tableau[0];
}

premier<string>(['a', 'b']); // "a"
premier<number>([1, 2, 3]); // 1
```

**Utilisation dans Playwright :** les interfaces documentent les données de test et
éliminent les erreurs de frappe dans les noms de propriétés.

```typescript
interface IdentifiantsTest {
  email: string;
  motDePasse: string;
}

const credentials: IdentifiantsTest = {
  email: 'apprenant@example.com',
  motDePasse: 'MotDePasse!',
};
```

---

### 5. Programmation asynchrone : Promises et `async/await`

**Pourquoi asynchrone ?** Les navigateurs et le réseau prennent du temps. Plutôt que de
bloquer l'exécution, JavaScript utilise des promesses (`Promise`) pour représenter une
valeur future.

**Une Promise :**

```typescript
// Simule une attente de 500 ms puis renvoie une valeur
function attendre(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

**`async/await`** : sucre syntaxique qui rend le code asynchrone lisible comme du code
synchrone.

```typescript
async function chargerUtilisateur(id: number): Promise<{ nom: string }> {
  // "await" suspend la fonction jusqu'à ce que la promesse soit résolue
  await attendre(200);
  return { nom: `Utilisateur #${id}` };
}
```

**Gestion des erreurs avec `try/catch` :**

```typescript
async function chercherProduit(url: string): Promise<void> {
  try {
    const réponse = await fetch(url);
    if (!réponse.ok) throw new Error(`HTTP ${réponse.status}`);
    const données = await réponse.json();
    console.log(données);
  } catch (erreur) {
    console.error('Erreur réseau :', erreur);
  }
}
```

**Dans Playwright :** toutes les actions (`click`, `fill`, `goto`…) renvoient une
`Promise`. Le mot-clé `await` est donc obligatoire.

```typescript
test('exemple async/await', async ({ page }) => {
  // Sans await → l'action serait lancée mais pas attendue (bug silencieux)
  await page.goto('https://example.com'); // ✅ correct
  await page.getByRole('button').click(); // ✅ correct
});
```

---

### 6. Modules : import/export

**Export nommé :**

```typescript
// helpers/format.ts
export function formaterPrix(prix: number): string {
  return `${prix.toFixed(2)} €`;
}

export const TVA = 0.2;
```

**Import nommé :**

```typescript
// test.spec.ts
import { formaterPrix, TVA } from './helpers/format';

const prixTTC = 100 * (1 + TVA);
console.log(formaterPrix(prixTTC)); // "120.00 €"
```

**Export par défaut :** réservé aux modules qui exposent une seule entité principale.

```typescript
// pages/panier.ts
export default class PanierPage {
  /* ... */
}
```

**Dans les exercices de ce dépôt**, les gabarits HTML sont exportés par des constantes :

```typescript
// starter/cart-page.ts
export const cartHtml = `<div>…</div>`;
```

---

## Récapitulatif visuel

| Concept          | Syntaxe clé                                 | Utilisation Playwright            |
| ---------------- | ------------------------------------------- | --------------------------------- |
| Constante        | `const x = 5`                               | URLs, sélecteurs, données de test |
| Arrow function   | `(a, b) => a + b`                           | Callbacks `filter`, `map`         |
| Template literal | `` `${var}` ``                              | Messages d'assertion, HTML inline |
| Destructuring    | `const { a } = obj`                         | Fixtures, paramètres de page      |
| Interface        | `interface Produit { … }`                   | Typer les données de test         |
| Async/await      | `async function f() { await p; }`           | Toutes les actions Playwright     |
| Import/export    | `export const x`, `import { x } from './f'` | Partager pages HTML et helpers    |

## Cas réel (terrain)

- Une équipe débutante écrit des tests sans `await`, ce qui produit des assertions sur
  des états intermédiaires, résultant en faux positifs.
- En révisant les bases `async/await`, l'équipe comprend pourquoi chaque action Playwright
  doit être attendue et corrige ses tests.

## Exercice bonus

- Écrire une fonction typée `formaterPanier(items: Produit[]): string` qui retourne un
  résumé formaté du panier.
- Convertir une fonction classique en arrow function et observer que le comportement est
  identique.
- Identifier dans `exercises/beginner-00/tests/cart.spec.ts` chaque usage de `await` et
  expliquer pourquoi il est nécessaire.

## Erreurs fréquentes

- Oublier `await` devant une action Playwright (le test passe parfois par chance).
- Utiliser `let` partout alors que `const` suffit dans la plupart des cas.
- Confondre `interface` et `type` : dans la pratique, les deux sont interchangeables pour
  décrire la forme d'un objet ; privilégier `interface` pour les données de test.
- Mélanger export nommé et export par défaut dans un même module, ce qui complique les
  imports.

## Exercices associés

- exercises/beginner-00
  - exercises/beginner-00

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer au chapitre suivant, vérifie que tu sais :

- Déclarer et typer des variables en TypeScript.
- Écrire et utiliser une fonction asynchrone avec `async/await`.
- Utiliser une interface pour typer des données de test.
- Importer et exporter des fonctions ou constantes.

**Quiz rapide**

1. Quelle différence entre `let` et `const` ?
2. Pourquoi faut-il toujours utiliser `await` avec Playwright ?
3. Comment définir le type d’un tableau d’objets ?
4. Quelle syntaxe pour importer une fonction exportée ?

> Si tu bloques sur une question, relis la section correspondante ou expérimente dans le starter kit.
