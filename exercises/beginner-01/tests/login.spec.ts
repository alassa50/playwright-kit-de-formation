import { expect, test } from '@playwright/test';
import { loginHtml } from '../starter/login-page';

test.describe('Exercice débutant 01', () => {
  test('valide le parcours de connexion', async ({ page }) => {
    await page.setContent(loginHtml);

    await page.getByLabel('Email').fill('apprenant@example.com');
    await page.getByLabel('Mot de passe').fill('MotDePasse!');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page.getByRole('status')).toHaveText('Connexion réussie');
  });
});
