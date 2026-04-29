import { expect, test } from '@playwright/test';
import { buildCartHtml } from '../starter/cart-page';
import { calculerTotal, formaterLigne } from '../starter/cart-helpers';
import type { Produit } from '../starter/cart-helpers';

// ---------------------------------------------------------------------------
// Données de test typées grâce à l'interface Produit.
// Destructuring utilisé dans les tests pour extraire les champs nécessaires.
// ---------------------------------------------------------------------------
const produits: Produit[] = [
  { id: 1, nom: 'clavier mécanique', prix: 89, enStock: true },
  { id: 2, nom: 'souris sans fil', prix: 35, enStock: true },
  { id: 3, nom: 'écran 4K', prix: 349, enStock: false },
];

test.describe('Exercice débutant 00 — Bases JS/TS', () => {
  // -------------------------------------------------------------------------
  // Test 1 : vérifier les fonctions utilitaires TypeScript (sans navigateur)
  // -------------------------------------------------------------------------
  test('calculerTotal ne compte que les produits en stock', () => {
    // TODO : appeler calculerTotal(produits) et vérifier que le résultat
    // est égal à la somme des prix des produits en stock (89 + 35 = 124).
    const total = calculerTotal(produits);
    expect(total).toBe(124);
  });

  test('formaterLigne retourne une chaîne formatée', () => {
    // TODO : appeler formaterLigne avec le premier produit et vérifier
    // que la chaîne retournée contient le nom et le prix.
    const [premierProduit] = produits; // destructuring
    const ligne = formaterLigne(premierProduit);
    expect(ligne).toContain('clavier mécanique');
    expect(ligne).toContain('89.00 €');
  });

  // -------------------------------------------------------------------------
  // Test 2 : vérifier le rendu HTML dans un vrai navigateur (Playwright)
  // -------------------------------------------------------------------------
  test('affiche le total correct dans la page', async ({ page }) => {
    // buildCartHtml construit la page à partir des données typées.
    await page.setContent(buildCartHtml(produits));

    // Le total visible ne doit inclure que les produits en stock.
    await expect(page.getByRole('status')).toContainText('124.00 €');
  });

  test("affiche le bon nombre d'articles en stock", async ({ page }) => {
    await page.setContent(buildCartHtml(produits));

    // Deux produits sur trois sont en stock.
    await expect(page.locator('#nb-articles')).toContainText('2');
  });

  test('chaque ligne du tableau est rendue avec le bon nom', async ({ page }) => {
    await page.setContent(buildCartHtml(produits));

    // Utiliser map pour vérifier chaque produit individuellement.
    for (const { nom } of produits) {
      await expect(page.getByText(nom)).toBeVisible();
    }
  });

  test('les produits épuisés affichent "épuisé"', async ({ page }) => {
    await page.setContent(buildCartHtml(produits));

    const épuisés = produits.filter((p) => !p.enStock);
    for (const { nom } of épuisés) {
      const ligne = page.locator(`tr`, { hasText: nom });
      await expect(ligne.locator('.stock')).toHaveText('épuisé');
    }
  });
});
