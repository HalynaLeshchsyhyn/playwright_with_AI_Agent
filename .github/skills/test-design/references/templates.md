# Output Templates

## 1. Markdown Test Case (default)

```markdown
## TC-[MODULE]-001 — [Title]

| Field | Value |
|---|---|
| **ID** | TC-[MODULE]-001 |
| **Title** | Short description of what is being verified |
| **Priority** | Critical / High / Medium / Low |
| **Preconditions** | What must be true before running this test |

**Steps:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
Exact, observable outcome that can be verified.
```

---

## 2. Gherkin (BDD)

```gherkin
Feature: [Feature Name]

  Background:
    Given [shared precondition applicable to all scenarios]

  Scenario: [Happy path title]
    Given [initial state]
    When [action taken]
    Then [expected outcome]

  Scenario: [Negative scenario title]
    Given [initial state]
    When [invalid action or input]
    Then [expected error outcome]

  Scenario Outline: [Data-driven scenario title]
    Given [initial state]
    When the user enters "<input>"
    Then the system shows "<result>"

    Examples:
      | input    | result               |
      | valid    | success message      |
      | invalid  | error message        |
      | empty    | validation message   |
```

---

## 3. TestRail-Compatible (tab-separated)

For import into TestRail or Zephyr.

```
ID	Title	Priority	Preconditions	Steps	Expected Result
TC-AUTH-001	Valid login	High	User account exists; not logged in	1. Go to /login\n2. Enter valid email\n3. Enter valid password\n4. Click Login	Redirected to dashboard. Session cookie set.
TC-AUTH-002	Login — wrong password	High	User account exists	1. Go to /login\n2. Enter valid email\n3. Enter wrong password\n4. Click Login	Error shown: "Invalid email or password". User stays on /login.
```

---

## 4. CSV

For import into Excel or Google Sheets.

```
ID,Title,Priority,Preconditions,Steps,Expected Result
TC-AUTH-001,Valid login,High,User account exists; not logged in,"1. Go to /login; 2. Enter valid email; 3. Enter valid password; 4. Click Login",Redirected to dashboard
TC-AUTH-002,Login — wrong password,High,User account exists,"1. Go to /login; 2. Enter valid email; 3. Enter wrong password; 4. Click Login","Error: Invalid email or password"
```

---

## 5. Coverage Matrix

```markdown
## Test Coverage Matrix — [Feature Name]

| Requirement Area       | Test Case IDs          | Coverage       |
|------------------------|------------------------|----------------|
| [Happy path area]      | TC-XXX-001, TC-XXX-002 | ✅ Full        |
| [Negative area]        | TC-XXX-003             | ✅ Full        |
| [Boundary area]        | TC-XXX-004, TC-XXX-005 | ⚠️ Partial     |
| [Untested area]        | —                      | ❌ Not covered |

### Gaps

- **[Untested area]**: Not covered — [reason, e.g., environment unavailable]
- **[Boundary area]**: Partial — missing negative boundary test for [X]
```

---

## Format Selection Guide

| Use Case | Format |
|---|---|
| Internal team documentation | Markdown |
| BDD / story-based development | Gherkin |
| Import into TestRail / Zephyr | TestRail tab-separated |
| Import into Excel / Google Sheets | CSV |
| Stakeholder review | Markdown + Coverage Matrix |
