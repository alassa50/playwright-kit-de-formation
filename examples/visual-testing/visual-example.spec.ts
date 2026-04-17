import { expect, test } from '@playwright/test';

test('exemple visuel carte @visual', async ({ page }) => {
  await page.setContent(`
    <section style="padding:12px;border:1px solid #ccc;width:220px">
      <h3>Produit visuel</h3>
      <p>Prix: 49€</p>
    </section>
  `);

  await expect(page.locator('section')).toHaveScreenshot('visual-example.png');
});
