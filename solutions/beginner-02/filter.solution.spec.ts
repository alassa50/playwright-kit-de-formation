import { expect, test } from '@playwright/test';
import { filterHtml } from '../../exercises/beginner-02/starter/filter-page';

test('solution commentée: filtre dynamique', async ({ page }) => {
  await page.setContent(filterHtml);
  await page.getByLabel('Recherche').fill('livre');

  await expect(page.getByText('livre TypeScript')).toBeVisible();
  await expect(page.getByText('clavier mécanique')).toBeHidden();

  // Le clear vérifie l'idempotence du composant.
  await page.getByLabel('Recherche').clear();
  await expect(page.getByText('clavier mécanique')).toBeVisible();
});
