# TC-REG — New User Signup! Test Cases

**Site:** https://automationexercise.com  
**Feature:** New User Signup! — two-step flow: Signup form on `/login` → Registration form on `/signup`  
**Module:** REG

---

## Feature Analysis

| Item | Detail |
|---|---|
| **Actor** | Anonymous (not logged in) user |
| **Step 1 — Signup form** | On `/login`: Name + Email Address inputs → "Signup" button |
| **Step 2 — Registration form** | On `/signup`: Title radio, Name (editable), Email **(disabled)**, Password, Date of Birth, address fields → "Create Account" button |
| **Required — Step 1** | Name, Email Address |
| **Required — Step 2** | Password, First name, Last name, Address, State, City, Zipcode, Mobile Number |
| **Optional — Step 2** | Company, Address 2, newsletter checkbox, special offers checkbox |
| **Validation — Step 1** | HTML5 browser native: empty fields and invalid email format |
| **Validation — Step 2** | HTML5 browser native for empty fields; server-side for duplicate email |
| **Success outcome** | `/account_created` shows "ACCOUNT CREATED!" heading; after Continue → nav shows "Logged in as \<name\>" |

---

## 1. Positive / Happy Path

### TC-REG-001 — Register successfully with all required fields

```
ID:               TC-REG-001
Title:            New user completes both signup steps and sees Account Created confirmation
Priority:         Critical
Preconditions:    User is not logged in; email address has never been registered before
Test Data:
  name          = <random_name>      → e.g. "User_k9x2m"
  email         = <random_email>     → e.g. "test_1716220800_abc12@example.com"
  password      = <random_password>  → e.g. "Pwd_j4n8qz1!"
  first_name    = <random_name>
  last_name     = <random_name>
  address       = <random_address>
  country       = "United States"    (fixed — dropdown)
  state         = <random_string(6)>
  city          = <random_string(6)>
  zipcode       = <random_zip>
  mobile_number = <random_phone>

Steps:
  1.  Navigate to https://automationexercise.com/login
  2.  Verify "New User Signup!" heading is visible
  3.  Enter <random_name> in the "Name" field
  4.  Enter <random_email> in the signup "Email Address" field
  5.  Click the "Signup" button
  6.  Verify URL changes to /signup and "ENTER ACCOUNT INFORMATION" heading is visible
  7.  Select "Mr." title radio button
  8.  Enter <random_password> in the "Password" field
  9.  Select day "15", month "June", year "1990" from the Date of Birth dropdowns
  10. Enter <random_name> in "First name" and <random_name> in "Last name"
  11. Enter <random_address> in the "Address" field
  12. Select "United States" from the "Country" dropdown
  13. Enter <random_string(6)> in "State" and <random_string(6)> in "City"
  14. Enter <random_zip> in "Zipcode" and <random_phone> in "Mobile Number"
  15. Click the "Create Account" button
  16. Verify URL is /account_created and "ACCOUNT CREATED!" heading is visible
  17. Click the "Continue" button
  18. Verify navigation bar shows "Logged in as <random_name>"

Expected Result:
  - Step 6:  Page navigates to /signup; "ENTER ACCOUNT INFORMATION" heading is visible
  - Step 16: "ACCOUNT CREATED!" heading is visible on the /account_created page
  - Step 18: User is authenticated; nav bar displays "Logged in as <random_name>"
```

---

### TC-REG-002 — Register successfully with optional fields left blank

```
ID:               TC-REG-002
Title:            Registration completes when Company and Address 2 are left empty
Priority:         High
Preconditions:    User is not logged in; fresh email
Test Data:
  name          = <random_name>
  email         = <random_email>
  password      = <random_password>
  first_name    = <random_name>
  last_name     = <random_name>
  address       = <random_address>
  state         = <random_string(6)>
  city          = <random_string(6)>
  zipcode       = <random_zip>
  mobile_number = <random_phone>
  company       = ""   (intentionally blank — optional field)
  address2      = ""   (intentionally blank — optional field)

Steps:
  1. Navigate to /login; fill Name + Email; click Signup
  2. On /signup, fill all required fields; leave "Company" and "Address 2" blank
  3. Click "Create Account"

Expected Result: "ACCOUNT CREATED!" heading is visible; no validation error is shown
```

