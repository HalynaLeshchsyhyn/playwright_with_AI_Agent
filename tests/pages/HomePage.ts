import { Page, Locator } from '@playwright/test';

export class HomePage {
  // Role-based heading — most resilient to DOM changes
  private readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'AutomationExercise' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  getPageHeading(): Locator {
    return this.heading;
  }
}
