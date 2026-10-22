export function getBaseUrl(): string {
  const baseUrl = process.env.BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      'Falta BASE_URL. Define en el archivo .env la URL base de la aplicación.',
    );
  }

  // devuelve eliminando barras slash
  return baseUrl.replace(/\/+$/, '');
}
