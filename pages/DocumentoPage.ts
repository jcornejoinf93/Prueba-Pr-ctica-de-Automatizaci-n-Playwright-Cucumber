import { expect, type Locator, type Page } from '@playwright/test';

export interface DocumentFormValues {
  tipo: string;
  folio: string;
  rut: string;
  monto: string;
  observaciones?: string;
}

export interface DocumentRowValues {
  tipo: string;
  rut: string;
  monto: string;
  estado: string;
}

export class DocumentoPage {
  constructor(private readonly page: Page) {}


  // modal dialog de crear documento
  private get newDocumentDialog(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Emitir nuevo documento',
      exact: true
    });
  }

  // modal dialog de editar documento
  private editDocumentDialog(folio: string): Locator {
    return this.page.getByRole('dialog', {name: new RegExp(`^Editar documento - Folio #${folio}$`)});
  }

  // Crear documento 
  async crearDocumento(buttonName: string): Promise<void> {
    await this.page.getByRole('button', { name: buttonName, exact: true }).click();
    await expect(this.newDocumentDialog).toBeVisible();
  }

  private get documentTable(): Locator {
    return this.page.getByRole('table', {name: 'Tabla de Documentos Tributarios', exact: true});
  }

  private documentRow(folio: string): Locator {
    return this.documentTable.getByRole('row', {
      name: new RegExp(`#${folio}\\b`),
    });
  }

  async completaFormularioDoc(values: DocumentFormValues): Promise<void> {
    await this.newDocumentDialog.getByRole('combobox', {
        name: 'Tipo de documento tributario *',
        exact: true
      }).selectOption({ label: values.tipo });

    await this.newDocumentDialog.locator('#input-folio').fill(values.folio);
    await this.newDocumentDialog
      .getByRole('textbox', { name: 'RUT receptor *', exact: true }).fill(values.rut);
    await this.newDocumentDialog.locator('#input-monto').fill(values.monto);

    if (values.observaciones) {
      await this.newDocumentDialog.getByRole('textbox', { name: 'Observaciones', exact: true }).fill(values.observaciones);
    }
  }

  // Click en boton para crear documento luego de llenar el formulario
  async emiteDocumento(): Promise<void> {
    await this.newDocumentDialog.getByRole('button', { name: 'Guardar y emitir', exact: true }).click();
  }

  async validaDocumentoCreado(folio: string): Promise<void> {
    await expect(
      this.page.getByText(`Documento folio ${folio} emitido correctamente.`, { exact: true })).toBeVisible();
  }

  async validaDocumentoTabla(folio: string, expected: DocumentRowValues): Promise<void> {
    const row = this.documentRow(folio);

    await expect(row).toBeVisible();
    await expect(row).toContainText(`#${folio}`);
    await expect(row).toContainText(expected.tipo);
    await expect(row).toContainText(expected.rut);
    await expect(row).toContainText(expected.monto);
    await expect(row).toContainText(expected.estado);
  }


  // Edirar documento
  async editaDocumento(folio: string): Promise<void> {
    const row = this.documentRow(folio);

    await expect(row).toBeVisible();
    await row.getByRole('button', {name: `Editar folio ${folio}`,exact: true}).click();
    await expect(this.editDocumentDialog(folio)).toBeVisible();
  }

  // editar monto sumando 100
  async expectEditAmount(folio: string, amount: number): Promise<void> {
    await expect(this.editDocumentDialog(folio).locator('#input-monto')).toHaveValue(String(amount));
  }

  // agregar observacion en textarea
  async actualizaDocumento(folio: string, monto: number, observaciones: string): Promise<void> {
    const dialog = this.editDocumentDialog(folio);

    await dialog.locator('#input-monto').fill(String(monto));
    await dialog.locator('#input-observaciones').fill(observaciones);
  }

  // guardar cambios posterior a editar en formulario
  async guardarCambios(folio: string): Promise<void> {
    await this.editDocumentDialog(folio).getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  }

  // Validaciones de la edicion
  async validaDocumentoActualizado(folio: string): Promise<void> {
    await expect(this.page.getByText(`Documento folio ${folio} actualizado correctamente.`, { exact: true })).toBeVisible();
  }

  async expectUpdatedRowAfterReload(folio: string, updatedAmount: number): Promise<void> {
    const row = this.documentRow(folio);
    const formattedAmount = `$ ${new Intl.NumberFormat('es-CL').format(updatedAmount)} CLP`;

    await expect(row).toBeVisible();
    await expect(row).toContainText(`#${folio}`);
    await expect(row).toContainText(formattedAmount);
  }

    async expectEditedValuesAfterReload(folio: string, updatedAmount: number,observations: string): Promise<void> {
    await this.editaDocumento(folio);

    const dialog = this.editDocumentDialog(folio);
    await expect(dialog.locator('#input-monto')).toHaveValue(
      String(updatedAmount),
    );
    await expect(dialog.locator('#input-observaciones')).toHaveValue(observations);
  }



  // Elimina documento
  async eliminaDocumento(folio: string, rut: string): Promise<void> {
    const row = this.documentRow(folio);

    //await expect(row).toBeVisible();
    await row.getByRole('button', {name: `Eliminar folio ${folio}`,exact: true}).click();

    const dialog = this.page.getByRole('alertdialog', {name: 'Eliminar documento', exact: true});

    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(`folio #${folio}`);
    await expect(dialog).toContainText(rut);
  }

  // Click en boton eliminar documento en modal de dialogo
  async confirmaEliminacion(): Promise<void> {
    await this.page.getByRole('alertdialog', { name: 'Eliminar documento', exact: true})
    .getByRole('button', { name: 'Eliminar documento', exact: true}).click();
  }

  // Validar mensaje en verde documento eliminado correctamente
  async validaDocumentoEliminado(folio: string): Promise<void> {
    await expect( this.page.getByText(`Documento folio ${folio} eliminado correctamente.`,  { exact: true })).toBeVisible();
  }

  // Valida que folio no exista en la fila de la tabla
  async validaDocumentoAusente(folio: string): Promise<void> {
    await expect(this.documentRow(folio)).toHaveCount(0);
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await expect(this.documentTable).toBeVisible();
  }

  async reloadElimina(rut: string): Promise<void> {
    await this.reload();
    await this.buscarRutDocument(rut.trim());
    await this.validaSinResultados();
  }

  // Buscar documento
  async buscarRutDocument(rut: string): Promise<void> {
    await this.page.getByRole('textbox', {name: 'Buscar por RUT Receptor', exact: true}).fill(rut);
    await this.page.getByRole('button', { name: 'Buscar', exact: true }).click();
  }

  async validaResultadosBusqueda(rut: string): Promise<void> {
    const matchingRows = this.documentTable
      .getByRole('row')
      .filter({ hasText: rut });

    await expect(matchingRows.first()).toBeVisible();
    await expect(matchingRows.first()).toContainText(rut);
  }

  async validaSinResultados(): Promise<void> {
  await expect(
    this.page.getByText('No se encontraron documentos DTE para los criterios seleccionados.', { exact: true }))
    .toBeVisible();
  }
}
