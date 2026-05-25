import { Page, Locator } from '@playwright/test';

export class ProductDetailsPage {
  // CSS class selector for product name — stable semantic class in this app
  private readonly productName: Locator;
  private readonly availability: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly addedModalHeading: Locator;
  private readonly viewCartLink: Locator;

  constructor(private readonly page: Page) {
    this.productName      = page.locator('.product-information h2');
    this.availability     = page.getByText('Availability: In Stock');
    this.quantityInput    = page.locator('#quantity');
    this.addToCartButton  = page.getByRole('button', { name: /Add to cart/i });
    this.addedModalHeading = page.getByRole('heading', { name: 'Added!' });
    this.viewCartLink     = page.getByRole('link', { name: 'View Cart' });
  }

  async setQuantity(qty: string): Promise<void> {
    await this.quantityInput.fill(qty);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async viewCart(): Promise<void> {
    await this.viewCartLink.click();
  }

  getProductName(): Locator {
    return this.productName;
  }

  getAvailability(): Locator {
    return this.availability;
  }

  getAddedModalHeading(): Locator {
    return this.addedModalHeading;
  }
}
