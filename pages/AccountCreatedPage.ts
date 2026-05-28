import { Page, Locator } from '@playwright/test';

export class AccountCreatedPage {
  // Case-insensitive regex to tolerate uppercase styling in the DOM
  private readonly accountCreatedHeading: Locator;
  private readonly continueLink: Locator;

  constructor(private readonly page: Page) {
    this.accountCreatedHeading = page.getByRole('heading', { name: /account created/i });
    this.continueLink          = page.getByRole('link', { name: 'Continue' });
  }

  async clickContinue(): Promise<void> {
    await this.continueLink.click();
  }

  getHeading(): Locator {
    return this.accountCreatedHeading;
  }
}
