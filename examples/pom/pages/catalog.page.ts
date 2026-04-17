import { Page } from '@playwright/test';

export class CatalogPage {
  constructor(private readonly page: Page) {}

  async openWithContent(html: string): Promise<void> {
    await this.page.setContent(html);
  }

  async addFirstItemToCart(): Promise<void> {
    await this.page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
  }
}
