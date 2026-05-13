import { test } from '@playwright/test';

test.describe('Exercice avancé 03 — Interface chatbot IA', () => {
  test('affiche la réponse mockée dans le chat', async ({ page }) => {
    // TODO: Mocker /api/ai/chat pour retourner { response: 'Votre commande arrive demain.' }
    // TODO: Charger la page avec page.setContent(chatbotHtml)
    // TODO: Saisir un message dans le champ texte et soumettre le formulaire
    // TODO: Vérifier que le texte de la réponse est visible dans un role="article"
  });

  test("affiche l'indicateur de chargement pendant la requête", async ({ page }) => {
    // TODO: Mocker /api/ai/chat avec un délai de 300ms avant de répondre
    // TODO: Charger la page et envoyer un message
    // TODO: Vérifier que role="status" contient "Chargement..." pendant la requête
    // TODO: Vérifier que role="status" disparaît après la réponse
  });

  test('affiche une erreur en cas de réponse 500', async ({ page }) => {
    // TODO: Mocker /api/ai/chat pour retourner status 500
    // TODO: Charger la page et envoyer un message
    // TODO: Vérifier qu'un role="alert" est affiché avec un message d'erreur
  });

  test('ne contient pas de violation a11y critique', async ({ page }) => {
    // TODO: Importer AxeBuilder from '@axe-core/playwright'
    // TODO: Charger la page avec page.setContent(chatbotHtml)
    // TODO: Exécuter un audit axe et vérifier l'absence de violations critiques
  });
});
