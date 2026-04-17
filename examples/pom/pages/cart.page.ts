import { expect, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectCount(expected: number): Promise<void> {
    await expect(this.page.getByTestId('cart-count')).toHaveText(String(expected));
  }
}