---

## 2. Negative / Error Handling

### TC-REG-003 — Signup with empty Name field

```
ID:               TC-REG-003
Title:            Signup form does not submit when Name is empty
Priority:         High
Preconditions:    User is not logged in; on /login page
Test Data:
  name  = ""                             (empty)
  email = "test_neg_name@example.com"    (fixed — form won't submit so uniqueness irrelevant)

Steps:
  1. Navigate to /login
  2. Leave the "Name" field in the Signup section empty
  3. Enter "test_neg_name@example.com" in the signup "Email Address" field
  4. Click the "Signup" button

Expected Result:
  - Browser validation tooltip appears on the "Name" field:
    "Please fill in this field."
  - Form does NOT submit; URL remains /login
```

---

### TC-REG-004 — Signup with empty Email field

```
ID:               TC-REG-004
Title:            Signup form does not submit when Email is empty
Priority:         High
Preconditions:    User is not logged in; on /login page
Test Data:
  name  = "TestUser"   (fixed)
  email = ""           (empty)

Steps:
  1. Navigate to /login
  2. Enter "TestUser" in the "Name" field of the Signup section
  3. Leave the signup "Email Address" field empty
  4. Click the "Signup" button

Expected Result:
  - Browser validation tooltip appears on the "Email Address" field:
    "Please fill in this field."
  - Form does NOT submit; URL remains /login
```

---

### TC-REG-005 — Signup with invalid email format (no @)

```
ID:               TC-REG-005
Title:            Signup form rejects an email address that is missing the @ symbol
Priority:         High
Preconditions:    User is not logged in; on /login page
Test Data:
  name  = "TestUser"    (fixed)
  email = "bademail"    (fixed — no @ symbol)

Steps:
  1. Navigate to /login
  2. Enter "TestUser" in the "Name" field
  3. Enter "bademail" in the signup "Email Address" field
  4. Click the "Signup" button

Expected Result:
  - Browser validation tooltip on "Email Address":
    "Please include an '@' in the email address. 'bademail' is missing an '@'."
  - Form does NOT submit; URL remains /login
```

---

### TC-REG-006 — Signup with an already-registered email

```
ID:               TC-REG-006
Title:            Registration fails with a server error when the email is already in use
Priority:         Critical
Preconditions:
  - User is not logged in
  - An account with email "fresh_test_check@example.com" already exists in the system
Test Data:
  name  = <random_name>                     (random — irrelevant, server rejects on email)
  email = "fresh_test_check@example.com"    (fixed — known-existing account)

Steps:
  1. Navigate to /login
  2. Enter <random_name> in the "Name" field
  3. Enter "fresh_test_check@example.com" in the signup "Email Address" field
  4. Click the "Signup" button
  5. Wait for the page to load

Expected Result:
  - Page navigates to /signup
  - Error message "Email Address already exist!" is displayed in red text
  - Account information form is NOT presented; user cannot proceed with this email
```

---

### TC-REG-007 — Submit registration form with Password empty

```
ID:               TC-REG-007
Title:            Registration form does not submit when Password is empty
Priority:         High
Preconditions:    User has completed Step 1 with a valid name and fresh email; is on /signup
Test Data:
  (Step 1 prereq)
  name     = <random_name>
  email    = <random_email>
  password = ""   (empty)

Steps:
  1. Navigate to /login; enter <random_name> + <random_email>; click Signup
  2. On /signup, leave the "Password" field empty
  3. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "Password": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

### TC-REG-008 — Submit registration form with First name empty

```
ID:               TC-REG-008
Title:            Registration form does not submit when First name is empty
Priority:         High
Preconditions:    User is on /signup (Step 1 completed)
Test Data:
  password   = <random_password>
  first_name = ""   (empty)

Steps:
  1. Navigate to /login; complete Step 1; arrive at /signup
  2. Fill "Password" with <random_password>
  3. Leave "First name" blank; fill all other required fields with valid values
  4. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "First name": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

