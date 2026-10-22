@api
Feature: Gestión de documentos tributarios mediante API
  Como consumidor de la API
  Quiero crear y consultar un documento tributario
  Para comprobar que sus datos se persisten correctamente

  Background:
    Given inicio sesión en la API con las credenciales configuradas

  @api @crearApi
  Scenario: Crear un documento y consultar exactamente su respuesta
    When creo el siguiente documento mediante API:
      | tipoDte      | DTE 33       |
      | folio        | auto         |
      | rutReceptor  | 77.107.554-1 |
      | monto        | 450000       |
      | fechaEmision | 2026-09-28   |
    Then la creación del documento responde con estado HTTP 201
    And la respuesta de creación contiene los datos enviados
    When consulto el documento recién creado mediante API
    Then la consulta del documento responde con estado HTTP 200
    And la respuesta de consulta es exactamente igual a la respuesta de creación

  @api @modificarApi
  Scenario: Modificar el monto de un documento propio y verificar que persiste
    When creo el siguiente documento mediante API:
      | tipoDte      | DTE 33       |
      | folio        | auto         |
      | rutReceptor  | 76.192.083-9 |
      | monto        | 100          |
      | fechaEmision | 2026-09-28   |
    When modifico el monto del documento recién creado sumando 3500
    Then la modificación del documento responde con estado HTTP 200
    And la respuesta de modificación contiene el cuerpo completo actualizado
    When consulto el documento modificado mediante API
    Then la consulta del documento responde con estado HTTP 200
    And la respuesta GET coincide exactamente con la modificación

  @api @listarApi
  Scenario: Listar por RUT y tipo DTE, consultar detalle y validar documento inexistente
    When consulto documentos mediante API con filtros:
      | rut     | 77.777.777-7 |
      | tipoDte | DTE 33       |
    Then el listado filtrado responde con estado HTTP 200
    And el cuerpo completo del listado contiene los documentos esperados
    When consulto mediante API un id de documento inexistente "id-inexistente-404"
    Then la consulta del documento inexistente responde con estado HTTP 404
    And el cuerpo del error 404 es exactamente el esperado
