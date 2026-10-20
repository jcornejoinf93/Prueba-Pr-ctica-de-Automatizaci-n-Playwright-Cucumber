import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { chromium, type Browser } from '@playwright/test';
import { DocumentoPage } from '../../pages/DocumentoPage';
import { LoginPage } from '../../pages/LoginPage';
import { PlaywrightWorld } from './world';

setDefaultTimeout(60_000);

let browser: Browser | undefined;

BeforeAll(async () => {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
  });
});

Before(async function (this: PlaywrightWorld) {
  if (!browser) {
    throw new Error('El navegador de Playwright no fue inicializado.');
  }

  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
  this.documentoPage = new DocumentoPage(this.page);
});

After(async function (this: PlaywrightWorld) {
  await this.context?.close();
});

AfterAll(async () => {
  await browser?.close();
});
