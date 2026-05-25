import { Page, Locator } from '@playwright/test';

export class NavBar {
  // All locators scoped to banner to avoid matching body content with same text
  private readonly signupLoginLink: Locator;
  private readonly productsLink: Locator;
  private readonly loggedInLabel: Locator;
  private readonly deleteAccountLink: Locator;

  constructor(private readonly page: Page) {
    const banner = page.getByRole('banner');
    this.signupLoginLink   = banner.getByRole('link', { name: /Signup \/ Login/ });
    this.productsLink      = banner.getByRole('link', { name: /Products/ });
    this.loggedInLabel     = banner.getByText(/Logged in as/);
    this.deleteAccountLink = banner.getByRole('link', { name: /Delete Account/ });
  }

  async clickSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async clickProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async clickDeleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }

  getLoggedInLabel(): Locator {
    return this.loggedInLabel;
  }
}
