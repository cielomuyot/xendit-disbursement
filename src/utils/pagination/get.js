const {
  InvalidPageTypeError,
  InvalidLimitTypeError,
  InvalidPageRangeError,
  InvalidLimitRangeError,
} = require('./errors')

const validatePaginationQueryParams = (page, limit) => {
  if (page) {
    if (isNaN(page)) {
      throw new InvalidPageTypeError()
    } else if (page < 1) {
      throw new InvalidPageRangeError()
    }
  }

  if (limit) {
    if (isNaN(limit)) {
      throw new InvalidLimitTypeError()
    } else if (limit < 1) {
      throw new InvalidLimitRangeError()
    }
  }
}

const getPagination = req => {
  const { page: reqPage, limit: reqLimit } = req.query

  validatePaginationQueryParams(reqPage, reqLimit)

  const page = req.query.page - 1 || 0
  const limit = req.query.limit || 5

  const offset = page * limit

  return { limit, offset }
}

module.exports = getPagination
