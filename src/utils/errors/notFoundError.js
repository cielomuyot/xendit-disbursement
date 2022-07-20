const BaseError = require('./baseError')

class NotFoundError extends BaseError {
  constructor(message, errorCode) {
    super(message, 404, errorCode)
  }
}

module.exports = NotFoundError
