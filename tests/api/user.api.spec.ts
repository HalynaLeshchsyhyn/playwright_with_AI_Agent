import { test, expect } from '../fixtures/api.fixture';
import { randomUser, randomAddress } from '../../helpers/testData';
import { Logger } from '../../helpers/logger';
import { ApiMessages } from './support/ApiMessages';
import { buildAccountForm } from './support/accountFormBuilder';
import { AccountFormData } from './support/types';

// ─── Stateless Login / Method Tests ──────────────────────────────────────────

test.describe('Login API — stateless tests', () => {

  test('TC-API-008 — POST /api/verifyLogin without email param returns responseCode 400', async ({ userApi }) => {
    Logger.info('Sending POST /api/verifyLogin without email parameter');

    const response = await userApi.verifyLoginWithoutEmail('anypassword');

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe(ApiMessages.MISSING_LOGIN_PARAMS);
  });

  test('TC-API-009 — DELETE /api/verifyLogin returns responseCode 405 (method not supported)', async ({ userApi }) => {
    Logger.info('Sending DELETE /api/verifyLogin');

    const response = await userApi.deleteVerifyLogin();

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe(ApiMessages.METHOD_NOT_SUPPORTED);
  });

  test('TC-API-010 — POST /api/verifyLogin with invalid credentials returns responseCode 404', async ({ userApi }) => {
    const user = randomUser();
    Logger.info(`Sending POST /api/verifyLogin with non-existent user ${user.email}`);

    const response = await userApi.verifyLogin(user.email, user.password);

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(404);
    expect(body.message).toBe(ApiMessages.USER_NOT_FOUND);
  });

});

// ─── User Account Lifecycle Tests ─────────────────────────────────────────────

test.describe('User Account API — lifecycle', () => {
  let accountEmail:    string;
  let accountPassword: string;
  let accountName:     string;
  let accountForm:     AccountFormData;
  let updatedFirstName: string;

  test.beforeAll(async ({ userApi }) => {
    const user = randomUser();
    const address = randomAddress();
    accountEmail    = user.email;
    accountPassword = user.password;
    accountName     = user.name;
    accountForm     = buildAccountForm(user, address);

    Logger.info(`Creating test user account: ${accountEmail}`);
    const response = await userApi.createAccount(accountForm);
    const body = await response.json();

    Logger.debug(`Create account response: ${body.responseCode} — ${body.message}`);
    expect(body.responseCode).toBe(201);
  });

  test.afterAll(async ({ userApi }) => {
    Logger.info(`Cleaning up test user account: ${accountEmail}`);
    const response = await userApi.deleteAccount(accountEmail, accountPassword);
    const body = await response.json();
    Logger.debug(`Cleanup delete response: ${body.responseCode} — ${body.message}`);
  });

  // ── TC-API-011: Create account ────────────────────────────────────────────

  test('TC-API-011 — POST /api/createAccount creates a new user and returns responseCode 201', async ({ userApi }) => {
    // Account is created in beforeAll — create a second one here to keep the test atomic
    const user = randomUser();
    const address = randomAddress();
    const form = buildAccountForm(user, address);

    Logger.info(`Creating new account via API: ${user.email}`);
    const response = await userApi.createAccount(form);

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(201);
    expect(body.message).toBe(ApiMessages.USER_CREATED);

    // Cleanup the extra account
    Logger.debug(`Deleting extra account: ${user.email}`);
    await userApi.deleteAccount(user.email, user.password);
  });

  // ── TC-API-007: Verify login ──────────────────────────────────────────────

  test('TC-API-007 — POST /api/verifyLogin with valid credentials returns responseCode 200', async ({ userApi }) => {
    Logger.info(`Sending POST /api/verifyLogin for ${accountEmail}`);

    const response = await userApi.verifyLogin(accountEmail, accountPassword);

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe(ApiMessages.USER_EXISTS);
  });

  // ── TC-API-013: Update account ────────────────────────────────────────────

  test('TC-API-013 — PUT /api/updateAccount updates user data and returns responseCode 200', async ({ userApi }) => {
    const newAddress = randomAddress();
    updatedFirstName = newAddress.firstName;

    const updatedForm: AccountFormData = {
      ...accountForm,
      firstname:     updatedFirstName,
      lastname:      newAddress.lastName,
      address1:      newAddress.address,
      state:         newAddress.state,
      city:          newAddress.city,
      zipcode:       newAddress.zipcode,
      mobile_number: newAddress.mobileNumber,
    };

    Logger.info(`Sending PUT /api/updateAccount for ${accountEmail}`);
    const response = await userApi.updateAccount(updatedForm);

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(200);
    expect(body.message).toBe(ApiMessages.USER_UPDATED);
  });

  // ── TC-API-014: Get user by email ─────────────────────────────────────────

  test('TC-API-014 — GET /api/getUserDetailByEmail returns user data for a valid email', async ({ userApi }) => {
    Logger.info(`Sending GET /api/getUserDetailByEmail?email=${accountEmail}`);

    const response = await userApi.getUserByEmail(accountEmail);

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, user name: ${body.user?.name}`);

    expect(body.responseCode).toBe(200);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(accountEmail);
    expect(body.user.name).toBe(accountName);
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('first_name');
    expect(body.user).toHaveProperty('last_name');

    // Verify the updated first_name from TC-API-013 is reflected
    if (updatedFirstName) {
      Logger.debug(`Verifying updated first_name: ${updatedFirstName}`);
      expect(body.user.first_name).toBe(updatedFirstName);
    }
  });

  // ── TC-API-012: Delete account ────────────────────────────────────────────

  test('TC-API-012 — DELETE /api/deleteAccount removes the user and returns responseCode 200', async ({ userApi }) => {
    // Create a separate user for this test to keep it independent from afterAll cleanup
    const user = randomUser();
    const address = randomAddress();
    const form = buildAccountForm(user, address);

    Logger.info(`Creating account to delete: ${user.email}`);
    const createRes = await userApi.createAccount(form);
    const createBody = await createRes.json();
    expect(createBody.responseCode).toBe(201);

    Logger.info(`Sending DELETE /api/deleteAccount for ${user.email}`);
    const deleteRes = await userApi.deleteAccount(user.email, user.password);

    Logger.debug(`HTTP status: ${deleteRes.status()}`);
    expect(deleteRes.status()).toBe(200); // API always returns HTTP 200

    const deleteBody = await deleteRes.json();
    Logger.debug(`Response code: ${deleteBody.responseCode}, message: ${deleteBody.message}`);

    expect(deleteBody.responseCode).toBe(200);
    expect(deleteBody.message).toBe(ApiMessages.ACCOUNT_DELETED);

    // Verify the account no longer exists
    Logger.debug(`Verifying account ${user.email} no longer exists`);
    const verifyRes = await userApi.verifyLogin(user.email, user.password);
    const verifyBody = await verifyRes.json();
    expect(verifyBody.responseCode).toBe(404);
  });

});
