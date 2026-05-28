---
name: api-testing
description: 'Write API tests using Playwright APIRequestContext. Use when: "write API tests", "test REST API", "API automation", "HTTP request test", "test endpoint", "API test suite", "validate API response", "POST/GET/PUT/DELETE test", "status code assertion", "response body assertion", "API contract test".'
argument-hint: 'Describe the API endpoint(s) to test, or paste the API spec / curl examples'
---

# API Testing with Playwright

## When to Use

- User wants to test REST API endpoints (GET, POST, PUT, PATCH, DELETE)
- User wants to validate response status codes, headers, or body
- User wants API contract tests or schema validation
- User wants to combine API setup with UI E2E tests (e.g., create data via API, then verify in UI)
- User wants authenticated API test flows (login → get token → call protected endpoint)

---

## Prerequisites

Before writing tests, verify:
- Base URL of the API is known
- Authentication method is known (Bearer token, API key, Basic auth, Cookie)
- API spec, Swagger/OpenAPI doc, or curl examples are available
- Test data strategy is defined (use `test-design` skill first if test cases are not ready)

---

## Procedure

### Step 1 — Define the Request Plan

For each endpoint to test, identify:

```
Endpoint:       [METHOD] /api/path
Auth:           [None | Bearer token | API key | Basic | Cookie]
Request body:   [JSON payload, form data, or none]
Query params:   [key=value pairs, if any]
Headers:        [Content-Type, Accept, custom headers]
Expected:       [Status code + response body fields to assert]
```

---

### Step 2 — Set Up the API Request Context

Playwright's `request` fixture gives a pre-configured `APIRequestContext`. Use it directly in tests or wrap it in a helper class.

**Direct usage in test:**

```typescript
import { test, expect } from '@playwright/test';

test('GET /users returns 200', async ({ request }) => {
  const response = await request.get('/users');
  expect(response.status()).toBe(200);
});
```

**Shared API client class (recommended for multiple endpoints):**

```typescript
// tests/api/ApiClient.ts
import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getUsers() {
    return this.request.get('/users');
  }

  async createUser(payload: { name: string; email: string }) {
    return this.request.post('/users', { data: payload });
  }

  async deleteUser(id: number) {
    return this.request.delete(`/users/${id}`);
  }
}
```

---

### Step 3 — Configure Base URL and Auth

Set the base URL in `playwright.config.ts` so it applies to all API tests:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'https://api.example.com',
  },
});
```

**Bearer token auth:**

```typescript
const response = await request.get('/protected', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

**API key in header:**

```typescript
const response = await request.get('/data', {
  headers: {
    'x-api-key': process.env.API_KEY ?? '',
  },
});
```

**Basic auth:**

```typescript
const credentials = Buffer.from('user:password').toString('base64');
const response = await request.get('/secure', {
  headers: {
    Authorization: `Basic ${credentials}`,
  },
});
```

> **Security rule:** Never hardcode credentials or tokens in test files. Use `process.env` and a `.env` file (excluded from git via `.gitignore`).

---

### Step 4 — Write the Test File

```typescript
// tests/api/users.api.spec.ts
import { test, expect } from '@playwright/test';
import { randomUser } from '../../helpers/testData';
import { Logger } from '../../helpers/logger';

test.describe('Users API', () => {

  test('TC-API-001 — GET /users returns 200 and array body', async ({ request }) => {
    Logger.info('Sending GET /users');
    const response = await request.get('/users');

    Logger.debug(`Status: ${response.status()}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('TC-API-002 — POST /users creates a new user', async ({ request }) => {
    const user = randomUser();
    Logger.debug(`Creating user: ${user.email}`);

    const response = await request.post('/users', {
      data: { name: user.firstName, email: user.email },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ email: user.email });
    expect(body.id).toBeDefined();
  });

  test('TC-API-003 — DELETE /users/:id removes the user', async ({ request }) => {
    // Arrange — create a user first via API
    const user = randomUser();
    const createRes = await request.post('/users', {
      data: { name: user.firstName, email: user.email },
    });
    const { id } = await createRes.json();

    // Act
    Logger.info(`Deleting user id=${id}`);
    const deleteRes = await request.delete(`/users/${id}`);

    // Assert
    expect(deleteRes.status()).toBe(204);
  });

  test('TC-API-004 — POST /users with missing email returns 400', async ({ request }) => {
    const response = await request.post('/users', {
      data: { name: 'No Email' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain('email');
  });

});
```

**Rules:**
- One `test()` per test case ID — keep it atomic
- Always `await` every API call
- Always read `.json()` or `.text()` from the response before asserting body content
- Use `randomUser()` / `randomAddress()` from `helpers/testData.ts` — never hardcode emails or names
- Use `Logger` from `helpers/logger.ts` — never use `console.log()`
- Store credentials in `process.env` only

---

### Step 5 — Authentication Flow Test

When an API requires login before calling protected endpoints:

```typescript
test.describe('Authenticated API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    Logger.info('Authenticating via POST /auth/login');
    const res = await request.post('/auth/login', {
      data: { email: process.env.TEST_USER_EMAIL, password: process.env.TEST_USER_PASSWORD },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    token = body.token;
    Logger.debug('Auth token received');
  });

  test('TC-API-010 — GET /profile returns user data', async ({ request }) => {
    const res = await request.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.email).toBe(process.env.TEST_USER_EMAIL);
  });
});
```

---

### Step 6 — API + UI Combined Test

Use API calls to set up or tear down state, reducing UI test complexity:

```typescript
test('TC-ECOM-020 — Product added via API is visible in UI cart', async ({ page, request }) => {
  // Arrange via API — add product to cart
  Logger.info('Adding product via API');
  await request.post('/cart/items', { data: { productId: 42, quantity: 1 } });

  // Act in UI
  Logger.info('Navigating to cart page');
  await page.goto('/cart');

  // Assert in UI
  await expect(page.getByText('Product Name')).toBeVisible();
});
```

---

### Step 7 — Save Output

| File type | Location |
|---|---|
| API test files | `tests/api/[resource].api.spec.ts` |
| API client helper | `tests/api/ApiClient.ts` |
| Shared fixtures | `tests/fixtures/api.fixture.ts` |
| Environment vars | `.env` (add to `.gitignore`) |

---

## File Naming Convention

| What | Pattern | Example |
|---|---|---|
| API test file | `[resource].api.spec.ts` | `users.api.spec.ts` |
| API client | `[Name]ApiClient.ts` or `ApiClient.ts` | `UsersApiClient.ts` |
| Auth helper | `auth.helper.ts` | `auth.helper.ts` |
| Fixture | `api.fixture.ts` | `api.fixture.ts` |

---

## Best Practices

- Always assert **both** status code and response body
- Use `toMatchObject()` for partial body match — avoids brittle full-object comparisons
- Use `process.env` for all credentials — never hardcode
- Prefer API setup over UI setup in combined E2E tests (faster, more reliable)
- Use `test.beforeAll` for expensive auth flows, `test.beforeEach` for per-test data setup
- Clean up created test data in `test.afterEach` or `test.afterAll`
- Use `Logger` from `helpers/logger.ts` for all output — never `console.log()`

---

## References

- [patterns.md](./references/patterns.md) — Common request patterns (auth, pagination, file upload, error handling)
- [assertions.md](./references/assertions.md) — Response assertion recipes

## Related Skills

- [test-design](../test-design/SKILL.md) — Generate test cases for API endpoints before automating
- [test-implementation](../test-implementation/SKILL.md) — UI E2E automation (use alongside API tests for combined flows)
