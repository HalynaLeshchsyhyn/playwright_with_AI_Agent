# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ecom-checkout.spec.ts >> TC-ECOM-003 — E2E Checkout Flow >> TC-ECOM-003-01 — New user registers, searches product, adds to cart with qty 2, completes checkout, deletes account
- Location: tests\ecom-checkout.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Payment' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Payment' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e5]:
      - link [ref=e8] [cursor=pointer]:
        - /url: /
        - img [ref=e9]
      - list [ref=e12]:
        - listitem [ref=e13]:
          - link [ref=e14] [cursor=pointer]:
            - /url: /
            - generic [ref=e15]: 
            - text: Home
        - listitem [ref=e16]:
          - link [ref=e17] [cursor=pointer]:
            - /url: /products
            - generic [ref=e18]: 
            - text: Products
        - listitem [ref=e19]:
          - link [ref=e20] [cursor=pointer]:
            - /url: /view_cart
            - generic [ref=e21]: 
            - text: Cart
        - listitem [ref=e22]:
          - link [ref=e23] [cursor=pointer]:
            - /url: /logout
            - generic [ref=e24]: 
            - text: Logout
        - listitem [ref=e25]:
          - link [ref=e26] [cursor=pointer]:
            - /url: /delete_account
            - generic [ref=e27]: 
            - text: Delete Account
        - listitem [ref=e28]:
          - link [ref=e29] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=e30]: 
            - text: Test Cases
        - listitem [ref=e31]:
          - link [ref=e32] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=e33]: 
            - text: API Testing
        - listitem [ref=e34]:
          - link [ref=e35] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=e36]: 
            - text: Video Tutorials
        - listitem [ref=e37]:
          - link [ref=e38] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=e39]: 
            - text: Contact us
        - listitem [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]: 
            - text: Logged in as User_mdth6j
  - generic [ref=e44]:
    - list [ref=e46]:
      - listitem [ref=e47]:
        - link [ref=e48] [cursor=pointer]:
          - /url: /
          - text: Home
      - listitem [ref=e49]: Checkout
    - heading [level=2] [ref=e51]: Address Details
    - generic [ref=e53]:
      - list [ref=e55]:
        - listitem [ref=e56]:
          - heading [level=3] [ref=e57]: Your delivery address
        - listitem [ref=e58]: Mr. First_i65hb Last_rkxu5
        - listitem [ref=e59]: 556 Test Street
        - listitem [ref=e60]: City_67212 State_iln5h 95272
        - listitem [ref=e61]: United States
        - listitem [ref=e62]: "5200772401"
      - list [ref=e64]:
        - listitem [ref=e65]:
          - heading [level=3] [ref=e66]: Your billing address
        - listitem [ref=e67]: Mr. First_i65hb Last_rkxu5
        - listitem [ref=e68]: 556 Test Street
        - listitem [ref=e69]: City_67212 State_iln5h 95272
        - listitem [ref=e70]: United States
        - listitem [ref=e71]: "5200772401"
    - heading [level=2] [ref=e73]: Review Your Order
    - table [ref=e75]:
      - rowgroup [ref=e76]:
        - row [ref=e77]:
          - cell [ref=e78]: Item
          - cell [ref=e79]: Description
          - cell [ref=e80]: Price
          - cell [ref=e81]: Quantity
          - cell [ref=e82]: Total
          - cell [ref=e83]
      - rowgroup [ref=e84]:
        - row [ref=e85]:
          - cell [ref=e86]:
            - link [ref=e87] [cursor=pointer]:
              - /url: ""
              - img [ref=e88]
          - cell [ref=e89]:
            - heading [level=4] [ref=e90]:
              - link [ref=e91] [cursor=pointer]:
                - /url: /product_details/1
                - text: Blue Top
            - paragraph [ref=e92]: Women > Tops
          - cell [ref=e93]:
            - paragraph [ref=e94]: Rs. 500
          - cell [ref=e95]:
            - button [ref=e96] [cursor=pointer]: "2"
          - cell [ref=e97]:
            - paragraph [ref=e98]: Rs. 1000
        - row [ref=e99]:
          - cell [ref=e100]
          - cell [ref=e101]
          - cell [ref=e102]:
            - heading [level=4] [ref=e103]: Total Amount
          - cell [ref=e104]:
            - paragraph [ref=e105]: Rs. 1000
    - generic [ref=e106]:
      - generic [ref=e107]: If you would like to add a comment about your order, please write it in the field below.
      - textbox [ref=e108]: Please handle with care
    - link [ref=e110] [cursor=pointer]:
      - /url: /payment
      - text: Place Order
  - contentinfo [ref=e111]:
    - generic [ref=e116]:
      - heading [level=2] [ref=e117]: Subscription
      - generic [ref=e118]:
        - textbox [ref=e119]:
          - /placeholder: Your email address
        - button [ref=e120] [cursor=pointer]:
          - generic [ref=e121]: 
        - paragraph [ref=e122]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=e126]: Copyright © 2021 All rights reserved
  - insertion [ref=e128]:
    - iframe [ref=e130]:
      
  - text: 
