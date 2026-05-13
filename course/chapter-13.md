# Chapitre 13 — Testing Assisté par l'IA (2026)

## Objectifs pédagogiques

- Intégrer un assistant IA (Copilot, ChatGPT, Claude) dans le workflow de test.
- Générer, refactoriser et relire des tests avec des prompts versionnés.
- Savoir quand faire confiance à l'IA et quand invalider sa sortie.
- Appliquer une revue humaine systématique sur tout code généré.

## Durée estimée

- 90 min

## Prérequis

- Chapitres 1 à 12

## Contenu

### 1. Pourquoi l'IA change le métier du testeur en 2026

L'IA générative n'est pas un outil de remplacement — c'est un accélérateur. En 2026,
les pratiques établies dans les équipes de qualité sont :

| Usage                                | Gain réel                 | Risque à maîtriser                 |
| ------------------------------------ | ------------------------- | ---------------------------------- |
| Générer un premier brouillon de test | ×3 à ×5 sur la vitesse    | Sélecteurs fragiles, faux positifs |
| Refactoriser vers POM                | Réduit la dette technique | Perte de contexte métier           |
| Expliquer un test existant           | Accélère l'onboarding     | Sur-confiance dans l'explication   |
| Détecter des patterns flaky          | Détection préventive      | Faux négatifs sur les edge cases   |
| Créer des données de test            | Diversité des scénarios   | Données non-déterministes          |

**Principe fondamental** : tout code généré par l'IA doit être traité comme une
**pull request d'un contributeur junior** — utile, mais nécessite revue.

---

### 2. Workflow de prompt versionné

Ce dépôt utilise des prompts versionnés dans `.github/prompts/`. Cette approche présente
plusieurs avantages :

- **Reproductibilité** : toute l'équipe utilise les mêmes instructions.
- **Traçabilité** : `version` et `date` dans le front matter permettent l'audit.
- **Amélioration continue** : les prompts évoluent avec le projet.

**Structure d'un prompt versionné :**

```markdown
---
version: 1.2.0
date: 2026-05-01
usage: Générer un test Playwright pour un formulaire.
---

# Instruction

...
```

**Prompts disponibles dans ce dépôt :**

| Fichier                         | Rôle                                    |
| ------------------------------- | --------------------------------------- |
| `generate-test.prompt.md`       | Générer un test depuis un énoncé métier |
| `refactor-to-pom.prompt.md`     | Refactoriser vers Page Object Model     |
| `review-test-quality.prompt.md` | Auditer la qualité d'un test existant   |
| `test-ai-system.prompt.md`      | Tester un système basé sur l'IA         |
| `create-exercise.prompt.md`     | Créer un nouvel exercice de formation   |

---

### 3. Générer un test avec GitHub Copilot

**Étapes pratiques dans VS Code :**

1. Ouvrir le panneau Chat Copilot (`Ctrl+Alt+I`).
2. Sélectionner le prompt `generate-test.prompt.md`.
3. Fournir le contexte : URL, critères d'acceptation, données de test.
4. Copier le code généré dans un fichier `.spec.ts`.
5. **Relire systématiquement** : sélecteurs, assertions, gestion d'erreur.
6. Exécuter le test en mode `--headed` pour valider le comportement.

**Ce que Copilot génère bien :**

```ts
// ✅ Structure claire avec test.describe
test.describe('Formulaire de contact', () => {
  test('soumet avec des données valides', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Message').fill('Bonjour');
    await page.getByRole('button', { name: 'Envoyer' }).click();
    await expect(page.getByRole('status')).toContainText('Message envoyé');
  });
});
```

**Ce qu'il faut toujours vérifier manuellement :**

```ts
// ⚠️ Vérifier que le sélecteur existe réellement
await page.locator('.submit-btn').click(); // fragile, à remplacer

// ⚠️ Vérifier que le timeout est adapté
await page.waitForTimeout(2000); // anti-pattern à supprimer

// ⚠️ Vérifier que les données sont deterministes
const email = `user-${Date.now()}@test.com`; // OK si seedé proprement
```

---

### 4. Revue de qualité assistée par l'IA

L'IA peut aussi **auditer** un test existant. Le prompt `review-test-quality.prompt.md`
guide une revue structurée sur 5 axes :

1. **Sélecteurs** : accessibilité, robustesse, couplage au DOM.
2. **Assertions** : précision, message d'erreur, faux positifs possibles.
3. **Isolation** : dépendances externes, ordre d'exécution.
4. **Lisibilité** : nommage, structure, commentaires.
5. **Maintenabilité** : duplication, couplage, évolutivité.

**Exemple d'utilisation :**

```
@workspace /review-test-quality.prompt.md

Revue ce test :
[coller le contenu du fichier .spec.ts]
```

---

### 5. Checklist avant de merger un test généré par l'IA

```
[ ] Les sélecteurs utilisent getByRole/getByLabel/getByTestId
[ ] Pas de waitForTimeout ni sleep
[ ] Les assertions ont des messages d'erreur clairs
[ ] Le test passe 3 fois de suite sans flakiness
[ ] Le test échoue quand le comportement attendu est absent
[ ] Pas de secrets ni de données personnelles hardcodées
[ ] Le nom du test décrit le comportement (pas l'implémentation)
```

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer au chapitre suivant, vérifie que tu sais :

- Utiliser un prompt versionné pour générer un test Playwright.
- Identifier les erreurs typiques dans un test généré par l'IA.
- Appliquer la checklist de revue avant de merger.

**Quiz rapide**

1. Pourquoi versionner les prompts dans le dépôt ?
2. Cite 3 patterns à vérifier systématiquement dans un test généré.
3. Quel est le risque principal d'un test généré sans relecture humaine ?

> Si tu bloques sur une question, relis la section correspondante ou consulte les prompts dans `.github/prompts/`.
