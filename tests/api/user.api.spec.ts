import { test, expect } from '../fixtures/api.fixture';
import { randomUser, randomAddress } from '../../helpers/testData';
import { Logger } from '../../helpers/logger';
import { ApiMessages } from './support/ApiMessages';
import { buildAccountForm } from './support/accountFormBuilder';
import { AccountFormData } from './support/types';
import { parseApiResponse } from './support/apiResponseHelper';
import { ApiResponseCode, HttpStatus } from './support/ResponseCodes';

// ─── Stateless Login / Method Tests ──────────────────────────────────────────

test.describe('Login API — stateless tests', () => {

  test('TC-API-008 — POST /api/verifyLogin without email param returns responseCode 400', async ({ userApi }) => {
    Logger.info('Sending POST /api/verifyLogin without email parameter');

    const response = await userApi.verifyLoginWithoutEmail('anypassword');

    expect(response.status()).toBe(HttpStatus.OK);
    const body = await parseApiResponse(response);

    expect(body.responseCode).toBe(ApiResponseCode.BAD_REQUEST);
    expect(body.message).toBe(ApiMessages.MISSING_LOGIN_PARAMS);
  });

  test('TC-API-009 — DELETE /api/verifyLogin returns responseCode 405 (method not supported)', async ({ userApi }) => {
    Logger.info('Sending DELETE /api/verifyLogin');

    const response = await userApi.deleteVerifyLogin();

    expect(response.status()).toBe(HttpStatus.OK);
    const body = await parseApiResponse(response);

    expect(body.responseCode).toBe(ApiResponseCode.METHOD_NOT_ALLOWED);
    expect(body.message).toBe(ApiMessages.METHOD_NOT_SUPPORTED);
  });

  test('TC-API-010 — POST /api/verifyLogin with invalid credentials returns responseCode 404', async ({ userApi }) => {
    const user = randomUser();
    Logger.info(`Sending POST /api/verifyLogin with non-existent user ${user.email}`);

    const response = await userApi.verifyLogin(user.email, user.password);

    expect(response.status()).toBe(HttpStatus.OK);
    const body = await parseApiResponse(response);

    expect(body.responseCode).toBe(ApiResponseCode.NOT_FOUND);
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
    const body = await parseApiResponse(response);
    expect(body.responseCode).toBe(ApiResponseCode.CREATED);
  });

  test.afterAll(async ({ userApi }) => {
    Logger.info(`Cleaning up test user account: ${accountEmail}`);
    const response = await userApi.deleteAccount(accountEmail, accountPassword);
    await parseApiResponse(response);
  });

  test('TC-API-011 — POST /api/createAccount creates a new user and returns responseCode 201', async ({ userApi }) => {
    const user = randomUser();
    const address = randomAddress();
    const form = buildAccountForm(user, address);

    Logger.info(`Creating new account via API: ${user.email}`);
    const response = await userApi.createAccount(form);

    expect(response.status()).toBe(HttpStatus.OK);
    const body = await parseApiResponse(response);

    expect(body.responseCode).toBe(ApiResponseCode.CREATED);
    expect(body.message).toBe(ApiMessages.USER_CREATED);

    Logger.debug(`Deleting extra account: ${user.email}`);
    await userApi.deleteAccount(user.email, user.password);
  });

  test('TC-API-007 — POST /api/verifyLogin with valid credentials returns responseCode 200', async ({ userApi }) => {
    Logger.info(`Sending POST /api/verifyLogin for ${accountEmail}`);

    const response = await userApi.verifyLogin(accountEmail, accountPassword);

    expect(response.status()).toBe(HttpStatus.OK);
    const body = await parseApiResponse(response);

    expect(body.responseCode).toBe(ApiResponseCode.OK);
    expect(body.message).toBe(ApiMessages.USER_EXISTS);
  });

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

    expect(response.status()).toBe(HttpStatus.OK);
    const body = await parseApiResponse(response);

    expect(body.responseCode).toBe(ApiResponseCode.OK);
    expect(body.message).toBe(ApiMessages.USER_UPDATED);
  });

  test('TC-API-014 — GET /api/getUserDetailByEmail returns user data for a valid email', async ({ userApi }) => {
    Logger.info(`Sending GET /api/getUserDetailByEmail?email=${accountEmail}`);

    const response = await userApi.getUserByEmail(accountEmail);

    expect(response.status()).toBe(HttpStatus.OK);
    const body = await parseApiResponse(response);

    expect(body.responseCode).toBe(ApiResponseCode.OK);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(accountEmail);
    expect(body.user.name).toBe(accountName);
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('first_name');
    expect(body.user).toHaveProperty('last_name');

    if (updatedFirstName) {
      Logger.debug(`Verifying updated first_name: ${updatedFirstName}`);
      expect(body.user.first_name).toBe(updatedFirstName);
    }
  });

  test('TC-API-012 — DELETE /api/deleteAccount removes the user and returns responseCode 200', async ({ userApi }) => {
    const user = randomUser();
    const address = randomAddress();
    const form = buildAccountForm(user, address);

    Logger.info(`Creating account to delete: ${user.email}`);
    const createRes = await userApi.createAccount(form);
    const createBody = await parseApiResponse(createRes);
    expect(createBody.responseCode).toBe(ApiResponseCode.CREATED);

    Logger.info(`Sending DELETE /api/deleteAccount for ${user.email}`);
    const deleteRes = await userApi.deleteAccount(user.email, user.password);

    expect(deleteRes.status()).toBe(HttpStatus.OK);
    const deleteBody = await parseApiResponse(deleteRes);

    expect(deleteBody.responseCode).toBe(ApiResponseCode.OK);
    expect(deleteBody.message).toBe(ApiMessages.ACCOUNT_DELETED);

    Logger.debug(`Verifying account ${user.email} no longer exists`);
    const verifyRes = await userApi.verifyLogin(user.email, user.password);
    const verifyBody = await parseApiResponse(verifyRes);
    expect(verifyBody.responseCode).toBe(ApiResponseCode.NOT_FOUND);
  });

});