### TC-REG-009 — Submit registration form with Last name empty

```
ID:               TC-REG-009
Title:            Registration form does not submit when Last name is empty
Priority:         High
Preconditions:    User is on /signup
Test Data:
  last_name = ""   (empty)

Steps:
  1. Complete Step 1 to reach /signup
  2. Fill all required fields; leave "Last name" blank
  3. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "Last name": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

### TC-REG-010 — Submit registration form with Address empty

```
ID:               TC-REG-010
Title:            Registration form does not submit when Address is empty
Priority:         High
Preconditions:    User is on /signup
Test Data:
  address = ""   (empty)

Steps:
  1. Complete Step 1 to reach /signup
  2. Fill all required fields; leave "Address" blank
  3. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "Address": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

### TC-REG-011 — Submit registration form with State empty

```
ID:               TC-REG-011
Title:            Registration form does not submit when State is empty
Priority:         Medium
Preconditions:    User is on /signup
Test Data:
  state = ""   (empty)

Steps:
  1. Complete Step 1 to reach /signup
  2. Fill all required fields; leave "State" blank
  3. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "State": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

### TC-REG-012 — Submit registration form with City empty

```
ID:               TC-REG-012
Title:            Registration form does not submit when City is empty
Priority:         Medium
Preconditions:    User is on /signup
Test Data:
  city = ""   (empty)

Steps:
  1. Complete Step 1 to reach /signup
  2. Fill all required fields; leave "City" blank
  3. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "City": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

### TC-REG-013 — Submit registration form with Zipcode empty

```
ID:               TC-REG-013
Title:            Registration form does not submit when Zipcode is empty
Priority:         Medium
Preconditions:    User is on /signup
Test Data:
  zipcode = ""   (empty)

Steps:
  1. Complete Step 1 to reach /signup
  2. Fill all required fields; leave "Zipcode" blank
  3. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "Zipcode": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

### TC-REG-014 — Submit registration form with Mobile Number empty

```
ID:               TC-REG-014
Title:            Registration form does not submit when Mobile Number is empty
Priority:         Medium
Preconditions:    User is on /signup
Test Data:
  mobile_number = ""   (empty)

Steps:
  1. Complete Step 1 to reach /signup
  2. Fill all required fields; leave "Mobile Number" blank
  3. Click "Create Account"

Expected Result:
  - Browser validation tooltip on "Mobile Number": "Please fill in this field."
  - Form does NOT submit; URL remains /signup
```

---

## 3. Boundary Conditions

### TC-REG-015 — Password with 1 character is accepted

```
ID:               TC-REG-015
Title:            Registration succeeds with a single-character password — no minimum length enforced
Priority:         Low
Preconditions:    User is on /signup with a fresh email from Step 1
Test Data:
  password = "a"   (fixed — 1 character, absolute minimum)

Steps:
  1. Complete Step 1 to reach /signup
  2. Enter "a" in the "Password" field
  3. Fill all other required fields with valid values
  4. Click "Create Account"

Expected Result:
  - Registration completes; "ACCOUNT CREATED!" heading is visible
  - No minimum-length or complexity error is shown
  - Note: this is a security gap — password strength is not enforced
```

---

### TC-REG-016 — Name with 1 character is accepted in signup form

```
ID:               TC-REG-016
Title:            Signup form accepts a single-character name
Priority:         Low
Preconditions:    User is not logged in; on /login page
Test Data:
  name  = "A"           (fixed — 1 character)
  email = <random_email>

Steps:
  1. Navigate to /login
  2. Enter "A" in the "Name" field of the Signup section
  3. Enter <random_email> in the "Email Address" field
  4. Click the "Signup" button

Expected Result:
  - Form submits without error
  - Page navigates to /signup and "ENTER ACCOUNT INFORMATION" heading is visible
  - The Name field on the registration form shows "A"
```

---

## 4. Edge Cases

### TC-REG-017 — Email field on /signup is disabled

```
ID:               TC-REG-017
Title:            Email field on the registration form is disabled and pre-filled from Step 1
Priority:         Medium
Preconditions:    User has completed Step 1 and is on /signup
Test Data:
  email_step1 = <random_email>   (entered in Step 1 Signup form)

