# SOLID Principles in Test Automation

## S — Single Responsibility Principle

> A class should have one reason to change.

Each class/file should own exactly one concern.

| Class type | Its one responsibility |
|---|---|
| Page Object | Locators + actions for one page |
| Component Object | Locators + actions for one UI component |
| Fixture | Setting up one dependency (auth, test data) |
| Helper | One utility concern (API calls, DB seeding) |
| Test file | Scenarios for one feature |

**Violation:**
```typescript
// ❌ LoginPage doing too much
export class LoginPage {
  async login() { ... }
  async logout() { ... }         // belongs in NavBar or ProfileMenu
  async resetPassword() { ... }  // belongs in ForgotPasswordPage
  async seedTestUser() { ... }   // belongs in a helper/fixture
}
```

**Fix:**
```typescript
// ✅ Each class owns one thing
export class LoginPage     { async login() { ... } }
export class NavBar        { async logout() { ... } }
export class ResetPassPage { async resetPassword() { ... } }
// seedTestUser → tests/helpers/userHelper.ts
```

---

## O — Open/Closed Principle

> Open for extension, closed for modification.

Add new behavior by extending, not by editing existing classes. Use Playwright fixtures as extension points:

```typescript
// ✅ Extend the base test fixture — don't modify it
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('Password1!');
    await page.getByRole('button', { name: 'Log in' }).click();
    await use(page);
  }
});
```

When you need a new type of pre-authenticated user, create a new fixture rather than adding a conditional inside the existing one.

---

## L — Liskov Substitution Principle

> Subclasses must be substitutable for their base class.

If `AdminPage extends BasePage`, every method on `BasePage` must work correctly on `AdminPage` without special-casing.

**Violation:**
```typescript
// ❌ Subclass breaks base class contract
class BasePage {
  async goto(path: string) {
    await this.page.goto(path);
  }
}

class AdminPage extends BasePage {
  async goto(path: string) {
    if (!this.isAdmin) throw new Error('Not admin'); // unexpected behavior
  }
}
```

**Fix:** If behavior must differ, don't extend — compose instead:
```typescript
// ✅ Compose, don't inherit when behavior diverges
class AdminPage {
  constructor(private readonly page: Page, private readonly base: BasePage) {}
}
```

---

## I — Interface Segregation Principle

> Don't force classes to implement methods they don't use.

Split large base classes or shared objects into focused, composable pieces.

**Violation:**
```typescript
// ❌ One huge base that all pages must extend
class BasePage {
  navigate() { ... }
  handleModal() { ... }
  fillForm() { ... }
  interceptNetwork() { ... }
}
```

**Fix:**
```typescript
// ✅ Separate, composable behaviors
class NavigationHelper { navigate() { ... } }
class ModalHelper      { handleModal() { ... } }
class FormHelper       { fillForm() { ... } }

// Pages only take what they need
class CheckoutPage {
  constructor(page: Page) {
    this.modal = new ModalHelper(page);
    this.form  = new FormHelper(page);
  }
}
```

---

## D — Dependency Inversion Principle

> Depend on abstractions. Inject dependencies — don't instantiate them internally.

**Violation:**
```typescript
// ❌ Page Object creates its own dependencies
class LoginPage {
  private page: Page;
  constructor() {
    this.page = new BrowserContext().newPage(); // wrong — untestable
  }
}
```

**Fix:**
```typescript
// ✅ Dependencies are injected via constructor
class LoginPage {
  constructor(private readonly page: Page) {}
}

// In test or fixture:
const loginPage = new LoginPage(page);
```

Same applies to helpers and services — always inject, never instantiate internally.

---

## Quick Checklist

Before completing refactoring, verify:

- [ ] **S** — Each POM class covers exactly one page or component
- [ ] **S** — Each test file covers exactly one feature
- [ ] **S** — Helpers contain only one type of concern
- [ ] **O** — New behavior was added via fixtures/extension, not by editing existing classes
- [ ] **L** — Subclasses don't override methods in ways that break the base contract
- [ ] **I** — No class inherits methods it doesn't use
- [ ] **D** — `Page` is injected into every POM class via constructor
