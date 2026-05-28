import { APIRequestContext, APIResponse } from '@playwright/test';
import { AccountFormData } from './types';

/**
 * API client for the User Account endpoints.
 * Single Responsibility: owns all HTTP calls to /api/verifyLogin,
 * /api/createAccount, /api/deleteAccount, /api/updateAccount,
 * and /api/getUserDetailByEmail.
 */
export class UserApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async verifyLogin(email: string, password: string): Promise<APIResponse> {
    return this.request.post('/api/verifyLogin', {
      form: { email, password },
    });
  }

  async verifyLoginWithoutEmail(password: string): Promise<APIResponse> {
    return this.request.post('/api/verifyLogin', {
      form: { password },
    });
  }

  async deleteVerifyLogin(): Promise<APIResponse> {
    return this.request.delete('/api/verifyLogin');
  }

  async createAccount(form: AccountFormData): Promise<APIResponse> {
    return this.request.post('/api/createAccount', { form });
  }

  async deleteAccount(email: string, password: string): Promise<APIResponse> {
    return this.request.delete('/api/deleteAccount', {
      form: { email, password },
    });
  }

  async updateAccount(form: AccountFormData): Promise<APIResponse> {
    return this.request.put('/api/updateAccount', { form });
  }

  async getUserByEmail(email: string): Promise<APIResponse> {
    return this.request.get('/api/getUserDetailByEmail', {
      params: { email },
    });
  }
}
