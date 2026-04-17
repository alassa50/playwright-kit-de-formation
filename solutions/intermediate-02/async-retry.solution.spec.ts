import { expect, test } from '@playwright/test';
import { asyncHtml } from '../../exercises/intermediate-02/starter/async-page';

test('solution commentée: statut asynchrone', async ({ page }) => {
  await page.setContent(asyncHtml);
  await page.getByRole('button', { name: 'Démarrer' }).click();
  await expect(page.getByRole('status')).toHaveText('Terminé');
});
