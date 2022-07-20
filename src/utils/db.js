const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')

const buildSchemas = require('../schemas')
const { logger } = require('./logger')

const initializeDb = async () => {
  try {
    const db = await open({ filename: ':memory:', driver: sqlite3.Database })

    await buildSchemas(db)

    return db
  } catch (err) {
    logger.error({
      code: 'DATABASE_ERROR',
      message: err.message,
      errStack: err.stack,
    })
  }
}

module.exports = {
  initializeDb,
}
