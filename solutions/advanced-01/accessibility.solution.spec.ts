import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { accessibleHtml } from '../../exercises/advanced-01/starter/a11y-page';

test('solution commentée: audit a11y', async ({ page }) => {
  await page.setContent(accessibleHtml);
  const results = await new AxeBuilder({ page }).analyze();
  const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
  expect(criticalViolations).toHaveLength(0);
});
