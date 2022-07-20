const { logger } = require('../utils/logger')

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, next) => {
  const { statusCode, stack, message, errorCode } = error
  const ip = req.ip

  logger.error({ IP: ip, statusCode, errorStack: stack, message })

  const response = { message, error_code: errorCode }

  if (!res.headersSent) {
    res.status(statusCode).json(response)
  }
}

module.exports = errorMiddleware
