import { expect, test } from '@playwright/test';
import { buildCartHtml } from '../../exercises/beginner-00/starter/cart-page';
import type { Produit } from '../../exercises/beginner-00/starter/cart-helpers';

// ---------------------------------------------------------------------------
// Implémentation complète des helpers (étape TODO de l'exercice)
// ---------------------------------------------------------------------------

// calculerTotal : filter (en stock) + reduce (somme)
const calculerTotal = (items: Produit[]): number =>
  items.filter((p) => p.enStock).reduce((acc, p) => acc + p.prix, 0);

// formaterLigne : template literal avec formatage du prix et du statut
function formaterLigne(produit: Produit): string {
  const { nom, prix, enStock } = produit; // destructuring
  return `${nom} — ${prix.toFixed(2)} €  (${enStock ? 'en stock' : 'épuisé'})`;
}

// ---------------------------------------------------------------------------
// Données de test
// ---------------------------------------------------------------------------
const produits: Produit[] = [
  { id: 1, nom: 'clavier mécanique', prix: 89, enStock: true },
  { id: 2, nom: 'souris sans fil', prix: 35, enStock: true },
  { id: 3, nom: 'écran 4K', prix: 349, enStock: false },
];

test.describe('Solution débutant 00 — Bases JS/TS', () => {
  test('calculerTotal ne compte que les produits en stock', () => {
    // 89 + 35 = 124 ; l'écran 4K est épuisé, il est exclu.
    expect(calculerTotal(produits)).toBe(124);
  });

  test('formaterLigne retourne une chaîne formatée', () => {
    const [premierProduit] = produits; // destructuring du tableau
    const ligne = formaterLigne(premierProduit);
    expect(ligne).toContain('clavier mécanique');
    expect(ligne).toContain('89.00 €');
    expect(ligne).toContain('en stock');
  });

  test('affiche le total correct dans la page', async ({ page }) => {
    await page.setContent(buildCartHtml(produits));
    await expect(page.getByRole('status')).toContainText('124.00 €');
  });

  test("affiche le bon nombre d'articles en stock", async ({ page }) => {
    await page.setContent(buildCartHtml(produits));
    await expect(page.locator('#nb-articles')).toContainText('2');
  });

  test('chaque ligne du tableau est rendue avec le bon nom', async ({ page }) => {
    await page.setContent(buildCartHtml(produits));
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
