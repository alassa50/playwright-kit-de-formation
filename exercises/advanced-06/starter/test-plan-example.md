# Test Plan — TodoMVC (exemple de sortie du Planner)

> Ce fichier est un exemple de ce que produit le Planner sur https://demo.playwright.dev/todomvc.
> Dans un vrai projet, ce fichier est généré automatiquement, puis révisé par l'humain
> avant d'être passé au Generator.

---

## 1. Gestion des tâches

### 1.1 Ajouter une tâche

Steps :

1. Naviguer vers https://demo.playwright.dev/todomvc
2. Cliquer sur le champ "What needs to be done?"
3. Saisir "Acheter du pain"
4. Appuyer sur Entrée

Résultat attendu : La tâche "Acheter du pain" apparaît dans la liste avec le compteur "1 item left"

---

### 1.2 Marquer une tâche comme terminée

Prérequis : au moins une tâche existe dans la liste

Steps :

1. Naviguer vers https://demo.playwright.dev/todomvc
2. Ajouter une tâche via le champ (voir 1.1)
3. Cliquer sur le cercle (toggle) à gauche de la tâche

Résultat attendu : La tâche est affichée avec un style barré, le compteur passe à "0 items left"

---

### 1.3 Filtrer les tâches actives

Prérequis : au moins une tâche active et une tâche terminée existent

Steps :

1. Cliquer sur le lien "Active" dans le pied de la liste

Résultat attendu : Seules les tâches non terminées sont visibles dans la liste

---

### 1.4 Filtrer les tâches terminées

Prérequis : au moins une tâche terminée existe

Steps :

1. Cliquer sur le lien "Completed" dans le pied de la liste

Résultat attendu : Seules les tâches terminées sont visibles dans la liste

---

### 1.5 Supprimer une tâche

Prérequis : au moins une tâche existe dans la liste

Steps :

1. Survoler la tâche avec la souris pour faire apparaître le bouton de suppression
2. Cliquer sur le bouton "×" à droite de la tâche

Résultat attendu : La tâche n'est plus visible dans la liste
