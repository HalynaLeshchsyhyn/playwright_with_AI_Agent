import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * API client for the Products & Brands endpoints.
 * Single Responsibility: owns all HTTP calls to /api/productsList,
 * /api/brandsList, and /api/searchProduct.
 */
export class ProductsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProducts(): Promise<APIResponse> {
    return this.request.get('/api/productsList');
  }

  async postToProducts(): Promise<APIResponse> {
    return this.request.post('/api/productsList');
  }

  async getBrands(): Promise<APIResponse> {
    return this.request.get('/api/brandsList');
  }

  async putToBrands(): Promise<APIResponse> {
    return this.request.put('/api/brandsList');
  }

  async searchProduct(searchTerm: string): Promise<APIResponse> {
    return this.request.post('/api/searchProduct', {
      form: { search_product: searchTerm },
    });
  }

  async searchProductWithoutParam(): Promise<APIResponse> {
    return this.request.post('/api/searchProduct', { form: {} });
  }
}
