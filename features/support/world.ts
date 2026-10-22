import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type {
  APIRequestContext,
  APIResponse,
  BrowserContext,
  Page,
} from '@playwright/test';
import { DocumentoPage } from '../../pages/ui/DocumentoPage';
import type {
  DocumentoAPIFiltros,
  DocumentoAPIPayload,
  DocumentoAPIPage,
} from '../../pages/api/DocumentoAPIPage';
import { LoginAPIPage } from '../../pages/api/LoginAPIPage';
import { LoginPage } from '../../pages/ui/LoginPage';

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
  apiDocumentUpdatePayload!: DocumentoAPIPayload;
  apiDocumentUpdateResponse?: APIResponse;
  apiDocumentUpdated?: unknown;
  apiDocumentGetResponse?: APIResponse;
  apiAlmacenaDocResp?: unknown;
  apiDocumentFilters?: DocumentoAPIFiltros;
  apiDocumentListResponse?: APIResponse;
  apiDocumentListBody?: unknown;
  apiListedDocument?: Record<string, unknown>;
  apiListedDocumentDetailResponse?: APIResponse;
  apiListedDocumentDetailBody?: unknown;
  apiResponseNotFound?: APIResponse;
  apiBodyNotFound?: unknown;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);
