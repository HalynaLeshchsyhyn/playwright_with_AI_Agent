import { test, expect } from '../fixtures/api.fixture';
import { Logger } from '../../helpers/logger';
import { ApiMessages } from './support/ApiMessages';

test.describe('Products & Brands API', () => {

  // ─── Products List ──────────────────────────────────────────────────────────

  test('TC-API-001 — GET /api/productsList returns 200 with a non-empty products array', async ({ productsApi }) => {
    Logger.info('Sending GET /api/productsList');
    const response = await productsApi.getProducts();

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, products count: ${body.products?.length}`);

    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBeTruthy();
    expect(body.products.length).toBeGreaterThan(0);

    const first = body.products[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('price');
    expect(first).toHaveProperty('brand');
    expect(first).toHaveProperty('category');
  });

  test('TC-API-002 — POST /api/productsList returns responseCode 405 (method not supported)', async ({ productsApi }) => {
    Logger.info('Sending POST /api/productsList');
    const response = await productsApi.postToProducts();

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe(ApiMessages.METHOD_NOT_SUPPORTED);
  });

  // ─── Brands List ────────────────────────────────────────────────────────────

  test('TC-API-003 — GET /api/brandsList returns 200 with a non-empty brands array', async ({ productsApi }) => {
    Logger.info('Sending GET /api/brandsList');
    const response = await productsApi.getBrands();

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, brands count: ${body.brands?.length}`);

    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.brands)).toBeTruthy();
    expect(body.brands.length).toBeGreaterThan(0);

    const first = body.brands[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('brand');
  });

  test('TC-API-004 — PUT /api/brandsList returns responseCode 405 (method not supported)', async ({ productsApi }) => {
    Logger.info('Sending PUT /api/brandsList');
    const response = await productsApi.putToBrands();

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(405);
    expect(body.message).toBe(ApiMessages.METHOD_NOT_SUPPORTED);
  });

  // ─── Search Product ─────────────────────────────────────────────────────────

  test('TC-API-005 — POST /api/searchProduct with valid search_product returns matching products', async ({ productsApi }) => {
    const searchTerm = 'top';
    Logger.info(`Sending POST /api/searchProduct with search_product="${searchTerm}"`);

    const response = await productsApi.searchProduct(searchTerm);

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, products found: ${body.products?.length}`);

    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBeTruthy();
    expect(body.products.length).toBeGreaterThan(0);

    // Every product name should contain the search term (case-insensitive)
    for (const product of body.products) {
      expect(product.name.toLowerCase()).toContain(searchTerm);
    }
  });

  test('TC-API-006 — POST /api/searchProduct without search_product param returns responseCode 400', async ({ productsApi }) => {
    Logger.info('Sending POST /api/searchProduct without search_product parameter');

    const response = await productsApi.searchProductWithoutParam();

    Logger.debug(`HTTP status: ${response.status()}`);
    expect(response.status()).toBe(200); // API always returns HTTP 200

    const body = await response.json();
    Logger.debug(`Response code: ${body.responseCode}, message: ${body.message}`);

    expect(body.responseCode).toBe(400);
    expect(body.message).toBe(ApiMessages.MISSING_SEARCH_PRODUCT);
  });

});
