import { expect, test } from '@playwright/test';
import { catalogHtml } from '../../exercises/intermediate-01/starter/catalog-page';

test('solution commentée: mock API catalogue', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { name: 'Livre', price: 10 },
        { name: 'Souris', price: 20 },
        { name: 'Écran', price: 30 },
      ]),
    });
  });

  await page.setContent(catalogHtml);
  await page.getByRole('button', { name: 'Charger' }).click();
  await expect(page.locator('#total')).toHaveText('Total: 60€');
});
