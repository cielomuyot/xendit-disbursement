const swaggerJSDoc = require('swagger-jsdoc')
const config = require('config')

const swaggerDefinition = {
  info: {
    version: '1.0.0',
    title: 'Xendit tech assessment - Cielo Muyot',
  },
  host: `localhost:${config.get('server.port') || 8010}`,
  basePath: '/',
}

const options = {
  swaggerDefinition,
  apis: ['./docs/**/*.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
