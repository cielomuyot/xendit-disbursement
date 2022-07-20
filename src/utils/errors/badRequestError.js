const BaseError = require('./baseError')

class BadRequestError extends BaseError {
  constructor(message, errorCode) {
    super(message, 400, errorCode)
  }
}

module.exports = BadRequestError
