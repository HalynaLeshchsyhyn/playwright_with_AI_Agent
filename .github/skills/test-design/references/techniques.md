# Testing Techniques Reference

## 1. Equivalence Partitioning (EP)

Divide inputs into partitions where all values behave the same. Test **one representative value per partition** — valid and invalid.

**Example — Age field (18–65):**

| Partition | Value | Expected |
|---|---|---|
| Below minimum (invalid) | 17 | Rejected — "Age must be at least 18" |
| Valid range | 30 | Accepted |
| Above maximum (invalid) | 66 | Rejected — "Age must be 65 or below" |

**When to use:** Any input field with defined valid/invalid categories or ranges.

---

## 2. Boundary Value Analysis (BVA)

Test the exact edges of allowed ranges. Defects cluster at boundaries.

**Points to test:** `min−1` · `min` · `min+1` · `max−1` · `max` · `max+1`

**Example — Password length (8–20 characters):**

| Value | Length | Expected |
|---|---|---|
| `passwor` | 7 | Rejected |
| `password` | 8 | Accepted |
| `password1` | 9 | Accepted |
| `password1234567890` | 19 | Accepted |
| `password12345678901` | 20 | Accepted |
| `password123456789012` | 21 | Rejected |

**When to use:** Numeric ranges, string lengths, date ranges, quantity fields.

---

## 3. Decision Table

Map every combination of conditions to their expected outcomes.

**Example — Loan approval (employed AND credit ≥ 700 AND no defaults):**

| Employed | Credit ≥ 700 | No Defaults | Result |
|---|---|---|---|
| Yes | Yes | Yes | Approved |
| Yes | Yes | No | Rejected |
| Yes | No | Yes | Rejected |
| No | Any | Any | Rejected |

**When to use:** Business rules with multiple interdependent conditions.

---

## 4. State Transition

Model feature as states and test valid and invalid transitions between them.

**Example — Order lifecycle:**

```
[Created] --submit--> [Pending] --approve--> [Approved] --ship--> [Shipped] --deliver--> [Delivered]
                           |
                        --reject--> [Rejected]
```

**Test cases to cover:**
- Each valid transition (happy path)
- Each invalid transition (e.g., ship a Rejected order — must be blocked)
- Entry into each state
- Final states — no further transitions allowed

**When to use:** Orders, bookings, user accounts, approval workflows, subscriptions.

---

## 5. Scenario-Based / Use Case Testing

Follow a complete end-to-end user journey.

**Structure:**
- **Actor** — who performs the actions
- **Goal** — what they are trying to achieve
- **Main flow** — happy path steps
- **Alternative flows** — valid variations
- **Exception flows** — error conditions

**Example — Purchase flow:**
- Main: Browse → Add to cart → Checkout → Pay → Confirmation
- Alternative: Apply discount code during checkout
- Exception: Payment declined → retry or use different method

**When to use:** Integration testing, UAT, cross-feature flows.

---

## 6. Error Guessing

Use experience to target likely defect areas not covered by formal techniques.

**Common areas to probe:**

| Area | Examples |
|---|---|
| Empty / null inputs | Blank required fields, null API values |
| Numeric edge values | 0, −1, very large numbers |
| Special characters | `' " < > & ; -- /` (SQL/XSS injection risks) |
| String length | Extremely long values (>1000 chars) |
| Duplicate actions | Double-click submit, rapid re-submit |
| Concurrency | Two users editing the same record simultaneously |
| Session state | Expired session mid-flow, back-button after logout |
| File uploads | Wrong format, zero-byte file, oversized file |
| Network | Slow connection, timeout during transaction |

**When to use:** Always — as a supplement to every other technique.

---

## Technique Selection Guide

| Requirement Type | Primary | Supplement |
|---|---|---|
| Input field with allowed values | EP | BVA, Error Guessing |
| Numeric / length / date range | BVA | EP |
| Multiple interdependent conditions | Decision Table | Error Guessing |
| Status / lifecycle feature | State Transition | Scenario-Based |
| Full user journey | Scenario-Based | Error Guessing |
| Any feature | Error Guessing | Always apply as supplement |
