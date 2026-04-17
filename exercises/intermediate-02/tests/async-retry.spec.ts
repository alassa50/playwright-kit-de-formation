import { expect, test } from '@playwright/test';
import { asyncHtml } from '../starter/async-page';

test.describe('Exercice intermédiaire 02', () => {
  test('attend la fin du traitement asynchrone', async ({ page }) => {
    await page.setContent(asyncHtml);
    await page.getByRole('button', { name: 'Démarrer' }).click();
    await expect(page.getByRole('status')).toHaveText('Terminé');
  });
});
