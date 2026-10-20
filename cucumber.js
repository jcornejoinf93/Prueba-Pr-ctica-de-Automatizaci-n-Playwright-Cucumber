module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['dotenv/config', 'ts-node/register'],
    require: ['features/**/*.ts'],
    format: [
      'progress',
      ['html', 'reports/cucumber-report.html'],
      ['json', 'reports/cucumber-report.json'],
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      resultsDir: 'allure-results',
    },
    publishQuiet: true,
    strict: true,
    parallel: 1,
  }
};
