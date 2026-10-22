import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface DocumentoAPIPayload {
  tipoDte: string;
  folio: number;
  rutReceptor: string;
  monto: number;
  fechaEmision: string;
}

export interface DocumentoAPIFiltros {
  rut?: string;
  tipoDte?: string;
  estado?: string;
  page?: number;
  pageSize?: number;
}

export class DocumentoAPIPage {
  constructor(private readonly apiRequest: APIRequestContext) {}

  async creaAPIDocumento(token: string, payload: DocumentoAPIPayload): Promise<APIResponse> {
    return this.apiRequest.post('/api/documents', {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // modifica documento por id
  async modificaAPIDoc(token: string,  id: string, payload: DocumentoAPIPayload): Promise<APIResponse> {
    return this.apiRequest.put(`/api/documents/${(id)}`, {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Lista un unico documento por id
  async getDocumentById(token: string, id: string): Promise<APIResponse> {
    return this.apiRequest.get(`/api/documents/${(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Lista todos los documentos
  async listarDocumentos(token: string, filtros: DocumentoAPIFiltros): Promise<APIResponse> {
    const params: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(filtros)) {
      if (value !== undefined) {
        params[key] = value;
      }
    }
    return this.apiRequest.get('/api/documents', {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
