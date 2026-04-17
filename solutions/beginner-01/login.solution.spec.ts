import { expect, test } from '@playwright/test';
import { loginHtml } from '../../exercises/beginner-01/starter/login-page';

test('solution commentée: login stable', async ({ page }) => {
  // On injecte une page locale pour éviter les dépendances externes.
  await page.setContent(loginHtml);

  // Sélecteurs accessibles: plus lisibles et moins fragiles.
  await page.getByLabel('Email').fill('solution@example.com');
  await page.getByLabel('Mot de passe').fill('123456');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // L'assertion attend automatiquement l'état final.
  await expect(page.getByRole('status')).toHaveText('Connexion réussie');
});
