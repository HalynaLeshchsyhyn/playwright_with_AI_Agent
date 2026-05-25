# CSS Selector Patterns

Use CSS selectors only when Playwright built-in locators (`getByRole`, `getByLabel`, etc.) are not applicable.

---

## Attribute Selectors

```css
/* By name attribute */
input[name="username"]

/* By type attribute */
input[type="submit"]

/* By placeholder */
input[placeholder="Search..."]

/* By data-testid */
[data-testid="submit-button"]

/* By aria-label */
[aria-label="Close dialog"]

/* By href (links) */
a[href="/dashboard"]

/* Attribute contains value */
[class*="btn-primary"]

/* Attribute starts with */
[id^="user-"]

/* Attribute ends with */
[id$="-input"]
```

---

## Structural Selectors

```css
/* Direct child */
form > button

/* Any descendant */
.login-form input

/* Adjacent sibling */
label + input

/* General sibling */
h2 ~ p

/* First / last child */
ul li:first-child
ul li:last-child

/* Nth child (avoid when possible) */
tr:nth-child(2)
```

---

## Combining Selectors

```css
/* Tag + attribute */
button[type="submit"]

/* Class + attribute */
.form-field input[required]

/* Scoped to parent */
.modal-footer button[data-action="confirm"]
```

---

## Pseudo-Classes

```css
/* Enabled / disabled state */
button:enabled
input:disabled

/* Checked state */
input[type="checkbox"]:checked

/* Focus state */
input:focus

/* Contains text (non-standard, avoid in Playwright) */
/* Use getByText() instead */
```

---

## When to Prefer CSS Over Built-in Locators

| Situation | Recommended |
|---|---|
| Element has no visible text or role | `[data-testid="..."]` or `input[name="..."]` |
| Scoping to a specific container | `.container button[type="submit"]` |
| Filtering by state attribute | `button[aria-expanded="true"]` |
| No label or placeholder available | `input[name="email"]` |

---

## XPath — Last Resort Only

Use XPath only when CSS cannot express the condition (e.g., selecting a parent based on child content).

```xpath
// Parent containing specific child text
//div[contains(@class, 'item')][.//span[text()='Active']]

// Sibling after a label
//label[text()='Username']/following-sibling::input
```

**Avoid:** deep paths, absolute paths (`/html/body/div[1]/...`), generated class names.
