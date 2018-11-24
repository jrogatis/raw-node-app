/*
 * create and export configs variables
 */

// contaier for all the envi
const enviroments = {};

// staging default env
enviroments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging'
};

enviroments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production'
};

const currentEnviroment =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

const enviromentToExport =
  typeof enviroments[currentEnviroment] === 'object'
    ? enviroments[currentEnviroment]
    : enviroments.staging;

module.exports = enviromentToExport;
