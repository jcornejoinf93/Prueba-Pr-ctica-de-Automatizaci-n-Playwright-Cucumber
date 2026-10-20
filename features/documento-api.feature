@api
Feature: Gestión de documentos tributarios mediante API
  Como consumidor de la API
  Quiero crear y consultar un documento tributario
  Para comprobar que sus datos se persisten correctamente

  Background:
    Given inicio sesión en la API con las credenciales configuradas

  Scenario: Crear un documento y consultar exactamente su respuesta
    When creo el siguiente documento mediante API:
      | tipoDte      | DTE 33       |
      | folio        | auto         |
      | rutReceptor  | 77.107.554-1 |
      | monto        | 450000       |
      | fechaEmision | 2026-09-28   |
    Then la creación del documento responde con estado HTTP 201
    And la respuesta de creación contiene los datos enviados y los metadatos asignados
    When consulto el documento recién creado mediante API
    Then la consulta del documento responde con estado HTTP 200
    And la respuesta de consulta es exactamente igual a la respuesta de creación
