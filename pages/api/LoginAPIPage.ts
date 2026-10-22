import type { APIRequestContext, APIResponse } from '@playwright/test';
import { getBaseUrl } from '../../config/environment';

export class LoginAPIPage {
  private readonly loginUrl: string;

  constructor(
    private readonly apiRequest: APIRequestContext,
    baseUrl = getBaseUrl()
  ) {
    this.loginUrl = `${baseUrl.replace(/\/+$/, '')}/api/auth/login`;
  }

  async login(email: string, password: string): Promise<APIResponse> {
    return this.apiRequest.post(this.loginUrl, {
      data: { email, password },
      headers: { 'content-type': 'application/json' },
    });
  }
}
