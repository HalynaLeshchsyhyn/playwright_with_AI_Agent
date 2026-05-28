import { Page, Locator } from '@playwright/test';

export class LoginPage {
  // Scoped to the Signup form section to avoid matching the Login form's Email Address input
  private readonly signupNameInput: Locator;
  private readonly signupEmailInput: Locator;
  private readonly signupButton: Locator;
  private readonly newUserHeading: Locator;

  constructor(private readonly page: Page) {
    this.signupNameInput  = page.getByRole('textbox', { name: 'Name' });
    this.signupEmailInput = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    this.signupButton     = page.getByRole('button', { name: 'Signup' });
    this.newUserHeading   = page.getByRole('heading', { name: 'New User Signup!' });
  }

  async fillSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async fillSignupName(name: string): Promise<void> {
    await this.signupNameInput.fill(name);
  }

  async fillSignupEmail(email: string): Promise<void> {
    await this.signupEmailInput.fill(email);
  }

  async clickSignupButton(): Promise<void> {
    await this.signupButton.click();
  }

  getNewUserHeading(): Locator {
    return this.newUserHeading;
  }

  getSignupNameInput(): Locator {
    return this.signupNameInput;
  }

  getSignupEmailInput(): Locator {
    return this.signupEmailInput;
  }
}
