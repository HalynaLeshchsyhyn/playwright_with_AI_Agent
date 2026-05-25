---
name: locator-strategy
description: 'Write correct, resilient locators for web elements in Playwright. Use when: "find locator", "write selector", "get element", "locator for button", "how to select element", "CSS selector", "XPath", "getByRole", "getByTestId", "element not found", "flaky selector", "best locator for".'
argument-hint: 'Describe the element (e.g. "Submit button in login form") or paste the HTML snippet'
---

# Locator Strategy

## When to Use

- Need a locator for a specific web element
- Existing locator is flaky or breaks after UI changes
- Choosing between CSS, XPath, or Playwright built-in locators
- Reviewing locators for resilience and maintainability

---

## Locator Priority (best → worst)

Always prefer locators in this order:

| Priority | Method | Why |
|---|---|---|
| **1 — Best** | `getByRole()` | Matches semantic meaning; ARIA-based; accessible |
| **2** | `getByLabel()` | Tied to form label; stable across UI changes |
| **3** | `getByPlaceholder()` | Good for inputs without labels |
| **4** | `getByText()` | Use for buttons/links with visible text |
| **5** | `getByTestId()` | Requires `data-testid` attribute; explicit test contract |
| **6** | CSS selector | Use only when above are unavailable |
| **7 — Last resort** | XPath | Brittle; use only when CSS is insufficient |

---

## Procedure

### Step 1 — Inspect the Element

Ask for or analyze the HTML of the target element. Extract:
- Tag name (`button`, `input`, `a`, `div`, etc.)
- Visible text or label
- ARIA role or `aria-label`
- `data-testid`, `id`, `name`, or `class` attributes
- Position in the DOM (parent context if needed)

---

### Step 2 — Choose the Best Locator

**Has a semantic role + accessible name?** → Use `getByRole()`

```ts
page.getByRole('button', { name: 'Submit' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('link', { name: 'Sign in' })
page.getByRole('checkbox', { name: 'Remember me' })
```

**Has an associated `<label>`?** → Use `getByLabel()`

```ts
page.getByLabel('Password')
page.getByLabel('Date of birth')
```

**Has a placeholder?** → Use `getByPlaceholder()`

```ts
page.getByPlaceholder('Enter your email')
```

**Clickable with visible text?** → Use `getByText()`

```ts
page.getByText('Forgot password?')
page.getByText('Continue', { exact: true })
```

**Has `data-testid`?** → Use `getByTestId()`

```ts
page.getByTestId('login-submit-btn')
```

**None of the above?** → Use CSS (see [./references/css-selectors.md](./references/css-selectors.md))

```ts
page.locator('input[name="username"]')
page.locator('.login-form button[type="submit"]')
```

---

### Step 3 — Validate Resilience

Check the locator against these failure points:

| Risk | Bad example | Fix |
|---|---|---|
| Tied to position | `nth-child(3)` | Use role/text/testid instead |
| Tied to CSS class | `.btn-primary-v2` | Classes change with redesigns |
| Tied to generated ID | `#input-47` | Dynamic IDs break between runs |
| Too broad | `page.locator('button')` | Scope to parent or add name filter |
| Text case sensitive | `getByText('SUBMIT')` | Use `{ exact: false }` or match exact casing |

A good locator:
- Survives text changes → use testId or role
- Survives CSS refactors → avoid class-based selectors
- Survives DOM restructuring → avoid `nth-child`, deep XPath
- Is readable by humans → `getByRole('button', { name: 'Login' })` is self-documenting

---

### Step 4 — Scope When Needed

When multiple matching elements exist, scope to a parent:

```ts
// Scope to a specific form
const loginForm = page.locator('form#login')
loginForm.getByRole('button', { name: 'Submit' })

// Scope using .filter()
page.getByRole('listitem').filter({ hasText: 'Product A' }).getByRole('button', { name: 'Add to cart' })
```

---

### Step 5 — Output

Provide:
1. The recommended locator with explanation
2. Alternative locator (if HTML doesn't support first choice)
3. Note if `data-testid` should be added to the HTML for long-term stability

---

## Anti-Patterns to Avoid

```ts
// ❌ Fragile — tied to position
page.locator('div > ul > li:nth-child(2) > a')

// ❌ Fragile — generated class
page.locator('.css-1ab2cd3')

// ❌ Too broad
page.locator('button').click()

// ❌ XPath when CSS/role works
page.locator('//div[@class="form"]//button[text()="Login"]')

// ✅ Correct
page.getByRole('button', { name: 'Login' })
```

---

## References

- [css-selectors.md](./references/css-selectors.md) — CSS selector patterns and examples
