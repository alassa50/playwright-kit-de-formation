import { test } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { CatalogPage } from '../pages/catalog.page';

const html = `
  <main>
    <button onclick="document.querySelector('[data-testid=cart-count]').textContent = '1'">Ajouter au panier</button>
    <span data-testid="cart-count">0</span>
  </main>
`;

test('POM: ajout au panier', async ({ page }) => {
  const catalog = new CatalogPage(page);
  const cart = new CartPage(page);

  await catalog.openWithContent(html);
  await catalog.addFirstItemToCart();
  await cart.expectCount(1);
});
