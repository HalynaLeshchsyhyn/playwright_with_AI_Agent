# POM Patterns

## Component Object (reusable UI piece)

For elements that appear on multiple pages (nav bar, modal, toast), create a component class instead of duplicating locators.

```typescript
// pages/components/NavBar.ts
import { Page, Locator } from '@playwright/test';

export class NavBar {
  private readonly homeLink: Locator;
  private readonly profileMenu: Locator;
  private readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.homeLink     = page.getByRole('link', { name: 'Home' });
    this.profileMenu  = page.getByRole('button', { name: 'Profile' });
    this.logoutButton = page.getByRole('menuitem', { name: 'Log out' });
  }

  async goHome() {
    await this.homeLink.click();
  }

  async logout() {
    await this.profileMenu.click();
    await this.logoutButton.click();
  }
}
```

**Compose component into page:**

```typescript
// pages/DashboardPage.ts
export class DashboardPage {
  readonly nav: NavBar;

  constructor(private readonly page: Page) {
    this.nav = new NavBar(page);
  }
}

// In test:
const dashboard = new DashboardPage(page);
await dashboard.nav.logout();
```

---

## Modal Handler

```typescript
// pages/components/ConfirmModal.ts
export class ConfirmModal {
  private readonly confirmButton: Locator;
  private readonly cancelButton: Locator;
  private readonly dialog: Locator;

  constructor(private readonly page: Page) {
    this.dialog        = page.getByRole('dialog');
    this.confirmButton = this.dialog.getByRole('button', { name: 'Confirm' });
    this.cancelButton  = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async isVisible() {
    return this.dialog.isVisible();
  }
}
```

---

## Playwright Fixture (shared POM injection)

Use fixtures instead of repeating `new PageObject(page)` in every test:

```typescript
// tests/fixtures/pages.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

**Usage in test:**

```typescript
// tests/features/login.spec.ts
import { test, expect } from '../fixtures/pages.fixture';

test('valid login redirects to dashboard', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'Password1!');
  await expect(loginPage.page).toHaveURL('/dashboard');
});
```

---

## Base Page (shared behavior)

Only use a base class when multiple pages share genuine common behavior:

```typescript
// pages/BasePage.ts
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

// pages/LoginPage.ts
export class LoginPage extends BasePage {
  // inherits waitForLoad()
}
```

**Rule:** If only one page uses a method from the base, move it back to that page. Don't use base class as a dumping ground.

---

## File Naming Reference

| What | Pattern | Example |
|---|---|---|
| Page Object | `[Page]Page.ts` | `LoginPage.ts` |
| Component Object | `[Component].ts` | `NavBar.ts`, `Modal.ts` |
| Fixture file | `[name].fixture.ts` | `pages.fixture.ts` |
| Test file | `[feature].spec.ts` | `login.spec.ts` |
| Helper | `[concern].helper.ts` | `auth.helper.ts` |
