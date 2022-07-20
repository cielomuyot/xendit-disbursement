'use strict'

require('dotenv').config()

const createApp = require('./src/app')

const port = process.env.PORT || 8010

const { initializeDb } = require('./src/utils/db')
const { logger } = require('./src/utils/logger')

const start = async () => {
  const db = await initializeDb()

  const app = createApp(db)

  app.listen(port, () =>
    logger.info(`App started and listening on port ${port}`),
  )
}

start()
