import { test, expect } from '../fixtures/ecom.fixture';
import { randomUser, randomAddress } from '../../helpers/testData';
import { Logger } from '../../helpers/logger';

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

    Logger.info('Step 1-2: Navigate to home page');
    await homePage.goto();
    await expect(homePage.getPageHeading()).toBeVisible();

    Logger.info('Step 3-4: Click Signup / Login');
    await navBar.clickSignupLogin();
    await expect(loginPage.getNewUserHeading()).toBeVisible();

    Logger.info(`Step 5-7: Fill signup form — name: ${user.name}`);
    await loginPage.fillSignup(user.name, user.email);

    Logger.info('Step 8: Verify account information page');
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();

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

    Logger.info('Step 18: Verify account created');
    await expect(accountCreatedPage.getHeading()).toBeVisible();

    Logger.info('Step 19-20: Continue and verify logged in as');
    await accountCreatedPage.clickContinue();
    await expect(navBar.getLoggedInLabel()).toContainText(user.name);

    Logger.info('Step 21-22: Navigate to Products page');
    await navBar.clickProducts();
    await expect(productsPage.getAllProductsHeading()).toBeVisible();

    Logger.info(`Step 23-26: Search for ${SEARCH_TERM}`);
    await productsPage.search(SEARCH_TERM);
    await expect(productsPage.getSearchedProductsHeading()).toBeVisible();

    Logger.info('Step 27: Click first search result');
    await productsPage.clickFirstResult();

    Logger.info('Step 28-29: Verify product name and availability');
    await expect(productDetailsPage.getProductName()).toContainText(SEARCH_TERM);
    await expect(productDetailsPage.getAvailability()).toBeVisible();

    Logger.info(`Step 30-32: Set quantity to ${CART_QUANTITY} and add to cart`);
    await productDetailsPage.setQuantity(CART_QUANTITY);
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.getAddedModalHeading()).toBeVisible();

    Logger.info('Step 33: View cart');
    await productDetailsPage.viewCart();

    Logger.info('Step 34-36: Verify cart product name and quantity');
    await expect(cartPage.getFirstProductName()).toContainText(SEARCH_TERM);
    await expect(cartPage.getFirstProductQuantity()).toContainText(CART_QUANTITY);

    Logger.info('Step 37: Proceed to checkout');
    await cartPage.proceedToCheckout();

    Logger.info('Step 38-40: Verify delivery address and fill comment');
    await expect(checkoutPage.getAddressDetailsHeading()).toBeVisible();
    await expect(checkoutPage.getDeliveryAddressHeading()).toBeVisible();
    await checkoutPage.fillOrderComment(ORDER_COMMENT);

    Logger.info('Step 41: Place order');
    await checkoutPage.placeOrder();

    Logger.info('Step 42: Verify payment page heading');
    await expect(paymentPage.getPaymentHeading()).toBeVisible();

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

    Logger.info('Step 48: Verify order placed confirmation');
    await expect(orderConfirmedPage.getOrderPlacedHeading()).toBeVisible();
    await expect(orderConfirmedPage.getConfirmationText()).toBeVisible();

    Logger.info('Step 49: Delete account');
    await navBar.clickDeleteAccount();
    Logger.info('Step 50: Verify account deleted');
    await expect(deleteAccountPage.getHeading()).toBeVisible();
  });

});
