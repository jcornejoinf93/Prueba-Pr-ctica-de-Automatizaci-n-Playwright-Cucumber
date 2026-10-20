import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import { DocumentoPage } from '../../pages/DocumentoPage';
import { LoginPage } from '../../pages/LoginPage';

export class PlaywrightWorld extends World {
  context?: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  documentoPage!: DocumentoPage;
  documentoFolio!: string;
  documentoRut!: string;
  montoDocumento!: number;
  updatedMontoDocumento!: number;
  updatedObservaciones!: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);
