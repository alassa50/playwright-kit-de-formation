# Chapitre 11 — Sécurité et secrets

## Objectifs pédagogiques

- Éviter fuite de secrets dans tests/CI.
- Appliquer un minimum de tests sécurité.

## Durée estimée

- 60 min

## Prérequis

- Chapitres 1 à 10

## Contenu

### 1. GitHub Secrets — stocker et utiliser les secrets en CI

Les **GitHub Secrets** permettent de stocker des informations sensibles (tokens, mots de
passe, clés API) en dehors du code source. Ils sont chiffrés et n'apparaissent jamais
dans les logs.

**Créer un secret dans GitHub :**

1. Aller dans `Settings` du dépôt.
2. Cliquer sur `Secrets and variables` → `Actions`.
3. Cliquer sur `New repository secret`.
4. Nommer le secret (ex: `TEST_API_KEY`) et entrer sa valeur.

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer au chapitre suivant, vérifie que tu sais :

- Stocker un secret dans GitHub.
- Utiliser un secret dans un workflow CI.
- Appliquer un test de sécurité basique.

**Quiz rapide**

1. Pourquoi ne jamais commiter un secret ?
2. Comment référencer un secret dans GitHub Actions ?
3. Que faire si un secret a fuité ?

> Si tu bloques sur une question, relis la section correspondante ou expérimente dans le starter kit.

**Utiliser un secret dans un workflow :**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      # Injecter le secret comme variable d'environnement
      TEST_API_KEY: ${{ secrets.TEST_API_KEY }}
    steps:
      - run: npx playwright test
```

**Utiliser un secret dans un test Playwright :**

```typescript
// Lire la variable d'environnement injectée par CI
const apiKey = process.env.TEST_API_KEY;

test('appel API authentifié', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    Authorization: `Bearer ${apiKey}`,
  });
  await page.goto('/api/profil');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

**Règles fondamentales :**

> Ne jamais écrire une valeur secrète directement dans le code source, même sous forme
> commentée ou pour un test "temporaire".

---

### 2. Bonnes pratiques sur les variables d'environnement

**Différencier les types de variables :**

| Type                   | Exemple                   | Où stocker                            |
| ---------------------- | ------------------------- | ------------------------------------- |
| Configuration publique | URL de l'API de test      | `playwright.config.ts` ou `.env.test` |
| Identifiant de test    | `test-user@example.com`   | `.env.test` (commitable)              |
| Secret sensible        | Token d'API, mot de passe | GitHub Secrets uniquement             |

**Utiliser `.env` pour le développement local :**

```bash
# .env.test (commitable — ne contient pas de vraies valeurs sensibles)
TEST_BASE_URL=https://staging.exemple.com
TEST_USER_EMAIL=apprenant@example.com
```

```typescript
// playwright.config.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.TEST_BASE_URL ?? 'http://localhost:3000',
  },
};
```

**Ne jamais commiter de `.env` contenant des secrets réels :**

```bash
# .gitignore
.env
.env.local
.env.production
```

**Vérification automatique avec `git-secrets` ou `gitleaks` :**

Ces outils scannent les commits pour détecter des patterns ressemblant à des secrets.
Ils s'intègrent comme pre-commit hooks ou étapes de CI.

---

### 3. Checklist de revue sécurité

Avant de fusionner une PR qui touche aux tests ou à la CI, parcourir cette liste :

**Dans les fichiers de test :**

- [ ] Aucune valeur de type `password`, `token`, `key`, `secret` dans le code.
- [ ] Les URLs pointent vers des environnements de test, pas la production.
- [ ] Les comptes de test utilisés sont dédiés et révocables.
- [ ] Les données sensibles sont lues depuis `process.env`, jamais en dur.

**Dans les workflows CI :**

- [ ] Les secrets sont injectés via `${{ secrets.NOM }}`, pas via des variables en clair.
- [ ] Les logs ne contiennent pas de valeurs sensibles affichées par `console.log` ou `echo`.
- [ ] Les permissions du workflow sont au minimum nécessaire (`contents: read`).
- [ ] Les actions tierces utilisent une version épinglée (`@v4`, pas `@main`).

**Exemple de permission minimale dans le workflow :**

```yaml
permissions:
  contents: read # ← ne donner que ce qui est nécessaire
```

**Consulter les ressources du dépôt :**

- `SECURITY.md` — règles opérationnelles.
- `CHECKLIST_FUTURE_PROOF.md` — politique de maintenance sécurité.

**En cas de suspicion de fuite :**

1. Révoquer immédiatement le secret concerné.
2. Créer un nouveau secret avec une valeur différente.
3. Vérifier les logs CI des 30 derniers jours.
4. Ouvrir un ticket dans les issues privées du dépôt.

## Cas réel (terrain)

- Une clé d'API est accidentellement exposée dans un log de pipeline.
- L'équipe renforce la gestion des secrets et le masquage des sorties sensibles.
- Les revues de PR incluent désormais une vérification sécurité explicite.

## Exercice bonus

- Auditer un scénario de test pour repérer les zones de fuite potentielle de secrets.
- Définir quelles variables doivent être injectées uniquement via CI.
- Ajouter une mini-checklist de revue sécurité avant fusion.

## Erreurs fréquentes

- Commiter des valeurs de test qui ressemblent à de vrais secrets.
- Afficher des tokens dans les logs pour "debug rapide".
- Confondre variable de configuration publique et secret sensible.

## Exercices associés

- Revue de CHECKLIST_FUTURE_PROOF.md
