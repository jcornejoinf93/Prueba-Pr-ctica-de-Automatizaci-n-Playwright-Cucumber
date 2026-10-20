import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { randomInt } from 'node:crypto';
import { expect, type APIResponse } from '@playwright/test';
import type { DocumentoAPIPayload } from '../../pages/DocumentoAPIPage';
import { PlaywrightWorld } from '../support/world';

Given('inicio sesión en la API con las credenciales configuradas',
  async function (this: PlaywrightWorld) {
    const email = process.env.API_LOGIN_EMAIL;
    const password = process.env.API_LOGIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'Configura API_LOGIN_EMAIL y API_LOGIN_PASSWORD en .env para ejecutar el escenario @api.',
      );
    }

    this.apiLoginResponse = await this.loginAPIPage.login(email, password);
    expect(this.apiLoginResponse.status()).toBe(200);

    const loginBody = await this.apiLoginResponse.json();
    expect(loginBody).toEqual(
      expect.objectContaining({ token: expect.any(String) }),
    );
    this.apiToken = loginBody.token as string;
  });

When( 'creo el siguiente documento mediante API:',
  async function (this: PlaywrightWorld, table: DataTable) {
    const values = table.rowsHash();
    const generateFolio = values.folio.toLowerCase() === 'auto';
    const payload: DocumentoAPIPayload = {
      tipoDte: values.tipoDte,
      folio: generateFolio ? 0 : Number(values.folio),
      rutReceptor: values.rutReceptor,
      monto: Number(values.monto),
      fechaEmision: values.fechaEmision,
    };

    const maxAttempts = generateFolio ? 5 : 1;
    let createResponse: APIResponse | undefined;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (generateFolio) {
        payload.folio = randomInt(1_000_000, 10_000_000);
      }

      createResponse = await this.documentoAPIPage.creataAPIDocumento(this.apiToken,payload);
      this.apiDocumentCreateResponse = createResponse;

      if (createResponse.status() !== 409) {
        break;
      }

      const errorBody = await createResponse.json();
      if (errorBody.code !== 'DUPLICATE_FOLIO' || attempt === maxAttempts - 1) {
        break;
      }
    }

    if (!createResponse) {
      throw new Error('No se recibió respuesta al crear el documento.');
    }

    this.apiDocumentPayload = { ...payload };
    this.apiCreatedDocument = await createResponse.json();
  },
);

Then( 'la creación del documento responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiDocumentCreateResponse?.status()).toBe(expectedStatus);
  });

Then('la respuesta de creación contiene los datos enviados y los metadatos asignados',
  async function (this: PlaywrightWorld) {
    const created = this.apiCreatedDocument as Record<string, unknown>;

    expect(created).toEqual(
      expect.objectContaining({ ...this.apiDocumentPayload }),
    );
    expect(created).toEqual(
      expect.objectContaining({
        id: expect.anything(),
        estado: expect.any(String),
      }),
    );

    const dateFields = Object.entries(created).filter(
      ([key, value]) =>
        /fecha|date|created|updated|creacion|actualizacion/i.test(key) &&
        typeof value === 'string'
    );
    expect(dateFields.length).toBeGreaterThan(0);
    for (const [key, value] of dateFields) {
      expect(
        Number.isNaN(Date.parse(String(value))),
        `La fecha ${key} debe ser válida`,
      ).toBe(false);
    }

    this.apiDocumentId = String(created.id);
  });

When('consulto el documento recién creado mediante API',
  async function (this: PlaywrightWorld) {
    this.apiDocumentGetResponse = await this.documentoAPIPage.getDocumentById(
      this.apiToken,
      this.apiDocumentId,
    );
    this.apiRetrievedDocument = await this.apiDocumentGetResponse.json();
  });

Then('la consulta del documento responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiDocumentGetResponse?.status()).toBe(expectedStatus);
  });

Then('la respuesta de consulta es exactamente igual a la respuesta de creación',
  async function (this: PlaywrightWorld) {
    expect(this.apiRetrievedDocument).toEqual(this.apiCreatedDocument);
  });
