import { DataTable, Then, When } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../../support/world';

const rowValues = (table: DataTable) => {
  const values = table.rowsHash();

  return {
    tipo: values.tipo,
    rut: values.rut,
    monto: values.monto,
    estado: values.estado,
  };
};

When('el usuario hace click en el botón {string}',
  async function (this: PlaywrightWorld, buttonName: string) {
    await this.documentoPage.crearDocumento(buttonName);
  });

When('completa el formulario de documento con:',
  async function (this: PlaywrightWorld, table: DataTable) {
    const values = table.rowsHash();
    const folio = '159';
      

    this.documentoFolio = folio;
    this.documentoRut = values.rut;
    this.montoDocumento = Number(values.monto);

    await this.documentoPage.completaFormularioDoc({
      tipo: values.tipo,
      folio,
      rut: values.rut,
      monto: values.monto,
      observaciones: values.observaciones,
    });
  });

When('guarda y emite el documento',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.emiteDocumento();
  });

Then('debería mostrar el aviso de éxito del documento',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.validaDocumentoCreado(this.documentoFolio);
  });

Then('la fila del documento nuevo debe mostrar:',
  async function (this: PlaywrightWorld, table: DataTable) {
    await this.documentoPage.validaDocumentoTabla(
      this.documentoFolio,
      rowValues(table),
    );
  });

When('el usuario abre la edición del documento creado',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.editaDocumento(this.documentoFolio);
    await this.documentoPage.expectEditAmount(this.documentoFolio, this.montoDocumento);
  });

When('actualiza el monto total sumando 100 y escribe {string} en observaciones',
  async function (this: PlaywrightWorld, observacion: string) {
    this.updatedMontoDocumento = this.montoDocumento + 100;
    this.updatedObservaciones = observacion;

    await this.documentoPage.actualizaDocumento(
      this.documentoFolio,
      this.updatedMontoDocumento,
      observacion,
    );
  });

When('guarda los cambios del documento',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.guardarCambios(this.documentoFolio);
  });

Then('debería mostrar el aviso de éxito de la actualización',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.validaDocumentoActualizado(this.documentoFolio);
  });

Then('la fila del documento actualizado debe mostrar:',
  async function (this: PlaywrightWorld, table: DataTable) {
    await this.documentoPage.validaDocumentoTabla(
      this.documentoFolio,
      rowValues(table)
    );
  });

When('recarga la página de documentos',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.reload();
  });

Then('el formulario de edición debe conservar los cambios',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.expectUpdatedRowAfterReload(this.documentoFolio, this.updatedMontoDocumento);
    await this.documentoPage.expectEditedValuesAfterReload(
      this.documentoFolio,
      this.updatedMontoDocumento,
      this.updatedObservaciones
    );
  });

When('el usuario abre la confirmación de eliminación del documento creado',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.eliminaDocumento(this.documentoFolio,'77.107.554-1');
  });

When('confirma la eliminación del documento',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.confirmaEliminacion();
  });

Then('debería mostrar el aviso de éxito de la eliminación',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.validaDocumentoEliminado(this.documentoFolio);
  });

Then('la fila del documento eliminado no debe mostrarse',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.validaDocumentoAusente(this.documentoFolio);
  });

Then('el documento eliminado no debe mostrarse después de recargar',
  async function (this: PlaywrightWorld) {
    await this.documentoPage.reloadElimina(this.documentoRut);
  });

When('busca documentos por el RUT receptor {string}',
  async function (this: PlaywrightWorld, rut: string) {
    await this.documentoPage.buscarRutDocument(rut);
  });

Then('debería mostrar resultados para el RUT {string}',
  async function (this: PlaywrightWorld, rut: string) {
    await this.documentoPage.validaResultadosBusqueda(rut);
  });
