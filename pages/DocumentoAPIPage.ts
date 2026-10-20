import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface DocumentoAPIPayload {
  tipoDte: string;
  folio: number;
  rutReceptor: string;
  monto: number;
  fechaEmision: string;
}

export class DocumentoAPIPage {
  constructor(private readonly apiRequest: APIRequestContext) {}

  async creataAPIDocumento(
    token: string,
    payload: DocumentoAPIPayload,
  ): Promise<APIResponse> {
    return this.apiRequest.post('/api/documents', {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getDocumentById(token: string, id: string): Promise<APIResponse> {
    return this.apiRequest.get(`/api/documents/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
