import { Locator } from '@playwright/test';
import { test, expect } from '../fixtures/ecom.fixture';
import { randomUser, randomAddress } from '../../helpers/testData';
import { Logger } from '../../helpers/logger';

// Known-existing account used for the duplicate-email test (TC-REG-006).
// Precondition: this account must exist — it was seeded during project setup.
const KNOWN_DUPLICATE_EMAIL = 'fresh_test_check@example.com';

// Reads the browser's native HTML5 validation message from any input element.
const validationMessage = (loc: Locator): Promise<string> =>
  loc.evaluate((el) => (el as unknown as HTMLInputElement).validationMessage);

// ─────────────────────────────────────────────────────────────────────────────

test.describe('TC-REG — New User Signup!', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // ── 1. Happy Path ─────────────────────────────────────────────────────────────

  test('TC-REG-001 — new user completes full registration and is logged in', async ({
    loginPage, signupPage, accountCreatedPage, navBar,
  }) => {
    const user    = randomUser();
    const address = randomAddress();
    Logger.debug(`TC-REG-001 data — name: ${user.name}, email: ${user.email}`);

    Logger.info('Step 1-5: Fill signup form and submit');
    await loginPage.fillSignup(user.name, user.email);

    Logger.info('Step 6: Verify account information page');
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();

    Logger.info('Step 7-14: Fill registration form');
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

    Logger.info('Step 15: Click Create Account');
    await signupPage.clickCreateAccount();

    Logger.info('Step 16-17: Verify Account Created and continue');
    await expect(accountCreatedPage.getHeading()).toBeVisible();
    await accountCreatedPage.clickContinue();

    Logger.info('Step 18: Verify logged-in state in nav');
    await expect(navBar.getLoggedInLabel()).toContainText(user.name);

    Logger.info('Cleanup: delete test account');
    await navBar.clickDeleteAccount();
  });

  test('TC-REG-002 — registration succeeds when optional fields (Company, Address 2) are left blank', async ({
    loginPage, signupPage, accountCreatedPage, navBar,
  }) => {
    const user    = randomUser();
    const address = randomAddress();
    Logger.debug(`TC-REG-002 data — email: ${user.email}`);

    await loginPage.fillSignup(user.name, user.email);
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();

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

    await expect(accountCreatedPage.getHeading()).toBeVisible();
    await accountCreatedPage.clickContinue();
    await navBar.clickDeleteAccount();
  });

  // ── 2. Negative — Step 1 (Signup form on /login) ───────────────────────────────

  test('TC-REG-003 — signup with empty Name shows browser validation', async ({
    page, loginPage,
  }) => {
    Logger.info('TC-REG-003: Leave Name empty, fill Email, click Signup');
    await loginPage.fillSignupEmail('test_neg_name@example.com');
    await loginPage.clickSignupButton();

    await expect(page).toHaveURL(/\/login/);
    const msg = await validationMessage(loginPage.getSignupNameInput());
    expect(msg).toBe('Please fill in this field.');
  });

  test('TC-REG-004 — signup with empty Email shows browser validation', async ({
    page, loginPage,
  }) => {
    Logger.info('TC-REG-004: Fill Name, leave Email empty, click Signup');
    await loginPage.fillSignupName('TestUser');
    await loginPage.clickSignupButton();

    await expect(page).toHaveURL(/\/login/);
    const msg = await validationMessage(loginPage.getSignupEmailInput());
    expect(msg).toBe('Please fill in this field.');
  });

  test('TC-REG-005 — signup with invalid email format shows browser validation', async ({
    page, loginPage,
  }) => {
    Logger.info('TC-REG-005: Enter email without @, click Signup');
    await loginPage.fillSignupName('TestUser');
    await loginPage.fillSignupEmail('bademail');
    await loginPage.clickSignupButton();

    await expect(page).toHaveURL(/\/login/);
    const msg = await validationMessage(loginPage.getSignupEmailInput());
    expect(msg).toContain("Please include an '@' in the email address.");
    expect(msg).toContain("'bademail' is missing an '@'.");
  });

  test('TC-REG-006 — signup with already-registered email shows server error', async ({
    page, signupPage, loginPage,
  }) => {
    Logger.info(`TC-REG-006: Use existing email ${KNOWN_DUPLICATE_EMAIL}`);
    await loginPage.fillSignup('AnyName', KNOWN_DUPLICATE_EMAIL);

    await expect(page).toHaveURL(/\/signup/);
    await expect(signupPage.getDuplicateEmailError()).toBeVisible();
    await expect(signupPage.getDuplicateEmailError()).toHaveText('Email Address already exist!');
  });

  // ── 3. Negative — Step 2 (Registration form on /signup) ───────────────────────

  test.describe('Registration form — required field validation', () => {

    test.beforeEach(async ({ loginPage, page }) => {
      const { name, email } = randomUser();
      Logger.debug(`Navigating to /signup with temp user: ${email}`);
      await loginPage.fillSignup(name, email);
      await page.waitForURL('**/signup');
    });

    test('TC-REG-007 — empty Password shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-007: Submit form without Password');
      await signupPage.fillRegistrationForm({
        firstName: a.firstName, lastName: a.lastName, address: a.address,
        state: a.state, city: a.city, zipcode: a.zipcode, mobileNumber: a.mobileNumber,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getPasswordInput())).toBe('Please fill in this field.');
    });

    test('TC-REG-008 — empty First name shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-008: Submit form without First name');
      await signupPage.fillRegistrationForm({
        password: 'Pwd_test1!', lastName: a.lastName, address: a.address,
        state: a.state, city: a.city, zipcode: a.zipcode, mobileNumber: a.mobileNumber,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getFirstNameInput())).toBe('Please fill in this field.');
    });

    test('TC-REG-009 — empty Last name shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-009: Submit form without Last name');
      await signupPage.fillRegistrationForm({
        password: 'Pwd_test1!', firstName: a.firstName, address: a.address,
        state: a.state, city: a.city, zipcode: a.zipcode, mobileNumber: a.mobileNumber,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getLastNameInput())).toBe('Please fill in this field.');
    });

    test('TC-REG-010 — empty Address shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-010: Submit form without Address');
      await signupPage.fillRegistrationForm({
        password: 'Pwd_test1!', firstName: a.firstName, lastName: a.lastName,
        state: a.state, city: a.city, zipcode: a.zipcode, mobileNumber: a.mobileNumber,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getAddressInput())).toBe('Please fill in this field.');
    });

    test('TC-REG-011 — empty State shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-011: Submit form without State');
      await signupPage.fillRegistrationForm({
        password: 'Pwd_test1!', firstName: a.firstName, lastName: a.lastName,
        address: a.address, city: a.city, zipcode: a.zipcode, mobileNumber: a.mobileNumber,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getStateInput())).toBe('Please fill in this field.');
    });

    test('TC-REG-012 — empty City shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-012: Submit form without City');
      await signupPage.fillRegistrationForm({
        password: 'Pwd_test1!', firstName: a.firstName, lastName: a.lastName,
        address: a.address, state: a.state, zipcode: a.zipcode, mobileNumber: a.mobileNumber,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getCityInput())).toBe('Please fill in this field.');
    });

    test('TC-REG-013 — empty Zipcode shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-013: Submit form without Zipcode');
      await signupPage.fillRegistrationForm({
        password: 'Pwd_test1!', firstName: a.firstName, lastName: a.lastName,
        address: a.address, state: a.state, city: a.city, mobileNumber: a.mobileNumber,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getZipcodeInput())).toBe('Please fill in this field.');
    });

    test('TC-REG-014 — empty Mobile Number shows browser validation', async ({
      page, signupPage,
    }) => {
      const a = randomAddress();
      Logger.info('TC-REG-014: Submit form without Mobile Number');
      await signupPage.fillRegistrationForm({
        password: 'Pwd_test1!', firstName: a.firstName, lastName: a.lastName,
        address: a.address, state: a.state, city: a.city, zipcode: a.zipcode,
      });
      await signupPage.clickCreateAccount();

      await expect(page).toHaveURL(/\/signup/);
      expect(await validationMessage(signupPage.getMobileInput())).toBe('Please fill in this field.');
    });

  });

  // ── 4. Boundary Conditions ─────────────────────────────────────────────────────────

  test('TC-REG-015 — 1-character password is accepted (no minimum length enforced)', async ({
    loginPage, signupPage, accountCreatedPage, navBar,
  }) => {
    const user    = randomUser();
    const address = randomAddress();
    Logger.info('TC-REG-015: Register with password = "a" (1 character)');

    await loginPage.fillSignup(user.name, user.email);
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();

    await signupPage.fillRegistrationForm({
      password:     'a',
      firstName:    address.firstName,
      lastName:     address.lastName,
      address:      address.address,
      state:        address.state,
      city:         address.city,
      zipcode:      address.zipcode,
      mobileNumber: address.mobileNumber,
    });
    await signupPage.clickCreateAccount();

    await expect(accountCreatedPage.getHeading()).toBeVisible();
    await accountCreatedPage.clickContinue();
    await navBar.clickDeleteAccount();
  });

  test('TC-REG-016 — 1-character Name is accepted by the signup form', async ({
    page, loginPage, signupPage,
  }) => {
    const { email } = randomUser();
    Logger.info('TC-REG-016: Enter Name = "A" (1 character)');

    await loginPage.fillSignupName('A');
    await loginPage.fillSignupEmail(email);
    await loginPage.clickSignupButton();

    await expect(page).toHaveURL(/\/signup/);
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();
  });

  // ── 5. Edge Cases ─────────────────────────────────────────────────────────────────

  test('TC-REG-017 — Email field on /signup is disabled and pre-filled from Step 1', async ({
    loginPage, signupPage,
  }) => {
    const { name, email } = randomUser();
    Logger.info('TC-REG-017: Verify email field is disabled on registration form');

    await loginPage.fillSignup(name, email);
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();

    await expect(signupPage.getEmailField()).toBeDisabled();
    await expect(signupPage.getEmailField()).toHaveValue(email);
  });

  test('TC-REG-018 — Name with special characters is accepted', async ({
    page, loginPage, signupPage,
  }) => {
    const specialName = "O'Brien-M\u00fcller";
    const { email }   = randomUser();
    Logger.info(`TC-REG-018: Enter Name with special chars: ${specialName}`);

    await loginPage.fillSignupName(specialName);
    await loginPage.fillSignupEmail(email);
    await loginPage.clickSignupButton();

    await expect(page).toHaveURL(/\/signup/);
    await expect(signupPage.getEnterAccountInfoHeading()).toBeVisible();
  });

  test('TC-REG-019 — navigating directly to /signup without Step 1 has no pre-filled email', async ({
    page, signupPage,
  }) => {
    Logger.info('TC-REG-019: Navigate directly to /signup, bypassing Step 1');
    await page.goto('/signup');

    const isOnSignup = page.url().includes('/signup');
    if (isOnSignup) {
      Logger.warn('TC-REG-019: /signup loaded directly — verifying email field is empty');
      const emailValue = await signupPage.getEmailField().inputValue().catch(() => '');
      expect(emailValue).toBe('');
    } else {
      Logger.info('TC-REG-019: Redirected away from /signup — expected behaviour');
      expect(page.url()).toContain('/login');
    }
  });

});
