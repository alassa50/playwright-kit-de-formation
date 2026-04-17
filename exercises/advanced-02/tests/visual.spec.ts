import { expect, test } from '@playwright/test';
import { visualHtml } from '../starter/visual-page';

test.describe('Exercice avancé 02 @visual', () => {
  test('snapshot carte produit', async ({ page }) => {
    await page.setContent(visualHtml);
    await expect(page.locator('article')).toHaveScreenshot('product-card.png');
  });
});
