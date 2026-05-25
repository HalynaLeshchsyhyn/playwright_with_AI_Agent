---
name: test-implementation
description: 'Create Playwright automation tests using the Playwright MCP server. Use when: "write automation tests", "automate this test", "create E2E tests", "Playwright test", "automate with Playwright", "MCP browser test", "generate test script", "automate UI test".'
argument-hint: 'Describe the feature or user flow to automate, or paste test scenarios'
---

# Playwright MCP Test Automation

## When to Use

- User has test scenarios and wants them automated with Playwright
- User asks to automate a UI flow or feature
- User wants E2E test scripts generated using the Playwright MCP server
- User wants Page Object Model classes created for a page

---

## Prerequisites

Before writing tests, verify:
- Playwright MCP server is running and connected
- Target application URL is known
- Test scenarios or acceptance criteria are available (use `test-design` skill first if not)
- Locator strategy is understood (use `locator-strategy` skill when unsure how to select an element)

---

## Procedure

### Step 1 — Explore the UI with MCP Tools

Use the Playwright MCP server to navigate and inspect the target page **before writing any code**:

1. Navigate to the target URL
2. Take a screenshot to see the current state
3. Get the page snapshot to discover selectors
4. Interact with key elements to verify they work

This ensures selectors are real and tests won't be brittle.

See [mcp-tools.md](./references/mcp-tools.md) for the full list of available MCP commands.

---

### Step 2 — Plan the Test Structure

For each scenario to automate, define:

```
Scenario:     [Name from test case]
URL:          [Starting page]
Preconditions: [Login state, test data needed]
Actions:      [User interactions to perform]
Assertions:   [What to verify — visible text, URL, element state]
```

Group related scenarios into one test file per feature/page.

---

### Step 3 — Prepare Random Test Data

Never hardcode test data values. Generate unique data per test run to avoid collisions and ensure test independence.

**Using `@faker-js/faker`** (install once: `npm install -D @faker-js/faker`):

```typescript
// helpers/testData.ts
import { faker } from '@faker-js/faker';

export const randomUser = () => ({
  firstName: faker.person.firstName(),
  lastName:  faker.person.lastName(),
  email:     faker.internet.email(),
  password:  faker.internet.password({ length: 12, memorable: false }),
});

export const randomProduct = () => ({
  name:  faker.commerce.productName(),
  price: faker.commerce.price({ min: 1, max: 500 }),
});
```

**Without a library** (built-in random helpers):

```typescript
// helpers/testData.ts
export const randomEmail = () =>
  `test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`;

export const randomString = (length = 8) =>
  Math.random().toString(36).slice(2, 2 + length);
```

**Rules:**
- Import data helpers at the top of test files — never inline hardcoded strings
- Call generators **inside each `test()` body** so every run gets fresh values
- Store generated values in a `const` at the top of the test for reuse in assertions

---

### Step 4 — Create Page Object Model (optional but recommended)

For any page used in more than one test, create a POM class:

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.emailInput    = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton  = page.getByRole('button', { name: 'Log in' });
    this.errorMessage  = page.getByRole('alert');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

> **Locators** — For every element in the Page Object, apply the `locator-strategy` skill to pick the most resilient selector.
> See [../locator-strategy/SKILL.md](../locator-strategy/SKILL.md) for the full priority guide and anti-patterns.

---

### Step 5 — Write the Test File

```typescript
// tests/[feature].spec.ts
import { test, expect } from '@playwright/test';
import { randomUser } from '../helpers/testData';

test.describe('[Feature Name]', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/path');
  });

  test('TC-[MODULE]-001 — [title]', async ({ page }) => {
    // Arrange — generate fresh random data for this run
    const user = randomUser();

    // Act
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assert
    await expect(page.getByRole('heading')).toBeVisible();
  });

});
```

**Rules:**
- One `test()` per test case ID — keep it atomic
- Use `test.describe` to group by feature
- Map test titles to TC IDs from test scenarios
- All assertions use `expect()` — never `if` statements
- Use `await` on every async action
- Use `Logger` from `helpers/logger.ts` at every meaningful point — never call `console.log()` directly:
  - `Logger.info(msg)`  — major step start (navigation, form submit, button click)
  - `Logger.debug(msg)` — low-level detail (input values, intermediate state)
  - `Logger.warn(msg)`  — unexpected but non-fatal condition (optional element missing, retry)
  - `Logger.error(msg)` — caught exception or known failure point

See [patterns.md](./references/patterns.md) for common interaction patterns and assertion examples.

---

### Step 6 — Validate with MCP

After generating the test file:
1. Run the test via MCP to verify it passes
2. If it fails, use screenshot + snapshot MCP tools to debug
3. Fix selectors or timing issues
4. Re-run to confirm green

---

### Step 7 — Save Output

| File type | Location |
|---|---|
| Test files | `tests/[feature].spec.ts` |
| Page Objects | `pages/[PageName]Page.ts` |
| Fixtures / helpers | `tests/fixtures/[name].ts` |
| Test data helpers | `helpers/testData.ts` |

---

## File Naming Convention

| What | Pattern | Example |
|---|---|---|
| Test file | `[feature].spec.ts` | `login.spec.ts` |
| Page Object | `[Page]Page.ts` | `LoginPage.ts` |
| Component Object | `[Component].ts` | `NavBar.ts` |
| Fixture | `[name].fixture.ts` | `auth.fixture.ts` |
| Test data helper | `[domain].ts` | `testData.ts` |

---

## Best Practices

- Always explore UI with MCP before writing selectors
- For every locator, follow the `locator-strategy` skill — see [../locator-strategy/SKILL.md](../locator-strategy/SKILL.md)
- One assertion per test where possible
- Never use `page.waitForTimeout()` — use `expect(...).toBeVisible()` instead
- Always use randomly generated test data — never hardcode emails, names, or passwords
- Generate data inside `test()` bodies using helpers from `helpers/testData.ts`
- Keep Page Objects free of assertions — put assertions in tests only
- Use `test.beforeEach` for repeated setup, `test.afterEach` for cleanup
- **Use `Logger` from `helpers/logger.ts`** — never call `console.log()` directly in tests

### Logger levels — when to use each

| Method | When to use |
|---|---|
| `Logger.info(msg)` | Major step starts: navigation, form submission, button click |
| `Logger.debug(msg)` | Low-level detail: generated test data values, intermediate state |
| `Logger.warn(msg)` | Unexpected but non-fatal: optional element absent, fallback path taken |
| `Logger.error(msg)` | Caught exception or known failure point inside a `catch` block |

### Logger pattern

```typescript
import { Logger } from '../helpers/logger';

test('TC-001 — login', async ({ page }) => {
  const user = randomUser();
  Logger.debug(`Test data: email=${user.email}`);

  Logger.info('Navigating to home page');
  await page.goto('/');

  Logger.info('Clicking Signup / Login');
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  try {
    await page.getByRole('heading', { name: 'Login' }).waitFor();
  } catch (e) {
    Logger.error('Login heading did not appear after navigation');
    throw e;
  }
});
```

---

## References

- [mcp-tools.md](./references/mcp-tools.md) — Available Playwright MCP commands and usage
- [patterns.md](./references/patterns.md) — Common interaction and assertion patterns

## Related Skills

- [locator-strategy](../locator-strategy/SKILL.md) — Use this skill to pick the correct, resilient locator for any web element
