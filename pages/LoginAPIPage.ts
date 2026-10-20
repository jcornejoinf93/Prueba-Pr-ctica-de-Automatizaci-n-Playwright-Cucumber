import type { APIRequestContext, APIResponse } from '@playwright/test';

const defaultBaseUrl = 'http://localhost:3000';

export class LoginAPIPage {
  private readonly loginUrl: string;

  constructor(
    private readonly apiRequest: APIRequestContext,
    baseUrl = process.env.API_BASE_URL ?? process.env.BASE_URL ?? defaultBaseUrl
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
