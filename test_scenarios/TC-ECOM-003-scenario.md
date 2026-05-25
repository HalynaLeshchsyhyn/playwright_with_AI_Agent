# TC-ECOM-003 — Complete E2E Checkout Flow for a New User

**Site:** https://automationexercise.com  
**Module:** ECOM  
**Priority:** Critical  
**Category:** Happy Path — Full Purchase Flow

---

## Test Cases

### TC-ECOM-003-01 — Register, Search Product, Set Quantity, Checkout, Place Order, Delete Account

```
ID:               TC-ECOM-003-01
Title:            New user registers, searches for a product, adds it with custom quantity,
                  completes checkout with payment, then deletes the account
Priority:         Critical
Preconditions:
  - User is not logged in
  - No existing session / cookies from a prior run
  - Browser is on a clean state (no cart items)

Test Data:
  name          = <random_name>         → e.g. "User_k9x2m"
  email         = <random_email>        → e.g. "test_1716220800_abc12@example.com"
  password      = <random_password>     → e.g. "Pwd_j4n8qz1!"
  first_name    = <random_name>
  last_name     = <random_name>
  address       = <random_address>      → e.g. "123 Test Street"
  state         = "California"          (fixed — dropdown value)
  city          = "Los Angeles"         (fixed)
  zipcode       = <random_zip>          → e.g. "90210"
  mobile        = <random_phone>        → e.g. "5551234567"
  search_term   = "Blue Top"            (fixed — known product)
  quantity      = "2"                   (fixed — boundary: more than default 1)
  card_name     = <random_name>
  card_number   = "4111111111111111"    (fixed — standard test VISA)
  card_cvc      = "123"
  card_expiry_m = "12"
  card_expiry_y = "2029"

Steps:
  1.  Navigate to https://automationexercise.com
  2.  Verify the "AutomationExercise" heading is visible on the home page
  3.  Click "Signup / Login" link in the navigation bar
  4.  Verify "New User Signup!" section heading is visible
  5.  Enter <random_name> in the "Name" field of the Signup section
  6.  Enter <random_email> in the "Email Address" field of the Signup section
  7.  Click the "Signup" button
  8.  Verify "ENTER ACCOUNT INFORMATION" heading is visible on the registration form page
  9.  Select title "Mr" radio button
  10. Enter <random_password> in the "Password" field
  11. Select day "15", month "June", year "1990" from the date of birth dropdowns
  12. Enter <random_name> in "First name" and "Last name" fields
  13. Enter <random_address> in the "Address" field
  14. Select "United States" from the "Country" dropdown
  15. Enter "California" in "State", "Los Angeles" in "City", <random_zip> in "Zipcode"
  16. Enter <random_phone> in the "Mobile Number" field
  17. Click the "Create Account" button
  18. Verify "ACCOUNT CREATED!" heading is visible
  19. Click the "Continue" button
  20. Verify the navigation bar shows "Logged in as <random_name>"
  21. Click "Products" link in the navigation bar
  22. Verify the "ALL PRODUCTS" heading is visible on the Products page
  23. Enter "Blue Top" in the "Search Product" input field
  24. Click the "SEARCH" button (or press Enter)
  25. Verify "SEARCHED PRODUCTS" heading is visible
  26. Verify at least one product result with the name "Blue Top" is displayed
  27. Click "View Product" on the first "Blue Top" result
  28. Verify the product detail page shows the product name contains "Blue Top"
  29. Verify "Availability: In Stock" is visible on the product detail page
  30. Change the quantity input to "2"
  31. Click the "Add to cart" button
  32. Verify the "Added!" modal heading is visible
  33. Click "View Cart" link in the modal
  34. Verify the cart page (/view_cart) is displayed
  35. Verify the product name in the cart contains "Blue Top"
  36. Verify the quantity displayed in the cart row is "2"
  37. Click "Proceed To Checkout" button
  38. Verify the checkout page shows a "Delivery Address" section
  39. Verify the delivery address matches the registered address details
  40. Enter "Please handle with care" in the order comment / message textarea
  41. Click "Place Order" button
  42. Verify the payment page shows a form with Name on Card, Card Number, CVC, and Expiry fields
  43. Enter <random_name> in "Name on Card"
  44. Enter "4111111111111111" in "Card Number"
  45. Enter "123" in "CVC"
  46. Enter "12" in "Expiration Month" and "2029" in "Expiration Year"
  47. Click "Pay and Confirm Order" button
  48. Verify a success message "Your order has been placed successfully!" (or "Order Placed!") is visible
  49. Click "Delete Account" link in the navigation bar
  50. Verify "ACCOUNT DELETED!" heading is visible on the confirmation page

Expected Result:
  - At step 18: Account is created successfully — "ACCOUNT CREATED!" is visible
  - At step 20: User is authenticated — nav displays "Logged in as <random_name>"
  - At step 26: Search returns at least one result matching "Blue Top"
  - At step 36: Cart reflects quantity 2 for the added product
  - At step 48: Order confirmation message is displayed
  - At step 50: Account is permanently deleted — "ACCOUNT DELETED!" heading is visible
```

