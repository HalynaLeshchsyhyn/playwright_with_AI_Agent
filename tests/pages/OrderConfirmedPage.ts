import { Page, Locator } from '@playwright/test';

export class OrderConfirmedPage {
  // Heading and confirmation paragraph confirmed against live DOM
  private readonly orderPlacedHeading: Locator;
  private readonly confirmationText: Locator;

  constructor(private readonly page: Page) {
    this.orderPlacedHeading  = page.getByRole('heading', { name: 'Order Placed!' });
    this.confirmationText    = page.getByText('Congratulations! Your order has been confirmed!');
  }

  getOrderPlacedHeading(): Locator {
    return this.orderPlacedHeading;
  }

  getConfirmationText(): Locator {
    return this.confirmationText;
  }
}
