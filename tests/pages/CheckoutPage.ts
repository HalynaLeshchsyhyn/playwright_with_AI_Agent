import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  // Role headings confirmed against live DOM snapshot
  private readonly addressDetailsHeading: Locator;
  private readonly deliveryAddressHeading: Locator;
  // Unlabeled textarea — class selector is the only stable option in this app
  private readonly orderCommentTextarea: Locator;
  private readonly placeOrderLink: Locator;

  constructor(private readonly page: Page) {
    this.addressDetailsHeading  = page.getByRole('heading', { name: 'Address Details' });
    this.deliveryAddressHeading = page.getByRole('heading', { name: 'Your delivery address' });
    this.orderCommentTextarea   = page.locator('textarea.form-control');
    this.placeOrderLink         = page.getByRole('link', { name: 'Place Order' });
  }

  async fillOrderComment(comment: string): Promise<void> {
    await this.orderCommentTextarea.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderLink.click();
  }

  getAddressDetailsHeading(): Locator {
    return this.addressDetailsHeading;
  }

  getDeliveryAddressHeading(): Locator {
    return this.deliveryAddressHeading;
  }
}