---

## Additional Test Cases

### TC-ECOM-003-02 — Checkout Blocked When Cart Is Empty

```
ID:               TC-ECOM-003-02
Title:            User cannot reach payment page from an empty cart
Priority:         High
Preconditions:    User is logged in; cart is empty
Test Data:        (none)
Steps:
  1. Navigate to /view_cart
  2. Verify the cart is empty (no product rows visible)
  3. Attempt to navigate directly to /checkout
Expected Result:  User is redirected or sees a message indicating the cart is empty;
                  payment form is NOT accessible
```

---

### TC-ECOM-003-03 — Payment Rejected with Invalid Card Number

```
ID:               TC-ECOM-003-03
Title:            Order placement fails when an invalid card number is entered
Priority:         High
Preconditions:    User is logged in, cart has at least one item, user is on the payment page
Test Data:
  card_number = "1234567890123456"   (fixed — invalid Luhn number)
  card_cvc    = "999"
  card_expiry = "01/2030"
Steps:
  1. On the payment page, enter "1234567890123456" in "Card Number"
  2. Enter "999" in "CVC"
  3. Enter "01" / "2030" in expiry fields
  4. Click "Pay and Confirm Order"
Expected Result:  An error message is displayed; the order is NOT placed;
                  user remains on the payment page
```

---

### TC-ECOM-003-04 — Product Search Returns No Results for Unknown Term

```
ID:               TC-ECOM-003-04
Title:            Search with a term that matches no products shows empty results
Priority:         Medium
Preconditions:    User is on /products page (login not required)
Test Data:
  search_term = "zzz_nonexistent_xyz_999"   (fixed — guaranteed no match)
Steps:
  1. Navigate to /products
  2. Enter "zzz_nonexistent_xyz_999" in the "Search Product" field
  3. Click the "SEARCH" button
Expected Result:  "SEARCHED PRODUCTS" heading is visible;
                  zero product cards are displayed below it
```

---

## Coverage Matrix

| Scenario | TC ID | Category | Priority | Automated? |
|---|---|---|---|---|
| Register → search → add to cart → checkout → order → delete | TC-ECOM-003-01 | Happy Path | Critical | Planned |
| Checkout blocked with empty cart | TC-ECOM-003-02 | Negative | High | Planned |
| Payment rejected with invalid card | TC-ECOM-003-03 | Negative | High | Planned |
| Search returns no results | TC-ECOM-003-04 | Edge Case | Medium | Planned |

### Untested / Gap Areas

- Guest checkout (without account registration)
- Adding the same product multiple times and verifying quantity merge
- Removing a product from the cart mid-checkout
- Applying discount / promo codes (if feature exists)
- Order history page after placing an order
- Mobile viewport behaviour (responsive layout)
