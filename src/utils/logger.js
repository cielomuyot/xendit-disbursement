const winston = require('winston')
const path = require('path')

const logOptions = {
  file: {
    level: 'info',
    filename: `${path.resolve('./')}/logs/${
      !['test'].includes(process.env.NODE_ENV) ? 'app.log' : 'tests.log'
    }`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
}

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File(logOptions.file),
    new winston.transports.Console(logOptions.console),
  ],
})

module.exports = {
  logger,
}
