import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  // ID-based locator for search submit — stable across releases
  private readonly searchInput: Locator;
  private readonly searchSubmit: Locator;
  private readonly allProductsHeading: Locator;
  private readonly searchedProductsHeading: Locator;
  private readonly firstViewProductLink: Locator;

  constructor(private readonly page: Page) {
    this.searchInput             = page.getByRole('textbox', { name: 'Search Product' });
    this.searchSubmit            = page.locator('#submit_search');
    this.allProductsHeading      = page.getByRole('heading', { name: /All Products/i });
    this.searchedProductsHeading = page.getByRole('heading', { name: /Searched Products/i });
    this.firstViewProductLink    = page.getByRole('link', { name: 'View Product' }).first();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchSubmit.click();
  }

  async clickFirstResult(): Promise<void> {
    await this.firstViewProductLink.click();
  }

  getAllProductsHeading(): Locator {
    return this.allProductsHeading;
  }

  getSearchedProductsHeading(): Locator {
    return this.searchedProductsHeading;
  }
}
