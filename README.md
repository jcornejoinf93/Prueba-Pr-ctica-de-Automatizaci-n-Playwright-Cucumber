# Pruebas automatizadas con Playwright y Cucumber

Proyecto de automatización 🚀 para el portal y su API local. Los escenarios BDD se encuentran en `features/` y usan Playwright para la interacción con el navegador y las solicitudes HTTP. 


## Requisitos

- Node.js 22, 24 o 26+, y npm (versiones compatibles con Cucumber 13.3).
- La aplicación web y su API levantadas en la URL configurada en `BASE_URL` dentro del archivo `.env`. Este repositorio contiene las pruebas; no inicia la aplicación.

## Obtener el proyecto e instalar dependencias

Clona el repositorio desde GitHub. Luego, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm ci
```

Para ejecutar escenarios de interfaz, instala Chromium:

```bash
npx playwright install chromium
```

Si también vas a ejecutar pruebas nativas de Playwright en los tres navegadores configurados (Chromium, Firefox y WebKit), instala todos:

```bash
npx playwright install
```

Los escenarios `@api` no requieren instalar navegadores.

## Configurar credenciales y URL

Cucumber y Playwright cargan automáticamente las variables del archivo `.env`.
Crea un archivo local `.env` a partir de la plantilla `.env.example` y configura `BASE_URL` con la URL base de la aplicación:



En el `.env`, reemplaza `your-password-here` por la contraseña de un usuario de prueba válido. La plantilla `.env.example` no contiene una contraseña real.

La plantilla también define `API_LOGIN_EMAIL` y `API_LOGIN_PASSWORD`, utilizados por el escenario de login API. La misma variable `BASE_URL` se usa para las pruebas de interfaz y API; no es necesario configurar una URL adicional.
Para cambiar la dirección de la aplicación, basta con editar `BASE_URL` en `.env`; no necesitas modificar `hooks.ts` ni las páginas del proyecto.


## Ejecutar las pruebas Cucumber

Antes de ejecutar pruebas, inicia la aplicación y confirma que el portal está disponible en la URL configurada.

```bash
# Todas las pruebas (API y UI)
npm run test:cucumber

# Solo pruebas de interfaz
npm run test:cucumber:ui

# Solo prueba de login UI
npm run test:cucumber -- features/ui/login.feature

# Pruebas solo de interfaz, visualizando la ejecución desde navegador
npm run test:cucumber:ui:headed

# Pruebas de API (usan las credenciales de .env; no abren navegador)
npm run test:cucumber:api

```

## Reportes

Cucumber genera:

- `reports/cucumber-report.html`: reporte HTML.
- `reports/cucumber-report.json`: resultados JSON.
- `allure-results/`: datos fuente para Allure.


```bash
npm run allure:report
```

Para limpiar manualmente los artefactos Allure:

```bash
npm run allure:clean
```

Los reportes generados están excluidos de Git y no se suben al repositorio.

## Muchas gracias afición 🫰⏱️


