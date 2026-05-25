# Playwright MCP Server — Available Tools

The Playwright MCP server exposes browser automation tools that can be called directly during test creation and debugging.

---

## Navigation

| Tool | What it does |
|---|---|
| `browser_navigate` | Navigate to a URL |
| `browser_navigate_back` | Go back in browser history |
| `browser_tabs` | List open tabs |

**Usage:**
```
browser_navigate: { url: "https://example.com/login" }
```

---

## Inspection

| Tool | What it does |
|---|---|
| `browser_snapshot` | Get accessibility tree of the current page — use to discover selectors |
| `browser_take_screenshot` | Capture the current page as an image |
| `browser_console_messages` | Read browser console output (errors, logs) |
| `browser_network_requests` | Inspect network requests made by the page |

**Use snapshot before writing any selectors.** It shows all roles, labels, and text — the exact inputs for `getByRole`, `getByLabel`, `getByText`.

---

## Interaction

| Tool | What it does |
|---|---|
| `browser_click` | Click an element |
| `browser_type` | Type text into a focused element |
| `browser_fill_form` | Fill multiple form fields at once |
| `browser_select_option` | Select a dropdown option |
| `browser_hover` | Hover over an element |
| `browser_drag` | Drag an element to a target |
| `browser_press_key` | Press a keyboard key (e.g. Enter, Tab, Escape) |
| `browser_file_upload` | Upload a file to an input |
| `browser_handle_dialog` | Accept or dismiss a browser dialog |

---

## State & Waiting

| Tool | What it does |
|---|---|
| `browser_wait_for` | Wait for a condition (element visible, URL change, network idle) |
| `browser_evaluate` | Run JavaScript in the page context |
| `browser_resize` | Resize the browser viewport |

---

## Recommended Workflow for Selector Discovery

1. `browser_navigate` → go to target page
2. `browser_take_screenshot` → see what's on screen
3. `browser_snapshot` → get the accessibility tree
4. Use role/label/text from snapshot in Playwright selectors
5. `browser_click` / `browser_fill_form` → test interactions manually
6. Write the test file based on confirmed interactions

---

## Common MCP Patterns

### Login before test
```
browser_navigate: { url: "/login" }
browser_fill_form: { fields: { "Email": "user@test.com", "Password": "secret123" } }
browser_click: { selector: "button[name='Log in']" }
browser_wait_for: { condition: "url contains /dashboard" }
```

### Verify error message
```
browser_fill_form: { fields: { "Email": "", "Password": "" } }
browser_click: { selector: "button[type='submit']" }
browser_snapshot  → find the error alert role/text
```

### Debug a failing test
```
browser_take_screenshot   → see current state
browser_console_messages  → check for JS errors
browser_snapshot          → verify element exists in DOM
```
