---
name: test-design
description: 'Generate Test Scenarios and Test Cases from requirements, user stories, or acceptance criteria. Use when: "create test cases", "write test scenarios", "test plan", "QA coverage", "what to test", "acceptance criteria tests", "test this requirement".'
argument-hint: 'Paste your requirement, user story, or feature description'
---

# Test Design

## When to Use

- User shares a requirement or user story and wants it tested
- User asks "what should I test for this feature?"
- User needs test case documentation (Markdown, Gherkin, TestRail, CSV)
- User needs a test coverage matrix
- User wants boundary value analysis, equivalence partitioning, or decision table

---

## Procedure

### Step 1 — Analyze the Requirement

Extract from the input:
- **Main functionality** — what the feature does
- **Actors** — who uses it (roles, external systems)
- **Inputs / outputs** — data in, expected results out
- **Business rules** — constraints, validations, conditions
- **Edge cases** — boundary values, empty states, errors
- **Ambiguities** — unclear areas that affect test design

> If something is ambiguous, ask **one focused clarifying question** before proceeding.

---

### Step 2 — Define Test Scenarios

| Category | Description |
|---|---|
| **Happy Path** | Valid input, normal flow, expected success |
| **Negative** | Invalid input, unauthorized access, system errors |
| **Boundary Conditions** | Values at edges of allowed ranges |
| **Edge Cases** | Empty fields, nulls, duplicates, special characters, concurrency |
| **Non-Functional** | Performance, security, accessibility (when applicable) |

---

### Step 3 — Write Test Cases

```
ID:               TC-[MODULE]-[NNN]
Title:            Short description of what is being verified
Priority:         Critical / High / Medium / Low
Preconditions:    What must be true before running this test
Test Data:        List all inputs — mark random values with <random_*> notation
Steps:
  1. Action using <random_email>
  2. Action
Expected Result:  Exact, observable outcome
```

**Rules:** atomic (one thing per test) · specific real data · unambiguous expected result · reproducible without context

---

#### Random Test Data Notation

When writing test steps, never hardcode values that must be unique per run. Use the `<random_*>` notation to mark generated values:

| Token | Use for |
|---|---|
| `<random_email>` | Registration, login, contact forms |
| `<random_name>` | Name fields, display names |
| `<random_password>` | Password fields |
| `<random_string(N)>` | Free-text fields, search queries |
| `<random_phone>` | Phone / mobile number fields |
| `<random_address>` | Address fields |
| `<random_zip>` | Zipcode fields |

**When to use random vs fixed data:**

| Scenario type | Data approach |
|---|---|
| Happy path — unique input required (registration, new record) | `<random_*>` — ensures no collisions between runs |
| Negative — specific invalid value matters | Fixed value, e.g. `"abc"` (not a valid email) |
| Boundary — exact edge value must be tested | Fixed value, e.g. `"a"` (1 character) |
| Error message — must reference a known value | Fixed value so the assertion is deterministic |

**Example test case with random data:**

```
ID:            TC-REG-001
Title:         Register a new user with valid data
Priority:      Critical
Preconditions: User is not logged in
Test Data:
  name     = <random_name>         → e.g. "User_k9x2m"
  email    = <random_email>        → e.g. "test_1716220800_abc12@example.com"
  password = <random_password>     → e.g. "Pwd_j4n8qz1!"
Steps:
  1. Navigate to /login
  2. Enter <random_name> in the Name field
  3. Enter <random_email> in the signup Email field
  4. Click Signup
  5. Fill the registration form with remaining valid fields
  6. Click Create Account
Expected Result: "ACCOUNT CREATED!" heading is visible
```

Choose the right technique for each scenario — see [techniques.md](./references/techniques.md).

---

### Step 4 — Prioritize

| Priority | When |
|---|---|
| **Critical** | Failure blocks the entire flow |
| **High** | Frequently used; significant business impact |
| **Medium** | Secondary feature; workaround exists |
| **Low** | Edge case, cosmetic, rarely reached |

---

### Step 5 — Output

Group test cases by category:
1. Positive / Happy Path
2. Negative / Error Handling
3. Boundary Conditions
4. Edge Cases
5. Non-Functional (if applicable)

Then add a **Coverage Matrix** — see [templates.md](./references/templates.md) for the exact format.

Flag untested areas and gaps explicitly.

---

### Step 6 — Save Output

Save to `test_scenarios/TC-[MODULE]-scenarios.md` in the project root.

For Gherkin, TestRail, or CSV output, use the format templates in [templates.md](./references/templates.md).

---

## Best Practices

- Atomic — one test, one expected result
- Use `<random_*>` notation for any value that must be unique per run (emails, names, passwords)
- Use fixed values for boundary and negative tests where the exact value drives the assertion
- Precise expected results — "Error 'Email is required' appears", not "error shows"
- At least one negative test per input field or business rule
- Runnable by a new team member without asking questions
- Document all test data in the `Test Data:` block of each test case

---

## References

- [techniques.md](./references/techniques.md) — EP, BVA, Decision Table, State Transition, Error Guessing
- [templates.md](./references/templates.md) — Markdown, Gherkin, TestRail, CSV, Coverage Matrix
