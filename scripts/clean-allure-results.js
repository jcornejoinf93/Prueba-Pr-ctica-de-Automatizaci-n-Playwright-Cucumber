const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const generatedDirectories = ['allure-results', 'allure-report'];

for (const directoryName of generatedDirectories) {
  const targetPath = path.resolve(projectRoot, directoryName);
  const relativePath = path.relative(projectRoot, targetPath);

  if (
    !relativePath ||
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Se rechazó limpiar una ruta fuera del proyecto: ${targetPath}`);
  }

  try {
    const targetStats = fs.lstatSync(targetPath);
    if (targetStats.isSymbolicLink() || !targetStats.isDirectory()) {
      throw new Error(`La ruta no es un directorio generado seguro: ${targetPath}`);
    }

    fs.rmSync(targetPath, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

fs.mkdirSync(path.join(projectRoot, 'allure-results'), { recursive: true });
// console.log('Resultados y reporte Allure anteriores eliminados; allure-results quedó vacío.');
