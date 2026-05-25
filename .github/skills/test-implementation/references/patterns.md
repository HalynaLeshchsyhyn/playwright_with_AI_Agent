# Common Playwright Patterns

## Interactions

### Fill and submit a form
```typescript
await page.getByLabel('Email').fill('user@test.com');
await page.getByLabel('Password').fill('secret123');
await page.getByRole('button', { name: 'Log in' }).click();
```

### Select a dropdown option
```typescript
await page.getByLabel('Country').selectOption('Ukraine');
```

### Upload a file
```typescript
await page.getByLabel('Upload').setInputFiles('path/to/file.pdf');
```

### Press a key
```typescript
await page.getByRole('textbox').press('Enter');
await page.keyboard.press('Tab');
```

### Hover and click a tooltip / dropdown
```typescript
await page.getByRole('button', { name: 'Menu' }).hover();
await page.getByRole('menuitem', { name: 'Settings' }).click();
```

### Handle a confirmation dialog
```typescript
page.once('dialog', dialog => dialog.accept());
await page.getByRole('button', { name: 'Delete' }).click();
```

---

## Assertions

### Element is visible
```typescript
await expect(page.getByRole('alert')).toBeVisible();
```

### Element has exact text
```typescript
await expect(page.getByRole('heading')).toHaveText('Welcome back');
```

### Element has value
```typescript
await expect(page.getByLabel('Email')).toHaveValue('user@test.com');
```

### URL matches
```typescript
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/order\/\d+/);
```

### Element count
```typescript
await expect(page.getByRole('listitem')).toHaveCount(5);
```

### Element is disabled / enabled
```typescript
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
```

### Element is checked (checkbox/radio)
```typescript
await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeChecked();
```

### Element is NOT visible
```typescript
await expect(page.getByRole('alert')).not.toBeVisible();
```

---

## Waiting (never use waitForTimeout)

### Wait for element to appear
```typescript
await expect(page.getByRole('status')).toBeVisible();
```

### Wait for navigation
```typescript
await Promise.all([
  page.waitForURL('/dashboard'),
  page.getByRole('button', { name: 'Log in' }).click(),
]);
```

### Wait for network request to complete
```typescript
await page.waitForResponse(resp => resp.url().includes('/api/login') && resp.status() === 200);
```

---

## Test Setup Patterns

### Shared login (beforeEach)
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@test.com');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL('/dashboard');
});
```

### Reusable auth fixture
```typescript
// tests/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@test.com');
    await page.getByLabel('Password').fill('secret123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL('/dashboard');
    await use(page);
  },
});
```

---

## Selector Cheat Sheet

| Situation | Selector |
|---|---|
| Button by label | `getByRole('button', { name: 'Submit' })` |
| Input by label | `getByLabel('Email')` |
| Any element by text | `getByText('Welcome')` |
| Element by test id | `getByTestId('submit-btn')` |
| Heading | `getByRole('heading', { name: 'Login' })` |
| Link | `getByRole('link', { name: 'Sign up' })` |
| Inside a container | `page.locator('.modal').getByRole('button', { name: 'Confirm' })` |
| nth match | `page.getByRole('listitem').nth(2)` |
