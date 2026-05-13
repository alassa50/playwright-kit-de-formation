import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { chatbotHtml } from '../../exercises/advanced-03/starter/chatbot-page';

test.describe('Solution commentée — Chatbot IA (avancé 03)', () => {
  test('affiche la réponse mockée dans le chat', async ({ page }) => {
    // Mocker l'API IA avant de charger la page
    // => déterminisme total : pas d'appel réseau réel
    await page.route('**/api/ai/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ response: 'Votre commande arrive demain.' }),
      });
    });

    await page.setContent(chatbotHtml);

    // Envoyer un message via le formulaire accessible
    await page.getByLabel('Votre message').fill('Où est ma commande ?');
    await page.getByRole('button', { name: 'Envoyer' }).click();

    // Valider que la réponse s'affiche (validation sémantique, pas de toEqual)
    await expect(page.getByRole('article')).toContainText('commande');
  });

  test("affiche l'indicateur de chargement pendant la requête", async ({ page }) => {
    // Simuler une réponse lente pour capturer l'état intermédiaire
    await page.route('**/api/ai/chat', async (route) => {
      await new Promise((r) => setTimeout(r, 400));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ response: 'Réponse après délai.' }),
      });
    });

    await page.setContent(chatbotHtml);

    await page.getByLabel('Votre message').fill('Test délai');
    await page.getByRole('button', { name: 'Envoyer' }).click();

    // L'indicateur doit être visible PENDANT la requête
    await expect(page.getByRole('status')).toContainText('Chargement...');

    // Après la réponse, l'indicateur doit disparaître
    await expect(page.getByRole('article')).toBeVisible();
    await expect(page.getByRole('status')).toBeHidden();
  });

  test('affiche une erreur en cas de réponse 500', async ({ page }) => {
    // Simuler une panne serveur
    await page.route('**/api/ai/chat', async (route) => {
      await route.fulfill({ status: 500 });
    });

    await page.setContent(chatbotHtml);

    await page.getByLabel('Votre message').fill('Trigger error');
    await page.getByRole('button', { name: 'Envoyer' }).click();

    // Le role="alert" permet aux lecteurs d'écran d'annoncer l'erreur immédiatement
    await expect(page.getByRole('alert')).toContainText('erreur');
  });

  test("ne contient pas de violation a11y critique sur l'interface chatbot", async ({ page }) => {
    await page.setContent(chatbotHtml);
    const results = await new AxeBuilder({ page }).analyze();
    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(
      criticalViolations,
      `Violations critiques détectées : ${JSON.stringify(criticalViolations.map((v) => v.id))}`,
    ).toHaveLength(0);
  });
});
