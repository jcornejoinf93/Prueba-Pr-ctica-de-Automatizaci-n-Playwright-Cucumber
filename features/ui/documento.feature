@UI
Feature: Gestión de documentos tributarios

  Background:
    Given Usuario se encuentra en la pagina para iniciar sesion
    When Un usuario digita el nombre de usuario "admin@azurian.com", la clave "Azurian2026!", y da click sobre el boton para iniciar sesion
    Then Accede al home de la app

  @UI @crear
  Scenario: Crear un documento tributario desde el portal
    When el usuario hace click en el botón "Nuevo documento"
    And completa el formulario de documento con:
      | tipo          | DTE 33 - Factura Electrónica          |
      | folio         | auto                                  |
      | rut           | 77.107.554-1                          |
      | monto         | 150000                                |
      | observaciones | Documento creado por automatizaciónPW |
    And guarda y emite el documento
    Then debería mostrar el aviso de éxito del documento
    And la fila del documento nuevo debe mostrar:
      | tipo   | DTE 33          |
      | rut    | 77.107.554-1    |
      | monto  | $ 150.000 CLP   |
      | estado | Pendiente       |

  @UI @editar
  Scenario: Editar un documento tributario creado desde el portal
    When el usuario hace click en el botón "Nuevo documento"
    And completa el formulario de documento con:
      | tipo          | DTE 33 - Factura Electrónica          |
      | folio         | auto                                  |
      | rut           | 77.107.554-1                          |
      | monto         | 150000                                |
      | observaciones | Documento creado por automatizaciónPW |
    And guarda y emite el documento
    When el usuario abre la edición del documento creado
    And actualiza el monto total sumando 100 y escribe "actualizado..." en observaciones
    And guarda los cambios del documento
    Then debería mostrar el aviso de éxito de la actualización
    And la fila del documento actualizado debe mostrar:
      | tipo   | DTE 33          |
      | rut    | 77.107.554-1    |
      | monto  | $ 150.100 CLP   |
      | estado | Pendiente       |
    When recarga la página de documentos
    And el formulario de edición debe conservar los cambios

  @UI @buscar
  Scenario: Buscar documentos por RUT receptor
    When busca documentos por el RUT receptor "77.777.777-7"
    Then debería mostrar resultados para el RUT "77.777.777-7"

  @UI @eliminar
  Scenario: Eliminar un documento tributario desde el portal
    When el usuario hace click en el botón "Nuevo documento"
    And completa el formulario de documento con:
      | tipo          | DTE 33 - Factura Electrónica        |
      | folio         | auto                                |
      | rut           | 77.107.554-1                        |
      | monto         | 150000                              |
      | observaciones | Documento creado por automatización |
    And guarda y emite el documento
    Then debería mostrar el aviso de éxito del documento
    And la fila del documento nuevo debe mostrar:
      | tipo   | DTE 33        |
      | rut    | 77.107.554-1  |
      | monto  | $ 150.000 CLP |
      | estado | Pendiente     |
    When el usuario abre la confirmación de eliminación del documento creado
    And confirma la eliminación del documento
    Then debería mostrar el aviso de éxito de la eliminación
    And la fila del documento eliminado no debe mostrarse
    Then el documento eliminado no debe mostrarse después de recargar
    
