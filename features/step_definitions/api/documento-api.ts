import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { randomInt } from 'node:crypto';
import { expect, type APIResponse } from '@playwright/test';
import type { DocumentoAPIFiltros, DocumentoAPIPayload } from '../../../pages/api/DocumentoAPIPage';
import { PlaywrightWorld } from '../../support/world';

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

When('creo el siguiente documento mediante API:',
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

      createResponse = await this.documentoAPIPage.creaAPIDocumento(this.apiToken,payload);
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
    this.apiDocumentId = String(
      (this.apiCreatedDocument as Record<string, unknown>).id,
    );
  },
);

Then( 'la creación del documento responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiDocumentCreateResponse?.status()).toBe(expectedStatus);
  });

Then('la respuesta de creación contiene los datos enviados',
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

  });

When('consulto el documento recién creado mediante API',
  async function (this: PlaywrightWorld) {
    this.apiDocumentGetResponse = await this.documentoAPIPage.getDocumentById( this.apiToken, this.apiDocumentId);
    this.apiAlmacenaDocResp = await this.apiDocumentGetResponse.json();
  });

Then('la consulta del documento responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiDocumentGetResponse?.status()).toBe(expectedStatus);
  });

Then('la respuesta de consulta es exactamente igual a la respuesta de creación',
  async function (this: PlaywrightWorld) {
    expect(this.apiAlmacenaDocResp).toEqual(this.apiCreatedDocument);
  });

When('modifico el monto del documento recién creado sumando {int}',
  async function (this: PlaywrightWorld, incremento: number) {
    this.apiDocumentUpdatePayload = {
      ...this.apiDocumentPayload,
      monto: this.apiDocumentPayload.monto + incremento
    };
    this.apiDocumentUpdateResponse = await this.documentoAPIPage.modificaAPIDoc(this.apiToken, this.apiDocumentId, this.apiDocumentUpdatePayload);
    this.apiDocumentUpdated = await this.apiDocumentUpdateResponse.json();
  });

Then('la modificación del documento responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiDocumentUpdateResponse?.status()).toBe(expectedStatus);
  });

Then('la respuesta de modificación contiene el cuerpo completo actualizado',
  async function (this: PlaywrightWorld) {
    const original = this.apiCreatedDocument as Record<string, unknown>;
    const updated = this.apiDocumentUpdated as Record<string, unknown>;

    expect(updated).toEqual({
      ...original,
      ...this.apiDocumentUpdatePayload,
      updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
    validaNoEdicionAPIDoc(original, updated);
  });

When('consulto el documento modificado mediante API',
  async function (this: PlaywrightWorld) {
    this.apiDocumentGetResponse = await this.documentoAPIPage.getDocumentById( this.apiToken, this.apiDocumentId);
    this.apiAlmacenaDocResp = await this.apiDocumentGetResponse.json();
  });

Then('la respuesta GET coincide exactamente con la modificación',
  async function (this: PlaywrightWorld) {
    expect(this.apiAlmacenaDocResp).toEqual(this.apiDocumentUpdated);
  });

function validaNoEdicionAPIDoc(
  original: Record<string, unknown>,
  updated: Record<string, unknown>,
): void {
  const originalSinMontoNiFechaActualizacion = { ...original };
  const actualizadoSinMontoNiFechaActualizacion = { ...updated };
  delete originalSinMontoNiFechaActualizacion.monto;
  delete originalSinMontoNiFechaActualizacion.updatedAt;
  delete actualizadoSinMontoNiFechaActualizacion.monto;
  delete actualizadoSinMontoNiFechaActualizacion.updatedAt;

  expect(Object.keys(updated).sort()).toEqual(Object.keys(original).sort());
  expect(actualizadoSinMontoNiFechaActualizacion).toEqual(
    originalSinMontoNiFechaActualizacion,
  );
}

  // Listar
When('consulto documentos mediante API con filtros:',
  async function (this: PlaywrightWorld, table: DataTable) {
    const values = table.rowsHash();
    const filtros: DocumentoAPIFiltros = {
      rut: values.rut,
      tipoDte: values.tipoDte,
    };

    this.apiDocumentFilters = filtros;
    this.apiDocumentListResponse = await this.documentoAPIPage.listarDocumentos(this.apiToken, filtros);
    this.apiDocumentListBody = await this.apiDocumentListResponse.json();
  });

Then('el listado filtrado responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiDocumentListResponse?.status()).toBe(expectedStatus);
  });

Then('el cuerpo completo del listado contiene los documentos esperados',
  async function (this: PlaywrightWorld) {
    const expectedKeys = [
      'id',
      'tipoDte',
      'folio',
      'rutReceptor',
      'monto',
      'fechaEmision',
      'estado',
      'contactEmail',
      'sendCopy',
      'deliveryChannel',
      'observaciones',
      'attachmentName',
      'createdAt',
      'updatedAt'
    ];

    expect(this.apiDocumentListBody).toEqual([
      expect.objectContaining({
        id: 'default-seed-10-1',
        tipoDte: 'DTE 33',
        folio: 9700,
        rutReceptor: '77.777.777-7',
        monto: 2230000,
        fechaEmision: '2026-09-28',
        estado: 'PENDIENTE',
        contactEmail: null,
        sendCopy: false,
        deliveryChannel: 'PORTAL',
        observaciones: null,
        attachmentName: null,
        createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      }),
    ]);

    const documents = this.apiDocumentListBody as Record<string, unknown>[];
    expect(Object.keys(documents[0]).sort()).toEqual([...expectedKeys].sort());
    expect(documents.every((document) =>
      document.rutReceptor === this.apiDocumentFilters?.rut &&
      document.tipoDte === this.apiDocumentFilters?.tipoDte
    )).toBe(true);
    expect(Number.isNaN(Date.parse(String(documents[0].createdAt)))).toBe(false);
    expect(Number.isNaN(Date.parse(String(documents[0].updatedAt)))).toBe(false);

    this.apiListedDocument = documents[0];
  });




When('consulto mediante API un id de documento inexistente {string}',
  async function (this: PlaywrightWorld, idInexistente: string) {
    this.apiResponseNotFound = await this.documentoAPIPage.getDocumentById(this.apiToken,  idInexistente);
    this.apiBodyNotFound = await this.apiResponseNotFound.json();
  });

Then('la consulta del documento inexistente responde con estado HTTP {int}',
  async function (this: PlaywrightWorld, expectedStatus: number) {
    expect(this.apiResponseNotFound?.status()).toBe(expectedStatus);
  });

Then('el cuerpo del error 404 es exactamente el esperado',
  async function (this: PlaywrightWorld) {
    expect(this.apiBodyNotFound).toEqual({
      error: 'El documento no existe en esta ejecución.',
      code: 'NOT_FOUND'
    });
  });
