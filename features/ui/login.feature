Feature: Login
     La página de inicio de sesión funcionará con las credenciales correctas del usuario.

    Scenario: Login exitoso
    Given Usuario se encuentra en la pagina para iniciar sesion
    When Un usuario digita el nombre de usuario "admin@azurian.com", la clave "Azurian2026!", y da click sobre el boton para iniciar sesion
    Then Accede al home de la app