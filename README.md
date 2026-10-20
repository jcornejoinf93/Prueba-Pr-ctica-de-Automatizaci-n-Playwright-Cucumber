# Pruebas automatizadas con Playwright y Cucumber

Proyecto de automatización para el portal y su API local. Los escenarios BDD se encuentran en `features/` y usan Playwright para la interacción con el navegador y las solicitudes HTTP.

## Requisitos

- Node.js 22, 24 o 26+, y npm (versiones compatibles con Cucumber 13.3).
- Git, si vas a clonar el repositorio.
- La aplicación web y su API levantadas en `http://localhost:3000`. Este repositorio contiene las pruebas; no inicia la aplicación.

Comprueba las versiones con:

```bash
node --version
npm --version
```

## Obtener el proyecto e instalar dependencias

Clona el repositorio o descarga y descomprime el ZIP desde GitHub. Luego, abre una terminal en la carpeta del proyecto y ejecuta:

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

Cucumber carga automáticamente las variables del archivo `.env`. Crea tu archivo local a partir de la plantilla:

En Windows PowerShell:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

En macOS o Linux:

```bash
test -f .env || cp .env.example .env
```

En `.env`, reemplaza `your-password-here` por la contraseña de un usuario de prueba válido para el API. No subas `.env` a GitHub: está excluido en `.gitignore`. La plantilla `.env.example` no contiene una contraseña real.

La plantilla define `API_LOGIN_EMAIL` y `API_LOGIN_PASSWORD`, utilizados por el escenario de login API. Por defecto, tanto el portal como el API usan `http://localhost:3000`. Si tu aplicación corre en otra dirección, puedes añadir al `.env`:

```dotenv
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
```

`BASE_URL` configura el portal; `API_BASE_URL` configura el API, cuyo login se solicita en `/api/auth/login`.

Los escenarios de interfaz usan un usuario de prueba escrito actualmente en los archivos Gherkin `features/login.feature` y `features/documento.feature`. Debe existir y ser válido en la aplicación local; si tus credenciales son distintas, actualízalas allí. No uses credenciales reales en archivos que vayan a publicarse.

## Ejecutar las pruebas Cucumber

Antes de ejecutar pruebas de interfaz, inicia la aplicación y confirma que el portal está disponible en la URL configurada.

```bash
# Todos los escenarios (API y UI)
npm run test:cucumber

# Solo los escenarios de interfaz de documentos
npm run test:cucumber:ui

# Solo el escenario de login UI
npm run test:cucumber -- features/login.feature

# Interfaz visible durante la ejecución
npm run test:cucumber:ui:headed

# Solo el login API (usa las credenciales de .env; no abre navegador)
npm run test:cucumber:api

# Ejecutar Cucumber en modo dry-run
npm run test:cucumber:dry
```

El escenario `documento-api.feature` crea un documento con un folio numérico aleatorio (y lo reintenta si el API señala una colisión), luego lo consulta por ID. Los escenarios de creación, edición y eliminación modifican datos; ejecútalos contra un entorno de prueba.


## Playwright Test y verificación de TypeScript

El runner nativo de Playwright está configurado para buscar archivos `*.spec.ts` en `tests/` y probar Chromium, Firefox y WebKit. Actualmente, los escenarios implementados en este repositorio son los de Cucumber bajo `features/`; si no hay archivos de prueba en `tests/`, `npm run test:playwright` no encontrará pruebas.

```bash
npm run test:playwright
npm run typecheck
```

## Reportes

Cucumber genera:

- `reports/cucumber-report.html`: reporte HTML.
- `reports/cucumber-report.json`: resultados JSON.
- `allure-results/`: datos fuente para Allure.

Después de ejecutar pruebas Cucumber, genera y abre el reporte Allure con:

```bash
npm run allure:report
```

También puedes abrir el HTML de Cucumber desde `reports/cucumber-report.html`. Para el reporte HTML del runner nativo de Playwright, usa `npx playwright show-report` después de ejecutar pruebas en `tests/`.

Los reportes generados están excluidos de Git y no se suben al repositorio.

## Ejecución de pruebas

```bash
### Todas las pruebas
npm run test:cucumber
### Pruebas frontend en segundo plano
npm run test:cucumber:ui
### Pruebas frontend mirando su ejecución en navegador
npm run test:cucumber:ui:headed
### Pruebas api
npm run test:cucumber:api

### Ver reporte allure
npm run allure:report 
