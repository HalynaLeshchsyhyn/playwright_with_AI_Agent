---
name: test-refactoring
description: 'Refactor Playwright automation tests using Page Object Model (POM) and SOLID principles. Use when: "refactor tests", "apply POM", "page object model", "extract page object", "tests are duplicated", "improve test structure", "SOLID for tests", "single responsibility test", "test code smells", "clean up tests", "restructure automation".'
argument-hint: 'Paste the test file(s) to refactor, or describe the current structure'
---

# Test Refactoring

## When to Use

- Test files contain duplicated selectors or actions
- Tests are long, hard to read, or hard to maintain
- Multiple tests access the same page without a shared abstraction
- Locators are scattered inline across test files
- A single test file does more than one thing (navigation + assertions + data setup)

---

## Procedure

### Step 1 — Audit the Existing Tests

Read the test file(s) and identify code smells:

| Smell | Description |
|---|---|
| **Duplicated locators** | Same selector appears in multiple tests or files |
| **Fat test** | One test performs setup, action, assertion, and cleanup all inline |
| **Magic strings** | Hardcoded URLs, labels, or values repeated without constants |
| **Mixed concerns** | Test logic mixed with page navigation or data preparation |
| **No POM** | All `page.locator(...)` calls live directly in `test()` bodies |
| **God Page Object** | One POM class covers an entire application instead of one page/component |

---

### Step 2 — Apply Page Object Model (POM)

Create one POM class per **page** or **reusable component**. Each class owns:
- All locators for that page (no locators in test files)
- All actions (methods that group related interactions)
- No assertions — assertions belong in tests only

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput    = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton  = page.getByRole('button', { name: 'Log in' });
    this.errorMessage  = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

> For every locator defined in a POM class, apply the `locator-strategy` skill.
> See [../locator-strategy/SKILL.md](../locator-strategy/SKILL.md) for the full priority guide.

See [pom-patterns.md](./references/pom-patterns.md) for component objects, modals, and navigation patterns.

---

### Step 3 — Apply SOLID Principles

See [solid-in-tests.md](./references/solid-in-tests.md) for full guidance. Summary:

**S — Single Responsibility**
Each class/file does one thing:
- POM class → represents one page or component
- Test file → covers one feature or user flow
- Helper → handles one concern (auth, data setup, API calls)

```typescript
// ❌ One class doing everything
class AppPage {
  login() { ... }
  addProduct() { ... }
  checkout() { ... }
  sendEmail() { ... }
}

// ✅ Separate classes per responsibility
class LoginPage { login() { ... } }
class ProductPage { addProduct() { ... } }
class CheckoutPage { checkout() { ... } }
```

**O — Open/Closed**
Extend behavior without modifying existing classes. Use fixtures or base classes:

```typescript
// Base fixture — extend, don't modify
const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  }
});
```

**L — Liskov Substitution**
Subclasses must be substitutable for their base. If `AdminPage extends BasePage`, every method on `BasePage` must work correctly on `AdminPage`.

**I — Interface Segregation**
Don't force POM classes to implement methods they don't use. Split large base classes into focused ones:

```typescript
// ❌ Fat base with unrelated methods
class BasePage {
  navigate() { ... }
  fillForm() { ... }
  handleModal() { ... }
}

// ✅ Composable, focused pieces
class NavigationMixin { navigate() { ... } }
class ModalHandler   { handleModal() { ... } }
```

**D — Dependency Inversion**
Depend on abstractions, not concretions. Inject `Page` via constructor — never instantiate it inside a POM class:

```typescript
// ❌ POM creates its own Page (untestable)
class LoginPage {
  private page = new Page(); // wrong
}

// ✅ Page is injected
class LoginPage {
  constructor(private readonly page: Page) {}
}
```

---

### Step 4 — Restructure Files

Apply this folder structure after refactoring:

```
tests/
├── features/
│   ├── login.spec.ts
│   ├── checkout.spec.ts
│   └── product.spec.ts
├── pages/
│   ├── LoginPage.ts
│   ├── CheckoutPage.ts
│   └── components/
│       ├── NavBar.ts
│       └── Modal.ts
├── fixtures/
│   └── auth.fixture.ts
└── helpers/
    └── testData.ts
```

---

### Step 5 — Verify After Refactoring

Before finishing, confirm:
- [ ] No locators remain inline in test files — all moved to POM classes
- [ ] Each POM class covers exactly one page or component
- [ ] No assertions inside POM methods
- [ ] All locators follow `locator-strategy` priority
- [ ] Tests still pass after refactoring
- [ ] Each test file focuses on one feature

---

## Best Practices

- POM = **no assertions, no test logic** — only locators and actions
- One POM class per page or component, not per test
- Inject `Page` via constructor — never create it inside a class
- Use `private readonly` for locators — they are internal implementation detail
- Extract shared setup into Playwright fixtures, not `beforeEach` copy-paste
- Keep test titles mapped to TC IDs from `test-design` scenarios

---

## Related Skills

- [locator-strategy](../locator-strategy/SKILL.md) — Pick the correct locator for every element in POM classes
- [test-implementation](../test-implementation/SKILL.md) — Write new tests following the refactored structure

---

## References

- [pom-patterns.md](./references/pom-patterns.md) — Component objects, modals, navigation, fixtures
- [solid-in-tests.md](./references/solid-in-tests.md) — Full SOLID guide with test automation examples