Steps:
  1. Navigate to /login; enter <random_name> and <random_email>; click Signup
  2. Observe the "Email" field on the /signup registration form
  3. Attempt to interact with (click and type into) the Email field

Expected Result:
  - The Email field has the `disabled` attribute — it cannot be edited
  - The field displays the exact email entered in Step 1
  - Any attempt to type is ignored; field value does not change
```

---

### TC-REG-018 — Name field accepts special characters

```
ID:               TC-REG-018
Title:            Signup form accepts a name with special characters (apostrophe, hyphen, umlaut)
Priority:         Low
Preconditions:    User is not logged in; on /login page
Test Data:
  name  = "O'Brien-Müller"   (fixed — apostrophe, hyphen, non-ASCII umlaut)
  email = <random_email>

Steps:
  1. Navigate to /login
  2. Enter "O'Brien-Müller" in the "Name" field
  3. Enter <random_email> in the "Email Address" field
  4. Click the "Signup" button

Expected Result:
  - Signup form accepts the value without error
  - Page navigates to /signup
  - The Name field on the registration form shows "O'Brien-Müller"
```

---

### TC-REG-019 — Direct navigation to /signup without completing Step 1

```
ID:               TC-REG-019
Title:            Navigating directly to /signup without completing the Signup form redirects user
Priority:         Medium
Preconditions:    User is not logged in; has NOT submitted the Signup form on /login
Test Data:        (none)

Steps:
  1. Navigate directly to https://automationexercise.com/signup (bypassing /login)

Expected Result:
  - User is redirected back to /login, OR
  - /signup loads but shows an empty/unusable form with no pre-filled name or email
  - Registration cannot be completed without going through Step 1
```

---

## Coverage Matrix

| TC ID | Title (short) | Category | Priority | Automated? |
|---|---|---|---|---|
| TC-REG-001 | Register with all required fields | Happy Path | Critical | Planned |
| TC-REG-002 | Register with optional fields blank | Happy Path | High | Planned |
| TC-REG-003 | Empty Name on signup form | Negative | High | Planned |
| TC-REG-004 | Empty Email on signup form | Negative | High | Planned |
| TC-REG-005 | Invalid email format (no @) | Negative | High | Planned |
| TC-REG-006 | Duplicate / already-registered email | Negative | Critical | Planned |
| TC-REG-007 | Empty Password on registration form | Negative | High | Planned |
| TC-REG-008 | Empty First name | Negative | High | Planned |
| TC-REG-009 | Empty Last name | Negative | High | Planned |
| TC-REG-010 | Empty Address | Negative | High | Planned |
| TC-REG-011 | Empty State | Negative | Medium | Planned |
| TC-REG-012 | Empty City | Negative | Medium | Planned |
| TC-REG-013 | Empty Zipcode | Negative | Medium | Planned |
| TC-REG-014 | Empty Mobile Number | Negative | Medium | Planned |
| TC-REG-015 | 1-character password accepted | Boundary | Low | Planned |
| TC-REG-016 | 1-character name accepted | Boundary | Low | Planned |
| TC-REG-017 | Email field is disabled on /signup | Edge Case | Medium | Planned |
| TC-REG-018 | Special characters in Name | Edge Case | Low | Planned |
| TC-REG-019 | Direct navigation to /signup | Edge Case | Medium | Planned |

---

## Gaps & Untested Areas

- **Password strength** — no minimum length or complexity rules enforced (1-char accepted); security risk
- **Maximum field lengths** — no upper boundary tested for Name, Password, Address fields
- **Mobile number format** — no format validation observed; non-numeric values not tested
- **Zipcode format** — no numeric-only enforcement tested
- **Email case sensitivity** — uppercase duplicate email (e.g. `USER@EXAMPLE.COM` vs `user@example.com`) not tested
- **Date of Birth validation** — future dates and impossible dates (e.g. Feb 30) not tested
- **Country dropdown default** — defaults to "India"; no test for each country option
- **Concurrent registration** — two sessions registering with the same email simultaneously
