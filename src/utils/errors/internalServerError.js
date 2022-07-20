const BaseError = require('./baseError')

class InternalServerError extends BaseError {
  constructor(message, errorCode) {
    super(message, 500, errorCode)
  }
}

module.exports = InternalServerError
