import { test, expect } from './fixtures/ecom.fixture';
import { randomUser, randomAddress } from '../helpers/testData';
import { Logger } from '../helpers/logger';

// --- Test constants — fixed values that drive assertions or are reused across steps ---
const SEARCH_TERM   = 'Blue Top';
const CART_QUANTITY = '2';
const ORDER_COMMENT = 'Please handle with care';
const PAYMENT = {
  cardNumber:  '4111111111111111', // standard Visa test card (Luhn-valid)
  cvc:         '123',
  expiryMonth: '12',
  expiryYear:  '2029',
} as const;

test.describe('TC-ECOM-003 — E2E Checkout Flow', () => {

  test('TC-ECOM-003-01 — New user registers, searches product, adds to cart with qty 2, completes checkout, deletes account', async ({
    homePage,
    navBar,
    loginPage,
    signupPage,
    accountCreatedPage,
    productsPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
    paymentPage,
    orderConfirmedPage,
    deleteAccountPage,
  }) => {
    // --- Arrange ---
    const user    = randomUser();
    const address = randomAddress();
    Logger.debug(`Test data — name: ${user.name}, email: ${user.email}`);
    Logger.debug(`Test data — address: ${address.address}, city: ${address.city}`);

    // --- Step 1-2: Navigate home and verify heading ---
    Logger.info('Step 1-2: Navigate to home page');
    await homePage.goto();
    await expect(homePage.getPageHeading()).toBeVisible();

    // --- Step 3-4: Open Signup / Login page ---
    Logger.info('Step 3-4: Click Signup / Login');
    await navBar.clickSignupLogin();
    await expect(loginPage.getNewUserHeading()).toBeVisible();

    // --- Step 5-7: Fill signup name + email, click Signup ---
    Logger.info(`Step 5-7: Fill signup form — name: ${user.name}`);
    await loginPage.fillSignup(user.name, user.email);

    // --- Step 8: Verify "Enter Account Information" heading ---
    Logger.info('Step 8: Verify account information page');
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();

    // --- Step 9-17: Fill registration form ---
    Logger.info('Step 9-17: Fill registration form');
    await signupPage.fillRegistrationForm({
      password:     user.password,
      firstName:    address.firstName,
      lastName:     address.lastName,
      address:      address.address,
      state:        address.state,
      city:         address.city,
      zipcode:      address.zipcode,
      mobileNumber: address.mobileNumber,
    });
    await signupPage.clickCreateAccount();

    // --- Step 18: Verify "Account Created!" ---
    Logger.info('Step 18: Verify account created');
    await expect(accountCreatedPage.getHeading()).toBeVisible();

    // --- Step 19-20: Continue and verify logged-in state ---
    Logger.info('Step 19-20: Continue and verify logged in as');
    await accountCreatedPage.clickContinue();
    await expect(navBar.getLoggedInLabel()).toContainText(user.name);

    // --- Step 21-22: Navigate to Products page ---
    Logger.info('Step 21-22: Navigate to Products page');
    await navBar.clickProducts();
    await expect(productsPage.getAllProductsHeading()).toBeVisible();

    // --- Step 23-26: Search for product and verify results ---
    Logger.info(`Step 23-26: Search for ${SEARCH_TERM}`);
    await productsPage.search(SEARCH_TERM);
    await expect(productsPage.getSearchedProductsHeading()).toBeVisible();

    // --- Step 27: Click View Product on the first result ---
    Logger.info('Step 27: Click first search result');
    await productsPage.clickFirstResult();

    // --- Step 28-29: Verify product details ---
    Logger.info('Step 28-29: Verify product name and availability');
    await expect(productDetailsPage.getProductName()).toContainText(SEARCH_TERM);
    await expect(productDetailsPage.getAvailability()).toBeVisible();

    // --- Step 30-32: Set quantity and add to cart ---
    Logger.info(`Step 30-32: Set quantity to ${CART_QUANTITY} and add to cart`);
    await productDetailsPage.setQuantity(CART_QUANTITY);
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getAddedModalHeading()).toBeVisible();

    // --- Step 33: View Cart ---
    Logger.info('Step 33: View cart');
    await productDetailsPage.viewCart();

    // --- Step 34-36: Verify cart contents ---
    Logger.info('Step 34-36: Verify cart product name and quantity');
    await expect(cartPage.getFirstProductName()).toContainText(SEARCH_TERM);
    await expect(cartPage.getFirstProductQuantity()).toContainText(CART_QUANTITY);

    // --- Step 37: Proceed to Checkout ---
    Logger.info('Step 37: Proceed to checkout');
    await cartPage.proceedToCheckout();

    // --- Step 38-40: Verify checkout address and fill order comment ---
    Logger.info('Step 38-40: Verify delivery address and fill comment');
    await expect(checkoutPage.getAddressDetailsHeading()).toBeVisible();
    await expect(checkoutPage.getDeliveryAddressHeading()).toBeVisible();
    await checkoutPage.fillOrderComment(ORDER_COMMENT);

    // --- Step 41: Place Order ---
    Logger.info('Step 41: Place order');
    await checkoutPage.placeOrder();

    // --- Step 42: Verify payment page heading ---
    Logger.info('Step 42: Verify payment page heading');
    await expect(paymentPage.getPaymentHeading()).toBeVisible();

    // --- Step 43-47: Fill payment details and confirm ---
    Logger.info('Step 43-47: Fill payment details');
    await paymentPage.fillPaymentDetails({
      nameOnCard:  `${address.firstName} ${address.lastName}`,
      cardNumber:  PAYMENT.cardNumber,
      cvc:         PAYMENT.cvc,
      expiryMonth: PAYMENT.expiryMonth,
      expiryYear:  PAYMENT.expiryYear,
    });
    Logger.info('Step 47: Confirm payment');
    await paymentPage.confirmPayment();

    // --- Step 48: Verify order confirmation ---
    Logger.info('Step 48: Verify order placed confirmation');
    await expect(orderConfirmedPage.getOrderPlacedHeading()).toBeVisible();
    await expect(orderConfirmedPage.getConfirmationText()).toBeVisible();

    // --- Step 49-50: Delete account and verify ---
    Logger.info('Step 49: Delete account');
    await navBar.clickDeleteAccount();
    Logger.info('Step 50: Verify account deleted');
    await expect(deleteAccountPage.getHeading()).toBeVisible();
  });

});
