import { expect, type Page } from '@playwright/test';

const defaultBaseUrl = 'http://localhost:3000';

export class LoginPage {
  private readonly baseUrl: string;

  constructor(
    private readonly page: Page,
    baseUrl = process.env.BASE_URL ?? defaultBaseUrl,
  ) {
    this.baseUrl = baseUrl;
  }

  async open(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/login`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.page
      .getByRole('textbox', {
        name: 'Usuario o Correo Electrónico',
        exact: true,
      })
      .fill(username);

    await this.page
      .getByRole('textbox', { name: 'Contraseña', exact: true })
      .fill(password);

    await this.page
      .getByRole('button', { name: 'Iniciar Sesión', exact: true })
      .click();
  }

  async expectDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(`${this.baseUrl}/dashboard`);
  }
}
