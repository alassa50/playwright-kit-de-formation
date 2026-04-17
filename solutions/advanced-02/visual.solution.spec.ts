import { expect, test } from '@playwright/test';
import { visualHtml } from '../../exercises/advanced-02/starter/visual-page';

test('solution commentée: snapshot stable @visual', async ({ page }) => {
  await page.setContent(visualHtml);
  await expect(page.locator('article')).toHaveScreenshot('solution-product-card.png');
});
