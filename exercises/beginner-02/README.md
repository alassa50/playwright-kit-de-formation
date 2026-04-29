# Exercice Débutant 02 — Filtre de liste

## Énoncé

Tester un filtre client-side qui masque les éléments non correspondants.

## Critères d'acceptation

1. En tapant `livre`, seuls les articles contenant `livre` restent visibles.
2. En vidant le filtre, tous les articles sont visibles.
3. Aucune attente fixe (`waitForTimeout`) n'est utilisée.

---

## 🟢 Checkpoint — Auto-évaluation

Avant de passer à l’exercice suivant, vérifie que tu sais :

- Automatiser un filtre côté client.
- Vérifier la visibilité/masquage d’éléments sans timeout fixe.
- Revenir à l’état initial après filtrage.

**Questions rapides**

1. Pourquoi éviter `waitForTimeout` dans les tests ?
2. Comment vérifier qu’un élément est masqué ?
3. Que se passe-t-il si le filtre est insensible à la casse ?

> Si tu bloques sur une question, relis l’énoncé ou teste dans le starter.
