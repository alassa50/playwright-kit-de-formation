# Chapitre 4 — Débogage, traces et rapports

## Objectifs pédagogiques

- Diagnostiquer un échec de test.
- Exploiter traces, screenshots et rapport HTML.

## Durée estimée

- 75 min

## Prérequis

- Chapitres 1 à 3

## Contenu

### 1. Traces Playwright

La **trace** est l'enregistrement complet d'un test : chaque action, chaque appel réseau,
chaque état du DOM, chaque screenshot intermédiaire. C'est l'outil le plus puissant pour
diagnostiquer un échec, notamment en CI.

**Activer les traces dans `playwright.config.ts` :**

```typescript
use: {
  // 'on-first-retry' : trace générée seulement quand un test est relanc é après échec
  // 'on'            : trace systématique (plus lourd)
  // 'off'           : désactivé
  trace: 'on-first-retry',
}
```

**Ouvrir une trace après un échec :**

```bash
npx playwright show-trace test-results/<nom-du-test>/trace.zip
```

Le Trace Viewer s'ouvre dans le navigateur. Il affiche :

- une **timeline** cliquable avec chaque action,
- le **snapshot du DOM** à chaque étape,
- les **appels réseau** et leurs réponses,
- les **logs console** de la page.

**Astuce :** cliquer sur une action dans la timeline met en surbrillance l'élément
ciblé dans le snapshot DOM. C'est la façon la plus rapide de comprendre pourquoi un
sélecteur a échoué.

---

### 2. Screenshots et vidéos d'échec

**Configurer les screenshots automatiques :**

```typescript
use: {
  // 'only-on-failure' : capture uniquement en cas d'échec (recommandé)
  // 'on'              : capture à chaque test
  screenshot: 'only-on-failure',
}
```

**Configurer la vidéo :**

```typescript
use: {
  // 'retain-on-failure' : conserve la vidéo seulement si le test échoue
  video: 'retain-on-failure',
}
```

Les artefacts sont sauvegardés dans le dossier `test-results/` après l'exécution.

**Prendre un screenshot manuellement dans un test :**

```typescript
// Utile pour documenter l'état de la page à un moment précis
await page.screenshot({ path: 'debug/etat-apres-clic.png' });

// Screenshot d'un seul élément
await page.locator('article').screenshot({ path: 'debug/carte.png' });
```

**Différence trace vs screenshot :**

| Outil      | Contient                              | Usage principal               |
| ---------- | ------------------------------------- | ----------------------------- |
| Screenshot | Image fixe de la page à un instant    | Vérifier l'état visuel        |
| Vidéo      | Enregistrement de toute l'exécution   | Rejouer le test pas à pas     |
| Trace      | Tout : DOM, réseau, logs, screenshots | Diagnostic complet d'un échec |

---

### 3. Stratégies de correction rapide

Quand un test échoue, il faut adopter une démarche méthodique pour identifier la cause
racine avant d'écrire une correction.

**Étape 1 — Reproduire en local**

```bash
# Lancer un test spécifique avec le navigateur visible
npx playwright test exercises/intermediate-02/tests/async-retry.spec.ts --headed

# Utiliser le mode UI (plus interactif)
npx playwright test --ui
```

**Étape 2 — Lire le message d'erreur**

```
Error: expect(locator).toHaveText(expected)
Expected: "Terminé"
Received: "En cours…"
  at async page.getByRole('status') — async-retry.spec.ts:8
```

Le message indique : l'assertion `toHaveText('Terminé')` a expiré parce que le texte
était encore `"En cours…"`. C'est un problème de **synchronisation asynchrone**.

**Étape 3 — Corriger selon la cause**

| Cause                          | Correction recommandée                                |
| ------------------------------ | ----------------------------------------------------- |
| Élément pas encore visible     | `await expect(locator).toBeVisible()` (auto-wait)     |
| Texte pas encore mis à jour    | `await expect(locator).toHaveText('...')` (auto-wait) |
| API lente                      | `page.route` pour mocker ou augmenter le timeout      |
| Animation bloque l'interaction | `await locator.waitFor({ state: 'stable' })`          |
| Timing race condition          | Restructurer pour attendre un événement réseau précis |

**Ce qu'il ne faut pas faire :**

```typescript
// ⚠️  Éviter les attentes arbitraires : masque le problème sans le corriger
await page.waitForTimeout(3000);
```

**Bonne pratique :**

```typescript
// ✅ Attendre un état observable : le test échoue vite si le problème persiste
await expect(page.getByRole('status')).toHaveText('Terminé');
```

Ce code est directement issu de `exercises/intermediate-02/tests/async-retry.spec.ts` :
le test attend que le statut affiche `'Terminé'` sans timeout fixe — Playwright gère
l'attente automatiquement.

## Cas réel (terrain)

- Un test échoue uniquement en CI sans reproduction locale immédiate.
- L'analyse combinée trace + screenshot + vidéo permet d'identifier un timing asynchrone.
- La correction cible le bon point de synchronisation au lieu d'ajouter un `wait` arbitraire.

## Exercice bonus

- Forcer un échec contrôlé sur un test pour générer des artefacts.
- Ouvrir la trace et retrouver l'action exacte qui diverge.
- Proposer une correction minimale basée sur le diagnostic.

## Erreurs fréquentes

- Ajouter des temporisations fixes (`waitForTimeout`) au lieu de diagnostiquer.
- Ne consulter qu'un seul artefact (ex: screenshot) et ignorer la trace.
- Corriger "au hasard" sans hypothèse vérifiable.

## Exercices associés

- exercises/intermediate-02
