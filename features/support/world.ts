import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type {
  APIRequestContext,
  APIResponse,
  BrowserContext,
  Page,
} from '@playwright/test';
import { DocumentoPage } from '../../pages/DocumentoPage';
import type { DocumentoAPIPayload, DocumentoAPIPage } from '../../pages/DocumentoAPIPage';
import { LoginAPIPage } from '../../pages/LoginAPIPage';
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
  apiContext?: APIRequestContext;
  loginAPIPage!: LoginAPIPage;
  apiLoginResponse?: APIResponse;
  documentoAPIPage!: DocumentoAPIPage;
  apiToken!: string;
  apiDocumentPayload!: DocumentoAPIPayload;
  apiDocumentCreateResponse?: APIResponse;
  apiCreatedDocument?: unknown;
  apiDocumentId!: string;
  apiDocumentGetResponse?: APIResponse;
  apiRetrievedDocument?: unknown;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);
