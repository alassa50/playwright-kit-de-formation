# Exercice Avancé 03 — Testing d'une interface chatbot IA

## Énoncé

Tester une interface de chatbot IA de manière reproductible en mockant l'API du LLM,
en validant les propriétés de la réponse (pas la valeur exacte), et en vérifiant la
robustesse face aux erreurs.

## Contexte

Le fichier `starter/chatbot-page.ts` exporte le HTML d'une interface chatbot qui
appelle `/api/ai/chat` en POST. Le comportement à tester :

1. L'utilisateur saisit un message et clique sur "Envoyer".
2. Pendant le chargement, un indicateur `role="status"` affiche "Chargement...".
3. Quand la réponse arrive, elle est affichée dans un élément `role="article"`.
4. En cas d'erreur serveur, un message d'erreur explicite est affiché.

## Critères d'acceptation

1. Mocker `/api/ai/chat` pour retourner une réponse contrôlée.
2. Vérifier que la réponse mockée s'affiche dans le chat.
3. Vérifier l'indicateur de chargement (`role="status"`) pendant la requête.
4. Vérifier le comportement en cas d'erreur 500 de l'API IA.
5. Valider l'absence de violations a11y critiques sur l'interface.

## Aide

- Utilise `page.route()` pour mocker `/api/ai/chat`.
- Pour simuler un délai, utilise `async (route) => { await new Promise(...); route.fulfill(...); }`.
- Pour tester l'état d'erreur, `route.fulfill({ status: 500 })`.
- Les assertions sur `role="status"` et `role="article"` : `getByRole('status')`, `getByRole('article')`.
