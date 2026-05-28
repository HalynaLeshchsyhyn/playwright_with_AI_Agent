import { Page, Locator } from '@playwright/test';

export class PaymentPage {
  // All payment inputs use data-qa attributes — most stable across DOM refactors
  private readonly paymentHeading: Locator;
  private readonly nameOnCardInput: Locator;
  private readonly cardNumberInput: Locator;
  private readonly cvcInput: Locator;
  private readonly expiryMonthInput: Locator;
  private readonly expiryYearInput: Locator;
  private readonly payConfirmButton: Locator;

  constructor(private readonly page: Page) {
    this.paymentHeading   = page.getByRole('heading', { name: 'Payment' });
    this.nameOnCardInput  = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput  = page.locator('[data-qa="card-number"]');
    this.cvcInput         = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput  = page.locator('[data-qa="expiry-year"]');
    this.payConfirmButton = page.getByRole('button', { name: 'Pay and Confirm Order' });
  }

  async fillPaymentDetails(params: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<void> {
    await this.nameOnCardInput.fill(params.nameOnCard);
    await this.cardNumberInput.fill(params.cardNumber);
    await this.cvcInput.fill(params.cvc);
    await this.expiryMonthInput.fill(params.expiryMonth);
    await this.expiryYearInput.fill(params.expiryYear);
  }

  async confirmPayment(): Promise<void> {
    await this.payConfirmButton.click();
  }

  getPaymentHeading(): Locator {
    return this.paymentHeading;
  }
}
