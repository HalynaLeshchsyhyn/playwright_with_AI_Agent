import { Page, Locator } from '@playwright/test';

export class DeleteAccountPage {
  // Case-insensitive regex — heading is displayed in uppercase via CSS
  private readonly accountDeletedHeading: Locator;

  constructor(private readonly page: Page) {
    this.accountDeletedHeading = page.getByRole('heading', { name: /account deleted/i });
  }

  getHeading(): Locator {
    return this.accountDeletedHeading;
  }
}