```

# Test source

```ts
  29  |     orderConfirmedPage,
  30  |     deleteAccountPage,
  31  |   }) => {
  32  |     // --- Arrange ---
  33  |     const user    = randomUser();
  34  |     const address = randomAddress();
  35  |     Logger.debug(`Test data — name: ${user.name}, email: ${user.email}`);
  36  |     Logger.debug(`Test data — address: ${address.address}, city: ${address.city}`);
  37  | 
  38  |     // --- Step 1-2: Navigate home and verify heading ---
  39  |     Logger.info('Step 1-2: Navigate to home page');
  40  |     await homePage.goto();
  41  |     await expect(homePage.getPageHeading()).toBeVisible();
  42  | 
  43  |     // --- Step 3-4: Open Signup / Login page ---
  44  |     Logger.info('Step 3-4: Click Signup / Login');
  45  |     await navBar.clickSignupLogin();
  46  |     await expect(loginPage.getNewUserHeading()).toBeVisible();
  47  | 
  48  |     // --- Step 5-7: Fill signup name + email, click Signup ---
  49  |     Logger.info(`Step 5-7: Fill signup form — name: ${user.name}`);
  50  |     await loginPage.fillSignup(user.name, user.email);
  51  | 
  52  |     // --- Step 8: Verify "Enter Account Information" heading ---
  53  |     Logger.info('Step 8: Verify account information page');
  54  |     await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();
  55  | 
  56  |     // --- Step 9-17: Fill registration form ---
  57  |     Logger.info('Step 9-17: Fill registration form');
  58  |     await signupPage.fillRegistrationForm({
  59  |       password:     user.password,
  60  |       firstName:    address.firstName,
  61  |       lastName:     address.lastName,
  62  |       address:      address.address,
  63  |       state:        address.state,
  64  |       city:         address.city,
  65  |       zipcode:      address.zipcode,
  66  |       mobileNumber: address.mobileNumber,
  67  |     });
  68  |     await signupPage.clickCreateAccount();
  69  | 
  70  |     // --- Step 18: Verify "Account Created!" ---
  71  |     Logger.info('Step 18: Verify account created');
  72  |     await expect(accountCreatedPage.getHeading()).toBeVisible();
  73  | 
  74  |     // --- Step 19-20: Continue and verify logged-in state ---
  75  |     Logger.info('Step 19-20: Continue and verify logged in as');
  76  |     await accountCreatedPage.clickContinue();
  77  |     await expect(navBar.getLoggedInLabel()).toContainText(user.name);
  78  | 
  79  |     // --- Step 21-22: Navigate to Products page ---
  80  |     Logger.info('Step 21-22: Navigate to Products page');
  81  |     await navBar.clickProducts();
  82  |     await expect(productsPage.getAllProductsHeading()).toBeVisible();
  83  | 
  84  |     // --- Step 23-26: Search for product and verify results ---
  85  |     Logger.info(`Step 23-26: Search for ${SEARCH_TERM}`);
  86  |     await productsPage.search(SEARCH_TERM);
  87  |     await expect(productsPage.getSearchedProductsHeading()).toBeVisible();
  88  | 
  89  |     // --- Step 27: Click View Product on the first result ---
  90  |     Logger.info('Step 27: Click first search result');
  91  |     await productsPage.clickFirstResult();
  92  | 
  93  |     // --- Step 28-29: Verify product details ---
  94  |     Logger.info('Step 28-29: Verify product name and availability');
  95  |     await expect(productDetailsPage.getProductName()).toContainText(SEARCH_TERM);
  96  |     await expect(productDetailsPage.getAvailability()).toBeVisible();
  97  | 
  98  |     // --- Step 30-32: Set quantity and add to cart ---
  99  |     Logger.info(`Step 30-32: Set quantity to ${CART_QUANTITY} and add to cart`);
  100 |     await productDetailsPage.setQuantity(CART_QUANTITY);
  101 |     await productDetailsPage.addToCart();
  102 |     await expect(productDetailsPage.getAddedModalHeading()).toBeVisible();
  103 | 
  104 |     // --- Step 33: View Cart ---
  105 |     Logger.info('Step 33: View cart');
  106 |     await productDetailsPage.viewCart();
  107 | 
  108 |     // --- Step 34-36: Verify cart contents ---
  109 |     Logger.info('Step 34-36: Verify cart product name and quantity');
  110 |     await expect(cartPage.getFirstProductName()).toContainText(SEARCH_TERM);
  111 |     await expect(cartPage.getFirstProductQuantity()).toContainText(CART_QUANTITY);
  112 | 
  113 |     // --- Step 37: Proceed to Checkout ---
  114 |     Logger.info('Step 37: Proceed to checkout');
  115 |     await cartPage.proceedToCheckout();
  116 | 
  117 |     // --- Step 38-40: Verify checkout address and fill order comment ---
  118 |     Logger.info('Step 38-40: Verify delivery address and fill comment');
  119 |     await expect(checkoutPage.getAddressDetailsHeading()).toBeVisible();
  120 |     await expect(checkoutPage.getDeliveryAddressHeading()).toBeVisible();
  121 |     await checkoutPage.fillOrderComment(ORDER_COMMENT);
  122 | 
  123 |     // --- Step 41: Place Order ---
  124 |     Logger.info('Step 41: Place order');
  125 |     await checkoutPage.placeOrder();
  126 | 
  127 |     // --- Step 42: Verify payment page heading ---
  128 |     Logger.info('Step 42: Verify payment page heading');
> 129 |     await expect(paymentPage.getPaymentHeading()).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  130 | 
  131 |     // --- Step 43-47: Fill payment details and confirm ---
  132 |     Logger.info('Step 43-47: Fill payment details');
  133 |     await paymentPage.fillPaymentDetails({
  134 |       nameOnCard:  `${address.firstName} ${address.lastName}`,
  135 |       cardNumber:  PAYMENT.cardNumber,
  136 |       cvc:         PAYMENT.cvc,
  137 |       expiryMonth: PAYMENT.expiryMonth,
  138 |       expiryYear:  PAYMENT.expiryYear,
  139 |     });
  140 |     Logger.info('Step 47: Confirm payment');
  141 |     await paymentPage.confirmPayment();
  142 | 
  143 |     // --- Step 48: Verify order confirmation ---
  144 |     Logger.info('Step 48: Verify order placed confirmation');
  145 |     await expect(orderConfirmedPage.getOrderPlacedHeading()).toBeVisible();
  146 |     await expect(orderConfirmedPage.getConfirmationText()).toBeVisible();
  147 | 
  148 |     // --- Step 49-50: Delete account and verify ---
  149 |     Logger.info('Step 49: Delete account');
  150 |     await navBar.clickDeleteAccount();
  151 |     Logger.info('Step 50: Verify account deleted');
  152 |     await expect(deleteAccountPage.getHeading()).toBeVisible();
  153 |   });
  154 | 
  155 | });
  156 | 
```