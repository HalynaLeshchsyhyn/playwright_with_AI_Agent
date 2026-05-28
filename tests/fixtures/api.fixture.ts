import { test as base } from '@playwright/test';
import { ProductsApiClient } from '../api/support/ProductsApiClient';
import { UserApiClient } from '../api/support/UserApiClient';

type ApiFixtures = {
  productsApi: ProductsApiClient;
  userApi:     UserApiClient;
};

export const test = base.extend<ApiFixtures>({
  productsApi: async ({ request }, use) => use(new ProductsApiClient(request)),
  userApi:     async ({ request }, use) => use(new UserApiClient(request)),
});

export { expect } from '@playwright/test';
