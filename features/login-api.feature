Feature: Login mediante API
  Como consumidor de la API
  Quiero autenticarme con credenciales válidas
  Para recibir una respuesta exitosa del servicio de autenticación

  @api
  Scenario: Login exitoso mediante API
    When envío la solicitud de login con las credenciales configuradas
    Then la API responde con estado HTTP 200
