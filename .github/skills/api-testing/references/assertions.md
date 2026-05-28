# API Response Assertion Recipes

## Status Code Assertions

```typescript
// Exact status
expect(response.status()).toBe(200);
expect(response.status()).toBe(201);
expect(response.status()).toBe(204);
expect(response.status()).toBe(400);
expect(response.status()).toBe(401);
expect(response.status()).toBe(403);
expect(response.status()).toBe(404);
expect(response.status()).toBe(409);
expect(response.status()).toBe(422);
expect(response.status()).toBe(500);

// Any success (2xx)
expect(response.ok()).toBeTruthy();

// Not an error
expect(response.status()).toBeLessThan(400);
```

---

## Response Body — JSON

```typescript
const body = await response.json();

// Field exists
expect(body.id).toBeDefined();

// Exact field value
expect(body.email).toBe('user@example.com');
expect(body.status).toBe('active');

// Partial match (recommended — avoids brittle full-object comparison)
expect(body).toMatchObject({
  email: 'user@example.com',
  role: 'admin',
});

// Array body
expect(Array.isArray(body)).toBeTruthy();
expect(body.length).toBeGreaterThan(0);

// Array contains an object matching a shape
expect(body).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ id: 1, name: 'Alice' }),
  ])
);

// Nested fields
expect(body.address.city).toBe('Kyiv');
expect(body.permissions).toContain('read');

// Numeric range
expect(body.price).toBeGreaterThan(0);
expect(body.score).toBeLessThanOrEqual(100);

// String pattern
expect(body.email).toMatch(/@example\.com$/);
expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}/); // ISO date

// Null / undefined
expect(body.deletedAt).toBeNull();
expect(body.optionalField).toBeUndefined();
```

---

## Response Headers

```typescript
// Content-Type
expect(response.headers()['content-type']).toContain('application/json');

// Cache-Control
expect(response.headers()['cache-control']).toBe('no-store');

// Custom header exists
expect(response.headers()['x-request-id']).toBeDefined();

// Location header on 201 Created
expect(response.headers()['location']).toMatch(/\/users\/\d+/);
```

---

## Response Body — Text / HTML

```typescript
const text = await response.text();
expect(text).toContain('OK');
expect(text).not.toContain('error');
```

---

## Response Timing

```typescript
// Ensure response is fast enough (ms)
const start = Date.now();
const response = await request.get('/fast-endpoint');
const elapsed = Date.now() - start;
expect(elapsed).toBeLessThan(2000); // under 2 seconds
```

---

## Schema Validation (without external library)

```typescript
function assertUserSchema(body: Record<string, unknown>) {
  expect(typeof body.id).toBe('number');
  expect(typeof body.email).toBe('string');
  expect(typeof body.name).toBe('string');
  expect(['active', 'inactive']).toContain(body.status);
}

const body = await response.json();
assertUserSchema(body);
```

---

## Schema Validation (with Zod)

Install: `npm install -D zod`

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id:        z.number(),
  email:     z.string().email(),
  name:      z.string().min(1),
  status:    z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
});

const body = await response.json();
const parsed = UserSchema.safeParse(body);
expect(parsed.success).toBeTruthy();
```

---

## Negative Assertions

```typescript
// Status is not a success
expect(response.ok()).toBeFalsy();

// Body does not contain a field
expect(body.password).toBeUndefined();

// Body message mentions the failing field
expect(body.message).toContain('email');
expect(body.errors).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ field: 'email' }),
  ])
);
```

---

## Assertion Selection Guide

| What to verify | Assertion |
|---|---|
| Status is exactly N | `expect(response.status()).toBe(N)` |
| Any 2xx success | `expect(response.ok()).toBeTruthy()` |
| Body field equals value | `expect(body.field).toBe(value)` |
| Body contains subset of fields | `expect(body).toMatchObject({ ... })` |
| Body array contains an item | `expect(body).toEqual(expect.arrayContaining([...]))` |
| Field is present | `expect(body.field).toBeDefined()` |
| Field matches pattern | `expect(body.field).toMatch(/regex/)` |
| Numeric range | `expect(body.count).toBeGreaterThan(0)` |
| Content-Type header | `expect(response.headers()['content-type']).toContain('application/json')` |
| Response time | `expect(elapsed).toBeLessThan(2000)` |
| Schema shape | Use `toMatchObject` or Zod `safeParse` |
