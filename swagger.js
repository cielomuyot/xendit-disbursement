const swaggerJSDoc = require('swagger-jsdoc')
const port = process.env.PORT || 8010

const swaggerDefinition = {
  info: {
    version: '1.0.0',
    title: 'Xendit tech assessment - Cielo Muyot',
  },
  host: `localhost:${port}`,
  basePath: '/',
}

const options = {
  swaggerDefinition,
  apis: ['./docs/**/*.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec
