# Chapitre 10 — CI/CD multi-plateforme

## Objectifs pédagogiques

- Comprendre matrice OS + navigateurs.
- Exploiter les artefacts de CI.

## Durée estimée

- 60 min

## Prérequis

- Chapitres 1 à 9

## Contenu

### 1. Workflow GitHub Actions pour Playwright

Le fichier `.github/workflows/ci.yml` orchestre l'exécution des tests en CI.
Voici sa structure dans ce dépôt :

```yaml
name: CI
on:
  push:
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint

  playwright-matrix:
    needs: lint # ← n'exécute les tests qu'après le lint
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false # ← continue même si une combinaison échoue
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --project=${{ matrix.browser }}
      - run: npm run test:visual
      - uses: actions/upload-artifact@v4
        if: always() # ← upload même en cas d'échec
        with:
          name: artifacts-node${{ matrix.node }}-${{ matrix.os }}-${{ matrix.browser }}
          path: |
            playwright-report
            test-results
```

**Ce que fait chaque partie :**

- `on: push / pull_request` : déclenche la CI sur chaque push et PR.
- `needs: lint` : bloque les tests si le lint échoue.
- `fail-fast: false` : permet de voir les résultats sur toutes les combinaisons.
- `npx playwright install --with-deps` : installe les navigateurs en CI.
- `if: always()` : upload les artefacts même quand des tests échouent.

---

### 2. Stratégie de cache

Le cache accélère les exécutions en réutilisant les dépendances déjà installées.

**Cache npm (déjà configuré dans ce dépôt) :**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm # ← met en cache node_modules entre les runs
```

**Cache des navigateurs Playwright :**

Les navigateurs téléchargés par `npx playwright install` peuvent représenter plusieurs
centaines de Mo. Les mettre en cache réduit significativement le temps de pipeline.

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('package-lock.json') }}
    restore-keys: playwright-

- run: npx playwright install --with-deps
```

**Quand invalider le cache ?**

Le cache est automatiquement invalidé quand `package-lock.json` change (mise à jour
de Playwright). La clé `hashFiles('package-lock.json')` gère cela.

**Précaution :** un cache navigateur mal géré peut faire passer des tests sur une version
navigateur obsolète. En cas de doute, vider le cache manuellement depuis GitHub Actions.

---

### 3. Publication des rapports

**Récupérer les artefacts depuis GitHub Actions :**

1. Ouvrir le run sur `github.com/<org>/<repo>/actions`.
2. Descendre jusqu'à la section **Artefacts**.
3. Télécharger l'archive et extraire le dossier `playwright-report/`.
4. Ouvrir `playwright-report/index.html` dans un navigateur.

**Publier le rapport directement sur GitHub Pages (workflow dédié) :**

Ce dépôt contient `.github/workflows/publish-report.yml` pour publier le rapport HTML
sur GitHub Pages après chaque run de CI réussi.

**Lire les résultats de la matrice :**

Avec la matrice actuelle (2 versions Node × 3 OS × 3 navigateurs), chaque run génère
**18 jobs**. Quelques indicateurs à surveiller :

| Signal                                | Signification probable                          |
| ------------------------------------- | ----------------------------------------------- |
| Échoue seulement sur `windows-latest` | Problème de chemins de fichiers ou d'encodage   |
| Échoue seulement sur `webkit`         | API Web non supportée ou comportement différent |
| Échoue seulement avec `node: 22`      | Incompatibilité de dépendance                   |
| Échoue sur toutes les combinaisons    | Régression fonctionnelle réelle                 |

**Interpréter les durées :**

Un job Playwright qui dépasse 10 minutes est souvent signe de :

- tests flaky avec retries lents,
- timeout mal calibré,
- installation de dépendances non cachée.

## Cas réel (terrain)

- Les tests passent en local mais échouent aléatoirement selon l'OS en CI.
- Une matrice multi-plateforme révèle des écarts d'environnement.
- Les artefacts (traces, rapports) accélèrent le diagnostic à distance.

## Exercice bonus

- Proposer une matrice CI minimale pertinente pour ce dépôt.
- Identifier quels artefacts conserver pour faciliter le triage.
- Définir un critère simple de "pipeline prête pour merge".

## Erreurs fréquentes

- Exécuter toute la suite sur chaque commit sans stratégie de coût.
- Négliger la rétention des artefacts utiles au débogage.
- Ajouter un cache non maîtrisé qui masque des problèmes de reproductibilité.

## Exercices associés

- Analyse workflow .github/workflows/ci.yml
