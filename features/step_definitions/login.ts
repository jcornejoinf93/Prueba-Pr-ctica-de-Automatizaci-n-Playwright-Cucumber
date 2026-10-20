import { Given, Then, When } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../support/world';

Given('Usuario se encuentra en la pagina para iniciar sesion',
  async function (this: PlaywrightWorld) {
    await this.loginPage.open();
  });

When('Un usuario digita el nombre de usuario {string}, la clave {string}, y da click sobre el boton para iniciar sesion',
  async function (this: PlaywrightWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  });

Then('Accede al home de la app', async function (this: PlaywrightWorld) {
    await this.loginPage.expectDashboard();
  }
);
