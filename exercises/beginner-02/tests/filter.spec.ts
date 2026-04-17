import { expect, test } from '@playwright/test';
import { filterHtml } from '../starter/filter-page';

test.describe('Exercice débutant 02', () => {
  test('filtre dynamiquement les éléments', async ({ page }) => {
    await page.setContent(filterHtml);

    await page.getByLabel('Recherche').fill('livre');
    await expect(page.getByText('livre TypeScript')).toBeVisible();
    await expect(page.getByText('livre Playwright')).toBeVisible();
    await expect(page.getByText('clavier mécanique')).toBeHidden();

    await page.getByLabel('Recherche').clear();
    await expect(page.getByText('clavier mécanique')).toBeVisible();
  });
});
