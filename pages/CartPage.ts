import { Page, Locator } from '@playwright/test';

export class CartPage {
  // Semantic class selectors confirmed against live DOM
  private readonly firstProductName: Locator;
  private readonly firstProductQuantity: Locator;
  private readonly proceedToCheckoutButton: Locator;

  constructor(private readonly page: Page) {
    this.firstProductName      = page.locator('.cart_description h4 a').first();
    this.firstProductQuantity  = page.locator('.cart_quantity button').first();
    // "Proceed To Checkout" renders as <a class="btn check_out"> not a role=link
    this.proceedToCheckoutButton = page.locator('a.btn.check_out');
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  getFirstProductName(): Locator {
    return this.firstProductName;
  }

  getFirstProductQuantity(): Locator {
    return this.firstProductQuantity;
  }
}
