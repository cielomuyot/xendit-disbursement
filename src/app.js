'use strict'

const express = require('express')
const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../swagger')

const healthCheckRoutes = require('./routes/health')
const rideRoutes = require('./routes/ride')

const createApp = db => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use('/health', healthCheckRoutes)
  app.use('/rides', rideRoutes(db))

  return app
}

module.exports = createApp
