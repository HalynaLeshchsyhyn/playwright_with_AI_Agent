# API Testing Patterns

## 1. GET — Fetch a Resource

```typescript
const response = await request.get('/products/1');
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.id).toBe(1);
```

---

## 2. POST — Create a Resource

```typescript
const response = await request.post('/products', {
  data: {
    name: 'Test Product',
    price: 29.99,
    category: 'electronics',
  },
});
expect(response.status()).toBe(201);
const body = await response.json();
expect(body.id).toBeDefined();
```

---

## 3. PUT — Full Update

```typescript
const response = await request.put('/products/1', {
  data: { name: 'Updated Name', price: 49.99, category: 'electronics' },
});
expect(response.status()).toBe(200);
```

---

## 4. PATCH — Partial Update

```typescript
const response = await request.patch('/products/1', {
  data: { price: 39.99 },
});
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.price).toBe(39.99);
```

---

## 5. DELETE — Remove a Resource

```typescript
const response = await request.delete('/products/1');
expect(response.status()).toBe(204);
```

---

## 6. Query Parameters

```typescript
const response = await request.get('/products', {
  params: {
    category: 'electronics',
    page: 1,
    limit: 10,
  },
});
expect(response.status()).toBe(200);
```

---

## 7. Custom Headers

```typescript
const response = await request.get('/data', {
  headers: {
    'Accept': 'application/json',
    'x-api-key': process.env.API_KEY ?? '',
    'x-request-id': crypto.randomUUID(),
  },
});
```

---

## 8. Bearer Token Auth

```typescript
// Obtain token first
const loginRes = await request.post('/auth/login', {
  data: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD },
});
const { token } = await loginRes.json();

// Use token on subsequent calls
const response = await request.get('/me', {
  headers: { Authorization: `Bearer ${token}` },
});
expect(response.status()).toBe(200);
```

---

## 9. Cookie-Based Auth

```typescript
// Login — cookies are stored automatically in the request context
await request.post('/auth/login', {
  data: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD },
});

// Subsequent requests reuse the session cookie
const response = await request.get('/dashboard');
expect(response.status()).toBe(200);
```

---

## 10. Form Data (application/x-www-form-urlencoded)

```typescript
const response = await request.post('/auth/token', {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  form: {
    grant_type: 'password',
    username: process.env.TEST_EMAIL ?? '',
    password: process.env.TEST_PASSWORD ?? '',
  },
});
expect(response.status()).toBe(200);
```

---

## 11. Multipart File Upload

```typescript
const response = await request.post('/upload', {
  multipart: {
    file: {
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-content'),
    },
    description: 'Test upload',
  },
});
expect(response.status()).toBe(200);
```

---

## 12. Pagination — Iterate All Pages

```typescript
let page = 1;
let allItems: unknown[] = [];

while (true) {
  const res = await request.get('/items', { params: { page, limit: 50 } });
  const body = await res.json();
  allItems = allItems.concat(body.items);
  if (!body.hasNextPage) break;
  page++;
}
```

---

## 13. Retry on Transient Errors

```typescript
async function requestWithRetry(
  fn: () => Promise<import('@playwright/test').APIResponse>,
  retries = 3,
): Promise<import('@playwright/test').APIResponse> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fn();
    if (res.status() < 500) return res;
    if (attempt < retries) await new Promise(r => setTimeout(r, 500 * attempt));
  }
  throw new Error('Max retries exceeded');
}

// Usage
const response = await requestWithRetry(() => request.get('/flaky-endpoint'));
```

---

## 14. Create-Then-Cleanup Pattern

```typescript
let createdId: number;

test.beforeEach(async ({ request }) => {
  const res = await request.post('/users', {
    data: { name: 'Temp User', email: `temp_${Date.now()}@test.com` },
  });
  const body = await res.json();
  createdId = body.id;
});

test.afterEach(async ({ request }) => {
  if (createdId) {
    await request.delete(`/users/${createdId}`);
  }
});
```

---

## 15. Reusable API Fixture

```typescript
// tests/fixtures/api.fixture.ts
import { test as base } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';

type ApiFixtures = { apiClient: ApiClient };

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },
});

export { expect } from '@playwright/test';
```

Usage in tests:
```typescript
import { test, expect } from '../fixtures/api.fixture';

test('uses apiClient fixture', async ({ apiClient }) => {
  const res = await apiClient.getUsers();
  expect(res.status()).toBe(200);
});
```

---

## 16. Error Response Patterns

```typescript
// 400 Bad Request
test('missing required field returns 400', async ({ request }) => {
  const res = await request.post('/users', { data: {} });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.message).toBeDefined();
});

// 401 Unauthorized
test('no auth token returns 401', async ({ request }) => {
  const res = await request.get('/protected');
  expect(res.status()).toBe(401);
});

// 403 Forbidden
test('wrong role returns 403', async ({ request }) => {
  const res = await request.get('/admin', {
    headers: { Authorization: `Bearer ${readonlyUserToken}` },
  });
  expect(res.status()).toBe(403);
});

// 404 Not Found
test('non-existent resource returns 404', async ({ request }) => {
  const res = await request.get('/users/99999999');
  expect(res.status()).toBe(404);
});
```
