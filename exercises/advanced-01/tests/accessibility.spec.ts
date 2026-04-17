import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { accessibleHtml } from '../starter/a11y-page';

test.describe('Exercice avancé 01 @a11y', () => {
  test('valide l’absence de violation critique', async ({ page }) => {
    await page.setContent(accessibleHtml);
    const results = await new AxeBuilder({ page }).analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });
});
