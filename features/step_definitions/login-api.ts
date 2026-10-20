import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../support/world';

When('envío la solicitud de login con las credenciales configuradas',
  async function (this: PlaywrightWorld) {
    const email = process.env.API_LOGIN_EMAIL;
    const password = process.env.API_LOGIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'Configura las variables API_LOGIN_EMAIL y API_LOGIN_PASSWORD antes de ejecutar el escenario @api.',
      );
    }

    this.apiLoginResponse = await this.loginAPIPage.login(email, password);
  });

Then('la API responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiLoginResponse?.status()).toBe(expectedStatus);
  });
