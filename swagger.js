const swaggerJSDoc = require('swagger-jsdoc');
const config = require('config');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Xendit tech assessment - Cielo Muyot'
  },
  servers: [
    {
      url: `http://localhost:${config.get('server.port') || 8010}`,
      description: 'Development server'
    }
  ],
  host: `localhost:${config.get('server.port') || 8010}`,
  basePath: '/'
};

const options = {
  swaggerDefinition,
  apis: ['./docs/**/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;