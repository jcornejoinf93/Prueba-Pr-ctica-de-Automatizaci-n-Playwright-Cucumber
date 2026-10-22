import {
  After,
  AfterAll,
  Before,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import {
  chromium,
  request,
  type Browser,
} from '@playwright/test';
import { DocumentoPage } from '../../pages/ui/DocumentoPage';
import { DocumentoAPIPage } from '../../pages/api/DocumentoAPIPage';
import { LoginAPIPage } from '../../pages/api/LoginAPIPage';
import { LoginPage } from '../../pages/ui/LoginPage';
import { PlaywrightWorld } from './world';
import { getBaseUrl } from '../../config/environment';

setDefaultTimeout(60_000);

let browser: Browser | undefined;

Before({ tags: 'not @api' }, async function (this: PlaywrightWorld) {
  if (!browser) {
    browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
  }

  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
  this.documentoPage = new DocumentoPage(this.page);
});

Before({ tags: '@api' }, async function (this: PlaywrightWorld) {
  const baseUrl = getBaseUrl();
  this.apiContext = await request.newContext({ baseURL: baseUrl });
  this.loginAPIPage = new LoginAPIPage(this.apiContext, baseUrl);
  this.documentoAPIPage = new DocumentoAPIPage(this.apiContext);
});

After({ tags: 'not @api' }, async function (this: PlaywrightWorld) {
  await this.context?.close();
});

After({ tags: '@api' }, async function (this: PlaywrightWorld) {
  await this.apiContext?.dispose();
});

AfterAll(async () => {
  await browser?.close();
});
